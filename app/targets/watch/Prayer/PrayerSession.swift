import Foundation
import Observation
import WatchKit

/**
 * One Rosary (or one decade) prayed on the wrist. Owns the position, moves it from the
 * crown, taps, double tap or the audio, plays the haptic for each bead and keeps the
 * phone journal up to date each time a decade is finished.
 */
@MainActor
@Observable
final class PrayerSession: Identifiable {
  enum Scope: Equatable {
    case rosary
    case decade(Int)
    /** Carries on a Rosary left halfway today, on the phone or here, as the same entry. */
    case continuing(TodayStore.Entry)
  }

  let id: String
  let set: SetTemplate
  let content: LocaleContent
  let steps: [StepTemplate]
  let kind: String
  let startedAt: Date
  let prayedOn: String

  private(set) var position = 0
  private(set) var isPlaying = false
  private(set) var audioLoaded = false
  private(set) var finished = false

  /** Pack parts resolved to files; nil while this language's pack is not on the watch. */
  private let audioSteps: [RosaryStep]?
  /// The pack's silence, in the recordings' format: it pads the end of each step.
  private let silenceURL: URL?
  /** The passage each reading step reads, by step id. */
  private let readingRefs: [String: String]
  private let passages: [String: PassagesFile.Passage]
  private let settings: WatchSettings
  private let earlierSeconds: Double
  private var activeSeconds: Double = 0
  private var lastTick = Date()
  private var counting = true
  private var savedDecades = 0
  /** Where praying began on this watch; a continued Rosary was prayed before it elsewhere. */
  private var firstPosition = 0
  private var ticker: Timer?
  private var quietClick = false

  var hasAudio: Bool { audioSteps != nil }
  var step: StepTemplate { steps[position] }

  /** The words of the current prayer, or nil for a step that only announces a mystery. */
  var prayer: LocaleContent.Prayer? { step.prayer.flatMap { content.prayers[$0] } }

  /** The voice's level, kept between sessions. */
  var volume: Double = UserDefaults.standard.object(forKey: "volume") as? Double ?? 1 {
    didSet {
      SharedPlayer.core.volume = Float(volume)
      UserDefaults.standard.set(volume, forKey: "volume")
    }
  }

