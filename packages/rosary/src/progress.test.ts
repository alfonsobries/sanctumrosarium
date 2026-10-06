import { describe, expect, it } from 'vitest';

import { decadesCompleted, nextDecadeStart, previousDecadeStart } from './progress';
import { buildSequence } from './sequence';
import type { MysteryRef } from './types';

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
  fatimaPrayer: false,
  hailHolyQueen: true,
  litany: false,
  closingPrayer: true,
});

const indexOf = (id: string): number => steps.findIndex((step) => step.id === id);

describe('progress', () => {
  it('counts a decade once its Glory Be is passed', () => {
    expect(decadesCompleted(steps, indexOf('d2-glory-be'))).toBe(1);
    expect(decadesCompleted(steps, indexOf('d2-glory-be') + 1)).toBe(2);
    expect(decadesCompleted(steps, steps.length)).toBe(5);
  });

  it('jumps between decades', () => {
    expect(nextDecadeStart(steps, indexOf('d1-hail-mary-4'))).toBe(indexOf('d2-announce'));
    expect(nextDecadeStart(steps, indexOf('d5-hail-mary-4'))).toBeNull();
    expect(previousDecadeStart(steps, indexOf('d3-hail-mary-4'))).toBe(indexOf('d3-announce'));
  });
});
