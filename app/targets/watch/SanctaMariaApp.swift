import SwiftUI

@main
struct SanctaMariaApp: App {
  init() {
    PhoneLink.shared.activate()
  }

  var body: some Scene {
    WindowGroup {
      HomeView()
    }
  }
}
