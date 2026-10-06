import Foundation
import Observation

/**
 * What was prayed today, from the phone's journal and from this watch, so the home shows
 * it and can continue a Rosary that was left halfway. Counts acts, nothing else.
 */
@MainActor
@Observable
final class TodayStore {
  static let shared = TodayStore()

  struct Entry: Codable, Equatable {
    let id: String
    let kind: String
    let mysterySet: String
    let locale: String
    let prayedOn: String
    let startedAt: String
    let completedAt: String?
    let decades: Int
    let durationSeconds: Int

    init?(_ dictionary: [String: Any]) {
      guard
        let id = dictionary["id"] as? String,
        let kind = dictionary["kind"] as? String,
        let mysterySet = dictionary["mysterySet"] as? String,
        let locale = dictionary["locale"] as? String,
        let prayedOn = dictionary["prayedOn"] as? String,
        let startedAt = dictionary["startedAt"] as? String,
        let decades = dictionary["decades"] as? Int
      else {
        return nil
      }
      self.id = id
      self.kind = kind
      self.mysterySet = mysterySet
      self.locale = locale
      self.prayedOn = prayedOn
      self.startedAt = startedAt
      self.completedAt = dictionary["completedAt"] as? String
      self.decades = decades
      self.durationSeconds = dictionary["durationSeconds"] as? Int ?? 0
    }
  }

  private static let storageKey = "today"

  private(set) var entries: [Entry] = []

  private init() {
    if let data = UserDefaults.standard.data(forKey: Self.storageKey), let stored = try? JSONDecoder().decode([Entry].self, from: data) {
      entries = stored
    }
  }

  /** Decades prayed today, across the phone and the watch. */
  var decades: Int {
    current.reduce(0) { $0 + $1.decades }
  }

  /** The latest Rosary of today left halfway, which the watch can carry on. */
  var resumable: Entry? {
    current
      .filter { $0.kind == "rosary" && $0.completedAt == nil && (1...4).contains($0.decades) }
      .max { $0.startedAt < $1.startedAt }
  }

  /** The phone's view of today replaces what it knew; this watch's own sessions are kept. */
  func apply(phone context: [String: Any]) {
    guard context["date"] as? String == Self.today() else {
      return
    }
    let phone = (context["entries"] as? [[String: Any]] ?? []).compactMap(Entry.init)
    merge(phone)
  }

  func record(_ entry: [String: Any]) {
    if let parsed = Entry(entry) {
      merge([parsed])
    }
  }

  private var current: [Entry] {
    let today = Self.today()
    return entries.filter { $0.prayedOn == today }
  }

  private func merge(_ incoming: [Entry]) {
    var byId = Dictionary(current.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
    for entry in incoming {
      if let known = byId[entry.id], known.decades > entry.decades {
        continue
      }
      byId[entry.id] = entry
    }
    entries = Array(byId.values)
    if let data = try? JSONEncoder().encode(entries) {
      UserDefaults.standard.set(data, forKey: Self.storageKey)
    }
  }

  static func today(_ date: Date = Date()) -> String {
    let parts = Calendar.current.dateComponents([.year, .month, .day], from: date)
    return String(format: "%04d-%02d-%02d", parts.year ?? 0, parts.month ?? 0, parts.day ?? 0)
  }
}
