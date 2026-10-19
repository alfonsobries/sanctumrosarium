import * as Notifications from 'expo-notifications';
import type { TFunction } from 'i18next';

import { reminderIds, type Reminder } from './reminders';

const channelId = 'reminders';

export type PermissionState = 'granted' | 'undetermined' | 'denied';

Notifications.setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});

export async function permissionState(): Promise<PermissionState> {
  const { status, ios } = await Notifications.getPermissionsAsync();
  if (status === 'granted' || ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return 'granted';
  }
  return status === 'undetermined' ? 'undetermined' : 'denied';
}

/** Asks only when the system still can; a refusal is answered from Settings, not by asking again. */
export async function requestPermission(): Promise<PermissionState> {
  const current = await permissionState();
  if (current !== 'undetermined') {
    return current;
  }
  await ensureChannel();
  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return status === 'granted' ? 'granted' : 'denied';
}

async function ensureChannel(): Promise<void> {
  if (process.env.EXPO_OS !== 'android') {
    return;
  }
  // Android 13 only shows the permission prompt once a channel exists.
  await Notifications.setNotificationChannelAsync(channelId, {
    name: 'Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Makes the scheduled notifications match the settings: every reminder of the app is
 * cancelled and the wanted ones scheduled again, so a new time or language always lands.
 */
export async function syncReminders(reminders: readonly Reminder[], t: TFunction): Promise<void> {
  await Promise.all(reminderIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  if (reminders.length === 0 || (await permissionState()) !== 'granted') {
    return;
  }
  if (process.env.EXPO_OS === 'android') {
    await Notifications.setNotificationChannelAsync(channelId, {
      name: t('reminders.channel'),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  for (const reminder of reminders) {
    await Notifications.scheduleNotificationAsync({
      identifier: reminder.id,
      content: {
        title: t(`reminders.${reminder.id}.title`),
        body: t(`reminders.${reminder.id}.body`),
        data: { url: reminder.url },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
        channelId,
      },
    });
  }
}
