import { describe, expect, it } from 'vitest';

import {
  buildRosary,
  countHailMarys,
  mysteriesOfSet,
  type RosaryOptions,
} from '../sequence';

const base: RosaryOptions = { form: 'roman', locale: 'en-US', set: 'gaudiosa' };

function prayerIds(options: RosaryOptions): readonly string[] {
  return buildRosary(options).map((step) =>
    step.kind === 'prayer' ? step.prayer.id : step.kind,
  );
}

describe('buildRosary', () => {
  it('has 53 Hail Marys: three at the start and fifty in the decades', () => {
    expect(countHailMarys(buildRosary(base))).toBe(53);
  });

  it('keeps the essential decade whatever the options say', () => {
    const steps = buildRosary({ ...base, include: [] });
    const firstDecade = steps.filter((step) => 'decade' in step && step.decade === 0);
    const ids = firstDecade.map((step) =>
      step.kind === 'prayer' ? step.prayer.id : step.kind,
    );

    expect(ids[0]).toBe('announce');
    expect(ids[1]).toBe('pater-noster');
    expect(ids.filter((id) => id === 'ave-maria')).toHaveLength(10);
    expect(ids[ids.length - 1]).toBe('gloria-patri');
  });

  it('leaves optional prayers out unless they are asked for', () => {
    expect(prayerIds(base)).not.toContain('oratio-fatimae');
    expect(
      prayerIds({ ...base, include: ['oratio-fatimae'] }).filter(
        (id) => id === 'oratio-fatimae',
      ),
    ).toHaveLength(5);
  });

  it('does not change the essential prayers when an optional one is added', () => {
    const without = countHailMarys(buildRosary(base));
    const with_ = countHailMarys(buildRosary({ ...base, include: ['oratio-fatimae'] }));
    expect(with_).toBe(without);
  });

  it('builds the Mexican form with its own closing', () => {
    const ids = prayerIds({ form: 'es-MX', locale: 'es-MX', set: 'dolorosa' });
    expect(ids).toContain('per-signum-crucis');
    expect(ids).toContain('salve-hija-de-dios-padre');
    expect(ids).toContain('templo-y-sagrario');
    // The Marian aspiration is said after every decade, five times.
    expect(ids.filter((id) => id === 'iaculatoria-mariae')).toHaveLength(5);
  });

  it('builds the Spanish form opening with the versicle and no Creed', () => {
    const ids = prayerIds({ form: 'es-ES', locale: 'es-ES', set: 'gloriosa' });
    expect(ids).toContain('domine-labia');
    expect(ids).not.toContain('credo');
  });

  it('builds the Dominican form opening with psalm 69', () => {
    const ids = prayerIds({ form: 'dominican', locale: 'la', set: 'gloriosa' });
    expect(ids).toContain('deus-in-adiutorium');
    expect(
      countHailMarys(buildRosary({ form: 'dominican', locale: 'la', set: 'gloriosa' })),
    ).toBe(50);
  });

  it('prays all twenty mysteries when asked for the full Rosary', () => {
    const steps = buildRosary({ ...base, fullRosary: true });
    expect(countHailMarys(steps)).toBe(203);
    const decades = new Set(
      steps.flatMap((step) => ('decade' in step ? [step.decade] : [])),
    );
    expect(decades.size).toBe(20);
  });

  it('adds the reading and the silence when they are on', () => {
    const steps = buildRosary({ ...base, withReading: true, silenceSeconds: 10 });
    expect(steps.filter((step) => step.kind === 'reading')).toHaveLength(5);
    expect(steps.filter((step) => step.kind === 'silence')).toHaveLength(5);
  });

  it('adds the litany only when asked', () => {
    expect(buildRosary(base).some((step) => step.kind === 'litany')).toBe(false);
    expect(
      buildRosary({ ...base, withLitany: true }).some((step) => step.kind === 'litany'),
    ).toBe(true);
  });

  it('announces a different mystery in each decade, in order', () => {
    const announced = buildRosary(base).flatMap((step) =>
      step.kind === 'announce' ? [step.mystery.id] : [],
    );
    expect(announced).toEqual([
      'gaudiosa-1',
      'gaudiosa-2',
      'gaudiosa-3',
      'gaudiosa-4',
      'gaudiosa-5',
    ]);
  });

  it('numbers the beads of each decade from one to ten', () => {
    const beads = buildRosary(base)
      .filter(
        (step) =>
          step.kind === 'prayer' && step.decade === 2 && step.prayer.id === 'ave-maria',
      )
      .map((step) => (step.kind === 'prayer' ? step.beadInDecade : undefined));
    expect(beads).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('mysteriesOfSet', () => {
  it('returns five mysteries in order', () => {
    expect(mysteriesOfSet('luminosa').map((mystery) => mystery.order)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });
});

describe('the mystery is never out of sight', () => {
  it('carries the mystery on every step of a decade', () => {
    const decadeSteps = buildRosary({ ...base, include: ['oratio-fatimae'] }).filter(
      (step) => 'decade' in step && step.decade === 1,
    );

    expect(decadeSteps.length).toBeGreaterThan(12);
    for (const step of decadeSteps) {
      const mystery = 'mystery' in step ? step.mystery : undefined;
      expect(mystery?.id, step.kind).toBe('gaudiosa-2');
    }
  });

  it('carries it in every form', () => {
    for (const form of ['roman', 'es-MX', 'es-ES', 'dominican'] as const) {
      const locale = form === 'dominican' ? 'la' : form === 'roman' ? 'en-US' : form;
      const steps = buildRosary({ form, locale, set: 'dolorosa' });
      const beads = steps.filter(
        (step) => step.kind === 'prayer' && step.beadInDecade !== undefined,
      );
      for (const bead of beads) {
        expect('mystery' in bead ? bead.mystery : undefined, form).toBeDefined();
      }
    }
  });
});

describe('localeOverrides', () => {
  it('prays the chosen prayers in another language, one at a time', () => {
    const steps = buildRosary({
      form: 'roman',
      locale: 'la',
      set: 'gaudiosa',
      localeOverrides: { 'ave-maria': 'es-MX' },
    });
    const ave = steps.find(
      (step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria',
    );
    const pater = steps.find(
      (step) => step.kind === 'prayer' && step.prayer.id === 'pater-noster',
    );
    expect(ave?.kind === 'prayer' && ave.prayer.locale).toBe('es-MX');
    expect(pater?.kind === 'prayer' && pater.prayer.locale).toBe('la');
  });

  it('falls back to the base locale when the override lacks the prayer', () => {
    const steps = buildRosary({
      form: 'es-MX',
      locale: 'es-MX',
      set: 'gaudiosa',
      include: ['ave-maria-purissima'],
      localeOverrides: { 'ave-maria-purissima': 'en-US' },
    });
    const greeting = steps.find(
      (step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria-purissima',
    );
    expect(greeting?.kind === 'prayer' && greeting.prayer.locale).toBe('es-MX');
  });
});

describe('withClauses', () => {
  const aves = (options: Parameters<typeof buildRosary>[0]) =>
    buildRosary(options).filter(
      (step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria',
    );

  it('appends the clause of the mystery to every Hail Mary of its decade', () => {
    const steps = aves({
      form: 'roman',
      locale: 'es-MX',
      set: 'gaudiosa',
      withClauses: true,
    });
    expect(steps).toHaveLength(53);
    const decadeAves = steps.filter((step) => 'decade' in step && step.decade === 0);
    for (const step of decadeAves) {
      expect(
        step.kind === 'prayer' &&
          step.prayer.lines.some((line) =>
            line.includes('Jesús, a quien concebiste por obra del Espíritu Santo.'),
          ),
      ).toBe(true);
    }
  });

  it('keeps the plain Hail Mary without the setting', () => {
    const plain = aves({ form: 'roman', locale: 'es-MX', set: 'gaudiosa' });
    for (const step of plain) {
      expect(
        step.kind === 'prayer' &&
          step.prayer.lines.some((line) => line.includes(', a quien')),
      ).toBe(false);
    }
  });

  it('keeps the call and response cut unchanged', () => {
    const [withClause] = aves({
      form: 'roman',
      locale: 'la',
      set: 'dolorosa',
      withClauses: true,
    }).filter((step) => 'decade' in step && step.decade === 0);
    expect(withClause.kind === 'prayer' && withClause.prayer.responseFrom).toBe(3);
  });

  it('every mystery of every set carries its clause into the Aves', () => {
    for (const set of ['gaudiosa', 'luminosa', 'dolorosa', 'gloriosa'] as const) {
      const steps = buildRosary({ form: 'roman', locale: 'la', set, withClauses: true });
      const decades = new Set(
        steps.flatMap((step) =>
          'decade' in step && step.decade !== undefined ? [step.decade] : [],
        ),
      );
      for (const decade of decades) {
        const ave = steps.find(
          (step) =>
            step.kind === 'prayer' &&
            step.prayer.id === 'ave-maria' &&
            step.decade === decade,
        );
        expect(
          ave?.kind === 'prayer' && ave.prayer.lines.join(' ').includes('Iesus,'),
        ).toBe(true);
      }
    }
  });
});
