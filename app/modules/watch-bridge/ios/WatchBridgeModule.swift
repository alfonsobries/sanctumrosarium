import ExpoModulesCore
import WatchConnectivity

private final class PhoneSession: NSObject, WCSessionDelegate {
  static let shared = PhoneSession()

  func activate() {
    guard WCSession.isSupported() else {
      return
    }
    let session = WCSession.default
    session.delegate = self
    session.activate()
  }

  func sessionDidBecomeInactive(_ session: WCSession) {}

  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }

  func session(
    _ session: WCSession,
    activationDidCompleteWith activationState: WCSessionActivationState,
    error: Error?
  ) {}
}

public class WatchBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WatchBridge")

    OnCreate {
      PhoneSession.shared.activate()
    }

    Function("updateContext") { (payload: [String: String]) in
      guard WCSession.isSupported() else {
        return
      }
      try? WCSession.default.updateApplicationContext(payload)
    }
  }
}
