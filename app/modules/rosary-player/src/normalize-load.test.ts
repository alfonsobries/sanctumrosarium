import { describe, expect, it } from 'vitest';

import { clampRate, normalizeLoad } from './normalize-load';
import type { RosaryStep } from './rosary-player.types';

const nowPlaying = { album: 'Joyful Mysteries', artist: 'SanctaMaria' };

const step = (id: string, gapAfterMs = 500): RosaryStep => ({
  id,
  title: id,
  parts: [
    { uri: `file:///audio/${id}-leader.m4a`, gapAfterMs },
    { uri: `file:///audio/${id}-response.m4a`, gapAfterMs },
  ],
});

describe('clampRate', () => {
  it('keeps rates inside the pitch-preserving range', () => {
    expect(clampRate(0.1)).toBe(0.5);
    expect(clampRate(3)).toBe(2);
    expect(clampRate(1.25)).toBe(1.25);
  });

  it('falls back to normal speed for non-finite values', () => {
    expect(clampRate(Number.NaN)).toBe(1);
    expect(clampRate(Number.POSITIVE_INFINITY)).toBe(1);
  });
});

describe('normalizeLoad', () => {
  it('fills defaults and keeps the queue intact', () => {
    const result = normalizeLoad([step('a'), step('b')], { nowPlaying });

    expect(result.options).toEqual({ startIndex: 0, rate: 1, nowPlaying });
    expect(result.steps.map((s) => s.id)).toEqual(['a', 'b']);
    expect(result.steps[0].parts[0]).toEqual({ uri: 'file:///audio/a-leader.m4a', gapAfterMs: 500 });
  });

  it('rounds gaps and clamps the rate', () => {
    const result = normalizeLoad([step('a', 250.6)], { nowPlaying, rate: 4 });

    expect(result.steps[0].parts[0].gapAfterMs).toBe(251);
    expect(result.options.rate).toBe(2);
  });

  it('does not mutate the input steps', () => {
    const input = [step('a', 10.4)];
    normalizeLoad(input, { nowPlaying });

    expect(input[0].parts[0].gapAfterMs).toBe(10.4);
  });

  it('rejects an empty queue', () => {
    expect(() => normalizeLoad([], { nowPlaying })).toThrow('at least one step');
  });

  it('rejects a step without parts', () => {
    expect(() => normalizeLoad([{ id: 'x', title: 'x', parts: [] }], { nowPlaying })).toThrow(
      '"x" has no parts',
    );
  });

  it('rejects negative or non-finite gaps', () => {
    expect(() => normalizeLoad([step('a', -1)], { nowPlaying })).toThrow('invalid gapAfterMs');
    expect(() => normalizeLoad([step('a', Number.NaN)], { nowPlaying })).toThrow('invalid gapAfterMs');
  });

  it('rejects a start index outside the queue', () => {
    expect(() => normalizeLoad([step('a')], { nowPlaying, startIndex: 1 })).toThrow(RangeError);
    expect(() => normalizeLoad([step('a')], { nowPlaying, startIndex: 0.5 })).toThrow(RangeError);
  });
});
