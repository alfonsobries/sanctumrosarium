import { buildSequence, type MysteryRef } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import { guideFor } from './guide';

const steps = buildSequence({
  set: 'glorious',
  mysteries: [1, 2, 3, 4, 5].map((order): MysteryRef => ({
    id: `g${order}`,
    set: 'glorious',
    order,
    readings: [],
  })),
  scope: { kind: 'full' },
  opening: true,
  readingFor: null,
  fatimaPrayer: true,
  hailHolyQueen: true,
  litany: true,
  closingPrayer: true,
});
const at = (id: string) => steps.findIndex((step) => step.id === id);

describe('guideFor', () => {
  it('explains each part the first time it appears', () => {
    expect(guideFor(steps, at('d1-announce'))).toBe('announce');
    expect(guideFor(steps, at('d1-hail-mary-1'))).toBe('hailMary');
    expect(guideFor(steps, at('opening-hail-mary-1'))).toBe('openingHailMary');
  });

  it('stays quiet once the part is known', () => {
    expect(guideFor(steps, at('d1-hail-mary-2'))).toBeNull();
    expect(guideFor(steps, at('d2-announce'))).toBeNull();
    expect(guideFor(steps, at('d2-glory-be'))).toBeNull();
  });

  it('does not explain the final sign of the cross', () => {
    expect(guideFor(steps, steps.length - 1)).toBeNull();
  });
});
