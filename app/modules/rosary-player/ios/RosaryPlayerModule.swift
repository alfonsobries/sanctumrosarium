import ExpoModulesCore

struct PartRecord: Record {
  @Field var uri: String = ""
  @Field var gapAfterMs: Double = 0
}

struct StepRecord: Record {
  @Field var id: String = ""
  @Field var title: String = ""
  @Field var subtitle: String?
  @Field var parts: [PartRecord] = []
}

struct NowPlayingRecord: Record {
  @Field var album: String = ""
  @Field var artist: String = ""
  @Field var artworkUri: String?
}

struct LoadOptionsRecord: Record {
  @Field var startIndex: Int = 0
  @Field var rate: Double = 1
  @Field var nowPlaying: NowPlayingRecord = NowPlayingRecord()
}

// The core outlives module instances, so a JS reload or an unmounted screen
// never tears playback down.
@MainActor
private enum SharedPlayer {
  static let core = RosaryPlayerCore()
  /// Whether JavaScript listens to progress, so it can resume after the app returns.
  @MainActor static var progressObserved = false
}

public final class RosaryPlayerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RosaryPlayer")

    Events("onStepChange", "onStatusChange", "onProgress", "onError")

    OnCreate {
      // Events are only sent through `sendEvent`, which is thread-safe.
      nonisolated(unsafe) weak let module = self
      Task { @MainActor in
        module?.attach()
      }
    }

    OnDestroy {
      Task { @MainActor in
        let core = SharedPlayer.core
        core.onStepChange = nil
        core.onStatusChange = nil
        core.onProgress = nil
        core.onError = nil
        core.progressEnabled = false
      }
    }

    OnStartObserving("onProgress") {
      Task { @MainActor in
        SharedPlayer.progressObserved = true
        SharedPlayer.core.progressEnabled = true
      }
    }

    OnStopObserving("onProgress") {
      Task { @MainActor in
        SharedPlayer.progressObserved = false
        SharedPlayer.core.progressEnabled = false
      }
    }

    // Progress only lights up words on screen; with the screen off it would wake
    // JavaScript twenty times a second for nobody.
    OnAppEntersBackground {
      Task { @MainActor in
        SharedPlayer.core.progressEnabled = false
      }
    }

    OnAppBecomesActive {
      Task { @MainActor in
        SharedPlayer.core.progressEnabled = SharedPlayer.progressObserved
      }
    }

    AsyncFunction("load") { (records: [StepRecord], options: LoadOptionsRecord) async throws in
      let steps = records.map(Self.step)
      let nowPlaying = RosaryNowPlaying(
        album: options.nowPlaying.album,
        artist: options.nowPlaying.artist,
        artworkURL: options.nowPlaying.artworkUri.flatMap(Self.url)
      )
      let startIndex = options.startIndex
      let rate = Float(options.rate)
      try await SharedPlayer.core.load(steps: steps, startIndex: startIndex, rate: rate, nowPlaying: nowPlaying)
    }

    AsyncFunction("play") { () async in
      await SharedPlayer.core.play()
    }

    AsyncFunction("pause") { () async in
      await SharedPlayer.core.pause()
    }

    AsyncFunction("toggle") { () async in
      await SharedPlayer.core.toggle()
    }

    AsyncFunction("skipTo") { (index: Int) async in
      await SharedPlayer.core.skipTo(index)
    }

    AsyncFunction("next") { () async in
      await SharedPlayer.core.next()
    }

    AsyncFunction("previous") { () async in
      await SharedPlayer.core.previous()
    }

    AsyncFunction("setRate") { (rate: Double) async in
      await SharedPlayer.core.setRate(Float(rate))
    }

    AsyncFunction("unload") { () async in
      await SharedPlayer.core.unload()
    }

    AsyncFunction("getState") { () async -> [String: Any] in
      let state = await SharedPlayer.core.state()
      return [
        "index": state.index,
        "status": state.status.rawValue,
        "positionMs": state.positionMs,
        "durationMs": state.durationMs,
      ]
    }
  }

  @MainActor
  private func attach() {
    let core = SharedPlayer.core
    core.onStepChange = { [weak self] index, id in
      self?.sendEvent("onStepChange", ["index": index, "id": id])
    }
    core.onStatusChange = { [weak self] status, reason in
      var payload: [String: Any] = ["status": status.rawValue]
      if let reason {
        payload["reason"] = reason.rawValue
      }
      self?.sendEvent("onStatusChange", payload)
    }
    core.onProgress = { [weak self] index, positionMs, durationMs in
      self?.sendEvent("onProgress", ["index": index, "positionMs": positionMs, "durationMs": durationMs])
    }
    core.onError = { [weak self] message in
      self?.sendEvent("onError", ["message": message])
    }
  }

  private static func step(_ record: StepRecord) -> RosaryStep {
    RosaryStep(
      id: record.id,
      title: record.title,
      subtitle: record.subtitle,
      parts: record.parts.compactMap { part in
        url(part.uri).map { RosaryPart(url: $0, gapAfter: part.gapAfterMs / 1000) }
      }
    )
  }

  private static func url(_ value: String) -> URL? {
    if value.hasPrefix("/") {
      return URL(fileURLWithPath: value)
    }
    return URL(string: value)
  }
}