  init(set: SetTemplate, scope: Scope, settings: WatchSettings, now: Date = Date()) {
    let content = ContentStore.shared.content(for: settings.prayerLocale)
    let fatima = settings.fatimaPrayer && content.prayers["fatima-prayer"] != nil
    let template: [StepTemplate]
    switch scope {
    case .rosary, .continuing:
      template = set.steps
    case let .decade(decade):
      template = set.decades[min(max(1, decade), set.decades.count) - 1]
    }
    // Mirrors `keeps` in scripts/build-watch-content.mts, which checks it against the engine.
    let steps = template.filter { step in
      if step.isReading {
        return settings.reading
      }
      if step.prayer == "fatima-prayer" {
        return fatima
      }
      if step.prayer == "litany-of-loreto" {
        return settings.litany
      }
      if step.intention == "pope" {
        return settings.prayerForThePope
      }
      return true
    }
    self.set = set
    self.content = content
    self.steps = steps
    self.settings = settings
    let installed = PackStore.shared.pack(for: content.locale)
    let silenceURL = installed.map { $0.url(of: "silence.mp3") }.flatMap {
      FileManager.default.fileExists(atPath: $0.path) ? $0 : nil
    }
    // The passage heard is the one in the pack; while a newer choice is still on its way
    // from the phone, the words shown follow the voice.
    var refs: [String: String] = [:]
    for step in steps where step.isReading {
      refs[step.id] = installed?.parts[step.audio]?.first?.ref
        ?? step.mystery.flatMap { settings.readings[$0] }
        ?? step.reading
    }
    let passages = ContentStore.shared.passages(for: content.locale)
    self.readingRefs = refs
    self.passages = passages
    self.silenceURL = silenceURL
    self.audioSteps = installed.flatMap {
      Self.audioSteps(
        steps,
        set: set,
        content: content,
        pack: $0,
        silence: silenceURL,
        reading: { id in refs[id].flatMap { passages[$0] } },
        pauseSeconds: settings.pauseSeconds
      )
    }

    switch scope {
    case let .continuing(entry):
      id = entry.id
      kind = "rosary"
      startedAt = Self.parse(entry.startedAt) ?? now
      prayedOn = entry.prayedOn
      earlierSeconds = Double(entry.durationSeconds)
      savedDecades = entry.decades
      position = steps.firstIndex { $0.isAnnounce && $0.decade == entry.decades + 1 } ?? 0
      firstPosition = position
    case .rosary, .decade:
      id = UUID().uuidString.lowercased()
      if case .decade = scope {
        kind = "decade"
      } else {
        kind = "rosary"
      }
      startedAt = now
      prayedOn = TodayStore.today(now)
      earlierSeconds = 0
    }
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

  /** The Gospel passage of the current step, when it is a reading. */
  var passage: PassagesFile.Passage? {
    readingRefs[step.id].flatMap { passages[$0] }
  }

  /** The prayer being said, or the Gospel passage while a mystery is announced or read. */
  var prayerTitle: String {
    if step.isReading {
      return passage?.displayRef ?? readingRefs[step.id] ?? ""
    }
    if step.isAnnounce, let mystery = step.mystery {
      let reading = steps.first { $0.isReading && $0.mystery == mystery }
      return reading.flatMap { readingRefs[$0.id] }.flatMap { passages[$0]?.displayRef }
        ?? content.mysteries[mystery]?.reading
        ?? ""
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

  /**
   * Starts the audio the first time, then plays or pauses. The player decides from its
   * own state, never a cached flag, so one press always does what it shows.
   */
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
    core.volume = Float(volume)
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
    let nowPlaying = RosaryNowPlaying(album: setTitle, artist: "Sanctum Rosarium", artworkURL: nil)
    Task {
      do {
        try await core.load(
          steps: audioSteps,
          startIndex: position,
          rate: Float(settings.rate),
          nowPlaying: nowPlaying,
          silence: silenceURL
        )
        core.play()
      } catch {
        audioLoaded = false
        isPlaying = false
      }
    }
  }

  /** The voice's speed, applied to the voice already playing and kept for the next time. */
  var rate: Double {
    get { settings.rate }
    set {
      settings.rate = newValue
      if audioLoaded {
        SharedPlayer.core.setRate(Float(newValue))
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

  /** A firmer tap on the Our Father bead and the announced mystery, a light one on each Hail Mary. */
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

  /** Same shape as the phone's journalEntryFor. */
  private func journalEntry(decades: Int) -> [String: Any] {
    var entry: [String: Any] = [
      "id": id,
      "kind": kind,
      "mysterySet": set.id,
      "locale": content.locale,
      "prayedOn": prayedOn,
      "startedAt": Self.iso(startedAt),
      "decades": decades,
      "durationSeconds": Int((earlierSeconds + activeSeconds).rounded()),
    ]
    if isComplete {
      entry["completedAt"] = Self.iso(Date())
    }
    // The passages reached here, so the phone turns to the next account of each mystery.
    var heard: [String: String] = [:]
    for step in steps[min(firstPosition, position)...position] where step.isReading {
      if let mystery = step.mystery, let ref = readingRefs[step.id] {
        heard[mystery] = ref
      }
    }
    if !heard.isEmpty {
      entry["readings"] = heard
    }
    return entry
  }

  // MARK: - Helpers

  private static func audioSteps(
    _ steps: [StepTemplate],
    set: SetTemplate,
    content: LocaleContent,
    pack: PackStore.Installed,
    silence: URL?,
    reading: (String) -> PassagesFile.Passage?,
    pauseSeconds: Double
  ) -> [RosaryStep]? {
    let pauseMs = pauseSeconds * 1000
    var result: [RosaryStep] = []
    for step in steps {
      let resolved: [RosaryPart]
      if let parts = pack.parts[step.audio], !parts.isEmpty {
        resolved = parts.map { part in
          let gapMs = part.pause ? max(part.minGapMs, pauseMs) : part.minGapMs
          return RosaryPart(url: pack.url(of: part.file), gapAfter: gapMs / 1000)
        }
      } else if step.isReading, let silence, let passage = reading(step.id) {
        // A pack from before readings were turned on: time to read it, as on the phone.
        resolved = [RosaryPart(url: silence, gapAfter: passage.silenceMs / 1000)]
      } else {
        return nil
      }
      let title = step.isReading
        ? reading(step.id)?.displayRef ?? ""
        : step.prayer.flatMap { content.prayers[$0]?.title }
          ?? step.mystery.flatMap { content.mysteries[$0]?.title }
          ?? ""
      let mystery = step.decade.flatMap { decade in
        set.mysteries.indices.contains(decade - 1) ? content.mysteries[set.mysteries[decade - 1]]?.title : nil
      }
      let artwork = step.cover.flatMap { Bundle.main.url(forResource: $0, withExtension: "jpg", subdirectory: "artwork") }
      result.append(RosaryStep(id: step.id, title: title, subtitle: mystery, parts: resolved, artworkURL: artwork))
    }
    return result
  }

  private static func iso(_ date: Date) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.string(from: date)
  }

  private static func parse(_ value: String) -> Date? {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.date(from: value) ?? ISO8601DateFormatter().date(from: value)
  }
}

/** One player for the app's lifetime: it owns the audio session and Now Playing. */
@MainActor
enum SharedPlayer {
  static let core = RosaryPlayerCore()
}
