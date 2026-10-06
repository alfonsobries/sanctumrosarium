import { buildSequence, type MysteryRef } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import { beadRingState, decadeFills } from './bead-state';

const steps = buildSequence({
  set: 'joyful',
  mysteries: [1, 2, 3, 4, 5].map((order): MysteryRef => ({
    id: `j${order}`,
    set: 'joyful',
    order,
    readings: [],
  })),
  scope: { kind: 'full' },
  opening: true,
  readingFor: null,
  fatimaPrayer: true,
  hailHolyQueen: true,
  litany: false,
  closingPrayer: true,
});
const at = (id: string): number => steps.findIndex((step) => step.id === id);

describe('beadRingState', () => {
  it('starts on the cross', () => {
    expect(beadRingState(steps, 0)).toEqual({ kind: 'opening', prayed: 0, current: 0 });
  });

  it('walks the three opening Hail Marys', () => {
    expect(beadRingState(steps, at('opening-hail-mary-2'))).toEqual({
      kind: 'opening',
      prayed: 2,
      current: 3,
    });
  });

  it('marks the Our Father bead of a decade', () => {
    expect(beadRingState(steps, at('d3-our-father'))).toMatchObject({ ourFather: 'current', prayed: 0 });
  });

  it('fills the beads already prayed', () => {
    expect(beadRingState(steps, at('d3-hail-mary-7'))).toEqual({
      kind: 'decade',
      ourFather: 'done',
      prayed: 6,
      current: 7,
    });
  });

  it('shows the whole decade prayed at the Glory Be', () => {
    expect(beadRingState(steps, at('d3-glory-be'))).toMatchObject({ prayed: 10, current: null });
  });
});

describe('decadeFills', () => {
  it('fills earlier decades and part of the current one', () => {
    const fills = decadeFills(steps, at('d2-hail-mary-1'));
    expect(fills[0]).toBe(1);
    expect(fills[1]).toBeCloseTo(2 / 14);
    expect(fills.slice(2)).toEqual([0, 0, 0]);
  });
});
