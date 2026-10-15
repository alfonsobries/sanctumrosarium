import { describe, expect, it } from 'vitest';

import { formatLocalDate, mysterySetFor, offeredSets, parseLocalDate } from './calendar';

describe('mysterySetFor', () => {
  it.each([
    ['2026-10-05', 'joyful'], // Monday
    ['2026-10-06', 'sorrowful'],
    ['2026-10-07', 'glorious'],
    ['2026-10-08', 'luminous'],
    ['2026-10-09', 'sorrowful'],
    ['2026-10-10', 'joyful'],
    ['2026-10-11', 'glorious'], // Sunday
  ])('%s is %s', (date, set) => {
    expect(mysterySetFor(parseLocalDate(date))).toBe(set);
  });

  it.each([
    ['2026-10-05', 'joyful'], // Monday
    ['2026-10-06', 'sorrowful'],
    ['2026-10-07', 'glorious'],
    ['2026-10-08', 'joyful'],
    ['2026-10-09', 'sorrowful'],
    ['2026-10-10', 'glorious'],
    ['2026-10-11', 'glorious'], // Sunday
  ])('without the luminous mysteries, %s is %s', (date, set) => {
    expect(mysterySetFor(parseLocalDate(date), { luminous: false })).toBe(set);
  });

  it('round-trips local dates', () => {
    expect(formatLocalDate(parseLocalDate('2026-02-09'))).toBe('2026-02-09');
  });

  it('rejects malformed dates', () => {
    expect(() => parseLocalDate('2026-2-9')).toThrow(RangeError);
  });
});

describe('offeredSets', () => {
  it('offers the four sets by default', () => {
    expect(offeredSets()).toEqual(['joyful', 'luminous', 'sorrowful', 'glorious']);
  });

  it('leaves out the luminous mysteries when they are not prayed', () => {
    expect(offeredSets({ luminous: false })).toEqual(['joyful', 'sorrowful', 'glorious']);
  });
});
