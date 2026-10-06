import { buildSequence, type MysteryRef } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import { buildQueue, readingSilenceMs, type AudioManifest } from './queue';

const mysteries: MysteryRef[] = [1, 2, 3, 4, 5].map((order) => ({
  id: `m${order}`,
  set: 'joyful',
  order,
  readings: [{ book: 'Luke', ref: `Lk ${order}` }],
}));

const track = (key: string) => ({ file: `${key}.mp3`, durationMs: 1000 });
const manifest: AudioManifest = {
  version: 1,
  locale: 'es-MX',
  tracks: Object.fromEntries(
    [
      'sign-of-the-cross.leader',
      'apostles-creed.leader',
      'our-father.leader',
      'our-father.response',
      'hail-mary.leader',
      'hail-mary.response',
      'glory-be.leader',
      'glory-be.response',
      'hail-holy-queen.leader',
      'rosary-closing-prayer.leader',
      'litany.0.call',
      'litany.1.call',
      'litany.response.0',
      ...mysteries.map((m) => `announce.${m.id}`),
    ].map((key) => [key, track(key)]),
  ),
  litanyResponses: ['litany.response.0', 'litany.response.0'],
};

const timing = { pauseMs: 1000, responseGapMs: 500, afterAnnounceMs: 4000 };

const steps = (overrides: { reading?: boolean; litany?: boolean; fatima?: boolean } = {}) =>
  buildSequence({
    set: 'joyful',
    mysteries,
    scope: { kind: 'full' },
    opening: true,
    readingFor: overrides.reading ? (m) => m.readings[0] ?? null : null,
    fatimaPrayer: overrides.fatima ?? false,
    prayerForThePope: false,
    hailHolyQueen: true,
    litany: overrides.litany ?? false,
    closingPrayer: true,
  });

describe('buildQueue', () => {
  it('keeps one queue entry per step so indices match the screen', () => {
    const sequence = steps({ reading: true, litany: true });
    const queue = buildQueue(sequence, manifest, timing, () => 'x');
    expect(queue?.map((entry) => entry.id)).toEqual(sequence.map((step) => step.id));
  });

  it('plays the leader, a breath, then the response, then the chosen silence', () => {
    const queue = buildQueue(steps(), manifest, timing, () => '')!;
    const hailMary = queue.find((entry) => entry.id === 'd1-hail-mary-1');
    expect(hailMary?.parts).toEqual([
      { file: 'hail-mary.leader.mp3', gapAfterMs: 500 },
      { file: 'hail-mary.response.mp3', gapAfterMs: 1000 },
    ]);
  });

  it('keeps silence after announcing a mystery', () => {
    const queue = buildQueue(steps(), manifest, timing, () => '')!;
    expect(queue.find((entry) => entry.id === 'd3-announce')?.parts[0]?.gapAfterMs).toBe(4000);
  });

  it('turns an unrecorded reading into silence to read it', () => {
    const queue = buildQueue(steps({ reading: true }), manifest, timing, () => 'a'.repeat(280))!;
    expect(queue.find((entry) => entry.id === 'd1-reading')?.parts).toEqual([
      { file: null, gapAfterMs: 20_000 },
    ]);
  });

  it('alternates litany calls and shared responses', () => {
    const queue = buildQueue(steps({ litany: true }), manifest, timing, () => '')!;
    expect(queue.find((entry) => entry.id === 'closing-litany-of-loreto')?.parts.map((p) => p.file)).toEqual([
      'litany.0.call.mp3',
      'litany.response.0.mp3',
      'litany.1.call.mp3',
      'litany.response.0.mp3',
    ]);
  });

  it('refuses a pack that misses a prayer instead of skipping it', () => {
    expect(buildQueue(steps({ fatima: true }), manifest, timing, () => '')).toBeNull();
  });

  it('bounds the reading silence', () => {
    expect(readingSilenceMs('')).toBe(8000);
    expect(readingSilenceMs('a'.repeat(10_000))).toBe(90_000);
  });
});
