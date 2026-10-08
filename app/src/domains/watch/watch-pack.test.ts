import { describe, expect, it } from 'vitest';

import type { AudioManifest } from '../audio/queue';

import { watchAudioPack, watchSequence } from './watch-pack';

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
        { fatimaPrayer: true, litany: false, prayerForThePope: true },
      ).map((step) =>
        step.kind === 'announce' ? `announce.${step.mystery.id}` : step.kind === 'prayer' ? step.prayer : '',
      ),
    ),
  ),
];
const complete = manifestFor(
  keys.flatMap((key) => (key.startsWith('announce.') ? [key] : [`${key}.leader`, `${key}.response`])),
);

describe('watchAudioPack', () => {
  it('has no reading steps, which are not for the wrist', () => {
    expect(steps.some((step) => step.kind === 'reading')).toBe(false);
  });

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
