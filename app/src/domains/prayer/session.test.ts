import type { MysteryRef } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import { journalEntryFor, planSession, stepsFor } from './session';

const mysteries: MysteryRef[] = [1, 2, 3, 4, 5].map((order) => ({
  id: `s${order}`,
  set: 'sorrowful',
  order,
  readings: [
    { book: 'Matthew', ref: `Mt ${order}` },
    { book: 'Luke', ref: `Lk ${order}` },
  ],
}));

const plan = (overrides: Partial<Parameters<typeof planSession>[0]> = {}) =>
  planSession({
    id: 'p1',
    set: 'sorrowful',
    scope: { kind: 'full' },
    locale: 'es-MX',
    openingForm: 'standard',
    fatimaPrayer: true,
    litany: false,
    prayerForThePope: true,
    reading: true,
    gospel: 'rotate',
    readingCounts: { s1: 1 },
    mysteries,
    now: new Date('2026-10-07T04:30:00Z'),
    prayedOn: '2026-10-06',
    ...overrides,
  });

describe('planSession', () => {
  it('rotates each mystery to its next Gospel', () => {
    expect(plan().readings).toMatchObject({ s1: { ref: 'Lk 1' }, s2: { ref: 'Mt 2' } });
  });

  it('skips readings when they are off', () => {
    expect(plan({ reading: false }).readings).toBeNull();
  });

  it('keeps the opening form, and reads an older plan without one as standard', () => {
    const virtues = plan({ openingForm: 'three-virtues' });
    const { openingForm: _openingForm, ...older } = virtues;
    const prayerOf = (steps: ReturnType<typeof stepsFor>) =>
      steps.find((step) => step.id === 'opening-hail-mary-1');

    expect(prayerOf(stepsFor(virtues, mysteries))).toMatchObject({ prayer: 'hail-mary-faith' });
    expect(prayerOf(stepsFor(older, mysteries))).toMatchObject({ prayer: 'hail-mary' });
  });
});

describe('journalEntryFor', () => {
  const p = plan();
  const steps = stepsFor(p, mysteries);
  const at = (id: string) => steps.findIndex((step) => step.id === id);

  it('records nothing when no decade was finished', () => {
    expect(journalEntryFor(p, steps, at('d1-hail-mary-9'), new Date(), 120)).toBeNull();
  });

  it('records the decades prayed and the readings heard when stopping midway', () => {
    const entry = journalEntryFor(p, steps, at('d3-announce'), new Date('2026-10-07T04:45:00Z'), 900);
    expect(entry).toMatchObject({
      kind: 'rosary',
      decades: 2,
      completedAt: null,
      prayedOn: '2026-10-06',
      readings: { s1: 'Lk 1', s2: 'Mt 2' },
    });
  });

  it('records a complete Rosary at the last step', () => {
    const entry = journalEntryFor(p, steps, steps.length - 1, new Date('2026-10-07T04:52:00Z'), 1320);
    expect(entry).toMatchObject({
      decades: 5,
      completedAt: '2026-10-07T04:52:00.000Z',
      durationSeconds: 1320,
    });
  });
});
