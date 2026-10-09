import { buildSequence, mysterySets, type PrayerId } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import {
  rosaryPromises,
  hasPrayerText,
  litany,
  locales,
  openingFormFor,
  openingFormsFor,
  mysteriesOf,
  mysteryRefsOf,
  mysterySlug,
  passage,
  prayerText,
  allMysteries,
  allPrayers,
} from './index';

const rosaryPrayers: PrayerId[] = [
  'sign-of-the-cross',
  'apostles-creed',
  'our-father',
  'hail-mary',
  'glory-be',
  'fatima-prayer',
  'hail-holy-queen',
  'rosary-closing-prayer',
  'litany-of-loreto',
];

describe('content', () => {
  it.each(locales)('has every prayer of the Rosary in %s, with a source', (locale) => {
    for (const id of rosaryPrayers.filter((id) => !(id === 'fatima-prayer' && locale === 'la'))) {
      const text = prayerText(id, locale);
      expect(text.lines.length, id).toBeGreaterThan(0);
      expect(text.source.url, id).toMatch(/^https:\/\//);
    }
  });

  it('splits the Hail Mary for the response in every locale', () => {
    for (const locale of locales) {
      expect(prayerText('hail-mary', locale).responseFrom, locale).not.toBeNull();
    }
  });

  it('has five ordered mysteries per set', () => {
    for (const set of mysterySets) {
      expect(mysteriesOf(set).map((m) => m.order)).toEqual([1, 2, 3, 4, 5]);
    }
    expect(allMysteries()).toHaveLength(20);
  });

  it('has the text of every reading in every language', () => {
    for (const mystery of allMysteries()) {
      expect(mystery.readings.length, mystery.id).toBeGreaterThan(0);
      for (const reading of mystery.readings) {
        for (const locale of locales) {
          expect(passage(reading.ref, locale)?.text, `${reading.ref} ${locale}`).toBeTruthy();
        }
      }
    }
  });

  it('builds a full Rosary from the content', () => {
    const steps = buildSequence({
      set: 'sorrowful',
      mysteries: mysteryRefsOf('sorrowful'),
      scope: { kind: 'full' },
      opening: true,
      openingForm: 'standard',
      readingFor: (m) => m.readings[0] ?? null,
      fatimaPrayer: true,
      prayerForThePope: false,
      hailHolyQueen: true,
      litany: true,
      closingPrayer: true,
    });
    expect(steps.filter((s) => s.kind === 'reading')).toHaveLength(5);
  });

  it('derives slugs shared with the artwork', () => {
    expect(mysterySlug('sorrowful-1-agony-in-the-garden')).toBe('agony-in-the-garden');
  });

  it('has no official Latin Fatima prayer, so it is never shown in Latin', () => {
    expect(hasPrayerText('fatima-prayer', 'la')).toBe(false);
    expect(hasPrayerText('fatima-prayer', 'es-ES')).toBe(true);
  });

  it('offers the three-virtues opening only where every one of its prayers has a source', () => {
    expect(openingFormsFor('es-MX')).toEqual(['standard', 'three-virtues']);
    expect(openingFormsFor('es-ES')).toEqual(['standard', 'three-virtues']);
    expect(openingFormsFor('en-US')).toEqual(['standard']);
    expect(openingFormsFor('la')).toEqual(['standard']);
  });

  it('falls back to the standard opening in a locale without the chosen form', () => {
    expect(openingFormFor('three-virtues', 'es-MX')).toBe('three-virtues');
    expect(openingFormFor('three-virtues', 'en-US')).toBe('standard');
  });

  it('splits each virtue Hail Mary for the response at Holy Mary', () => {
    for (const id of ['hail-mary-faith', 'hail-mary-hope', 'hail-mary-charity']) {
      const text = prayerText(id, 'es-MX');
      expect(text.lines[text.responseFrom ?? -1], id).toBe('Santa María, Madre de Dios,');
      expect(text.source.url, id).toMatch(/^https:\/\//);
    }
  });

  it('reads the litany as call and response', () => {
    const { pairs } = litany('es-MX');
    expect(pairs.length).toBeGreaterThan(50);
    expect(pairs.some((pair) => pair.call.includes('Madre de la Misericordia'))).toBe(true);
  });

  it('keeps prayer ids unique', () => {
    const ids = allPrayers().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('rosary promises', () => {
  it.each(['es', 'en'] as const)('has fifteen sourced promises and a framing in %s', (language) => {
    const promises = rosaryPromises(language);
    expect(promises.promises.map((p) => p.n)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    for (const promise of promises.promises) {
      expect(promise.text.length).toBeGreaterThan(10);
      expect(promise.source.url).toMatch(/^https:\/\//);
    }
    expect(promises.intro.length).toBeGreaterThan(100);
    expect(promises.understanding.length).toBeGreaterThan(3);
  });
});
