import ExpoModulesCore
import WatchConnectivity

private final class PhoneSession: NSObject, WCSessionDelegate {
  static let shared = PhoneSession()
  var onPrayed: (([String: Any]) -> Void)?

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

  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    onPrayed?(message)
  }

  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    onPrayed?(userInfo)
  }
}

public class WatchBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WatchBridge")
    Events("onWatchPrayed")

    OnCreate {
      PhoneSession.shared.activate()
      PhoneSession.shared.onPrayed = { [weak self] payload in
        self?.sendEvent("onWatchPrayed", payload)
      }
    }

    Function("updateContext") { (payload: [String: String]) in
      guard WCSession.isSupported() else {
        return
      }
      try? WCSession.default.updateApplicationContext(payload)
    }
  }
}
