import SwiftUI

/**
 * Today's mysteries and one button to pray them, what was prayed today with a way to
 * carry on, and the mysteries of any set one level down.
 */
struct HomeView: View {
  private static let setList = "sets"

  @State private var session: PrayerSession?
  @State private var path: [String] = []
  @State private var today = Date()
  @Environment(\.scenePhase) private var scenePhase
  private let settings = WatchSettings.shared
  private let todayStore = TodayStore.shared
  private let packs = PackStore.shared

  var body: some View {
    let store = ContentStore.shared
    let set = store.setFor(today)
    let content = store.content(for: settings.prayerLocale)

    NavigationStack(path: $path) {
      List {
        Section {
          VStack(alignment: .leading, spacing: 2) {
            Text("home.today")
              .font(.footnote)
              .foregroundStyle(.secondary)
            Text(content.setTitles[set.id] ?? set.id)
              .font(.title3.weight(.semibold))
              .foregroundStyle(Color.accentColor)
            if todayStore.decades > 0 {
              Text("home.decadesToday \(todayStore.decades)")
                .font(.footnote)
                .foregroundStyle(.secondary)
            }
            AudioStatus(status: packs.status(for: content.locale))
          }
          .listRowBackground(Color.clear)

          Button {
            start(set, .rosary)
          } label: {
            Label("home.pray", systemImage: "play.fill")
              .frame(maxWidth: .infinity)
          }
          .buttonStyle(.borderedProminent)
          .foregroundStyle(Color("accentForeground"))
          .listRowBackground(Color.clear)

          if let entry = todayStore.resumable {
            let resumeSet = store.set(entry.mysterySet)
            Button {
              start(resumeSet, .continuing(entry))
            } label: {
              VStack(alignment: .leading, spacing: 1) {
                Text("home.continue \(entry.decades + 1)")
                Text(content.setTitles[resumeSet.id] ?? resumeSet.id)
                  .font(.footnote)
                  .foregroundStyle(.secondary)
              }
            }
          }
        }

        Section {
          NavigationLink(value: set.id) {
            Label("home.mysteries", systemImage: "circle.circle")
          }
          NavigationLink(value: Self.setList) {
            Label("home.other", systemImage: "list.bullet")
          }
        }
      }
      .navigationTitle(Text(verbatim: "SanctaMaria"))
      .navigationDestination(for: String.self) { destination in
        if destination == Self.setList {
          SetList(content: content)
        } else {
          MysteryPager(set: store.set(destination), content: content) { scope in
            start(store.set(destination), scope)
          }
        }
      }
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

  private func start(_ set: SetTemplate, _ scope: PrayerSession.Scope) {
    path = []
    session = PrayerSession(set: set, scope: scope, settings: settings)
  }

  #if DEBUG
  /**
   * For simulator captures: `-startPraying [step]` opens a session on launch and
   * `-openSet <set>` opens that set's mysteries.
   */
  private func startForCapture(set: SetTemplate) {
    let arguments = ProcessInfo.processInfo.arguments
    if let flag = arguments.firstIndex(of: "-openSet"), arguments.indices.contains(flag + 1), path.isEmpty {
      path = [arguments[flag + 1]]
    }
    guard session == nil, let flag = arguments.firstIndex(of: "-startPraying") else {
      return
    }
    let started = PrayerSession(set: set, scope: .rosary, settings: settings)
    if arguments.indices.contains(flag + 1), let step = Int(arguments[flag + 1]) {
      started.go(to: step)
    }
    session = started
  }
  #endif
}

/** Shown only while a pack is on its way; praying never waits for it, it just has no audio yet. */
private struct AudioStatus: View {
  let status: PackStore.Status

  var body: some View {
    if case let .downloading(received, total) = status {
      VStack(alignment: .leading, spacing: 2) {
        Text("audio.downloading")
          .font(.caption2)
        ProgressView(value: Double(min(received, total)), total: Double(max(total, 1)))
          .tint(Color.accentColor)
        Text(verbatim: "\(received.formatted(.byteCount(style: .file))) / \(total.formatted(.byteCount(style: .file)))")
          .font(.caption2)
          .foregroundStyle(.secondary)
      }
      .padding(.top, 4)
      .accessibilityElement(children: .combine)
    }
  }
}

private struct SetList: View {
  let content: LocaleContent

  var body: some View {
    List(ContentStore.shared.rosary.sets) { set in
      NavigationLink(value: set.id) {
        Text(content.setTitles[set.id] ?? set.id)
      }
    }
    .navigationTitle(Text("home.sets"))
  }
}

/**
 * A set as vertical pages the crown turns: first the whole Rosary, then each mystery,
 * which can be prayed as a single decade.
 */
private struct MysteryPager: View {
  let set: SetTemplate
  let content: LocaleContent
  let onStart: (PrayerSession.Scope) -> Void

  var body: some View {
    TabView {
      VStack(spacing: 8) {
        Text(content.setTitles[set.id] ?? set.id)
          .font(.title3.weight(.semibold))
          .foregroundStyle(Color.accentColor)
          .multilineTextAlignment(.center)
          .minimumScaleFactor(0.8)
        Button {
          onStart(.rosary)
        } label: {
          Label("home.prayRosary", systemImage: "play.fill")
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .foregroundStyle(Color("accentForeground"))
      }
      .padding(.horizontal)

      ForEach(Array(set.mysteries.enumerated()), id: \.element) { index, mystery in
        VStack(spacing: 6) {
          Text("prayer.mystery \(index + 1)")
            .font(.footnote)
            .foregroundStyle(.secondary)
          Text(content.mysteries[mystery]?.title ?? mystery)
            .font(.headline)
            .foregroundStyle(Color.accentColor)
            .multilineTextAlignment(.center)
            .lineLimit(3)
            .minimumScaleFactor(0.8)
          if let reading = content.mysteries[mystery]?.reading {
            Text(reading)
              .font(.footnote)
              .foregroundStyle(.secondary)
          }
          Button {
            onStart(.decade(index + 1))
          } label: {
            Text("home.prayDecade")
              .frame(maxWidth: .infinity)
          }
        }
        .padding(.horizontal)
      }
    }
    .tabViewStyle(.verticalPage)
  }
}
