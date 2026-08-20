import SwiftUI

/// One decade on the watch: the mystery stays in view, the crown moves the bead.
struct DecadeView: View {
  let set: MysterySet
  @State private var crown = 0.0

  private var bead: Int {
    Int(crown.rounded())
  }

  var body: some View {
    VStack(spacing: 10) {
      Text(set.nameEs)
        .font(.headline)
        .multilineTextAlignment(.center)
      Text(bead == 0 ? "Padrenuestro" : "Ave \(bead) de 10")
        .font(.caption)
        .foregroundStyle(.secondary)
      HStack(spacing: 4) {
        ForEach(1 ... 10, id: \.self) { index in
          Circle()
            .fill(index <= bead ? Color.accentColor : Color.secondary.opacity(0.35))
            .frame(width: index == bead ? 10 : 7, height: index == bead ? 10 : 7)
        }
      }
      .focusable()
      .digitalCrownRotation($crown, from: 0, through: 10, by: 1, sensitivity: .low)
    }
    .padding()
  }
}
