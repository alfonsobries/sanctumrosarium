import { findPrayer } from '@rosario/content';
import { describe, expect, it } from 'vitest';

import { pairLatinLines } from './bilingual';

describe('pairLatinLines', () => {
  it('pairs one to one when the line counts match', () => {
    const latin = findPrayer('pater-noster', 'la')!;
    const own = findPrayer('pater-noster', 'es-MX')!;
    const pairs = pairLatinLines(latin, own, 'es');
    expect(pairs).toHaveLength(latin.lines.length);
    for (const [index, pair] of pairs.entries()) {
      expect(pair.own).toEqual([own.lines[index]]);
    }
  });

  it('groups the own lines that answer to one Latin line', () => {
    const latin = findPrayer('ave-maria', 'la')!;
    const own = findPrayer('ave-maria', 'es-MX')!;
    const pairs = pairLatinLines(latin, own, 'es');
    // "Ave, Maria, gratia plena, Dominus tecum." carries two Spanish lines.
    expect(pairs[0].own).toHaveLength(2);
    expect(pairs[6].own).toEqual(['Amén.']);
  });

  it('lets a Latin line stand alone when the other language does not print it', () => {
    const latin = findPrayer('oratio-fatimae', 'la')!;
    const own = findPrayer('oratio-fatimae', 'en-US')!;
    const pairs = pairLatinLines(latin, own, 'en');
    expect(pairs[4].latin).toBe('Amen.');
    expect(pairs[4].own).toEqual([]);
  });
});
