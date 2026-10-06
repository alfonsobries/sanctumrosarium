import Foundation
import WatchConnectivity

// The phone side of WatchConnectivity.
//
// - Phone to watch, latest state only: the settings, what was prayed today and which audio
//   pack the watch should hold travel together as the application context.
// - Audio packs: the phone owns them and sends the chosen language's files one by one with
//   transferFile. The watch reports in its own context which files of which pack it has, so
//   sending is a reconciliation that can run any time and only sends what is missing.
// - Watch to phone: each prayed session arrives with transferUserInfo. Entries are kept
//   until JavaScript confirms they are in the journal, so none is lost if the app closes.
final class WatchBridgeSession: NSObject, WCSessionDelegate, @unchecked Sendable {
  static let shared = WatchBridgeSession()

  private static let pendingKey = "watch-bridge.pending"
  private static let packKey = "watch-bridge.pack"

  struct PackFile {
    let name: String
    let path: String
    let size: Int
  }

  struct Pack {
    let locale: String
    /** Nil when the language has no audio: the watch prays it without. */
    let version: String?
    let manifestPath: String?
    let files: [PackFile]

    var bytes: Int { files.reduce(0) { $0 + $1.size } }
  }

  // Every piece of state below is only touched on this queue.
  private let queue = DispatchQueue(label: "app.sanctamaria.watch-bridge")
  private var settings: [String: Any]?
  private var today: [String: Any]?
  private var pack: Pack?
  private var handler: (@Sendable ([String: Any]) -> Void)?

  var onEntry: (@Sendable ([String: Any]) -> Void)? {
    get { queue.sync { handler } }
    set { queue.sync { handler = newValue } }
  }

  func activate() {
    guard WCSession.isSupported() else {
      return
    }
    queue.async {
      self.pack = self.pack ?? Self.restorePack()
    }
    let session = WCSession.default
    if session.delegate == nil {
      session.delegate = self
    }
    if session.activationState != .activated {
      session.activate()
    }
  }

  func send(settings: [String: Any]) {
    queue.async {
      self.settings = settings
      self.flush()
    }
  }

  func send(today: [String: Any]) {
    queue.async {
      self.today = today
      self.flush()
    }
  }

  /**
   * Makes `locale`'s pack the one the watch should hold. `parts` is the playback plan the
   * watch reads (JSON); `files` are the recordings on this phone.
   */
  func setPack(locale: String, version: String?, parts: String?, files: [(name: String, path: String)]) {
    queue.async {
      guard let version, let parts else {
        self.pack = Pack(locale: locale, version: nil, manifestPath: nil, files: [])
        self.storePack()
        self.flush()
        return
      }
      if self.pack?.version == version, self.pack?.manifestPath.map(FileManager.default.fileExists) == true {
        self.flush()
        return
      }
      let packFiles = files.compactMap { file -> PackFile? in
        let attributes = try? FileManager.default.attributesOfItem(atPath: file.path)
        guard let size = attributes?[.size] as? Int else {
          return nil
        }
        return PackFile(name: file.name, path: file.path, size: size)
      }
      guard packFiles.count == files.count, let manifestPath = Self.writeManifest(locale: locale, version: version, parts: parts, files: packFiles) else {
        return
      }
      self.pack = Pack(locale: locale, version: version, manifestPath: manifestPath, files: packFiles)
      self.storePack()
      self.flush()
    }
  }

  func pending() -> [[String: Any]] {
    queue.sync { Array(storedPending().values) }
  }

  func acknowledge(_ id: String) {
    queue.async {
      var stored = self.storedPending()
      stored.removeValue(forKey: id)
      UserDefaults.standard.set(stored, forKey: Self.pendingKey)
    }
  }

  // MARK: - Sending

  private var session: WCSession? {
    guard WCSession.isSupported() else {
      return nil
    }
    let session = WCSession.default
    guard session.activationState == .activated, session.isPaired, session.isWatchAppInstalled else {
      return nil
    }
    return session
  }

  private func flush() {
    guard let session else {
      return
    }
    var context: [String: Any] = [:]
    if let settings {
      context["settings"] = settings
    }
    if let today {
      context["today"] = today
    }
    if let pack {
      var offer: [String: Any] = ["locale": pack.locale]
      if let version = pack.version {
        offer["version"] = version
        offer["bytes"] = pack.bytes
        offer["files"] = pack.files.map { ["name": $0.name, "size": $0.size] }
      }
      context["pack"] = offer
    }
    if !context.isEmpty {
      try? session.updateApplicationContext(context)
    }
    reconcilePack(session)
  }

