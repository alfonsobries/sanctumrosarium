import SwiftUI
import WatchConnectivity

/// Five decades on the watch: the mystery stays in view, the crown moves the bead.
struct DecadeView: View {
  let set: MysterySet
  let titles: [String]
  @State private var decadeIndex = 0
  @State private var crown = 0.0
  @State private var audioNote: String?
  @State private var finished = false

  private var bead: Int {
    Int(crown.rounded())
  }

  private var mysteryTitle: String {
    if titles.indices.contains(decadeIndex) {
      return titles[decadeIndex]
    }
    return set.nameEs
  }

  var body: some View {
    VStack(spacing: 8) {
      if finished {
        Text(set.nameEs)
          .font(.headline)
          .multilineTextAlignment(.center)
        Text("Cinco decenas.")
          .font(.caption)
          .foregroundStyle(.secondary)
      } else {
        Text(mysteryTitle)
          .font(.headline)
          .multilineTextAlignment(.center)
          .minimumScaleFactor(0.7)
        Text(bead == 0 ? "Padrenuestro" : bead == 10 ? "Gloria" : "Ave \(bead) de 10")
          .font(.caption)
          .foregroundStyle(.secondary)
        Text("Decena \(decadeIndex + 1) de 5")
          .font(.caption2)
          .foregroundStyle(.secondary)
        if let audioNote {
          Text(audioNote)
            .font(.caption2)
            .foregroundStyle(.secondary)
            .multilineTextAlignment(.center)
        }
        HStack(spacing: 4) {
          ForEach(1 ... 10, id: \.self) { index in
            Circle()
              .fill(index <= bead ? Color.accentColor : Color.secondary.opacity(0.35))
              .frame(width: index == bead ? 10 : 7, height: index == bead ? 10 : 7)
          }
        }
        .focusable()
        .digitalCrownRotation($crown, from: 0, through: 10, by: 1, sensitivity: .low)
        .onChange(of: bead) { _, next in
          WatchGuide.haptic(WatchGuide.pulseFor(bead: next))
        }
      }
    }
    .padding()
    .contentShape(Rectangle())
    .accessibilityElement(children: .combine)
    .accessibilityLabel(mysteryTitle)
    .accessibilityValue(
      finished
        ? "Cinco decenas."
        : "\(bead == 0 ? "Padrenuestro" : bead == 10 ? "Gloria" : "Ave \(bead) de 10"), decena \(decadeIndex + 1) de 5"
    )
    .accessibilityAddTraits(.isButton)
    .accessibilityHint("Toca para avanzar")
    .onTapGesture(perform: advance)
    .onAppear {
      audioNote = WatchGuide.prepareSpokenAudio()
    }
  }

  private func advance() {
    if finished {
      return
    }
    if bead < 10 {
      crown = Double(bead + 1)
      return
    }
    if decadeIndex < 4 {
      decadeIndex += 1
      crown = 0
      WatchGuide.haptic(.announce)
      return
    }
    finished = true
    WatchGuide.haptic(.gloria)
    sendToPhone()
  }

  private func sendToPhone() {
    let payload: [String: String] = [
      "decades": "5",
      "set": set.rawValue,
    ]
    guard WCSession.isSupported() else {
      return
    }
    let session = WCSession.default
    if session.isReachable {
      session.sendMessage(payload, replyHandler: nil)
    } else {
      session.transferUserInfo(payload)
    }
  }
}
