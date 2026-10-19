import { describe, expect, it } from 'vitest';

import { auxiliumFor, auxiliumSectionIds, auxiliumText, hasPrayerText, locales } from './index';

describe('auxilium christianorum', () => {
  it.each(locales)('has every section in %s, in order and with a source', (locale) => {
    const text = auxiliumText(locale);
    expect(text.sections.map((section) => section.id)).toEqual([...auxiliumSectionIds]);
    expect(text.source.url).toMatch(/^https:\/\/auxiliumchristianorum\.org\//);
    for (const source of Object.values(text.sectionSources ?? {})) {
      expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it.each(locales)('names a source for every text the booklet only names in %s', (locale) => {
    const text = auxiliumText(locale);
    if (locale !== 'la') {
      expect(Object.keys(text.sectionSources ?? {}).sort()).toEqual(['guardian-angel', 'saint-michael']);
    }
  });

  it.each(locales)('says one weekday prayer each day in %s', (locale) => {
    for (let weekday = 0; weekday < 7; weekday++) {
      const days = auxiliumFor(locale, weekday).filter((section) => section.day !== undefined);
      expect(days.map((section) => section.day)).toEqual([weekday]);
    }
  });

  it.each(locales)('takes the Our Father, Hail Mary and Glory Be from the Rosary in %s', (locale) => {
    for (const section of auxiliumText(locale).sections) {
      for (const block of section.blocks) {
        if (block.kind === 'prayer') {
          expect(hasPrayerText(block.prayer, locale), block.prayer).toBe(true);
        }
      }
    }
  });

  it.each(locales)('splits every litany line into its call and its answer in %s', (locale) => {
    for (const section of auxiliumText(locale).sections) {
      for (const block of section.blocks) {
        if (block.kind !== 'litany') {
          continue;
        }
        for (const item of block.items) {
          expect(item.call, section.id).not.toMatch(
            /Sálvanos|save us|salva nos|ora pro nobis|pray for us|Ruega/,
          );
        }
      }
    }
  });

  it('marks the sign of the cross in the Latin formulas', () => {
    expect(JSON.stringify(auxiliumText('la').sections)).not.toMatch(/\ba\s+et\s+(Filii|Spiritus)/);
  });

  it.each(locales)('keeps no empty text and no stray footnote in %s', (locale) => {
    const all = JSON.stringify(auxiliumText(locale).sections);
    expect(all).not.toMatch(/Copyright|Derechos de autor|""/);
    expect(all).not.toMatch(/\s{2,}/);
  });
});
