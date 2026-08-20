import ExpoModulesCore
import HealthKit

public class MindfulSessionModule: Module {
  private let store = HKHealthStore()
  private var startedAt: Date?

  public func definition() -> ModuleDefinition {
    Name("MindfulSession")

    AsyncFunction("requestAuthorization") { (promise: Promise) in
      guard HKHealthStore.isHealthDataAvailable() else {
        promise.resolve(false)
        return
      }
      guard let type = HKObjectType.categoryType(forIdentifier: .mindfulSession) else {
        promise.resolve(false)
        return
      }
      self.store.requestAuthorization(toShare: [type], read: []) { success, _ in
        promise.resolve(success)
      }
    }

    Function("begin") {
      self.startedAt = Date()
    }

    AsyncFunction("end") { (promise: Promise) in
      guard let start = self.startedAt else {
        promise.resolve(false)
        return
      }
      self.startedAt = nil
      guard let type = HKObjectType.categoryType(forIdentifier: .mindfulSession) else {
        promise.resolve(false)
        return
      }
      let sample = HKCategorySample(type: type, value: HKCategoryValue.notApplicable.rawValue, start: start, end: Date())
      self.store.save(sample) { success, _ in
        promise.resolve(success)
      }
    }
  }
}
