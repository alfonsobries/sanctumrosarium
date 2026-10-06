import Foundation
import WatchConnectivity

/**
 * The watch side of WatchConnectivity. The phone's application context carries the
 * settings, what was prayed today and which audio pack to hold; pack files arrive with
 * transferFile. The watch's own context tells the phone which pack files it has. Each
 * session goes to the phone journal with transferUserInfo, which the system queues and
 * delivers whenever the phone is reachable again, even after this app is closed.
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
    TodayStore.shared.record(entry)
    let payload: [String: Any] = ["type": "journal-entry", "entry": entry]
    guard WCSession.isSupported() else {
      return
    }
    let session = WCSession.default
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

  private func apply(_ context: [String: Any]) {
    if let settings = context["settings"] as? [String: Any] {
      WatchSettings.shared.apply(settings)
    }
    if let today = context["today"] as? [String: Any] {
      TodayStore.shared.apply(phone: today)
    }
    if let pack = context["pack"] as? [String: Any] {
      PackStore.shared.apply(offer: pack)
    }
    reportPack()
  }

  private func reportPack() {
    let session = WCSession.default
    guard session.activationState == .activated else {
      return
    }
    try? session.updateApplicationContext(["pack": PackStore.shared.report()])
  }

  // MARK: - WCSessionDelegate

  nonisolated func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    guard activationState == .activated else {
      return
    }
    let context = session.receivedApplicationContext
    Task { @MainActor in
      self.apply(context)
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
      self.apply(applicationContext)
    }
  }

  nonisolated func session(_ session: WCSession, didReceive file: WCSessionFile) {
    guard PackStore.store(file.fileURL, metadata: file.metadata) else {
      return
    }
    Task { @MainActor in
      PackStore.shared.refresh()
      self.reportPack()
    }
  }
}
