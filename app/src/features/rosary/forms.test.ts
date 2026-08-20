import { allForms, forms } from '@rosario/content';
import { buildRosary } from '@rosario/engine';
import { describe, expect, it } from 'vitest';

import { effectiveForm, formsForLocale, optionalPrayersOf } from './forms';

describe('effectiveForm', () => {
  it('follows the prayer language on auto', () => {
    expect(effectiveForm('auto', 'es-MX')).toBe('es-MX');
    expect(effectiveForm('auto', 'en-US')).toBe('roman');
  });

  it('honours a chosen form the language can pray', () => {
    expect(effectiveForm('dominican', 'la')).toBe('dominican');
  });

  it('falls back to the language when the chosen form cannot be prayed in it', () => {
    // The Mexican form only exists in es-MX; Latin cannot pray it.
    expect(effectiveForm('es-MX', 'la')).toBe('roman');
  });
});

describe('formsForLocale', () => {
  it('only offers forms whose prayers exist in the locale', () => {
    const ids = formsForLocale('la').map((form) => form.id);
    expect(ids).toContain('roman');
    expect(ids).not.toContain('es-MX');
  });
});

describe('optionalPrayersOf', () => {
  it('lists the optional prayers of the Mexican form', () => {
    const optional = optionalPrayersOf(forms['es-MX']);
    expect(optional).toContain('oratio-fatimae');
    expect(optional).toContain('actus-contritionis');
    expect(optional).not.toContain('ave-maria');
  });
});

describe('what is essential is not configurable', () => {
  it.each(allForms.map((form) => [form.id, form] as const))(
    'the %s form always prays mystery, Our Father, ten Hail Marys and Glory Be',
    (_id, form) => {
      const locale = form.locales[0];
      for (const include of [[], optionalPrayersOf(form)]) {
        const steps = buildRosary({ form: form.id, locale, set: 'dolorosa', include });
        const announces = steps.filter((step) => step.kind === 'announce');
        const aves = steps.filter(
          (step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria',
        );
        const decadePaters = steps.filter(
          (step) =>
            step.kind === 'prayer' &&
            step.prayer.id === 'pater-noster' &&
            'decade' in step &&
            step.decade !== undefined,
        );
        const decadeGlorias = steps.filter(
          (step) =>
            step.kind === 'prayer' &&
            step.prayer.id === 'gloria-patri' &&
            'decade' in step &&
            step.decade !== undefined,
        );
        expect(announces).toHaveLength(5);
        expect(aves.length).toBeGreaterThanOrEqual(50);
        expect(decadePaters).toHaveLength(5);
        expect(decadeGlorias).toHaveLength(5);
      }
    },
  );
});
