import AVFoundation
import Foundation
import MediaPlayer
#if os(iOS)
import UIKit
#elseif os(watchOS)
import UIKit
import WatchKit
#endif

// Framework-free playback core: shared by the Expo bridge and the watchOS app.
// Every step becomes one AVPlayerItem whose timeline holds the voice parts and
// the silent gaps between them, so a gap is playback time the system sees as
// audio, never a timer that lets the process be suspended.

public struct RosaryPart: Sendable {
  public let url: URL
  public let gapAfter: TimeInterval

  public init(url: URL, gapAfter: TimeInterval) {
    self.url = url
    self.gapAfter = max(0, gapAfter)
  }
}

public struct RosaryStep: Sendable {
  public let id: String
  public let title: String
  public let subtitle: String?
  public let parts: [RosaryPart]

  public init(id: String, title: String, subtitle: String?, parts: [RosaryPart]) {
    self.id = id
    self.title = title
    self.subtitle = subtitle
    self.parts = parts
  }
}

public struct RosaryNowPlaying: Sendable {
  public let album: String
  public let artist: String
  public let artworkURL: URL?

  public init(album: String, artist: String, artworkURL: URL?) {
    self.album = album
    self.artist = artist
    self.artworkURL = artworkURL
  }
}

public enum RosaryPlaybackStatus: String, Sendable {
  case idle
  case loading
  case playing
  case paused
  case interrupted
  case ended
}

public enum RosaryStatusReason: String, Sendable {
  case interruption
  case route
  case remote
  case user
  case error
  case ended
}

public struct RosaryPlaybackState: Sendable {
  public let index: Int
  public let status: RosaryPlaybackStatus
  public let positionMs: Double
  public let durationMs: Double
}

public enum RosaryPlayerError: LocalizedError {
  case emptyQueue
  case emptyStep(String)
  case missingAudioTrack(URL)
  case playbackFailed(String)

  public var errorDescription: String? {
    switch self {
    case .emptyQueue:
      return "The queue has no steps"
    case .emptyStep(let id):
      return "Step \(id) has no parts"
    case .missingAudioTrack(let url):
      return "No audio track in \(url.lastPathComponent)"
    case .playbackFailed(let id):
      return "Step \(id) failed to play"
    }
  }
}

@MainActor
public final class RosaryPlayerCore {
  public static let minRate: Float = 0.5
  public static let maxRate: Float = 2

  // An interruption shorter than this resumes even without `.shouldResume`:
  // apps that play short voice cues often deactivate without notifying others.
  private static let resumeWindow: TimeInterval = 180
  private static let lookahead = 2
  private static let progressInterval = CMTime(value: 1, timescale: 4)
  private static let timescale: CMTimeScale = 44_100

  public var onStepChange: ((Int, String) -> Void)?
  public var onStatusChange: ((RosaryPlaybackStatus, RosaryStatusReason?) -> Void)?
  public var onProgress: ((Int, Double, Double) -> Void)?
  public var onError: ((String) -> Void)?

  public var progressEnabled = false {
    didSet { updateProgressObserver() }
  }

  public private(set) var index = 0
  public private(set) var status: RosaryPlaybackStatus = .idle
  public private(set) var rate: Float = 1

  private var player = AVQueuePlayer()
  private var steps: [RosaryStep] = []
  private var nowPlaying: RosaryNowPlaying?
  private var artwork: MPMediaItemArtwork?
  private var wantsToPlay = false
  private var generation = 0
  private var fillingGeneration: Int?
  private var compositions: [Int: AVComposition] = [:]
  private var itemIndexes: [ObjectIdentifier: Int] = [:]
  private var recoveredIndexes: Set<Int> = []
  private var interruption: (wasPlaying: Bool, startedAt: Date)?
  private var activationRetries = 0
  private var playerObservations: [NSKeyValueObservation] = []
  private var notificationTokens: [NSObjectProtocol] = []
  private var timeObserver: Any?
  private var remoteCommandsRegistered = false
  // The asset is kept with its track: a track only holds its asset weakly and
  // cannot be inserted once the asset is gone.
  private var silence: (asset: AVURLAsset, track: AVAssetTrack, duration: CMTime)?

  public init() {
    preparePlayer()
    observeNotifications()
  }

  // MARK: - Commands

