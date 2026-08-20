import AVFoundation
import WatchKit

/// Spoken-audio session and haptic beads for praying without the phone (tasks 017-018).
enum WatchGuide {
  enum Pulse {
    case pater, bead, gloria, announce
  }

  static func haptic(_ pulse: Pulse) {
    let device = WKInterfaceDevice.current()
    switch pulse {
    case .pater:
      device.play(.notification)
    case .bead:
      device.play(.click)
    case .gloria:
      device.play(.success)
    case .announce:
      device.play(.start)
    }
  }

  static func pulseFor(bead: Int) -> Pulse {
    if bead == 0 {
      return .pater
    }
    if bead == 10 {
      return .gloria
    }
    return .bead
  }

  /// watchOS long-form audio needs a Bluetooth route, or a recent watch speaker.
  static func prepareSpokenAudio() -> String? {
    let session = AVAudioSession.sharedInstance()
    do {
      try session.setCategory(.playback, mode: .spokenAudio, policy: .longFormAudio)
      try session.setActive(true)
    } catch {
      return "Sin audio. Reza con la corona y el toque."
    }
    if session.currentRoute.outputs.contains(where: {
      $0.portType == .bluetoothA2DP
        || $0.portType == .bluetoothHFP
        || $0.portType == .bluetoothLE
        || $0.portType == .headphones
    }) {
      return nil
    }
    return "Conecta los auriculares, o reza con la háptica."
  }
}
