import SwiftUI

/**
 * The beads drawn as a circle around the count, as on the phone: for a decade, its Our
 * Father bead at the top and ten Hail Marys from 30° to 330°; during the opening, the
 * crucifix at the top and the four beads that follow it. Prayed beads are filled, the
 * current one carries a halo. Always-On drops the halo animation and the accent.
 */
struct BeadRing: View {
  let state: RingState
  var dimmed = false

  private struct Slot: Identifiable {
    let id: String
    let degrees: Double
    let large: Bool
    let done: Bool
    let current: Bool
  }

  var body: some View {
    GeometryReader { proxy in
      let size = min(proxy.size.width, proxy.size.height)
      let radius = size * 0.42
      let bead = size * 0.085
      ZStack {
        Circle()
          .stroke(Color("bead"), lineWidth: 1)
          .frame(width: radius * 2, height: radius * 2)

        if let cross {
          crossView(arm: bead * 0.75, done: cross.done, current: cross.current)
            .offset(offset(0, radius: radius))
        }

        ForEach(slots) { slot in
          beadView(diameter: slot.large ? bead * 1.45 : bead, filled: slot.done, current: slot.current)
            .offset(offset(slot.degrees, radius: radius))
        }
      }
      .frame(width: size, height: size)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    .animation(dimmed ? nil : .smooth(duration: 0.26), value: state)
    .accessibilityHidden(true)
  }

  private var cross: (done: Bool, current: Bool)? {
    guard case let .opening(prayed, current) = state else {
      return nil
    }
    return (done: prayed > 0 || current != 0, current: current == 0)
  }

  private var slots: [Slot] {
    switch state {
    case let .opening(prayed, current):
      return [72.0, 144, 216, 288].enumerated().map { index, degrees in
        let position = index + 1
        return Slot(id: "o\(position)", degrees: degrees, large: position == 1, done: position <= prayed, current: current == position)
      }
    case let .decade(ourFather, prayed, current):
      let ourFatherSlot = Slot(id: "of", degrees: 0, large: true, done: ourFather != .pending, current: ourFather == .current)
      let hailMarys = (1...10).map { index in
        Slot(id: "hm\(index)", degrees: 30 + Double(index - 1) * 300 / 9, large: false, done: index <= prayed, current: current == index)
      }
      return [ourFatherSlot] + hailMarys
    }
  }

  private func offset(_ degrees: Double, radius: CGFloat) -> CGSize {
    let radians = (degrees - 90) * .pi / 180
    return CGSize(width: radius * cos(radians), height: radius * sin(radians))
  }

  private var bead: Color { Color("bead") }
  private var beadDone: Color { dimmed ? Color("beadDone").opacity(0.55) : Color("beadDone") }
  private var halo: Color { dimmed ? .secondary : .accentColor }

  private func crossView(arm: CGFloat, done: Bool, current: Bool) -> some View {
    ZStack {
      Circle()
        .fill(Color.black)
        .frame(width: arm * 3.2, height: arm * 3.2)
      Path { path in
        path.move(to: CGPoint(x: arm * 1.6, y: arm * 0.3))
        path.addLine(to: CGPoint(x: arm * 1.6, y: arm * 3))
        path.move(to: CGPoint(x: arm * 0.6, y: arm * 1.25))
        path.addLine(to: CGPoint(x: arm * 2.6, y: arm * 1.25))
      }
      .stroke(done || current ? beadDone : bead, style: StrokeStyle(lineWidth: arm * 0.4, lineCap: .round))
      .frame(width: arm * 3.2, height: arm * 3.2)
      if current {
        Circle()
          .stroke(halo, lineWidth: 2)
          .frame(width: arm * 4, height: arm * 4)
      }
    }
  }

  private func beadView(diameter: CGFloat, filled: Bool, current: Bool) -> some View {
    Circle()
      .fill(filled ? beadDone : bead)
      .frame(width: diameter, height: diameter)
      .overlay {
        if current {
          Circle()
            .stroke(halo, lineWidth: 2)
            .frame(width: diameter * 1.8, height: diameter * 1.8)
            .transition(dimmed ? .identity : .scale(scale: 0.6).combined(with: .opacity))
        }
      }
  }
}
