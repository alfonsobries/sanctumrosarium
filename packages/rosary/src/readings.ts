import type { Evangelist, MysteryRef, Reading } from './types';

const evangelistByBook: Record<string, Evangelist> = {
  Matthew: 'matthew',
  Mark: 'mark',
  Luke: 'luke',
  John: 'john',
};

export function evangelistOf(reading: Reading): Evangelist | null {
  return evangelistByBook[reading.book] ?? null;
}

export type ReadingPreference = 'rotate' | Evangelist;

/**
 * Picks the passage to read for a mystery. When several Gospels tell it, each time the
 * mystery is prayed the next one is read, so over a few weeks the person hears every
 * account. A preferred evangelist wins whenever he tells the mystery.
 */
export function chooseReading(
  mystery: MysteryRef,
  preference: ReadingPreference,
  timesPrayed: number,
): Reading | null {
  if (mystery.readings.length === 0) {
    return null;
  }

  if (preference !== 'rotate') {
    const preferred = mystery.readings.find((reading) => evangelistOf(reading) === preference);
    if (preferred !== undefined) {
      return preferred;
    }
  }

  const index = Math.abs(Math.trunc(timesPrayed)) % mystery.readings.length;
  return mystery.readings[index] ?? null;
}
