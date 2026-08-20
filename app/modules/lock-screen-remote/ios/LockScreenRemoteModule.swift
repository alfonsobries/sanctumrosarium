import ExpoModulesCore
import MediaPlayer

public class LockScreenRemoteModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LockScreenRemote")
    Events("onSkip")

    OnCreate {
      let center = MPRemoteCommandCenter.shared()
      center.nextTrackCommand.isEnabled = true
      center.previousTrackCommand.isEnabled = true
      center.nextTrackCommand.addTarget { [weak self] _ in
        self?.sendEvent("onSkip", ["direction": 1])
        return .success
      }
      center.previousTrackCommand.addTarget { [weak self] _ in
        self?.sendEvent("onSkip", ["direction": -1])
        return .success
      }
    }
  }
}
