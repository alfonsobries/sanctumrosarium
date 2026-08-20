import { describe, expect, it } from 'vitest';

import { buildRosary } from '../sequence';
import {
  advance,
  decadesCompleted,
  goBack,
  goToDecade,
  progressOf,
  recordOf,
  startSession,
} from '../session';

const steps = buildRosary({ form: 'roman', locale: 'en-US', set: 'gaudiosa' });
const now = new Date('2026-08-15T21:00:00.000Z');

describe('session', () => {
  it('starts at the first step', () => {
    const state = startSession(now);
    expect(progressOf(state, steps).stepIndex).toBe(0);
    expect(progressOf(state, steps).finished).toBe(false);
  });

  it('counts the Hail Marys already prayed', () => {
    let state = startSession(now);
    for (let i = 0; i < 20; i += 1) {
      state = advance(state, steps, now);
    }
    const progress = progressOf(state, steps);
    expect(progress.hailMarysTotal).toBe(53);
    expect(progress.hailMarysPrayed).toBeGreaterThan(0);
  });

  it('goes back without losing the place', () => {
    let state = startSession(now);
    state = advance(state, steps, now);
    state = advance(state, steps, now);
    expect(goBack(state).stepIndex).toBe(1);
  });

  it('never goes back past the beginning', () => {
    expect(goBack(startSession(now)).stepIndex).toBe(0);
  });

  it('jumps to a decade', () => {
    const state = goToDecade(startSession(now), steps, 3);
    const step = steps[state.stepIndex];
    expect(step?.kind).toBe('announce');
    expect(step !== undefined && 'decade' in step ? step.decade : undefined).toBe(3);
  });

  it('finishes at the end and writes the record', () => {
    let state = startSession(now, 'por mi madre');
    for (let i = 0; i < steps.length; i += 1) {
      state = advance(state, steps, now);
    }
    expect(progressOf(state, steps).finished).toBe(true);

    const record = recordOf(state, steps);
    expect(record?.decades).toBe(5);
    expect(record?.intention).toBe('por mi madre');
    expect(record?.finishedAt).toBe(now.toISOString());
  });

  it('has no record before finishing', () => {
    expect(recordOf(startSession(now), steps)).toBeUndefined();
  });

  it('survives being saved and restored', () => {
    let state = startSession(now);
    for (let i = 0; i < 30; i += 1) {
      state = advance(state, steps, now);
    }
    const restored = JSON.parse(JSON.stringify(state)) as typeof state;
    expect(progressOf(restored, steps)).toEqual(progressOf(state, steps));
    expect(restored.version).toBe(1);
  });
});

describe('decadesCompleted', () => {
  const steps = buildRosary({ form: 'roman', locale: 'es-MX', set: 'gaudiosa' });
  const lastOfDecade = (decade: number) => {
    let last = -1;
    for (const [index, step] of steps.entries()) {
      if ('decade' in step && step.decade === decade) {
        last = index;
      }
    }
    return last;
  };

  it('counts nothing before the first decade closes', () => {
    const state = { ...startSession(new Date()), stepIndex: lastOfDecade(0) };
    expect(decadesCompleted(state, steps)).toBe(0);
  });

  it('counts a decade the moment its last step is behind', () => {
    const state = { ...startSession(new Date()), stepIndex: lastOfDecade(0) + 1 };
    expect(decadesCompleted(state, steps)).toBe(1);
  });

  it('counts loose decades wherever the cursor stands', () => {
    const state = { ...startSession(new Date()), stepIndex: lastOfDecade(2) + 1 };
    expect(decadesCompleted(state, steps)).toBe(3);
  });

  it('counts all five at the end', () => {
    const state = { ...startSession(new Date()), stepIndex: steps.length };
    expect(decadesCompleted(state, steps)).toBe(5);
  });
});
