import { auxiliumFor, type AuxiliumSection } from '@sanctamaria/content';
import { describe, expect, it } from 'vitest';

import type { AudioManifest } from '@/domains/audio/queue';

import { buildAuxiliumQueue, type AuxiliumManifest } from './queue';

const timing = { pauseMs: 1000, responseGapMs: 450, afterAnnounceMs: 4000 };
const track = (file: string) => ({ file, durationMs: 1000 });

const rosary: AudioManifest = {
  version: 1,
  locale: 'es-MX',
  litanyResponses: [],
  tracks: {
    'our-father.leader': track('of-l'),
    'our-father.response': track('of-r'),
  },
};

const sections: AuxiliumSection[] = [
  { id: 'opening', blocks: [{ kind: 'versicle', call: 'V', response: 'R' }] },
  { id: 'our-father', blocks: [{ kind: 'prayer', prayer: 'our-father' }] },
  {
    id: 'invocations',
    blocks: [
      {
        kind: 'litany',
        items: [{ call: 'Kyrie' }, { call: 'A', response: 'ora' }, { call: 'B', response: 'ora' }],
      },
    ],
  },
  {
    id: 'conclusion',
    blocks: [
      { kind: 'text', text: 'Oremos.', lead: true },
      { kind: 'text', text: 'T', response: 'Amén.' },
    ],
  },
];

const manifest: AuxiliumManifest = {
  tracks: {
    'opening.0.call': track('v'),
    'opening.0.response': track('r'),
    'invocations.0.0.call': track('k'),
    'invocations.0.1.call': track('a'),
    'invocations.0.1.response': track('ora'),
    'invocations.0.2.call': track('b'),
    'invocations.0.2.response': track('ora'),
    'conclusion.0.text': track('lead'),
    'conclusion.1.text': track('t'),
    'conclusion.1.response': track('amen'),
  },
};

describe('buildAuxiliumQueue', () => {
  it('plays one step per section, in order', () => {
    const queue = buildAuxiliumQueue(sections, manifest, rosary, timing);
    expect(queue?.map((step) => step.id)).toEqual([
      'auxilium.opening',
      'auxilium.our-father',
      'auxilium.invocations',
      'auxilium.conclusion',
    ]);
  });

  it('answers each call and rests after the last one', () => {
    const litany = buildAuxiliumQueue(sections, manifest, rosary, timing)?.[2];
    expect(litany?.parts.map((p) => [p.file, p.gapAfterMs])).toEqual([
      ['k', 400],
      ['a', 250],
      ['ora', 400],
      ['b', 250],
      ['ora', 1000],
    ]);
  });

  it('takes the Our Father from the Rosary recordings', () => {
    const step = buildAuxiliumQueue(sections, manifest, rosary, timing)?.[1];
    expect(step?.parts.map((p) => p.file)).toEqual(['of-l', 'of-r']);
  });

  it('gives up when a recording is missing, so the screen stays silent instead of skipping words', () => {
    const { 'conclusion.1.response': _missing, ...tracks } = manifest.tracks;
    expect(buildAuxiliumQueue(sections, { tracks }, rosary, timing)).toBeNull();
  });

  it('covers a real day of the booklet when every key exists', () => {
    const day = auxiliumFor('es-MX', 1);
    const keys = new Proxy({} as AuxiliumManifest['tracks'], { get: (_, key) => track(String(key)) });
    const full: AudioManifest = {
      ...rosary,
      tracks: new Proxy({}, { get: (_, key) => track(String(key)) }) as AudioManifest['tracks'],
    };
    expect(buildAuxiliumQueue(day, { tracks: keys }, full, timing)).toHaveLength(day.length);
  });
});
