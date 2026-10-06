import SwiftUI

/**
 * One decade as a circle of ten beads with its Our Father bead apart at the top: beads
 * already prayed are filled, the current one carries a halo. During the opening, the
 * cross and the four beads before the first decade.
 */
struct BeadRing: View {
  let state: RingState
  var dimmed = false

  var body: some View {
    GeometryReader { proxy in
      let size = min(proxy.size.width, proxy.size.height)
      ZStack {
        switch state {
        case let .decade(ourFather, prayed, current):
          decade(size: size, ourFather: ourFather, prayed: prayed, current: current)
        case let .opening(prayed, current):
          opening(size: size, prayed: prayed, current: current)
        }
      }
      .frame(width: size, height: size)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    .animation(.smooth(duration: 0.26), value: state)
    .accessibilityHidden(true)
  }

  private var bead: Color { Color("bead") }
  private var beadDone: Color { dimmed ? Color("beadDone").opacity(0.55) : Color("beadDone") }
  private var halo: Color { dimmed ? .secondary : .accentColor }

  @ViewBuilder
  private func decade(size: CGFloat, ourFather: RingState.Bead, prayed: Int, current: Int?) -> some View {
    let center = size / 2
    let radius = size * 0.4
    let small = size * 0.11
    let large = small * 1.45

    Circle()
      .stroke(Color("bead"), lineWidth: 1)
      .frame(width: radius * 2, height: radius * 2)
      .position(x: center, y: center)

    beadView(diameter: large, filled: ourFather != .pending, current: ourFather == .current)
      .position(x: center, y: center - radius)

    ForEach(1...10, id: \.self) { index in
      let angle = -Double.pi / 2 + Double(index) * 2 * Double.pi / 12
      beadView(diameter: small, filled: index <= prayed, current: current == index)
        .position(x: center + radius * cos(angle), y: center + radius * sin(angle))
    }
  }

  @ViewBuilder
  private func opening(size: CGFloat, prayed: Int, current: Int?) -> some View {
    let center = size / 2
    let small = size * 0.1
    let spacing = small * 1.75
    let crossY = center - spacing * 1.9
    let arm = small * 0.75

    Path { path in
      path.move(to: CGPoint(x: center, y: crossY - arm * 1.3))
      path.addLine(to: CGPoint(x: center, y: crossY + arm * 1.7))
      path.move(to: CGPoint(x: center - arm, y: crossY - arm * 0.3))
      path.addLine(to: CGPoint(x: center + arm, y: crossY - arm * 0.3))
    }
    .stroke(current == 0 || prayed > 0 ? beadDone : bead, style: StrokeStyle(lineWidth: small * 0.3, lineCap: .round))

    if current == 0 {
      Circle()
        .stroke(halo, lineWidth: 2)
        .frame(width: arm * 4, height: arm * 4)
        .position(x: center, y: crossY)
    }

    ForEach(1...4, id: \.self) { position in
      let diameter = position == 1 ? small * 1.45 : small
      let y = crossY + spacing * (position == 1 ? 1.4 : 1.4 + Double(position - 1) * 0.9 + 0.15)
      beadView(diameter: diameter, filled: position <= prayed, current: current == position)
        .position(x: center, y: y)
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
            .transition(.scale(scale: 0.6).combined(with: .opacity))
        }
      }
  }
}
