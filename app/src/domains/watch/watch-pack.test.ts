import { describe, expect, it } from 'vitest';

import type { AudioManifest } from '../audio/queue';

import { watchAudioPack, watchReadings, watchSequence, type WatchScripture } from './watch-pack';

function manifestFor(keys: string[]): AudioManifest {
  const tracks: AudioManifest['tracks'] = {};
  for (const key of keys) {
    tracks[key] = { file: `${key}.mp3`, durationMs: 1000 };
  }
  return { version: 1, locale: 'es-MX', tracks, litanyResponses: [] };
}

const steps = watchSequence('joyful', { kind: 'full' });
const keys = [
  ...new Set(
    ['joyful', 'luminous', 'sorrowful', 'glorious'].flatMap((set) =>
      watchSequence(
        set as 'joyful',
        { kind: 'full' },
        { fatimaPrayer: true, litany: false, prayerForThePope: true, readings: false },
      ).map((step) =>
        step.kind === 'announce' ? `announce.${step.mystery.id}` : step.kind === 'prayer' ? step.prayer : '',
      ),
    ),
  ),
];
const complete = manifestFor(
  keys.flatMap((key) => (key.startsWith('announce.') ? [key] : [`${key}.leader`, `${key}.response`])),
);

const scripture = (readings = watchReadings('rotate', {})): WatchScripture => ({
  readings,
  track: (ref) =>
    ref === 'Lk 1:26-38' ? { file: 'reading.annunciation.mp3', durationMs: 60_000 } : undefined,
  text: () => 'x'.repeat(280),
});

describe('watchSequence', () => {
  it('reads a passage after each mystery is announced', () => {
    const readings = steps.filter((step) => step.kind === 'reading');
    expect(readings).toHaveLength(5);
    expect(steps[steps.findIndex((step) => step.kind === 'reading') - 1]?.kind).toBe('announce');
  });

  it('reads the chosen passage, else the primary one', () => {
    const chosen = watchSequence('joyful', { kind: 'full' }, undefined, {
      'joyful-1-annunciation': 'Lk 1:26-38',
    });
    const first = chosen.find((step) => step.kind === 'reading');
    expect(first?.kind === 'reading' && first.reading.ref).toBe('Lk 1:26-38');
  });
});

describe('watchReadings', () => {
  it('turns to the next account each time a mystery is prayed', () => {
    const first = watchReadings('rotate', {});
    const next = watchReadings('rotate', { 'luminous-1-baptism': 1 });
    expect(Object.keys(first)).toHaveLength(20);
    expect(next['luminous-1-baptism']).not.toBe(first['luminous-1-baptism']);
    expect(next['joyful-1-annunciation']).toBe(first['joyful-1-annunciation']);
  });
});

describe('watchAudioPack', () => {
  it('marks which gaps stretch to the pause chosen on the phone', () => {
    const pack = watchAudioPack('es-MX', complete);
    expect(pack?.parts['hail-mary']).toEqual([
      { file: 'hail-mary.leader.mp3', minGapMs: 450, pause: false },
      { file: 'hail-mary.response.mp3', minGapMs: 0, pause: true },
    ]);
    expect(pack?.parts['announce.joyful-1-annunciation']).toEqual([
      { file: 'announce.joyful-1-annunciation.mp3', minGapMs: 4000, pause: true },
    ]);
  });

  it('has no readings unless they are asked for', () => {
    const pack = watchAudioPack('es-MX', complete);
    expect(Object.keys(pack?.parts ?? {}).some((key) => key.startsWith('reading.'))).toBe(false);
  });

  it('reads each chosen passage, or leaves silence to read it without a recording', () => {
    const pack = watchAudioPack('es-MX', complete, scripture({ 'joyful-1-annunciation': 'Lk 1:26-38' }));
    expect(pack?.parts['reading.joyful-1-annunciation']).toEqual([
      { file: 'reading.annunciation.mp3', minGapMs: 1500, pause: true, ref: 'Lk 1:26-38' },
    ]);
    expect(pack?.parts['reading.joyful-2-visitation']).toEqual([
      { file: 'silence.mp3', minGapMs: 20_000, pause: false, ref: expect.any(String) },
    ]);
    expect(pack?.files).toContain('reading.annunciation.mp3');
  });

  it('changes version when another passage is chosen', () => {
    const first = watchAudioPack('es-MX', complete, scripture());
    const next = watchAudioPack(
      'es-MX',
      complete,
      scripture(watchReadings('rotate', { 'luminous-1-baptism': 1 })),
    );
    expect(next?.version).not.toBe(first?.version);
  });

  it('needs no recording of a prayer the language has no text for', () => {
    const latin = structuredClone(complete);
    delete latin.tracks['fatima-prayer.leader'];
    delete latin.tracks['fatima-prayer.response'];
    const pack = watchAudioPack('la', latin);
    expect(pack).not.toBeNull();
    expect(pack?.parts['fatima-prayer']).toBeUndefined();
    expect(watchAudioPack('es-MX', latin)).toBeNull();
  });

  it('carries the three-virtues opening when its recordings are there', () => {
    const virtues = ['hail-mary-faith', 'hail-mary-hope', 'hail-mary-charity', 'trinity-salutation'];
    const withVirtues = manifestFor([
      ...Object.keys(complete.tracks),
      ...virtues.flatMap((key) => [`${key}.leader`, `${key}.response`]),
    ]);
    const pack = watchAudioPack('es-MX', withVirtues);
    for (const key of virtues) {
      expect(pack?.parts[key]?.length).toBeGreaterThan(0);
    }
    expect(pack?.parts['glory-be']).toEqual(watchAudioPack('es-MX', complete)?.parts['glory-be']);

    const without = watchAudioPack('es-MX', complete);
    expect(without).not.toBeNull();
    expect(without?.parts['hail-mary-faith']).toBeUndefined();
  });

  it('is null when a recording is missing', () => {
    expect(watchAudioPack('es-MX', manifestFor(['hail-mary.leader']))).toBeNull();
  });

  it('changes version when a recording changes', () => {
    const first = watchAudioPack('es-MX', complete);
    const changed = structuredClone(complete);
    changed.tracks['hail-mary.leader'] = { file: 'hail-mary.leader-new.mp3', durationMs: 1000 };
    expect(watchAudioPack('es-MX', changed)?.version).not.toBe(first?.version);
  });
});
