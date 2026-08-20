import { describe, expect, it } from 'vitest';

import { latinLineMap } from '../bilingual';
import { prayersFor } from '../prayers';
import type { Language, Locale } from '../types';

const locales: readonly [Locale, Exclude<Language, 'la'>][] = [
  ['es-MX', 'es'],
  ['es-ES', 'es'],
  ['en-US', 'en'],
];

// Task 023: every prayer that exists in Latin pairs line by line with the other
// languages - either the counts match, or an explicit monotonic map says how.
describe('latin line alignment', () => {
  const latinPrayers = prayersFor('la');

  for (const [locale, language] of locales) {
    describe(`la <-> ${locale}`, () => {
      for (const latin of latinPrayers) {
        const own = prayersFor(locale).find((prayer) => prayer.id === latin.id);
        if (own === undefined) {
          continue;
        }
        it(`${latin.id} aligns`, () => {
          const map = latinLineMap[latin.id]?.[language];
          if (map === undefined) {
            expect(own.lines.length).toBe(latin.lines.length);
            return;
          }
          expect(map.length).toBe(own.lines.length);
          for (const index of map) {
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(latin.lines.length);
          }
          for (let index = 1; index < map.length; index += 1) {
            expect(map[index]).toBeGreaterThanOrEqual(map[index - 1]);
          }
        });
      }
    });
  }
});
