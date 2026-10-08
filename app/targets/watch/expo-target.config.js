/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = () => ({
  type: 'watch',
  name: 'SanctaMariaWatch',
  displayName: 'SanctaMaria',
  bundleIdentifier: '.watch',
  // watchOS 11 runs on the same watches as watchOS 26 (Series 6 and later, SE 2nd gen,
  // every Ultra), so it reaches people who have not updated without losing any hardware.
  deploymentTarget: '11.0',
  icon: '../../assets/images/icon.png',
  frameworks: ['SwiftUI', 'WatchConnectivity', 'AVFoundation', 'MediaPlayer'],
  colors: {
    $accent: '#D2AE66',
    accentForeground: '#17140E',
    bead: '#38342E',
    beadDone: '#D2AE66',
  },
});
