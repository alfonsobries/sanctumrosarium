import Foundation
import Observation

/**
 * How the Rosary is prayed on the wrist. Everything but haptics, the text view and the
 * voice's speed comes from the phone, which is where settings are changed; the watch keeps
 * the last values it received so it prays the same way without the phone nearby.
 */
@MainActor
@Observable
final class WatchSettings {
  static let shared = WatchSettings()

  private static let storageKey = "settings"
  private static let hapticsKey = "haptics"
  private static let showsTextKey = "showsText"
  private static let rateKey = "rate"

  var prayerLocale: String
  /** Off follows the week's order from before the luminous mysteries and hides them. */
  var luminous: Bool
  var fatimaPrayer: Bool
  var litany: Bool
  var prayerForThePope: Bool
  var pauseSeconds: Double
  /**
   * The voice's speed. It can be changed on the watch while praying; a new speed chosen
   * on the phone replaces it, the same one sent again does not.
   */
  var rate: Double {
    didSet { UserDefaults.standard.set(rate, forKey: Self.rateKey) }
  }
  /** "listen" starts the audio with the prayer; "tap" waits for the person to start it. */
  var mode: String
  /** A Gospel passage after each mystery is announced. */
  var reading: Bool
  /** The passage each mystery reads next, by mystery id, as the phone turns them. */
  var readings: [String: String]
  /** The opening Hail Marys: "standard", or another form the prayer language has. */
  var openingForm: String
  var haptics: Bool {
    didSet { UserDefaults.standard.set(haptics, forKey: Self.hapticsKey) }
  }
  /** The prayer as words to read along instead of beads; chosen on the watch, kept on it. */
  var showsText: Bool {
    didSet { UserDefaults.standard.set(showsText, forKey: Self.showsTextKey) }
  }
  /** The last speed the phone sent, to tell a new choice there from the same context again. */
  private var phoneRate: Double?

  private init() {
    let stored = UserDefaults.standard.dictionary(forKey: Self.storageKey) ?? [:]
    prayerLocale = stored["prayerLocale"] as? String ?? Self.deviceLocale()
    luminous = stored["luminous"] as? Bool ?? true
    fatimaPrayer = stored["fatimaPrayer"] as? Bool ?? true
    litany = stored["litany"] as? Bool ?? false
    prayerForThePope = stored["prayerForThePope"] as? Bool ?? true
    pauseSeconds = stored["pauseSeconds"] as? Double ?? 1
    let storedPhoneRate = stored["phoneRate"] as? Double ?? stored["rate"] as? Double
    phoneRate = storedPhoneRate
    rate = UserDefaults.standard.object(forKey: Self.rateKey) as? Double ?? storedPhoneRate ?? 1
    mode = stored["mode"] as? String ?? "listen"
    reading = stored["reading"] as? Bool ?? true
    readings = stored["readings"] as? [String: String] ?? [:]
    openingForm = stored["openingForm"] as? String ?? "standard"
    haptics = UserDefaults.standard.object(forKey: Self.hapticsKey) as? Bool ?? true
    showsText = UserDefaults.standard.object(forKey: Self.showsTextKey) as? Bool ?? false
  }

  /** Applies what the phone sent; unknown or mistyped keys keep their current value. */
  func apply(_ context: [String: Any]) {
    if let value = context["prayerLocale"] as? String, ContentStore.locales.contains(value) {
      prayerLocale = value
    }
    if let value = context["luminous"] as? Bool {
      luminous = value
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
    if let value = context["rate"] as? Double, value != phoneRate {
      phoneRate = value
      rate = value
    }
    if let value = context["mode"] as? String, value == "listen" || value == "tap" {
      mode = value
    }
    if let value = context["reading"] as? Bool {
      reading = value
    }
    if let value = context["readings"] as? [String: String] {
      readings = value
    }
    if let value = context["openingForm"] as? String {
      openingForm = value
    }
    UserDefaults.standard.set(
      [
        "prayerLocale": prayerLocale,
        "luminous": luminous,
        "fatimaPrayer": fatimaPrayer,
        "litany": litany,
        "prayerForThePope": prayerForThePope,
        "pauseSeconds": pauseSeconds,
        "phoneRate": phoneRate ?? rate,
        "mode": mode,
        "reading": reading,
        "readings": readings,
        "openingForm": openingForm,
      ],
      forKey: Self.storageKey
    )
  }

  /** The phone's first-run choice: English, Spanish from Spain, or Spanish otherwise. */
  private static func deviceLocale() -> String {
    let preferred = Locale(identifier: Locale.preferredLanguages.first ?? "es")
    if preferred.language.languageCode == .english {
      return "en-US"
    }
    return (preferred.region ?? Locale.current.region) == .spain ? "es-ES" : "es-MX"
  }
}
