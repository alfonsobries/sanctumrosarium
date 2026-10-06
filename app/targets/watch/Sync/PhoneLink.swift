import Foundation
import WatchConnectivity

/**
 * The watch side of WatchConnectivity: receives settings through the application context
 * and sends each session to the phone journal with transferUserInfo, which the system
 * queues and delivers whenever the phone is reachable again.
 */
@MainActor
final class PhoneLink: NSObject, WCSessionDelegate {
  static let shared = PhoneLink()

  private var pending: [[String: Any]] = []

  func activate() {
    guard WCSession.isSupported() else {
      return
    }
    WCSession.default.delegate = self
    WCSession.default.activate()
  }

  /**
   * Sends a journal entry. A newer version of the same session replaces any copy still
   * waiting to be delivered, so the phone only receives the latest state.
   */
  func send(entry: [String: Any]) {
    let payload: [String: Any] = ["type": "journal-entry", "entry": entry]
    let session = WCSession.default
    guard WCSession.isSupported() else {
      return
    }
    guard session.activationState == .activated else {
      pending.append(payload)
      return
    }
    let id = entry["id"] as? String
    for transfer in session.outstandingUserInfoTransfers {
      let queued = transfer.userInfo["entry"] as? [String: Any]
      if let id, queued?["id"] as? String == id {
        transfer.cancel()
      }
    }
    session.transferUserInfo(payload)
  }

  // MARK: - WCSessionDelegate

  nonisolated func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    guard activationState == .activated else {
      return
    }
    let context = session.receivedApplicationContext
    Task { @MainActor in
      if !context.isEmpty {
        WatchSettings.shared.apply(context)
      }
      let queued = self.pending
      self.pending = []
      for payload in queued {
        if let entry = payload["entry"] as? [String: Any] {
          self.send(entry: entry)
        }
      }
    }
  }

  nonisolated func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    Task { @MainActor in
      WatchSettings.shared.apply(applicationContext)
    }
  }
}