  public func load(steps: [RosaryStep], startIndex: Int, rate: Float, nowPlaying: RosaryNowPlaying) async throws {
    guard !steps.isEmpty else {
      throw RosaryPlayerError.emptyQueue
    }
    if let empty = steps.first(where: { $0.parts.isEmpty }) {
      throw RosaryPlayerError.emptyStep(empty.id)
    }

    resetQueue()
    self.steps = steps
    self.nowPlaying = nowPlaying
    self.artwork = nil
    self.index = min(max(0, startIndex), steps.count - 1)
    self.rate = Self.clampRate(rate)
    player.defaultRate = self.rate
    wantsToPlay = false
    interruption = nil

    configureSession()
    registerRemoteCommands()
    loadArtwork(nowPlaying.artworkURL)
    setStatus(.loading, reason: nil)
    onStepChange?(index, steps[index].id)

    let loadGeneration = generation
    do {
      try await enqueue(from: index, at: .zero, generation: loadGeneration)
    } catch {
      guard loadGeneration == generation else {
        return
      }
      setStatus(.paused, reason: .error)
      throw error
    }
    guard loadGeneration == generation else {
      return
    }
    if wantsToPlay {
      resume(reason: .user)
    } else {
      setStatus(.paused, reason: nil)
    }
  }

  public func play(reason: RosaryStatusReason = .user) {
    guard !steps.isEmpty else {
      return
    }
    if status == .loading {
      wantsToPlay = true
      return
    }
    if status == .ended || player.currentItem == nil {
      wantsToPlay = true
      skipTo(index, reason: reason)
      return
    }
    resume(reason: reason)
  }

  public func pause(reason: RosaryStatusReason = .user) {
    wantsToPlay = false
    interruption = nil
    player.pause()
    if status != .idle && status != .ended {
      setStatus(.paused, reason: reason)
    }
    updateNowPlaying()
  }

  // Decides from the player itself, never from a cached flag, so a toggle after
  // an interruption that paused the player behind our back always plays.
  public func toggle(reason: RosaryStatusReason = .user) {
    if isAudible || (status == .loading && wantsToPlay) {
      pause(reason: reason)
    } else {
      play(reason: reason)
    }
  }

  public func next(reason: RosaryStatusReason = .user) {
    guard index + 1 < steps.count else {
      return
    }
    let queued = player.items()
    if queued.count > 1, itemIndexes[ObjectIdentifier(queued[1])] == index + 1 {
      player.advanceToNextItem()
      if wantsToPlay {
        resume(reason: reason)
      }
      return
    }
    skipTo(index + 1, reason: reason)
  }

  public func previous(reason: RosaryStatusReason = .user) {
    skipTo(max(0, index - 1), reason: reason)
  }

  public func skipTo(_ target: Int, reason: RosaryStatusReason = .user) {
    guard steps.indices.contains(target) else {
      return
    }
    let shouldPlay = wantsToPlay
    resetQueue()
    index = target
    onStepChange?(target, steps[target].id)
    if compositions[target] == nil {
      setStatus(.loading, reason: reason)
    }

    let skipGeneration = generation
    Task { [weak self] in
      guard let self else {
        return
      }
      do {
        try await self.enqueue(from: target, at: .zero, generation: skipGeneration)
      } catch {
        guard skipGeneration == self.generation else {
          return
        }
        self.report(error)
        self.setStatus(.paused, reason: .error)
        return
      }
      guard skipGeneration == self.generation else {
        return
      }
      if shouldPlay || self.wantsToPlay {
        self.resume(reason: reason)
      } else {
        self.setStatus(.paused, reason: reason)
        self.updateNowPlaying()
      }
    }
  }

  public func setRate(_ newRate: Float) {
    rate = Self.clampRate(newRate)
    player.defaultRate = rate
    if player.rate > 0 {
      player.rate = rate
    }
    updateNowPlaying()
  }

  public func unload() {
    resetQueue()
    steps = []
    nowPlaying = nil
    artwork = nil
    wantsToPlay = false
    interruption = nil
    index = 0
    setStatus(.idle, reason: nil)
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
    unregisterRemoteCommands()
    deactivateSession()
  }

  public func state() -> RosaryPlaybackState {
    RosaryPlaybackState(
      index: index,
      status: status,
      positionMs: Self.milliseconds(currentPosition),
      durationMs: Self.milliseconds(currentDuration)
    )
  }

  // MARK: - Queue