  /** Sends whatever files of the wanted pack the watch neither has nor is receiving. */
  private func reconcilePack(_ session: WCSession) {
    let wanted = pack?.version
    var inFlight = Set<String>()
    for transfer in session.outstandingFileTransfers {
      let metadata = transfer.file.metadata ?? [:]
      guard metadata["kind"] as? String == "pack-file" || metadata["kind"] as? String == "pack-manifest" else {
        continue
      }
      if metadata["version"] as? String == wanted, let name = metadata["name"] as? String {
        inFlight.insert(name)
      } else {
        transfer.cancel()
      }
    }
    guard let pack, let version = pack.version, let manifestPath = pack.manifestPath else {
      return
    }
    let report = session.receivedApplicationContext["pack"] as? [String: Any] ?? [:]
    let sameVersion = report["version"] as? String == version
    if sameVersion, report["complete"] as? Bool == true {
      return
    }
    let received = Set(sameVersion ? report["received"] as? [String] ?? [] : [])
    let base: [String: Any] = ["locale": pack.locale, "version": version]

    if !received.contains("pack.json"), !inFlight.contains("pack.json") {
      var metadata = base
      metadata["kind"] = "pack-manifest"
      metadata["name"] = "pack.json"
      session.transferFile(URL(fileURLWithPath: manifestPath), metadata: metadata)
    }
    for file in pack.files where !received.contains(file.name) && !inFlight.contains(file.name) {
      guard FileManager.default.fileExists(atPath: file.path) else {
        continue
      }
      var metadata = base
      metadata["kind"] = "pack-file"
      metadata["name"] = file.name
      metadata["size"] = file.size
      session.transferFile(URL(fileURLWithPath: file.path), metadata: metadata)
    }
  }

  // MARK: - Storage

  private static func writeManifest(locale: String, version: String, parts: String, files: [PackFile]) -> String? {
    guard let partsObject = try? JSONSerialization.jsonObject(with: Data(parts.utf8)) else {
      return nil
    }
    let manifest: [String: Any] = [
      "locale": locale,
      "version": version,
      "parts": partsObject,
      "files": files.map { ["name": $0.name, "size": $0.size] },
    ]
    let directory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("watch-pack", isDirectory: true)
    do {
      try? FileManager.default.removeItem(at: directory)
      try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
      let url = directory.appendingPathComponent("\(locale)-\(version).json")
      try JSONSerialization.data(withJSONObject: manifest).write(to: url, options: .atomic)
      return url.path
    } catch {
      return nil
    }
  }

  private func storePack() {
    guard let pack else {
      return
    }
    var stored: [String: Any] = ["locale": pack.locale]
    if let version = pack.version, let manifestPath = pack.manifestPath {
      stored["version"] = version
      stored["manifestPath"] = manifestPath
      stored["files"] = pack.files.map { ["name": $0.name, "path": $0.path, "size": $0.size] }
    }
    UserDefaults.standard.set(stored, forKey: Self.packKey)
  }

  private static func restorePack() -> Pack? {
    guard let stored = UserDefaults.standard.dictionary(forKey: packKey), let locale = stored["locale"] as? String else {
      return nil
    }
    let files = (stored["files"] as? [[String: Any]] ?? []).compactMap { file -> PackFile? in
      guard let name = file["name"] as? String, let path = file["path"] as? String, let size = file["size"] as? Int else {
        return nil
      }
      return PackFile(name: name, path: path, size: size)
    }
    return Pack(
      locale: locale,
      version: stored["version"] as? String,
      manifestPath: stored["manifestPath"] as? String,
      files: files
    )
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
    queue.async {
      var stored = self.storedPending()
      stored[id] = entry
      UserDefaults.standard.set(stored, forKey: Self.pendingKey)
      self.handler?(entry)
    }
  }

  // MARK: - WCSessionDelegate

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    queue.async { self.flush() }
  }

  func sessionDidBecomeInactive(_ session: WCSession) {}

  // Switching to another paired watch deactivates the session; activate again for it.
  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }

  func sessionWatchStateDidChange(_ session: WCSession) {
    queue.async { self.flush() }
  }

  // The watch reports which pack files it holds; send whatever is still missing.
  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    queue.async { self.flush() }
  }

  func session(_ session: WCSession, didFinish fileTransfer: WCSessionFileTransfer, error: Error?) {}

  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    receive(userInfo)
  }
}
