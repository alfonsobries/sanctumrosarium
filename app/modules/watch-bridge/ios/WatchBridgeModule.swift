import ExpoModulesCore
import WatchConnectivity

struct PackFileRecord: Record {
  @Field var name: String = ""
  @Field var path: String = ""
}

struct PackRecord: Record {
  @Field var locale: String = ""
  @Field var version: String?
  @Field var parts: String?
  @Field var files: [PackFileRecord] = []
}

public final class WatchBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WatchBridge")

    Events("onWatchSession")

    OnCreate {
      // Events are only sent through `sendEvent`, which is thread-safe.
      nonisolated(unsafe) weak let module = self
      WatchBridgeSession.shared.onEntry = { entry in
        module?.sendEvent("onWatchSession", entry)
      }
      WatchBridgeSession.shared.activate()
    }

    OnDestroy {
      WatchBridgeSession.shared.onEntry = nil
    }

    Function("isSupported") { () -> Bool in
      WCSession.isSupported()
    }

    Function("sendSettings") { (settings: [String: Any]) in
      WatchBridgeSession.shared.send(settings: settings)
    }

    Function("sendToday") { (today: [String: Any]) in
      WatchBridgeSession.shared.send(today: today)
    }

    Function("setAudioPack") { (pack: PackRecord) in
      WatchBridgeSession.shared.setPack(
        locale: pack.locale,
        version: pack.version,
        parts: pack.parts,
        files: pack.files.map { (name: $0.name, path: $0.path) }
      )
    }

    Function("pendingSessions") { () -> [[String: Any]] in
      WatchBridgeSession.shared.pending()
    }

    Function("acknowledgeSession") { (id: String) in
      WatchBridgeSession.shared.acknowledge(id)
    }
  }
}
