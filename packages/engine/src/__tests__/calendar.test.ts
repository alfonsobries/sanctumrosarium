import { describe, expect, it } from 'vitest';

import { easterSunday, liturgicalSeason, mysteriesOfDay } from '../calendar';

/** Local date, because the diary follows the day of whoever prays, not UTC. */
function day(year: number, month: number, date: number): Date {
  return new Date(year, month - 1, date, 12, 0, 0);
}

describe('easterSunday', () => {
  it.each([
    [2020, '2020-04-12'],
    [2021, '2021-04-04'],
    [2022, '2022-04-17'],
    [2023, '2023-04-09'],
    [2024, '2024-03-31'],
    [2025, '2025-04-20'],
    [2026, '2026-04-05'],
    [2027, '2027-03-28'],
    [2030, '2030-04-21'],
    [2038, '2038-04-25'],
    [2050, '2050-04-10'],
  ])('finds Easter of %i', (year, expected) => {
    expect(easterSunday(year).toISOString().slice(0, 10)).toBe(expected);
  });
});

describe('liturgicalSeason', () => {
  it('knows Advent, Christmas, Lent, Easter and Ordinary time', () => {
    expect(liturgicalSeason(day(2026, 12, 1))).toBe('advent');
    expect(liturgicalSeason(day(2026, 12, 26))).toBe('christmas');
    expect(liturgicalSeason(day(2026, 1, 5))).toBe('christmas');
    expect(liturgicalSeason(day(2026, 3, 1))).toBe('lent');
    expect(liturgicalSeason(day(2026, 4, 12))).toBe('easter');
    expect(liturgicalSeason(day(2026, 8, 15))).toBe('ordinary');
  });
});

describe('mysteriesOfDay', () => {
  it('follows the weekly rule of RVM 38', () => {
    // Week of 2026-08-17, ordinary time.
    expect(mysteriesOfDay(day(2026, 8, 17)).set).toBe('gaudiosa'); // Monday
    expect(mysteriesOfDay(day(2026, 8, 18)).set).toBe('dolorosa'); // Tuesday
    expect(mysteriesOfDay(day(2026, 8, 19)).set).toBe('gloriosa'); // Wednesday
    expect(mysteriesOfDay(day(2026, 8, 20)).set).toBe('luminosa'); // Thursday
    expect(mysteriesOfDay(day(2026, 8, 21)).set).toBe('dolorosa'); // Friday
    expect(mysteriesOfDay(day(2026, 8, 22)).set).toBe('gaudiosa'); // Saturday
    expect(mysteriesOfDay(day(2026, 8, 23)).set).toBe('gloriosa'); // Sunday
  });

  it('prays the joyful mysteries on the Sundays of Advent', () => {
    const advent = mysteriesOfDay(day(2026, 12, 6));
    expect(advent.set).toBe('gaudiosa');
    expect(advent.reason).toBe('season');
  });

  it('prays the sorrowful mysteries on the Sundays of Lent', () => {
    const lent = mysteriesOfDay(day(2026, 3, 1));
    expect(lent.set).toBe('dolorosa');
    expect(lent.reason).toBe('season');
  });

  it('does not move a weekday because of the season', () => {
    // Christmas 2026 is a Friday. The weekday rule stands; only Sundays change.
    const christmas = mysteriesOfDay(day(2026, 12, 25));
    expect(christmas.set).toBe('dolorosa');
    expect(christmas.reason).toBe('weekday');
    expect(christmas.season).toBe('christmas');
  });

  it('falls back to the pre-2002 distribution when there are no luminous mysteries', () => {
    expect(mysteriesOfDay(day(2026, 8, 20), { withLuminous: false }).set).toBe(
      'gaudiosa',
    ); // Thursday
    expect(mysteriesOfDay(day(2026, 8, 22), { withLuminous: false }).set).toBe(
      'gloriosa',
    ); // Saturday
  });
});
