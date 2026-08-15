import { describe, expect, it } from 'vitest';

import { allForms, forms } from '../forms';
import { mysteries } from '../mysteries';
import { findPrayer, prayers, prayersFor } from '../prayers';
import type { Locale, MysterySetId } from '../types';
import { validateContent } from '../validate';

const locales: readonly Locale[] = ['es-MX', 'es-ES', 'en-US', 'la'];

describe('validation', () => {
  it('reports no issues for the shipped content', () => {
    expect(validateContent()).toEqual([]);
  });

  it('gives every prayer a source', () => {
    for (const prayer of prayers) {
      expect(prayer.source.name).not.toBe('');
    }
  });
});

describe('prayers', () => {
  it('has the essential prayers in every locale', () => {
    for (const locale of locales) {
      for (const id of ['pater-noster', 'ave-maria', 'gloria-patri'] as const) {
        expect(findPrayer(id, locale), `${id} in ${locale}`).toBeDefined();
      }
    }
  });

  it('splits the Hail Mary where the response starts', () => {
    const hailMary = findPrayer('ave-maria', 'es-MX');
    expect(hailMary?.responseFrom).toBe(4);
    expect(hailMary?.lines[hailMary.responseFrom ?? 0]).toContain('Santa María');
  });

  it('keeps the Latin Ave Maria intact', () => {
    const ave = findPrayer('ave-maria', 'la');
    expect(ave?.lines.join(' ')).toContain('gratia plena');
    expect(ave?.lines[ave.responseFrom ?? 0]).toContain('Sancta Maria');
  });

  it('does not mix Mexican and Spanish pieces', () => {
    expect(findPrayer('templo-y-sagrario', 'es-ES')).toBeUndefined();
    expect(findPrayer('oblatio', 'es-MX')).toBeUndefined();
  });

  it('returns every prayer of a locale', () => {
    for (const locale of locales) {
      expect(prayersFor(locale).length).toBeGreaterThan(5);
    }
  });
});

describe('mysteries', () => {
  it('has twenty mysteries, five per set', () => {
    expect(mysteries).toHaveLength(20);
    const sets: readonly MysterySetId[] = [
      'gaudiosa',
      'luminosa',
      'dolorosa',
      'gloriosa',
    ];
    for (const set of sets) {
      expect(mysteries.filter((mystery) => mystery.set === set)).toHaveLength(5);
    }
  });

  it('numbers each set from one to five', () => {
    for (const set of ['gaudiosa', 'luminosa', 'dolorosa', 'gloriosa'] as const) {
      const orders = mysteries
        .filter((mystery) => mystery.set === set)
        .map((mystery) => mystery.order);
      expect(orders).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it('gives every mystery a title, a fruit and a scripture reference in every language', () => {
    for (const mystery of mysteries) {
      expect(mystery.scriptureRef).not.toBe('');
      for (const language of ['es', 'en', 'la'] as const) {
        expect(mystery.text[language].title, `${mystery.id} ${language}`).not.toBe('');
        expect(mystery.text[language].fruit, `${mystery.id} ${language}`).not.toBe('');
      }
    }
  });

  it('gives every mystery a clause to say after the name of Jesus', () => {
    for (const mystery of mysteries) {
      expect(mystery.text.es.clause, mystery.id).toBeDefined();
    }
  });
});

describe('forms', () => {
  it('has the four forms', () => {
    expect(allForms.map((form) => form.id)).toEqual([
      'roman',
      'es-MX',
      'es-ES',
      'dominican',
    ]);
  });

  it('always runs the decades', () => {
    for (const form of allForms) {
      expect(form.opening.some((step) => step.kind === 'decades')).toBe(true);
    }
  });

  it('keeps the Mexican closing that the Roman form does not have', () => {
    const mexicanClosing = forms['es-MX'].closing.map((step) =>
      step.kind === 'prayer' ? step.prayer : step.kind,
    );
    expect(mexicanClosing).toContain('salve-hija-de-dios-padre');
    expect(mexicanClosing).toContain('templo-y-sagrario');

    const romanClosing = forms.roman.closing.map((step) =>
      step.kind === 'prayer' ? step.prayer : step.kind,
    );
    expect(romanClosing).not.toContain('templo-y-sagrario');
  });

  it('says the Marian aspiration after every decade in the Mexican form', () => {
    const closing = forms['es-MX'].decade.closing.map((step) =>
      step.kind === 'prayer' ? step.prayer : step.kind,
    );
    expect(closing[0]).toBe('iaculatoria-mariae');
  });

  it('opens the Spanish form with the versicle instead of the Creed', () => {
    const opening = forms['es-ES'].opening.map((step) =>
      step.kind === 'prayer' ? step.prayer : step.kind,
    );
    expect(opening).toContain('domine-labia');
    expect(opening).not.toContain('credo');
  });

  it('opens the Dominican form with psalm 69', () => {
    const opening = forms.dominican.opening.map((step) =>
      step.kind === 'prayer' ? step.prayer : step.kind,
    );
    expect(opening).toContain('deus-in-adiutorium');
  });

  it('announces the mystery in every form built so far', () => {
    for (const form of allForms) {
      expect(form.decade.announce, form.id).toBe(true);
    }
  });

  it('marks the Fatima prayer as optional everywhere', () => {
    for (const form of allForms) {
      const fatima = form.decade.closing.find(
        (step) => step.kind === 'prayer' && step.prayer === 'oratio-fatimae',
      );
      expect(fatima && 'optional' in fatima ? fatima.optional : undefined, form.id).toBe(
        true,
      );
    }
  });
});
