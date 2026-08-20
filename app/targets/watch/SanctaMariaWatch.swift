import SwiftUI
import WatchConnectivity

@main
struct SanctaMariaWatch: App {
  init() {
    WatchSession.shared.activate()
  }

  var body: some Scene {
    WindowGroup {
      TodayView()
    }
  }
}

/// Weekday rule of RVM 38. Liturgical exceptions (Advent Sundays, Christmas, Triduum)
/// still live in the phone engine; they land here when the bridge sends the day's set.
enum MysterySet: String {
  case gaudiosa, luminosa, dolorosa, gloriosa

  var nameEs: String {
    switch self {
    case .gaudiosa: return "Misterios gozosos"
    case .luminosa: return "Misterios luminosos"
    case .dolorosa: return "Misterios dolorosos"
    case .gloriosa: return "Misterios gloriosos"
    }
  }

  static func ofWeekday(_ date: Date) -> MysterySet {
    switch Calendar.current.component(.weekday, from: date) {
    case 2: return .gaudiosa
    case 3: return .dolorosa
    case 4: return .gloriosa
    case 5: return .luminosa
    case 6: return .dolorosa
    case 7: return .gaudiosa
    default: return .gloriosa
    }
  }
}

final class WatchSession: NSObject, WCSessionDelegate {
  static let shared = WatchSession()
  private(set) var setFromPhone: MysterySet?

  func activate() {
    guard WCSession.isSupported() else {
      return
    }
    WCSession.default.delegate = self
    WCSession.default.activate()
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}

  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    if let raw = applicationContext["set"] as? String, let set = MysterySet(rawValue: raw) {
      setFromPhone = set
    }
  }
}

struct TodayView: View {
  private var set: MysterySet {
    WatchSession.shared.setFromPhone ?? MysterySet.ofWeekday(Date())
  }

  var body: some View {
    NavigationStack {
      DecadeView(set: set)
    }
  }
}
