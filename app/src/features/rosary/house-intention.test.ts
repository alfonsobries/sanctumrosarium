import { describe, expect, it } from 'vitest';

import { createMemoryDriver } from '@/storage/kv';

import {
  clearHouseIntention,
  loadHouseIntention,
  saveHouseIntention,
} from './house-intention';

describe('house intention', () => {
  it('returns nothing on a fresh device', () => {
    expect(
      loadHouseIntention(createMemoryDriver(), new Date('2026-08-20T21:00:00')),
    ).toBe(undefined);
  });

  it('keeps the text for the local day and drops it the next morning', () => {
    const driver = createMemoryDriver();
    saveHouseIntention(driver, 'por la casa', new Date('2026-08-20T21:00:00'));
    expect(loadHouseIntention(driver, new Date('2026-08-20T23:30:00'))).toBe(
      'por la casa',
    );
    expect(loadHouseIntention(driver, new Date('2026-08-21T07:00:00'))).toBeUndefined();
  });

  it('clears on an empty save', () => {
    const driver = createMemoryDriver();
    saveHouseIntention(driver, 'por la casa', new Date('2026-08-20T21:00:00'));
    saveHouseIntention(driver, '  ', new Date('2026-08-20T21:00:00'));
    expect(loadHouseIntention(driver, new Date('2026-08-20T21:00:00'))).toBeUndefined();
  });

  it('can be cleared on purpose', () => {
    const driver = createMemoryDriver();
    saveHouseIntention(driver, 'por la casa', new Date('2026-08-20T21:00:00'));
    clearHouseIntention(driver);
    expect(loadHouseIntention(driver, new Date('2026-08-20T21:00:00'))).toBeUndefined();
  });
});
