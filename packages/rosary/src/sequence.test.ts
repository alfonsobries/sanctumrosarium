import { describe, expect, it } from 'vitest';

import { buildSequence, InvalidRosaryOptions } from './sequence';
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
  readingFor: null,
  fatimaPrayer: false,
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
