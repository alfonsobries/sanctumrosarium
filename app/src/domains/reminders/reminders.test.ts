import { describe, expect, it } from 'vitest';

import { defaultSettings } from '@/domains/settings/settings';

import { clockOf, dateAt, minutesOf, remindersFor } from './reminders';

describe('remindersFor', () => {
  it('asks for nothing by default', () => {
    expect(remindersFor(defaultSettings)).toEqual([]);
  });

  it('schedules the Rosary at the chosen time', () => {
    expect(remindersFor({ ...defaultSettings, rosaryReminder: true, rosaryReminderAt: 6 * 60 + 5 })).toEqual([
      { id: 'rosary', hour: 6, minute: 5, url: '/' },
    ]);
  });

  it('schedules Auxilium only while its prayers are on', () => {
    const asked = { ...defaultSettings, auxiliumReminder: true, auxiliumReminderAt: 21 * 60 };
    expect(remindersFor(asked)).toEqual([]);
    expect(remindersFor({ ...asked, auxilium: true })).toEqual([
      { id: 'auxilium', hour: 21, minute: 0, url: '/auxilium' },
    ]);
  });
});

describe('times of day', () => {
  it('round-trips minutes through a date', () => {
    expect(minutesOf(dateAt(23 * 60 + 59))).toBe(23 * 60 + 59);
    expect(clockOf(0)).toEqual({ hour: 0, minute: 0 });
  });
});
