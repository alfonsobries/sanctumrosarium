import Foundation
import Observation

/**
 * How the Rosary is prayed on the wrist. Everything but haptics comes from the phone,
 * which is where settings are changed; the watch keeps the last values it received so it
 * prays the same way without the phone nearby.
 */
@MainActor
@Observable
final class WatchSettings {
  static let shared = WatchSettings()

  private static let storageKey = "settings"
  private static let hapticsKey = "haptics"

  var prayerLocale: String
  var fatimaPrayer: Bool
  var litany: Bool
  var prayerForThePope: Bool
  var pauseSeconds: Double
  var rate: Double
  /** "listen" starts the audio with the prayer; "tap" waits for the person to start it. */
  var mode: String
  var haptics: Bool {
    didSet { UserDefaults.standard.set(haptics, forKey: Self.hapticsKey) }
  }

  private init() {
    let stored = UserDefaults.standard.dictionary(forKey: Self.storageKey) ?? [:]
    prayerLocale = stored["prayerLocale"] as? String ?? Self.deviceLocale()
    fatimaPrayer = stored["fatimaPrayer"] as? Bool ?? true
    litany = stored["litany"] as? Bool ?? false
    prayerForThePope = stored["prayerForThePope"] as? Bool ?? true
    pauseSeconds = stored["pauseSeconds"] as? Double ?? 1
    rate = stored["rate"] as? Double ?? 1
    mode = stored["mode"] as? String ?? "listen"
    haptics = UserDefaults.standard.object(forKey: Self.hapticsKey) as? Bool ?? true
  }

  /** Applies what the phone sent; unknown or mistyped keys keep their current value. */
  func apply(_ context: [String: Any]) {
    if let value = context["prayerLocale"] as? String, ContentStore.locales.contains(value) {
      prayerLocale = value
    }
    if let value = context["fatimaPrayer"] as? Bool {
      fatimaPrayer = value
    }
    if let value = context["litany"] as? Bool {
      litany = value
    }
    if let value = context["prayerForThePope"] as? Bool {
      prayerForThePope = value
    }
    if let value = context["pauseSeconds"] as? Double {
      pauseSeconds = max(0, value)
    }
    if let value = context["rate"] as? Double {
      rate = value
    }
    if let value = context["mode"] as? String, value == "listen" || value == "tap" {
      mode = value
    }
    UserDefaults.standard.set(
      [
        "prayerLocale": prayerLocale,
        "fatimaPrayer": fatimaPrayer,
        "litany": litany,
        "prayerForThePope": prayerForThePope,
        "pauseSeconds": pauseSeconds,
        "rate": rate,
        "mode": mode,
      ],
      forKey: Self.storageKey
    )
  }

  private static func deviceLocale() -> String {
    Locale.preferredLanguages.first?.hasPrefix("en") == true ? "en-US" : "es-MX"
  }
}
