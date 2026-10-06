import ExpoModulesCore
import WatchConnectivity

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

    Function("pendingSessions") { () -> [[String: Any]] in
      WatchBridgeSession.shared.pending()
    }

    Function("acknowledgeSession") { (id: String) in
      WatchBridgeSession.shared.acknowledge(id)
    }
  }
}
