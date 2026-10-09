import Foundation

// Data exported by scripts/build-watch-content.mts from the shared content and engine.
// The watch reads it as is; no prayer, order or calendar rule lives in Swift.

struct RosaryFile: Decodable {
  let weekdays: [String]
  /** Voice speeds offered, the same as on the phone. */
  let rates: [Double]
  let sets: [SetTemplate]
}

struct SetTemplate: Decodable, Identifiable, Hashable {
  let id: String
  let mysteries: [String]
  /** The whole Rosary. */
  let steps: [StepTemplate]
  /** Each mystery prayed as a single decade. */
  let decades: [[StepTemplate]]
}

struct StepTemplate: Decodable, Hashable {
  struct Count: Decodable, Hashable {
    let index: Int
    let total: Int
  }

  let id: String
  let kind: String
  let prayer: String?
  let section: String
  let decade: Int?
  let mystery: String?
  let count: Count?
  /** "pope" for the Our Father and Hail Mary said for the Pope's intentions. */
  let intention: String?
  let ring: RingState
  let decadesBefore: Int
  let audio: String
  /** The mystery whose image is the Now Playing cover during this step. */
  let cover: String?

  var isAnnounce: Bool { kind == "announce" }
  var isOurFather: Bool { prayer == "our-father" }
}

/** What the bead ring shows for a step; mirrors the phone's BeadRingState. */
enum RingState: Decodable, Hashable {
  enum Bead: String, Decodable, Hashable {
    case pending, current, done
  }

  case decade(ourFather: Bead, prayed: Int, current: Int?)
  case opening(prayed: Int, current: Int?)

  private enum Keys: String, CodingKey {
    case kind, ourFather, prayed, current
  }

  init(from decoder: Decoder) throws {
    let container = try decoder.container(keyedBy: Keys.self)
    let prayed = try container.decode(Int.self, forKey: .prayed)
    let current = try container.decodeIfPresent(Int.self, forKey: .current)
    if try container.decode(String.self, forKey: .kind) == "opening" {
      self = .opening(prayed: prayed, current: current)
    } else {
      self = .decade(ourFather: try container.decode(Bead.self, forKey: .ourFather), prayed: prayed, current: current)
    }
  }
}

struct LocaleContent: Decodable {
  struct Mystery: Decodable {
    let title: String
    let reading: String?
  }

  struct Prayer: Decodable {
    let title: String
    let lines: [String]
    let responseFrom: Int?
  }

  let locale: String
  let setTitles: [String: String]
  let mysteries: [String: Mystery]
  let prayers: [String: Prayer]
}

enum ContentError: Error {
  case missing(String)
}

/** Loads the bundled content once; every locale the phone can choose is bundled. */
@MainActor
final class ContentStore {
  static let shared = ContentStore()

  static let locales = ["es-MX", "es-ES", "en-US", "la"]

  let rosary: RosaryFile
  private var byLocale: [String: LocaleContent] = [:]

  private init() {
    do {
      rosary = try Self.decode(RosaryFile.self, named: "rosary")
    } catch {
      fatalError("The watch bundle has no rosary.json: \(error)")
    }
  }

  func content(for locale: String) -> LocaleContent {
    let resolved = Self.locales.contains(locale) ? locale : "es-MX"
    if let cached = byLocale[resolved] {
      return cached
    }
    do {
      let loaded = try Self.decode(LocaleContent.self, named: resolved)
      byLocale[resolved] = loaded
      return loaded
    } catch {
      fatalError("The watch bundle has no \(resolved).json: \(error)")
    }
  }

  func set(_ id: String) -> SetTemplate {
    rosary.sets.first { $0.id == id } ?? rosary.sets[0]
  }

  /** The set the Church assigns to this day of the week (RVM 38). */
  func setFor(_ date: Date, calendar: Calendar = .current) -> SetTemplate {
    let weekday = calendar.component(.weekday, from: date) - 1
    return set(rosary.weekdays[weekday])
  }

  private static func decode<T: Decodable>(_ type: T.Type, named name: String) throws -> T {
    guard let url = Bundle.main.url(forResource: name, withExtension: "json", subdirectory: "content") else {
      throw ContentError.missing(name)
    }
    return try JSONDecoder().decode(type, from: Data(contentsOf: url))
  }
}
