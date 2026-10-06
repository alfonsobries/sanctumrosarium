import Foundation
import Observation
import WatchKit

/**
 * One Rosary prayed on the wrist. Owns the position, moves it from the crown, taps or the
 * audio, plays the haptic for each bead and keeps the phone journal up to date each time
 * a decade is finished.
 */
@MainActor
@Observable
final class PrayerSession: Identifiable {
  let id: String
  let set: SetTemplate
  let content: LocaleContent
  let steps: [StepTemplate]
  let startedAt: Date
  let prayedOn: String

  private(set) var position = 0
  private(set) var isPlaying = false
  private(set) var audioLoaded = false
  private(set) var finished = false

  /** Pack parts resolved to files; nil when this language has no audio in the bundle. */
  private let audioSteps: [RosaryStep]?
  private let settings: WatchSettings
  private var activeSeconds: Double = 0
  private var lastTick = Date()
  private var counting = true
  private var savedDecades = 0
  private var ticker: Timer?
  private var quietClick = false

  var hasAudio: Bool { audioSteps != nil }
  var step: StepTemplate { steps[position] }

  init(set: SetTemplate, settings: WatchSettings, now: Date = Date()) {
    let content = ContentStore.shared.content(for: settings.prayerLocale)
    let fatima = settings.fatimaPrayer && content.prayers["fatima-prayer"] != nil
    let steps = set.steps.filter { step in
      switch step.prayer {
      case "fatima-prayer": return fatima
      case "litany-of-loreto": return settings.litany
      default: return true
      }
    }
    self.id = UUID().uuidString.lowercased()
    self.set = set
    self.content = content
    self.steps = steps
    self.settings = settings
    self.startedAt = now
    self.prayedOn = Self.localDate(now)
    self.audioSteps = Self.audioSteps(steps, set: set, content: content, pauseSeconds: settings.pauseSeconds)
  }

  // MARK: - Labels

  /** The mystery of the current decade, or nil before the first and after the last. */
  var mysteryTitle: String? {
    guard let decade = step.decade, set.mysteries.indices.contains(decade - 1) else {
      return nil
    }
    return content.mysteries[set.mysteries[decade - 1]]?.title
  }

  var setTitle: String { content.setTitles[set.id] ?? set.id }

  var prayerTitle: String {
    if step.isAnnounce, let mystery = step.mystery {
      return content.mysteries[mystery]?.reading ?? ""
    }
    guard let prayer = step.prayer else {
      return ""
    }
    return content.prayers[prayer]?.title ?? ""
  }

  // MARK: - Moving

