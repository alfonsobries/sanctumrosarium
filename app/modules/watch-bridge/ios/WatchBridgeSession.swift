import Foundation
import WatchConnectivity

// The phone side of WatchConnectivity. Activated as soon as the module is created so the
// watch can deliver sessions even before JavaScript subscribes; entries are kept until
// JavaScript confirms they are in the journal, so a session is never lost if the app is
// closed while one arrives.
final class WatchBridgeSession: NSObject, WCSessionDelegate, @unchecked Sendable {
  static let shared = WatchBridgeSession()

  private static let pendingKey = "watch-bridge.pending"

  private let lock = NSLock()
  private var latestSettings: [String: Any]?
  private var handler: (@Sendable ([String: Any]) -> Void)?

  var onEntry: (@Sendable ([String: Any]) -> Void)? {
    get { lock.withLock { handler } }
    set { lock.withLock { handler = newValue } }
  }

  func activate() {
    guard WCSession.isSupported() else {
      return
    }
    let session = WCSession.default
    if session.delegate == nil {
      session.delegate = self
    }
    if session.activationState != .activated {
      session.activate()
    }
  }

  /** Replaces the context the watch reads; only the latest settings matter. */
  func send(settings: [String: Any]) {
    lock.withLock { latestSettings = settings }
    flushSettings()
  }

  func pending() -> [[String: Any]] {
    lock.withLock { Array(storedPending().values) }
  }

  func acknowledge(_ id: String) {
    lock.withLock {
      var stored = storedPending()
      stored.removeValue(forKey: id)
      UserDefaults.standard.set(stored, forKey: Self.pendingKey)
    }
  }

  private func flushSettings() {
    guard WCSession.isSupported() else {
      return
    }
    let session = WCSession.default
    guard session.activationState == .activated, session.isPaired, session.isWatchAppInstalled else {
      return
    }
    guard let settings = lock.withLock({ latestSettings }) else {
      return
    }
    try? session.updateApplicationContext(settings)
  }

  private func storedPending() -> [String: [String: Any]] {
    UserDefaults.standard.dictionary(forKey: Self.pendingKey) as? [String: [String: Any]] ?? [:]
  }

  private func receive(_ userInfo: [String: Any]) {
    guard userInfo["type"] as? String == "journal-entry",
      let entry = userInfo["entry"] as? [String: Any],
      let id = entry["id"] as? String
    else {
      return
    }
    let callback: (@Sendable ([String: Any]) -> Void)? = lock.withLock {
      var stored = storedPending()
      stored[id] = entry
      UserDefaults.standard.set(stored, forKey: Self.pendingKey)
      return handler
    }
    callback?(entry)
  }

  // MARK: - WCSessionDelegate

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    flushSettings()
  }

  func sessionDidBecomeInactive(_ session: WCSession) {}

  // Switching to another paired watch deactivates the session; activate again for it.
  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }

  func sessionWatchStateDidChange(_ session: WCSession) {
    flushSettings()
  }

  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    receive(userInfo)
  }
}
