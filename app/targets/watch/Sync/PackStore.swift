import Foundation
import Observation

/**
 * The audio pack on the watch. The phone owns the packs and sends only the prayer
 * language's one, file by file. Files land in a folder per pack version; a pack becomes
 * the one in use only once every file listed in its pack.json is there with the right
 * size, and only then are older packs deleted. So the watch keeps at most one pack, plus
 * the previous one while a new one is still arriving, and never loses audio mid-transfer.
 */
@MainActor
@Observable
final class PackStore {
  static let shared = PackStore()

  struct Part: Decodable {
    let file: String
    let minGapMs: Double
    let pause: Bool
    /** On a reading, the passage it reads. */
    let ref: String?
  }

  struct Installed {
    let locale: String
    let version: String
    let parts: [String: [Part]]
    let directory: URL

    func url(of file: String) -> URL {
      directory.appendingPathComponent(file)
    }
  }

  /** What the phone wants the watch to hold. */
  struct Offer: Equatable {
    let locale: String
    let version: String?
    let bytes: Int
    /** Each file's size by name; names change with their content. */
    let files: [String: Int]
  }

  enum Status: Equatable {
    case ready
    case downloading(received: Int, total: Int)
    /** This language has no audio, or the phone has not offered it yet. */
    case unavailable
  }

  private struct Manifest: Decodable {
    struct File: Decodable {
      let name: String
      let size: Int
    }

    let locale: String
    let version: String
    let parts: [String: [Part]]
    let files: [File]
  }

  private static let offerKey = "pack.offer"
  private static let currentKey = "pack.current"
  nonisolated private static let manifestName = "pack.json"

  private(set) var current: Installed?
  private(set) var offer: Offer?
  private(set) var receivedBytes = 0

  private init() {
    if let stored = UserDefaults.standard.dictionary(forKey: Self.offerKey), let locale = stored["locale"] as? String {
      offer = Offer(
        locale: locale,
        version: stored["version"] as? String,
        bytes: stored["bytes"] as? Int ?? 0,
        files: stored["files"] as? [String: Int] ?? [:]
      )
    }
    if let version = UserDefaults.standard.string(forKey: Self.currentKey) {
      current = Self.verified(version: version)
    }
    refresh()
  }

  func status(for locale: String) -> Status {
    if let current, current.locale == locale, offer?.version == nil || offer?.version == current.version {
      return .ready
    }
    if let offer, offer.locale == locale, offer.version != nil {
      return .downloading(received: receivedBytes, total: offer.bytes)
    }
    return .unavailable
  }

  /** The pack to play `locale` with, when it is complete on the watch. */
  func pack(for locale: String) -> Installed? {
    guard let current, current.locale == locale else {
      return nil
    }
    return current
  }

  func apply(offer context: [String: Any]) {
    guard let locale = context["locale"] as? String else {
      return
    }
    var files: [String: Int] = [:]
    for file in context["files"] as? [[String: Any]] ?? [] {
      if let name = file["name"] as? String, let size = file["size"] as? Int {
        files[name] = size
      }
    }
    let next = Offer(locale: locale, version: context["version"] as? String, bytes: context["bytes"] as? Int ?? 0, files: files)
    guard next != offer else {
      return
    }
    offer = next
    var stored: [String: Any] = ["locale": next.locale, "bytes": next.bytes, "files": next.files]
    stored["version"] = next.version
    UserDefaults.standard.set(stored, forKey: Self.offerKey)
    refresh()
  }

  /** Re-reads the wanted pack's folder, installs it when complete and drops what is not needed. */
  func refresh() {
    let wanted = offer?.version
    if let wanted, let offer, let current, wanted != current.version {
      Self.reuse(offer.files, from: current.directory, into: wanted)
    }
    if let wanted, wanted != current?.version, let installed = Self.verified(version: wanted) {
      current = installed
      UserDefaults.standard.set(wanted, forKey: Self.currentKey)
    }
    if offer != nil, wanted == nil, current != nil {
      // The chosen language has no audio: the old pack is of no use any more.
      current = nil
      UserDefaults.standard.removeObject(forKey: Self.currentKey)
    }
    let keep = Set([current?.version, wanted].compactMap { $0 })
    for directory in (try? FileManager.default.contentsOfDirectory(at: Self.root, includingPropertiesForKeys: nil)) ?? [] where !keep.contains(directory.lastPathComponent) {
      try? FileManager.default.removeItem(at: directory)
    }
    receivedBytes = wanted.map(Self.receivedBytes) ?? 0
  }