  func start() {
    ticker = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in
      Task { @MainActor in self?.tick() }
    }
    if hasAudio && settings.mode == "listen" {
      toggleAudio()
    }
  }

  func setCounting(_ active: Bool) {
    tick()
    counting = active
  }

  func advance() {
    if position >= steps.count - 1 {
      finish()
      return
    }
    go(to: position + 1)
  }

  /** `fromCrown` leaves the plain beads to the crown's own detent, so they never tick twice. */
  func go(to target: Int, fromCrown: Bool = false) {
    let clamped = min(max(0, target), steps.count - 1)
    guard clamped != position, !finished else {
      return
    }
    quietClick = fromCrown
    if audioLoaded {
      // The player reports the new step back through onStepChange.
      SharedPlayer.core.skipTo(clamped)
    } else {
      moved(to: clamped)
    }
  }

  func toggleAudio() {
    guard let audioSteps else {
      return
    }
    let core = SharedPlayer.core
    if audioLoaded {
      core.toggle()
      return
    }
    audioLoaded = true
    core.onStepChange = { [weak self] index, _ in
      self?.moved(to: index)
    }
    core.onStatusChange = { [weak self] status, _ in
      guard let self else {
        return
      }
      self.isPlaying = status == .playing
      if status == .ended {
        self.finish()
      }
    }
    let nowPlaying = RosaryNowPlaying(album: setTitle, artist: "SanctaMaria", artworkURL: nil)
    Task {
      do {
        try await core.load(steps: audioSteps, startIndex: position, rate: Float(settings.rate), nowPlaying: nowPlaying)
        core.play()
      } catch {
        audioLoaded = false
        isPlaying = false
      }
    }
  }

  /** Ends the session, keeping in the journal whatever decades were prayed. */
  func end() {
    guard !finished else {
      return
    }
    finished = true
    tick()
    ticker?.invalidate()
    if audioLoaded {
      SharedPlayer.core.unload()
      SharedPlayer.core.onStepChange = nil
      SharedPlayer.core.onStatusChange = nil
    }
    save(force: true)
  }

  private func finish() {
    guard !finished else {
      return
    }
    position = steps.count - 1
    if settings.haptics {
      WKInterfaceDevice.current().play(.success)
    }
    end()
  }

  private func moved(to index: Int) {
    guard index != position, steps.indices.contains(index) else {
      return
    }
    position = index
    playHaptic()
    save(force: false)
  }

  private func playHaptic() {
    defer { quietClick = false }
    guard settings.haptics else {
      return
    }
    let strong = step.isAnnounce || step.isOurFather
    if !strong && quietClick {
      return
    }
    WKInterfaceDevice.current().play(strong ? .directionUp : .click)
  }

  private func tick() {
    let now = Date()
    if counting || isPlaying {
      activeSeconds += now.timeIntervalSince(lastTick)
    }
    lastTick = now
  }

  // MARK: - Journal

  private var isComplete: Bool { position >= steps.count - 1 }

  private func save(force: Bool) {
    let decades = steps[position].decadesBefore
    guard decades > 0, force || decades != savedDecades else {
      return
    }
    savedDecades = decades
    PhoneLink.shared.send(entry: journalEntry(decades: decades))
  }

  /** Same shape as the phone's journalEntryFor, without readings: the watch has none. */
  private func journalEntry(decades: Int) -> [String: Any] {
    var entry: [String: Any] = [
      "id": id,
      "kind": "rosary",
      "mysterySet": set.id,
      "locale": content.locale,
      "prayedOn": prayedOn,
      "startedAt": Self.iso(startedAt),
      "decades": decades,
      "durationSeconds": Int(activeSeconds.rounded()),
    ]
    if isComplete {
      entry["completedAt"] = Self.iso(Date())
    }
    return entry
  }

  // MARK: - Helpers

  private static func audioSteps(_ steps: [StepTemplate], set: SetTemplate, content: LocaleContent, pauseSeconds: Double) -> [RosaryStep]? {
    guard let audio = content.audio else {
      return nil
    }
    let pauseMs = pauseSeconds * 1000
    var result: [RosaryStep] = []
    for step in steps {
      guard let parts = audio[step.audio], !parts.isEmpty else {
        return nil
      }
      var resolved: [RosaryPart] = []
      for part in parts {
        guard let url = ContentStore.audioURL(locale: content.locale, file: part.file) else {
          return nil
        }
        let gapMs = part.pause ? max(part.minGapMs, pauseMs) : part.minGapMs
        resolved.append(RosaryPart(url: url, gapAfter: gapMs / 1000))
      }
      let title = step.prayer.flatMap { content.prayers[$0]?.title }
        ?? step.mystery.flatMap { content.mysteries[$0]?.title }
        ?? ""
      let mystery = step.decade.flatMap { decade in
        set.mysteries.indices.contains(decade - 1) ? content.mysteries[set.mysteries[decade - 1]]?.title : nil
      }
      result.append(RosaryStep(id: step.id, title: title, subtitle: mystery, parts: resolved))
    }
    return result
  }

  private static func localDate(_ date: Date) -> String {
    let parts = Calendar.current.dateComponents([.year, .month, .day], from: date)
    return String(format: "%04d-%02d-%02d", parts.year ?? 0, parts.month ?? 0, parts.day ?? 0)
  }

  private static func iso(_ date: Date) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.string(from: date)
  }
}

/** One player for the app's lifetime: it owns the audio session and Now Playing. */
@MainActor
enum SharedPlayer {
  static let core = RosaryPlayerCore()
}
