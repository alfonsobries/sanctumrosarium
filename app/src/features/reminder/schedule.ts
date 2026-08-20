import type { Settings } from '@/settings/store';

/**
 * What gets scheduled: one plain notice per chosen day and hour, or the three Angelus
 * hours. Never a second notice the same day, never a streak, never a count of missed
 * days (docs/gamificacion.md, 8).
 */
export type ReminderRequest = {
  /** 1 = Sunday ... 7 = Saturday, as the notification triggers expect. */
  readonly weekday: number;
  readonly hour: number;
  readonly minute: number;
};

const angelusHours = [6, 12, 18];

export function reminderRequests(
  settings: Pick<
    Settings,
    'reminderMode' | 'reminderHour' | 'reminderMinute' | 'reminderDays'
  >,
): readonly ReminderRequest[] {
  if (settings.reminderMode === 'off' || settings.reminderDays.length === 0) {
    return [];
  }
  const weekdays = [...settings.reminderDays].sort().map((day) => day + 1);
  if (settings.reminderMode === 'angelus') {
    return weekdays.flatMap((weekday) =>
      angelusHours.map((hour) => ({ weekday, hour, minute: 0 })),
    );
  }
  return weekdays.map((weekday) => ({
    weekday,
    hour: settings.reminderHour,
    minute: settings.reminderMinute,
  }));
}
