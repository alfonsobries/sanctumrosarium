import SwiftUI
import WatchKit

/**
 * The Rosary on the wrist, as beads or as words. The beads show the decade around the
 * count; the words show the whole prayer to read along. The crown does what it does in
 * every app on the watch: with the voice playing it is the volume, otherwise it passes
 * the beads, and over the words it scrolls them. Double tap is the main action.
 */
struct PrayerView: View {
  @Bindable var session: PrayerSession
  let onClose: () -> Void

  @Environment(\.isLuminanceReduced) private var dimmed
  @Environment(\.scenePhase) private var scenePhase
  @Bindable private var settings = WatchSettings.shared
  @State private var crown = 0.0
  @State private var volume = 1.0
  @State private var showingOptions = false

  var body: some View {
    content
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
        volume = session.volume
        session.start()
      }
      // The system close button dismisses the cover; what was prayed still reaches the journal.
      .onDisappear { session.end() }
  }

  @ViewBuilder
  private var content: some View {
    if settings.showsText {
      PrayerText(session: session)
    } else if session.isPlaying {
      volumeControlled(beads)
    } else {
      beadControlled(beads)
    }
  }

  private var beads: some View {
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
      .handGestureShortcut(.primaryAction, isEnabled: !session.isPlaying)
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

  private func beadControlled(_ content: some View) -> some View {
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

  /** While the voice plays, the crown is its volume, with the system's speaker mark beside it. */
  private func volumeControlled(_ content: some View) -> some View {
    content
      .focusable()
      .focusEffectDisabled()
      .digitalCrownRotation(
        $volume,
        from: 0,
        through: 1,
        by: 0.05,
        sensitivity: .low,
        isContinuous: false,
        isHapticFeedbackEnabled: true
      )
      .digitalCrownAccessory {
        Image(systemName: volumeSymbol)
          .foregroundStyle(Color.accentColor)
          .accessibilityLabel(Text("prayer.volume"))
      }
      .onChange(of: volume) { _, value in
        session.volume = value
      }
      .onChange(of: session.position) { _, position in
        crown = Double(position)
      }
  }

  private var volumeSymbol: String {
    switch volume {
    case ..<0.01: return "speaker.slash.fill"
    case ..<0.35: return "speaker.fill"
    case ..<0.7: return "speaker.wave.1.fill"
    default: return "speaker.wave.2.fill"
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
        // Double tap pauses the voice; with it paused, it passes the bead instead.
        .handGestureShortcut(.primaryAction, isEnabled: session.isPlaying)
      }
    }
    ToolbarItemGroup(placement: .bottomBar) {
      Button {
        settings.showsText.toggle()
      } label: {
        if settings.showsText {
          Label("prayer.showBeads", systemImage: "circle.dotted")
        } else {
          Label("prayer.showText", systemImage: "text.alignleft")
        }
      }
      if settings.showsText && !session.isPlaying {
        Button {
          session.advance()
        } label: {
          Label("prayer.next", systemImage: "chevron.forward")
        }
        .tint(.accentColor)
        .handGestureShortcut(.primaryAction)
      } else {
        Spacer()
      }
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
      } else if session.step.isReading {
        VStack(spacing: 2) {
          Image(systemName: "book")
            .font(.title3)
            .foregroundStyle(Color.accentColor)
          Text("prayer.reading")
            .font(.footnote)
            .foregroundStyle(.secondary)
        }
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

/** The words of the current step, from its top each time the prayer moves on. */
private struct PrayerText: View {
  @Bindable var session: PrayerSession

  private let top = "step-top"

  var body: some View {
    ScrollViewReader { proxy in
      ScrollView {
        VStack(alignment: .leading, spacing: 6) {
          Color.clear
            .frame(height: 0)
            .id(top)

          if let mystery = session.mysteryTitle, !session.step.isAnnounce {
            Text(mystery)
              .font(.caption2)
              .foregroundStyle(Color.accentColor)
              .lineLimit(2)
          }

          if session.step.isAnnounce {
            announce
          } else if session.step.isReading {
            reading
          } else {
            heading
            lines
          }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        // Clear of the floating toolbar, so the last line never sits behind it.
        .padding(.bottom, 32)
      }
      .onChange(of: session.position) { _, _ in
        proxy.scrollTo(top, anchor: .top)
      }
    }
  }

  private var heading: some View {
    HStack(alignment: .firstTextBaseline) {
      Text(session.prayerTitle)
        .font(.headline)
      Spacer(minLength: 4)
      if let count = session.step.count {
        Text("prayer.count \(count.index) \(count.total)")
          .font(.footnote.monospacedDigit())
          .foregroundStyle(Color.accentColor)
          .contentTransition(.numericText(value: Double(count.index)))
      }
    }
  }

  @ViewBuilder
  private var announce: some View {
    if let decade = session.step.decade {
      Text("prayer.mystery \(decade)")
        .font(.footnote)
        .foregroundStyle(.secondary)
    }
    Text(session.mysteryTitle ?? "")
      .font(.title3)
      .foregroundStyle(Color.accentColor)
    if !session.prayerTitle.isEmpty {
      Text(session.prayerTitle)
        .font(.footnote)
        .foregroundStyle(.secondary)
    }
  }

  @ViewBuilder
  private var reading: some View {
    HStack(alignment: .firstTextBaseline) {
      Text("prayer.reading")
        .font(.headline)
      Spacer(minLength: 4)
      Text(session.prayerTitle)
        .font(.footnote)
        .foregroundStyle(Color.accentColor)
    }
    if let passage = session.passage {
      Text(passage.text)
        .font(.body)
        .fixedSize(horizontal: false, vertical: true)
    }
  }

  @ViewBuilder
  private var lines: some View {
    if let prayer = session.prayer {
      let split = prayer.responseFrom ?? prayer.lines.count
      VStack(alignment: .leading, spacing: 4) {
        ForEach(Array(prayer.lines.enumerated()), id: \.offset) { index, line in
          Text(line)
            .font(.body)
            .italic(index >= split)
            .foregroundStyle(index >= split ? Color.secondary : Color.primary)
            .fixedSize(horizontal: false, vertical: true)
        }
      }
    }
  }
}

private struct PrayerOptions: View {
  @Bindable var session: PrayerSession
  let onEnd: () -> Void
  @Bindable private var settings = WatchSettings.shared

  var body: some View {
    List {
      Toggle("options.haptics", isOn: $settings.haptics)
      Toggle("prayer.showText", isOn: $settings.showsText)
      if session.hasAudio {
        VolumeControl()
          .frame(height: 44)
          .listRowBackground(Color.clear)
        Picker(selection: $session.rate) {
          ForEach(ContentStore.shared.rosary.rates, id: \.self) { rate in
            Text(verbatim: "\(rate.formatted(.number))×").tag(rate)
          }
        } label: {
          Label("options.rate", systemImage: "gauge.with.dots.needle.50percent")
        }
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
