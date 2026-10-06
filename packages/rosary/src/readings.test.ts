import { describe, expect, it } from 'vitest';

import { chooseReading } from './readings';
import type { MysteryRef } from './types';

const agony: MysteryRef = {
  id: 'agony-in-the-garden',
  set: 'sorrowful',
  order: 1,
  readings: [
    { book: 'Matthew', ref: 'Mt 26:36-46' },
    { book: 'Mark', ref: 'Mk 14:32-42' },
    { book: 'Luke', ref: 'Lk 22:39-46' },
  ],
};

describe('chooseReading', () => {
  it('rotates through every Gospel that tells the mystery', () => {
    const refs = [0, 1, 2, 3].map((times) => chooseReading(agony, 'rotate', times)?.ref);

    expect(refs).toEqual(['Mt 26:36-46', 'Mk 14:32-42', 'Lk 22:39-46', 'Mt 26:36-46']);
  });

  it('keeps the preferred evangelist when he tells the mystery', () => {
    expect(chooseReading(agony, 'luke', 7)?.ref).toBe('Lk 22:39-46');
  });

  it('falls back to rotation when the preferred evangelist is silent', () => {
    expect(chooseReading(agony, 'john', 1)?.ref).toBe('Mk 14:32-42');
  });

  it('returns nothing for a mystery without readings', () => {
    expect(chooseReading({ ...agony, readings: [] }, 'rotate', 0)).toBeNull();
  });
});
