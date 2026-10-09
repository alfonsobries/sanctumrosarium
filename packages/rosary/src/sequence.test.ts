import { describe, expect, it } from 'vitest';

import { buildSequence, InvalidRosaryOptions, openingFormPrayers } from './sequence';
import type { MysteryRef, RosaryOptions } from './types';

const sorrowful: MysteryRef[] = [1, 2, 3, 4, 5].map((order) => ({
  id: `sorrowful-${order}`,
  set: 'sorrowful',
  order,
  readings: [
    { book: 'Matthew', ref: `Mt ${order}` },
    { book: 'Luke', ref: `Lk ${order}` },
  ],
}));

const base: RosaryOptions = {
  set: 'sorrowful',
  mysteries: sorrowful,
  scope: { kind: 'full' },
  opening: true,
  openingForm: 'standard',
  readingFor: null,
  fatimaPrayer: false,
  prayerForThePope: false,
  hailHolyQueen: true,
  litany: false,
  closingPrayer: true,
};

const count = (steps: ReturnType<typeof buildSequence>, prayer: string): number =>
  steps.filter((step) => step.kind === 'prayer' && step.prayer === prayer).length;

describe('buildSequence', () => {
  it('prays fifty-three Hail Marys in a full Rosary', () => {
    const steps = buildSequence(base);

    expect(count(steps, 'hail-mary')).toBe(53);
    expect(count(steps, 'our-father')).toBe(6);
    expect(count(steps, 'glory-be')).toBe(6);
    expect(steps.filter((step) => step.kind === 'announce')).toHaveLength(5);
  });

  it('says the opening Hail Marys for faith, hope and charity in the three-virtues form', () => {
    const steps = buildSequence({ ...base, openingForm: 'three-virtues' });
    const opening = steps.filter((step) => step.section === 'opening').map((step) => step.id);
    const prayers = steps
      .filter((step) => step.section === 'opening' && step.kind === 'prayer')
      .map((step) => (step.kind === 'prayer' ? step.prayer : null));

    expect(prayers).toEqual([
      'sign-of-the-cross',
      'apostles-creed',
      'our-father',
      'hail-mary-faith',
      'hail-mary-hope',
      'hail-mary-charity',
      'trinity-salutation',
      'glory-be',
    ]);
    expect(opening).toContain('opening-hail-mary-1');
    expect(count(steps, 'hail-mary')).toBe(50);
  });

  it('keeps the counted beads of the opening in the three-virtues form', () => {
    const steps = buildSequence({ ...base, openingForm: 'three-virtues' });
    const charity = steps.find((step) => step.id === 'opening-hail-mary-3');

    expect(charity?.kind === 'prayer' && charity.count).toEqual({ index: 3, total: 3 });
    expect(charity?.bead).toEqual({ kind: 'opening-small', index: 3 });
  });

  it('leaves a single decade alone whatever the opening form', () => {
    const steps = buildSequence({ ...base, openingForm: 'three-virtues', scope: { kind: 'decade', decade: 1 } });

    expect(count(steps, 'hail-mary-faith')).toBe(0);
    expect(count(steps, 'trinity-salutation')).toBe(0);
  });

  it('announces the mysteries in order', () => {
    const announced = buildSequence({ ...base, mysteries: [...sorrowful].reverse() })
      .filter((step) => step.kind === 'announce')
      .map((step) => (step.kind === 'announce' ? step.mystery.id : ''));

    expect(announced).toEqual(sorrowful.map((mystery) => mystery.id));
  });

  it('never drops the essential core of a decade, whatever the options', () => {
    const steps = buildSequence({
      ...base,
      opening: false,
      prayerForThePope: false,
      hailHolyQueen: false,
      closingPrayer: false,
    });

    expect(count(steps, 'hail-mary')).toBe(50);
    expect(count(steps, 'our-father')).toBe(5);
    expect(count(steps, 'glory-be')).toBe(5);
  });

  it('prays a single decade without the opening or closing frame', () => {
    const steps = buildSequence({ ...base, scope: { kind: 'decade', decade: 3 } });

    expect(steps.map((step) => step.id)).toContain('d3-announce');
    expect(count(steps, 'hail-mary')).toBe(10);
    expect(count(steps, 'apostles-creed')).toBe(0);
    expect(count(steps, 'hail-holy-queen')).toBe(0);
    expect(steps[0]?.id).toBe('sign-of-the-cross');
    expect(steps.at(-1)?.id).toBe('closing-sign-of-the-cross');
  });

  it('inserts the chosen reading right after the announcement', () => {
    const steps = buildSequence({
      ...base,
      readingFor: (mystery) => mystery.readings[1] ?? null,
    });
    const index = steps.findIndex((step) => step.id === 'd2-announce');

    expect(steps[index + 1]).toMatchObject({ kind: 'reading', reading: { ref: 'Lk 2' } });
  });

  it('adds the Fatima prayer after every Glory Be of a decade', () => {
    expect(count(buildSequence({ ...base, fatimaPrayer: true }), 'fatima-prayer')).toBe(5);
  });

  it('places every Hail Mary of a decade on its own bead', () => {
    const beads = buildSequence(base)
      .filter((step) => step.kind === 'prayer' && step.decade === 4 && step.prayer === 'hail-mary')
      .map((step) => step.bead);

    expect(beads).toEqual(
      Array.from({ length: 10 }, (_, i) => ({ kind: 'decade-small', decade: 4, index: i + 1 })),
    );
  });

  it('gives every step a unique id', () => {
    const ids = buildSequence({ ...base, fatimaPrayer: true, litany: true }).map((s) => s.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('rejects mysteries from another set', () => {
    expect(() => buildSequence({ ...base, set: 'joyful' })).toThrow(InvalidRosaryOptions);
  });

  it('rejects a decade out of range', () => {
    expect(() => buildSequence({ ...base, scope: { kind: 'decade', decade: 6 } })).toThrow(
      InvalidRosaryOptions,
    );
  });
});

describe('prayer for the Pope', () => {
  it('concludes with an Our Father and a Hail Mary for his intentions before the Hail Holy Queen', () => {
    const steps = buildSequence({ ...base, prayerForThePope: true });
    const ids = steps.map((step) => step.id);
    const pope = ids.indexOf('closing-pope-our-father');
    expect(ids.slice(pope, pope + 3)).toEqual([
      'closing-pope-our-father',
      'closing-pope-hail-mary',
      'closing-hail-holy-queen',
    ]);
    expect(steps[pope]).toMatchObject({ intention: 'pope', count: null });
  });

  it('is left out of a single decade', () => {
    const steps = buildSequence({ ...base, prayerForThePope: true, scope: { kind: 'decade', decade: 2 } });
    expect(steps.some((step) => step.id.startsWith('closing-pope'))).toBe(false);
  });
});

describe('openingFormPrayers', () => {
  it('lists every prayer each form says', () => {
    expect(openingFormPrayers('standard')).toEqual(['hail-mary']);
    expect(openingFormPrayers('three-virtues')).toEqual([
      'hail-mary-faith',
      'hail-mary-hope',
      'hail-mary-charity',
      'trinity-salutation',
    ]);
  });
});
