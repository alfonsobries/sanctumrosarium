/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'watch',
  name: 'SanctaMariaWatch',
  displayName: 'SanctaMaria',
  bundleIdentifier: '.watch',
  deploymentTarget: '10.0',
  icon: '../../assets/icons/ios-light.png',
  colors: {
    $accent: { color: '#96563F', darkColor: '#D4A48F' },
  },
  frameworks: ['SwiftUI', 'WatchConnectivity'],
};