  private var isAudible: Bool {
    player.timeControlStatus != .paused
  }

  private var currentPosition: CMTime {
    guard let item = player.currentItem else {
      return .zero
    }
    let time = item.currentTime()
    return time.isValid ? time : .zero
  }

  private var currentDuration: CMTime {
    compositions[index]?.duration ?? .zero
  }

  private func preparePlayer() {
    player.automaticallyWaitsToMinimizeStalling = false
    player.actionAtItemEnd = .advance
    player.defaultRate = rate

    playerObservations = [
      player.observe(\.currentItem, options: [.new]) { [weak self] _, _ in
        Task { @MainActor in
          self?.handleCurrentItemChange()
        }
      },
      player.observe(\.timeControlStatus, options: [.new]) { [weak self] _, _ in
        Task { @MainActor in
          self?.handleTimeControlChange()
        }
      },
    ]
    updateProgressObserver()
  }

  private func teardownPlayer() {
    playerObservations.forEach { $0.invalidate() }
    playerObservations = []
    if let timeObserver {
      player.removeTimeObserver(timeObserver)
    }
    timeObserver = nil
    player.pause()
    player.removeAllItems()
  }

  private func resetQueue() {
    generation += 1
    player.removeAllItems()
    itemIndexes.removeAll()
  }

  private func enqueue(from start: Int, at position: CMTime, generation expected: Int) async throws {
    let composition = try await composition(for: start)
    guard expected == generation else {
      return
    }
    let item = makeItem(composition, index: start)
    player.insert(item, after: nil)
    if position > .zero {
      _ = await player.seek(to: position, toleranceBefore: .zero, toleranceAfter: .zero)
    }
    updateNowPlaying()
    fillQueue()
  }

  private func fillQueue() {
    guard fillingGeneration != generation else {
      return
    }
    let fillGeneration = generation
    fillingGeneration = fillGeneration
    Task { [weak self] in
      guard let self else {
        return
      }
      defer {
        if self.fillingGeneration == fillGeneration {
          self.fillingGeneration = nil
        }
      }
      while fillGeneration == self.generation {
        guard
          let last = self.player.items().last,
          let lastIndex = self.itemIndexes[ObjectIdentifier(last)],
          lastIndex + 1 < self.steps.count,
          lastIndex < self.index + Self.lookahead
        else {
          return
        }
        let nextIndex = lastIndex + 1
        do {
          let composition = try await self.composition(for: nextIndex)
          guard fillGeneration == self.generation, self.player.items().last === last else {
            return
          }
          self.player.insert(self.makeItem(composition, index: nextIndex), after: last)
        } catch {
          self.report(error)
          return
        }
      }
    }
  }

  private func makeItem(_ composition: AVComposition, index: Int) -> AVPlayerItem {
    let item = AVPlayerItem(asset: composition)
    item.audioTimePitchAlgorithm = .timeDomain
    itemIndexes[ObjectIdentifier(item)] = index
    return item
  }

