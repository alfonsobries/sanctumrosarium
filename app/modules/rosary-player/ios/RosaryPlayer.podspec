Pod::Spec.new do |s|
  s.name           = 'RosaryPlayer'
  s.version        = '1.0.0'
  s.summary        = 'Rosary audio queue with real silence, interruption recovery and Now Playing'
  s.description    = 'Plays a queue of prayer steps with gaps rendered as audio time, resumes after interruptions and drives the lock screen controls.'
  s.author         = ''
  s.homepage       = 'https://sanctamaria.app'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '6.0'

  s.dependency 'ExpoModulesCore'

  s.frameworks = 'AVFoundation', 'MediaPlayer'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