  /** What the watch holds, for the phone to send only what is missing. */
  func report() -> [String: Any] {
    guard let offer, let version = offer.version else {
      return [:]
    }
    let complete = current?.version == version
    var report: [String: Any] = ["locale": offer.locale, "version": version, "complete": complete]
    if !complete {
      report["received"] = Self.fileNames(version: version)
    }
    return report
  }

  // MARK: - Files

  nonisolated static var root: URL {
    FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("packs", isDirectory: true)
  }

  /**
   * Moves a received file into its pack's folder. WatchConnectivity deletes the file when
   * the delegate call returns, so this runs right there, off the main actor.
   */
  nonisolated static func store(_ file: URL, metadata: [String: Any]?) -> Bool {
    guard
      let metadata,
      let version = metadata["version"] as? String,
      let name = (metadata["name"] as? String).map({ ($0 as NSString).lastPathComponent }),
      !version.contains("/"), !name.isEmpty
    else {
      return false
    }
    let directory = root.appendingPathComponent(version, isDirectory: true)
    let destination = directory.appendingPathComponent(name)
    do {
      try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
      try? FileManager.default.removeItem(at: destination)
      try FileManager.default.moveItem(at: file, to: destination)
      return true
    } catch {
      return false
    }
  }

  /**
   * Links into a new pack's folder the files it shares with the pack in use, so a new
   * version (another Gospel passage chosen, one prayer re-recorded) only sends what changed.
   */
  private static func reuse(_ files: [String: Int], from directory: URL, into version: String) {
    let destination = root.appendingPathComponent(version, isDirectory: true)
    let manager = FileManager.default
    for (name, size) in files where name != manifestName {
      let source = directory.appendingPathComponent(name)
      let target = destination.appendingPathComponent(name)
      guard
        !manager.fileExists(atPath: target.path),
        (try? manager.attributesOfItem(atPath: source.path)[.size] as? Int) == size
      else {
        continue
      }
      try? manager.createDirectory(at: destination, withIntermediateDirectories: true)
      if (try? manager.linkItem(at: source, to: target)) == nil {
        try? manager.copyItem(at: source, to: target)
      }
    }
  }

  private static func fileNames(version: String) -> [String] {
    let directory = root.appendingPathComponent(version, isDirectory: true)
    return (try? FileManager.default.contentsOfDirectory(atPath: directory.path)) ?? []
  }

  private static func receivedBytes(version: String) -> Int {
    let directory = root.appendingPathComponent(version, isDirectory: true)
    return fileNames(version: version)
      .filter { $0 != manifestName }
      .compactMap { try? FileManager.default.attributesOfItem(atPath: directory.appendingPathComponent($0).path)[.size] as? Int }
      .reduce(0, +)
  }

  /** The pack, when pack.json is there and every file it lists has the listed size. */
  private static func verified(version: String) -> Installed? {
    let directory = root.appendingPathComponent(version, isDirectory: true)
    guard
      let data = try? Data(contentsOf: directory.appendingPathComponent(manifestName)),
      let manifest = try? JSONDecoder().decode(Manifest.self, from: data),
      manifest.version == version
    else {
      return nil
    }
    for file in manifest.files {
      let attributes = try? FileManager.default.attributesOfItem(atPath: directory.appendingPathComponent(file.name).path)
      guard attributes?[.size] as? Int == file.size else {
        return nil
      }
    }
    return Installed(locale: manifest.locale, version: version, parts: manifest.parts, directory: directory)
  }
}