  private func composition(for stepIndex: Int) async throws -> AVComposition {
    if let cached = compositions[stepIndex] {
      return cached
    }
    let step = steps[stepIndex]
    let composition = AVMutableComposition()
    guard let track = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) else {
      throw RosaryPlayerError.emptyStep(step.id)
    }
    var cursor = CMTime.zero
    for part in step.parts {
      let asset = AVURLAsset(url: part.url)
      guard let source = try await asset.loadTracks(withMediaType: .audio).first else {
        throw RosaryPlayerError.missingAudioTrack(part.url)
      }
      let range = try await source.load(.timeRange)
      try withExtendedLifetime(asset) {
        try track.insertTimeRange(range, of: source, at: cursor)
      }
      cursor = cursor + range.duration
      if part.gapAfter > 0 {
        cursor = try await insertSilence(part.gapAfter, into: track, at: cursor)
      }
    }
    if steps.indices.contains(stepIndex), steps[stepIndex].id == step.id {
      compositions[stepIndex] = composition
    }
    return composition
  }

  // A trailing empty edit does not extend a composition's duration, so gaps are
  // built from a real silent PCM file instead of insertEmptyTimeRange.
  private func insertSilence(_ seconds: TimeInterval, into track: AVMutableCompositionTrack, at start: CMTime) async throws -> CMTime {
    let silence = try await silenceSource()
    var cursor = start
    var remaining = CMTime(seconds: seconds, preferredTimescale: Self.timescale)
    while remaining > .zero {
      let chunk = CMTimeMinimum(remaining, silence.duration)
      try track.insertTimeRange(CMTimeRange(start: .zero, duration: chunk), of: silence.track, at: cursor)
      cursor = cursor + chunk
      remaining = remaining - chunk
    }
    return cursor
  }

  private func silenceSource() async throws -> (asset: AVURLAsset, track: AVAssetTrack, duration: CMTime) {
    if let silence {
      return silence
    }
    let url = try Self.silenceFileURL()
    let asset = AVURLAsset(url: url)
    guard let track = try await asset.loadTracks(withMediaType: .audio).first else {
      throw RosaryPlayerError.missingAudioTrack(url)
    }
    let duration = try await track.load(.timeRange).duration
    let source = (asset: asset, track: track, duration: duration)
    silence = source
    return source
  }

  private nonisolated static func silenceFileURL() throws -> URL {
    let directory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
    let url = directory.appendingPathComponent("rosary-player-silence-1s.caf")
    if FileManager.default.fileExists(atPath: url.path) {
      return url
    }
    let sampleRate = 22_050.0
    guard
      let format = AVAudioFormat(commonFormat: .pcmFormatInt16, sampleRate: sampleRate, channels: 1, interleaved: true),
      let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(sampleRate))
    else {
      throw RosaryPlayerError.missingAudioTrack(url)
    }
    buffer.frameLength = buffer.frameCapacity
    let temporary = directory.appendingPathComponent("rosary-player-silence-\(UUID().uuidString).caf")
    do {
      let file = try AVAudioFile(forWriting: temporary, settings: format.settings, commonFormat: .pcmFormatInt16, interleaved: true)
      try file.write(from: buffer)
    }
    if !FileManager.default.fileExists(atPath: url.path) {
      try FileManager.default.moveItem(at: temporary, to: url)
    } else {
      try? FileManager.default.removeItem(at: temporary)
    }
    return url
  }

  // MARK: - Player observation

  private func handleCurrentItemChange() {
    guard let item = player.currentItem, let newIndex = itemIndexes[ObjectIdentifier(item)] else {
      return
    }
    let live = Set(player.items().map(ObjectIdentifier.init))
    itemIndexes = itemIndexes.filter { live.contains($0.key) }
    if newIndex != index {
      index = newIndex
      onStepChange?(newIndex, steps[newIndex].id)
    }
    updateNowPlaying()
    fillQueue()
  }

  private func handleTimeControlChange() {
    switch player.timeControlStatus {
    case .playing:
      if wantsToPlay {
        setStatus(.playing, reason: nil)
        updateNowPlaying()
      }
    case .paused:
      guard wantsToPlay, status == .playing, interruption == nil else {
        return
      }
      // The system paused us without a command. Give interruption and route
      // notifications a moment to explain it before reporting a pause.
      let checkGeneration = generation
      Task { [weak self] in
        try? await Task.sleep(nanoseconds: 400_000_000)
        guard let self, checkGeneration == self.generation else {
          return
        }
        guard self.wantsToPlay, self.interruption == nil, self.status == .playing,
              self.player.timeControlStatus == .paused, self.player.currentItem != nil
        else {
          return
        }
        self.wantsToPlay = false
        self.setStatus(.paused, reason: nil)
        self.updateNowPlaying()
      }
    case .waitingToPlayAtSpecifiedRate:
      break
    @unknown default:
      break
    }
  }

  private func handleItemEnded(_ item: AVPlayerItem) {
    guard let ended = itemIndexes[ObjectIdentifier(item)], ended == steps.count - 1 else {
      return
    }
    wantsToPlay = false
    setStatus(.ended, reason: .ended)
    updateNowPlaying()
  }

  private func handleItemFailed(_ item: AVPlayerItem, error: Error?) {
    guard let failed = itemIndexes[ObjectIdentifier(item)] else {
      return
    }
    report(error ?? RosaryPlayerError.playbackFailed(steps[failed].id))
    guard !recoveredIndexes.contains(failed) else {
      wantsToPlay = false
      setStatus(.paused, reason: .error)
      return
    }
    recoveredIndexes.insert(failed)
    compositions[failed] = nil
    skipTo(failed, reason: .error)
  }

  private func updateProgressObserver() {
    if progressEnabled, timeObserver == nil {
      timeObserver = player.addPeriodicTimeObserver(forInterval: Self.progressInterval, queue: .main) { [weak self] _ in
        MainActor.assumeIsolated {
          self?.emitProgress()
        }
      }
    } else if !progressEnabled, let observer = timeObserver {
      player.removeTimeObserver(observer)
      timeObserver = nil
    }
  }

  private func emitProgress() {
    guard player.timeControlStatus == .playing, !steps.isEmpty else {
      return
    }
    onProgress?(index, Self.milliseconds(currentPosition), Self.milliseconds(currentDuration))
  }

  // MARK: - Session

  // Session calls are synchronous and can take hundreds of milliseconds on a device
  // (the audio server is another process), so they never run on the main thread.
  private nonisolated static let sessionQueue = DispatchQueue(label: "rosary-player.session", qos: .userInitiated)

  private nonisolated static func applyCategory() throws {
    try AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, policy: .longFormAudio, options: [])
  }

  private func configureSession() {
    Self.sessionQueue.async {
      do {
        try Self.applyCategory()
      } catch {
        Task { @MainActor [weak self] in
          self?.report(error)
        }
      }
    }
  }

  private func resume(reason: RosaryStatusReason) {
    wantsToPlay = true
    interruption = nil
    activateSession { [weak self] active in
      guard let self, self.wantsToPlay else {
        return
      }
      guard active else {
        self.retryActivation(reason: reason)
        return
      }
      self.activationRetries = 0
      self.player.play()
      self.setStatus(.playing, reason: reason)
      self.updateNowPlaying()
    }
  }

  // Reactivation fails while another app still holds a non-mixable session;
  // keep trying briefly, then wait for the next foreground or remote command.
  private func retryActivation(reason: RosaryStatusReason) {
    guard activationRetries < 3 else {
      activationRetries = 0
      interruption = (wasPlaying: true, startedAt: Date())
      setStatus(.interrupted, reason: .interruption)
      return
    }
    activationRetries += 1
    let retryGeneration = generation
    Task { [weak self] in
      try? await Task.sleep(nanoseconds: 1_000_000_000)
      guard let self, retryGeneration == self.generation, self.wantsToPlay else {
        return
      }
      self.resume(reason: reason)
    }
  }

  private func activateSession(_ completion: @escaping @MainActor (Bool) -> Void) {
    let session = AVAudioSession.sharedInstance()
    #if os(watchOS)
    configureSession()
    // Long-form audio on watchOS must activate asynchronously so the system can
    // route it to Bluetooth headphones.
    session.activate(options: []) { success, _ in
      Task { @MainActor in
        completion(success)
      }
    }
    #else
    Self.sessionQueue.async {
      do {
        try Self.applyCategory()
        try session.setActive(true)
        Task { @MainActor in
          completion(true)
        }
      } catch {
        Task { @MainActor [weak self] in
          self?.report(error)
          completion(false)
        }
      }
    }
    #endif
  }

  private func deactivateSession() {
    Self.sessionQueue.async {
      #if !os(watchOS)
      try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
      #else
      try? AVAudioSession.sharedInstance().setActive(false)
      #endif
    }
  }

  private func observeNotifications() {
    let center = NotificationCenter.default
    let session = AVAudioSession.sharedInstance()

    func on(_ name: Notification.Name, object: Any? = nil, _ handler: @escaping @MainActor (Notification) -> Void) {
      notificationTokens.append(center.addObserver(forName: name, object: object, queue: .main) { notification in
        // Delivered on the main queue, so the notification never leaves it.
        nonisolated(unsafe) let delivered = notification
        MainActor.assumeIsolated {
          handler(delivered)
        }
      })
    }

    on(AVAudioSession.interruptionNotification, object: session) { [weak self] notification in
      self?.handleInterruption(notification)
    }
    on(AVAudioSession.routeChangeNotification, object: session) { [weak self] notification in
      self?.handleRouteChange(notification)
    }
    on(AVAudioSession.mediaServicesWereResetNotification, object: session) { [weak self] _ in
      self?.handleMediaServicesReset()
    }
    on(AVPlayerItem.didPlayToEndTimeNotification) { [weak self] notification in
      guard let item = notification.object as? AVPlayerItem else {
        return
      }
      self?.handleItemEnded(item)
    }
    on(AVPlayerItem.failedToPlayToEndTimeNotification) { [weak self] notification in
      guard let item = notification.object as? AVPlayerItem else {
        return
      }
      let error = notification.userInfo?[AVPlayerItemFailedToPlayToEndTimeErrorKey] as? Error
      self?.handleItemFailed(item, error: error)
    }
    #if os(iOS)
    on(UIApplication.didBecomeActiveNotification) { [weak self] _ in
      self?.recoverAfterSilentInterruption()
    }
    #elseif os(watchOS)
    on(WKApplication.didBecomeActiveNotification) { [weak self] _ in
      self?.recoverAfterSilentInterruption()
    }
    #endif
  }

  private func handleInterruption(_ notification: Notification) {
    guard
      let info = notification.userInfo,
      let rawType = info[AVAudioSessionInterruptionTypeKey] as? UInt,
      let type = AVAudioSession.InterruptionType(rawValue: rawType)
    else {
      return
    }

    switch type {
    case .began:
      guard wantsToPlay else {
        return
      }
      interruption = (wasPlaying: true, startedAt: Date())
      setStatus(.interrupted, reason: .interruption)
      updateNowPlaying()
    case .ended:
      guard let pending = interruption else {
        return
      }
      let rawOptions = info[AVAudioSessionInterruptionOptionKey] as? UInt ?? 0
      let shouldResume = AVAudioSession.InterruptionOptions(rawValue: rawOptions).contains(.shouldResume)
      let wasShort = Date().timeIntervalSince(pending.startedAt) < Self.resumeWindow
      if pending.wasPlaying && (shouldResume || wasShort) {
        resume(reason: .interruption)
      } else {
        interruption = nil
        wantsToPlay = false
        setStatus(.paused, reason: .interruption)
        updateNowPlaying()
      }
    @unknown default:
      break
    }
  }

  // Some interruptions never deliver an "ended" notification. Coming back to the
  // foreground settles them: resume if it was short, otherwise rest paused.
  private func recoverAfterSilentInterruption() {
    if let pending = interruption, pending.wasPlaying {
      if Date().timeIntervalSince(pending.startedAt) < Self.resumeWindow {
        resume(reason: .interruption)
      } else {
        interruption = nil
        wantsToPlay = false
        setStatus(.paused, reason: .interruption)
        updateNowPlaying()
      }
      return
    }
    if wantsToPlay, player.currentItem != nil, player.timeControlStatus == .paused {
      resume(reason: .interruption)
    }
  }

  private func handleRouteChange(_ notification: Notification) {
    guard
      let rawReason = notification.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt,
      AVAudioSession.RouteChangeReason(rawValue: rawReason) == .oldDeviceUnavailable,
      wantsToPlay
    else {
      return
    }
    pause(reason: .route)
  }

  private func handleMediaServicesReset() {
    let restoreIndex = index
    let restorePosition = currentPosition
    let shouldPlay = wantsToPlay || interruption?.wasPlaying == true

    teardownPlayer()
    generation += 1
    itemIndexes.removeAll()
    compositions.removeAll()
    silence = nil
    player = AVQueuePlayer()
    preparePlayer()
    remoteCommandsRegistered = false
    interruption = nil

    guard !steps.isEmpty else {
      return
    }
    configureSession()
    registerRemoteCommands()
    wantsToPlay = shouldPlay
    setStatus(.loading, reason: .error)
    let resetGeneration = generation
    Task { [weak self] in
      guard let self else {
        return
      }
      do {
        try await self.enqueue(from: restoreIndex, at: restorePosition, generation: resetGeneration)
      } catch {
        self.report(error)
        self.setStatus(.paused, reason: .error)
        return
      }
      guard resetGeneration == self.generation else {
        return
      }
      if self.wantsToPlay {
        self.resume(reason: .error)
      } else {
        self.setStatus(.paused, reason: .error)
      }
    }
  }

  // MARK: - Remote commands and Now Playing

  private func registerRemoteCommands() {
    guard !remoteCommandsRegistered else {
      return
    }
    remoteCommandsRegistered = true
    let center = MPRemoteCommandCenter.shared()

    center.playCommand.addTarget { [weak self] _ in
      self?.play(reason: .remote)
      return .success
    }
    center.pauseCommand.addTarget { [weak self] _ in
      self?.pause(reason: .remote)
      return .success
    }
    center.togglePlayPauseCommand.addTarget { [weak self] _ in
      self?.toggle(reason: .remote)
      return .success
    }
    center.nextTrackCommand.addTarget { [weak self] _ in
      self?.next(reason: .remote)
      return .success
    }
    center.previousTrackCommand.addTarget { [weak self] _ in
      self?.previous(reason: .remote)
      return .success
    }
    for command in [center.playCommand, center.pauseCommand, center.togglePlayPauseCommand, center.nextTrackCommand, center.previousTrackCommand] {
      command.isEnabled = true
    }
    for command in disabledCommands(center) {
      command.isEnabled = false
    }
  }

  private func unregisterRemoteCommands() {
    guard remoteCommandsRegistered else {
      return
    }
    remoteCommandsRegistered = false
    let center = MPRemoteCommandCenter.shared()
    for command in [center.playCommand, center.pauseCommand, center.togglePlayPauseCommand, center.nextTrackCommand, center.previousTrackCommand] {
      command.removeTarget(nil)
      command.isEnabled = false
    }
  }

  private func disabledCommands(_ center: MPRemoteCommandCenter) -> [MPRemoteCommand] {
    [
      center.skipForwardCommand,
      center.skipBackwardCommand,
      center.seekForwardCommand,
      center.seekBackwardCommand,
      center.changePlaybackPositionCommand,
      center.changePlaybackRateCommand,
      center.changeRepeatModeCommand,
      center.changeShuffleModeCommand,
    ]
  }

  private func updateNowPlaying() {
    guard steps.indices.contains(index), let nowPlaying else {
      return
    }
    let step = steps[index]
    let playing = status == .playing && isAudible
    var info: [String: Any] = [
      MPMediaItemPropertyTitle: step.title,
      MPMediaItemPropertyArtist: nowPlaying.artist,
      MPMediaItemPropertyAlbumTitle: nowPlaying.album,
      MPMediaItemPropertyPlaybackDuration: currentDuration.seconds.isFinite ? currentDuration.seconds : 0,
      MPNowPlayingInfoPropertyElapsedPlaybackTime: currentPosition.seconds.isFinite ? currentPosition.seconds : 0,
      MPNowPlayingInfoPropertyPlaybackRate: playing ? Double(rate) : 0,
      MPNowPlayingInfoPropertyDefaultPlaybackRate: Double(rate),
      MPNowPlayingInfoPropertyMediaType: MPNowPlayingInfoMediaType.audio.rawValue,
      MPNowPlayingInfoPropertyPlaybackQueueIndex: index,
      MPNowPlayingInfoPropertyPlaybackQueueCount: steps.count,
    ]
    if let artwork {
      info[MPMediaItemPropertyArtwork] = artwork
    }
    MPNowPlayingInfoCenter.default().nowPlayingInfo = info
  }

  private func loadArtwork(_ url: URL?) {
    guard let url else {
      return
    }
    Task { [weak self] in
      guard let image = await Self.loadImage(from: url) else {
        return
      }
      guard let self, self.nowPlaying?.artworkURL == url else {
        return
      }
      self.artwork = Self.makeArtwork(image)
      self.updateNowPlaying()
    }
  }

  private nonisolated static func loadImage(from url: URL) async -> UIImage? {
    let data: Data?
    if url.isFileURL {
      data = try? Data(contentsOf: url)
    } else {
      data = try? await URLSession.shared.data(from: url).0
    }
    guard let data else {
      return nil
    }
    return UIImage(data: data)
  }

  // Nonisolated so the request handler is not bound to the main actor:
  // MediaPlayer calls it on a background queue.
  private nonisolated static func makeArtwork(_ image: UIImage) -> MPMediaItemArtwork {
    MPMediaItemArtwork(boundsSize: image.size) { _ in image }
  }

  // MARK: - Helpers

  private func setStatus(_ newStatus: RosaryPlaybackStatus, reason: RosaryStatusReason?) {
    guard newStatus != status else {
      return
    }
    status = newStatus
    onStatusChange?(newStatus, reason)
  }

  private func report(_ error: Error) {
    onError?(error.localizedDescription)
  }

  private static func clampRate(_ value: Float) -> Float {
    guard value.isFinite else {
      return 1
    }
    return min(max(value, minRate), maxRate)
  }

  private static func milliseconds(_ time: CMTime) -> Double {
    let seconds = time.seconds
    return seconds.isFinite ? (seconds * 1000).rounded() : 0
  }
}
