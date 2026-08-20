import { describe, expect, it } from 'vitest';

import { reminderRequests } from './schedule';

const base = {
  reminderMode: 'hour',
  reminderHour: 20,
  reminderMinute: 30,
  reminderDays: [0, 1, 2, 3, 4, 5, 6],
} as const;

describe('reminderRequests', () => {
  it('schedules nothing when off', () => {
    expect(reminderRequests({ ...base, reminderMode: 'off' })).toEqual([]);
  });

  it('schedules one notice per chosen day at the chosen hour', () => {
    const requests = reminderRequests({ ...base, reminderDays: [1, 3] });
    expect(requests).toEqual([
      { weekday: 2, hour: 20, minute: 30 },
      { weekday: 4, hour: 20, minute: 30 },
    ]);
  });

  it('never schedules two notices the same day in hour mode', () => {
    const requests = reminderRequests(base);
    const byDay = new Set(requests.map((request) => request.weekday));
    expect(requests).toHaveLength(byDay.size);
  });

  it('the Angelus model rings at six, twelve and eighteen', () => {
    const requests = reminderRequests({ ...base, reminderMode: 'angelus' });
    expect(requests).toHaveLength(21);
    expect(new Set(requests.map((request) => request.hour))).toEqual(
      new Set([6, 12, 18]),
    );
  });

  it('with no days chosen, nothing rings', () => {
    expect(reminderRequests({ ...base, reminderDays: [] })).toEqual([]);
  });
});
