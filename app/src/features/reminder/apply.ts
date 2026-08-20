import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Settings } from '@/settings/store';

import { reminderRequests } from './schedule';

export type ReminderStatus = 'off' | 'scheduled' | 'denied';

/**
 * The only place the app schedules notifications. Everything else stays silent by
 * design: no streaks, no losses, no product news.
 */
export async function applyReminder(
  settings: Settings,
  body: string,
  { requestPermission }: { requestPermission: boolean },
): Promise<ReminderStatus> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const requests = reminderRequests(settings);
  if (requests.length === 0) {
    return 'off';
  }

  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && requestPermission) {
    permission = await Notifications.requestPermissionsAsync();
  }
  if (!permission.granted) {
    return 'denied';
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminder', {
      name: 'Reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (const request of requests) {
    await Notifications.scheduleNotificationAsync({
      content: { body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: request.weekday,
        hour: request.hour,
        minute: request.minute,
        ...(Platform.OS === 'android' ? { channelId: 'reminder' } : null),
      },
    });
  }
  return 'scheduled';
}
