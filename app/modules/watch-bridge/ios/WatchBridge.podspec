Pod::Spec.new do |s|
  s.name           = 'WatchBridge'
  s.version        = '1.0.0'
  s.summary        = 'Settings to the Apple Watch and prayed sessions back to the phone'
  s.description    = 'WatchConnectivity bridge: sends settings as the application context and receives journal entries from the watch.'
  s.author         = ''
  s.homepage       = 'https://sanctumrosarium.app'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '6.0'

  s.dependency 'ExpoModulesCore'

  s.frameworks = 'WatchConnectivity'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
