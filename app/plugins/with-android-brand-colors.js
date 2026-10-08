const { AndroidConfig, withAndroidColors, withAndroidColorsNight, withAndroidStyles } = require('expo/config-plugins');

/**
 * Paints the native Android chrome the app cannot style from JavaScript (alert buttons,
 * text selection, the overscroll glow) in the brand colours instead of the platform's
 * default teal, with a lighter accent for dark mode.
 */
module.exports = function withAndroidBrandColors(config, { light, dark }) {
  config = withAndroidColors(config, (mod) => {
    mod.modResults = AndroidConfig.Colors.assignColorValue(mod.modResults, { name: 'colorPrimary', value: light });
    mod.modResults = AndroidConfig.Colors.assignColorValue(mod.modResults, { name: 'colorAccent', value: light });
    return mod;
  });
  config = withAndroidColorsNight(config, (mod) => {
    mod.modResults = AndroidConfig.Colors.assignColorValue(mod.modResults, { name: 'colorPrimary', value: dark });
    mod.modResults = AndroidConfig.Colors.assignColorValue(mod.modResults, { name: 'colorAccent', value: dark });
    return mod;
  });
  return withAndroidStyles(config, (mod) => {
    mod.modResults = AndroidConfig.Styles.assignStylesValue(mod.modResults, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeGroup(),
      name: 'colorAccent',
      value: '@color/colorAccent',
    });
    return mod;
  });
};
