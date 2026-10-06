import SwiftUI
import WatchKit

/**
 * The Rosary on the wrist: the mystery always on top and the beads below it. The crown
 * moves one bead per detent, the whole bead area is one button, and double tap on the
 * watches that have it is the same "next bead".
 */
struct PrayerView: View {
  @Bindable var session: PrayerSession
  let onClose: () -> Void

  @Environment(\.isLuminanceReduced) private var dimmed
  @Environment(\.scenePhase) private var scenePhase
  @State private var crown = 0.0
  @State private var showingOptions = false

  var body: some View {
    crownControlled(page)
      .toolbar { toolbar }
      .sheet(isPresented: $showingOptions) {
        PrayerOptions(session: session) {
          showingOptions = false
          session.end()
        }
      }
      .onChange(of: session.finished) { _, finished in
        if finished {
          onClose()
        }
      }
      .onChange(of: scenePhase) { _, phase in
        session.setCounting(phase == .active)
      }
      .containerBackground(Color.black, for: .navigation)
      .transaction { transaction in
        if dimmed {
          transaction.animation = nil
        }
      }
      .onAppear {
        crown = Double(session.position)
        session.start()
      }
      // The system close button dismisses the cover; what was prayed still reaches the journal.
      .onDisappear { session.end() }
  }

  private var page: some View {
    VStack(spacing: 2) {
      Text(session.mysteryTitle ?? session.setTitle)
        .font(.headline)
        .foregroundStyle(dimmed ? Color.secondary : Color.accentColor)
        .multilineTextAlignment(.center)
        .lineLimit(2)
        .minimumScaleFactor(0.75)
        .frame(maxWidth: .infinity)

      Button {
        session.advance()
      } label: {
        VStack(spacing: 0) {
          ZStack {
            BeadRing(state: session.step.ring, dimmed: dimmed)
            center
          }
          .frame(maxHeight: .infinity)

          Text(session.prayerTitle)
            .font(.footnote)
            .foregroundStyle(.secondary)
            .lineLimit(1)
            .minimumScaleFactor(0.8)
          if session.step.intention == "pope" {
            Text("prayer.pope")
              .font(.caption2)
              .foregroundStyle(.secondary)
              .lineLimit(1)
              .minimumScaleFactor(0.7)
          }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .contentShape(Rectangle())
      }
      .buttonStyle(.plain)
      .handGestureShortcut(.primaryAction)
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(accessibilityText)
      .accessibilityHint(Text("prayer.next"))
      .accessibilityAdjustableAction { direction in
        switch direction {
        case .increment: session.advance()
        case .decrement: session.go(to: session.position - 1)
        @unknown default: break
        }
      }
    }
  }

  private func crownControlled(_ content: some View) -> some View {
    content
      .focusable()
      .focusEffectDisabled()
      .digitalCrownRotation(
        $crown,
        from: 0,
        through: Double(session.steps.count - 1),
        by: 1,
        sensitivity: .low,
        isContinuous: false,
        isHapticFeedbackEnabled: true
      )
      .onChange(of: crown) { _, value in
        session.go(to: Int(value.rounded()), fromCrown: true)
      }
      .onChange(of: session.position) { _, position in
        if Int(crown.rounded()) != position {
          crown = Double(position)
        }
      }
  }

  @ToolbarContentBuilder
  private var toolbar: some ToolbarContent {
    if session.hasAudio {
      ToolbarItem(placement: .topBarTrailing) {
        Button {
          session.toggleAudio()
        } label: {
          playLabel
        }
      }
    }
    ToolbarItemGroup(placement: .bottomBar) {
      Spacer()
      Button {
        showingOptions = true
      } label: {
        Label("prayer.options", systemImage: "ellipsis")
      }
    }
  }

  @ViewBuilder
  private var playLabel: some View {
    if session.isPlaying {
      Label("prayer.pause", systemImage: "pause.fill")
    } else {
      Label("prayer.listen", systemImage: "play.fill")
    }
  }

  /** Inside the ring: which Hail Mary, or which mystery is being announced. */
  @ViewBuilder
  private var center: some View {
    Group {
      if session.step.isAnnounce, let decade = session.step.decade {
        Text("prayer.mystery \(decade)")
          .font(.footnote)
          .foregroundStyle(.secondary)
          .multilineTextAlignment(.center)
      } else if let count = session.step.count {
        Text(count.index, format: .number)
          .font(.title.monospacedDigit().weight(.semibold))
          .contentTransition(.numericText(value: Double(count.index)))
      }
    }
    .frame(maxWidth: 80)
    .animation(dimmed ? nil : .snappy, value: session.position)
  }

  private var accessibilityText: Text {
    let mystery = session.mysteryTitle ?? session.setTitle
    if let count = session.step.count {
      return Text(verbatim: "\(mystery), \(session.prayerTitle), ") + Text("prayer.count \(count.index) \(count.total)")
    }
    return Text(verbatim: "\(mystery), \(session.prayerTitle)")
  }
}

private struct PrayerOptions: View {
  @Bindable var session: PrayerSession
  let onEnd: () -> Void
  @Bindable private var settings = WatchSettings.shared

  var body: some View {
    List {
      Toggle("options.haptics", isOn: $settings.haptics)
      if session.hasAudio {
        VolumeControl()
          .frame(height: 44)
          .listRowBackground(Color.clear)
      }
      Button(role: .destructive, action: onEnd) {
        Label("prayer.end", systemImage: "xmark")
      }
    }
    .navigationTitle(Text("prayer.options"))
  }
}

/** The system volume control, the one Now Playing uses. */
private struct VolumeControl: WKInterfaceObjectRepresentable {
  func makeWKInterfaceObject(context: Context) -> WKInterfaceVolumeControl {
    WKInterfaceVolumeControl(origin: .local)
  }

  func updateWKInterfaceObject(_ control: WKInterfaceVolumeControl, context: Context) {}
}
