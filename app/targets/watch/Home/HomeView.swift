import SwiftUI

/** Today's mysteries and one button to pray them; another set is one level down. */
struct HomeView: View {
  @State private var session: PrayerSession?
  @State private var today = Date()
  @Environment(\.scenePhase) private var scenePhase
  private let settings = WatchSettings.shared

  var body: some View {
    let store = ContentStore.shared
    let set = store.setFor(today)
    let content = store.content(for: settings.prayerLocale)

    NavigationStack {
      List {
        Section {
          VStack(alignment: .leading, spacing: 2) {
            Text("home.today")
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(content.setTitles[set.id] ?? set.id)
              .font(.title3.weight(.semibold))
              .foregroundStyle(Color.accentColor)
          }
          .listRowBackground(Color.clear)

          Button {
            session = PrayerSession(set: set, settings: settings)
          } label: {
            Label("home.pray", systemImage: "play.fill")
              .frame(maxWidth: .infinity)
          }
          .buttonStyle(.borderedProminent)
          .foregroundStyle(Color("accentForeground"))
          .listRowBackground(Color.clear)
        }

        Section("home.mysteries") {
          ForEach(Array(set.mysteries.enumerated()), id: \.element) { index, mystery in
            MysteryRow(order: index + 1, title: content.mysteries[mystery]?.title ?? mystery)
          }
        }

        Section {
          NavigationLink {
            SetPicker(content: content) { chosen in
              session = PrayerSession(set: chosen, settings: settings)
            }
          } label: {
            Label("home.other", systemImage: "list.bullet")
          }
        }
      }
      .navigationTitle(Text(verbatim: "SanctaMaria"))
    }
    .fullScreenCover(item: $session) { session in
      NavigationStack {
        PrayerView(session: session) {
          self.session = nil
        }
      }
    }
    .onChange(of: scenePhase) { _, phase in
      if phase == .active {
        today = Date()
      }
    }
    #if DEBUG
    .onAppear { startForCapture(set: set) }
    #endif
  }

  #if DEBUG
  /** `-startPraying [step]` opens a session on launch, for simulator captures. */
  private func startForCapture(set: SetTemplate) {
    let arguments = ProcessInfo.processInfo.arguments
    guard session == nil, let flag = arguments.firstIndex(of: "-startPraying") else {
      return
    }
    let started = PrayerSession(set: set, settings: settings)
    if arguments.indices.contains(flag + 1), let step = Int(arguments[flag + 1]) {
      started.go(to: step)
    }
    session = started
  }
  #endif
}

private struct MysteryRow: View {
  let order: Int
  let title: String

  var body: some View {
    HStack(alignment: .firstTextBaseline, spacing: 6) {
      Text(order, format: .number)
        .font(.footnote.monospacedDigit())
        .foregroundStyle(.secondary)
      Text(title)
        .font(.footnote)
    }
  }
}

private struct SetPicker: View {
  let content: LocaleContent
  let onPick: (SetTemplate) -> Void
  @Environment(\.dismiss) private var dismiss

  var body: some View {
    List(ContentStore.shared.rosary.sets) { set in
      Button {
        dismiss()
        onPick(set)
      } label: {
        Text(content.setTitles[set.id] ?? set.id)
      }
    }
    .navigationTitle(Text("home.sets"))
  }
}
