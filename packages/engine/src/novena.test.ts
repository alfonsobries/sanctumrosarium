import { describe, expect, it } from 'vitest';

import { NOVENA_DAYS, novenaDay } from './novena';

describe('novenaDay', () => {
  it('is 27 days in petition and 27 in thanksgiving', () => {
    const days = Array.from({ length: NOVENA_DAYS }, (_, index) => novenaDay(index + 1));
    expect(days.filter((day) => day.phase === 'petition')).toHaveLength(27);
    expect(days.filter((day) => day.phase === 'thanksgiving')).toHaveLength(27);
    expect(days[26]!.phase).toBe('petition');
    expect(days[27]!.phase).toBe('thanksgiving');
  });

  it('cycles joyful, sorrowful, glorious and never luminous', () => {
    expect(novenaDay(1).set).toBe('gaudiosa');
    expect(novenaDay(2).set).toBe('dolorosa');
    expect(novenaDay(3).set).toBe('gloriosa');
    expect(novenaDay(28).set).toBe('gaudiosa');
    for (let day = 1; day <= NOVENA_DAYS; day += 1) {
      expect(novenaDay(day).set).not.toBe('luminosa');
    }
  });

  it('each phase holds nine of each set: 27 = 3 x 9', () => {
    const petition = Array.from({ length: 27 }, (_, index) => novenaDay(index + 1));
    for (const set of ['gaudiosa', 'dolorosa', 'gloriosa'] as const) {
      expect(petition.filter((day) => day.set === set)).toHaveLength(9);
    }
  });

  it('rejects days outside 1 to 54', () => {
    expect(() => novenaDay(0)).toThrow(RangeError);
    expect(() => novenaDay(55)).toThrow(RangeError);
  });
});
