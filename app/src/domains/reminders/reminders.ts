import type { Settings } from '@/domains/settings/settings';

export type ReminderId = 'rosary' | 'auxilium';

export const reminderIds: readonly ReminderId[] = ['rosary', 'auxilium'];

export type Reminder = {
  id: ReminderId;
  hour: number;
  minute: number;
  /** Route the notification opens. */
  url: '/' | '/auxilium';
};

type ReminderSettings = Pick<
  Settings,
  'rosaryReminder' | 'rosaryReminderAt' | 'auxilium' | 'auxiliumReminder' | 'auxiliumReminderAt'
>;

export function clockOf(minutes: number): { hour: number; minute: number } {
  return { hour: Math.floor(minutes / 60), minute: minutes % 60 };
}

/** The daily notifications the settings ask for; Auxilium's only while its prayers are on. */
export function remindersFor(settings: ReminderSettings): Reminder[] {
  const reminders: Reminder[] = [];
  if (settings.rosaryReminder) {
    reminders.push({ id: 'rosary', ...clockOf(settings.rosaryReminderAt), url: '/' });
  }
  if (settings.auxilium && settings.auxiliumReminder) {
    reminders.push({ id: 'auxilium', ...clockOf(settings.auxiliumReminderAt), url: '/auxilium' });
  }
  return reminders;
}

/** A date today at the given time, for pickers that edit a time of day. */
export function dateAt(minutes: number, today: Date = new Date()): Date {
  const { hour, minute } = clockOf(minutes);
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);
}

export function minutesOf(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}
