const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * The app only schedules local notifications, which need no push entitlement. expo-notifications
 * adds `aps-environment` anyway, and a store profile without Push Notifications rejects it.
 * Listed before expo-notifications in app.json, since mods run in reverse order.
 */
module.exports = function withLocalNotifications(config) {
  return withEntitlementsPlist(config, (mod) => {
    delete mod.modResults['aps-environment'];
    return mod;
  });
};
