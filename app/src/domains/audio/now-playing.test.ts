import { buildSequence, type MysteryRef, type Scope } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import { coverMysteries } from './now-playing';

const mysteries: MysteryRef[] = [1, 2, 3, 4, 5].map((order) => ({
  id: `m${order}`,
  set: 'joyful',
  order,
  readings: [{ book: 'Luke', ref: `Lk ${order}` }],
}));

const steps = (scope: Scope) =>
  buildSequence({
    set: 'joyful',
    mysteries,
    scope,
    opening: true,
    readingFor: (mystery) => mystery.readings[0] ?? null,
    fatimaPrayer: true,
    prayerForThePope: true,
    hailHolyQueen: true,
    litany: false,
    closingPrayer: true,
  });

describe('coverMysteries', () => {
  it('shows each decade with its mystery', () => {
    const sequence = steps({ kind: 'full' });
    const covers = coverMysteries(sequence);
    sequence.forEach((step, index) => {
      if (step.decade !== null) {
        expect(covers[index]).toBe(`m${step.decade}`);
      }
    });
  });

  it('opens with the first mystery and closes with the last', () => {
    const covers = coverMysteries(steps({ kind: 'full' }));
    expect(covers[0]).toBe('m1');
    expect(covers[covers.length - 1]).toBe('m5');
  });

  it('keeps a single decade on its own mystery', () => {
    expect(new Set(coverMysteries(steps({ kind: 'decade', decade: 3 })))).toEqual(new Set(['m3']));
  });
});
