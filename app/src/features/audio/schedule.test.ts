import { buildRosary } from '@rosario/engine';
import { describe, expect, it } from 'vitest';

import { defaultAudioSettings, planForStep } from './schedule';
import type { AudioManifest } from './types';

const manifest: AudioManifest = {
  version: 1,
  locale: 'es-MX',
  voice: 'test',
  provisional: true,
  tracks: {
    'ave-maria': {
      leader: { file: 'ave-maria.leader.mp3', durationMs: 8000 },
      response: { file: 'ave-maria.response.mp3', durationMs: 6000 },
    },
    'signum-crucis': {
      leader: { file: 'signum-crucis.leader.mp3', durationMs: 4000 },
    },
  },
};

const steps = buildRosary({ form: 'roman', locale: 'es-MX', set: 'gloriosa' });
const ave = steps.find(
  (step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria',
);
const sign = steps.find(
  (step) => step.kind === 'prayer' && step.prayer.id === 'signum-crucis',
);
const announce = steps.find((step) => step.kind === 'announce');

describe('planForStep', () => {
  it('plays the leader half and sizes the silence from the response', () => {
    const plan = planForStep(ave!, manifest, defaultAudioSettings);
    expect(plan).toEqual({
      kind: 'track',
      file: 'ave-maria.leader.mp3',
      silenceAfterMs: 7500,
    });
  });

  it('stretches the response silence when the rate slows down', () => {
    const plan = planForStep(ave!, manifest, { rate: 0.8, responseFactor: 1.25 });
    expect(plan).toEqual({
      kind: 'track',
      file: 'ave-maria.leader.mp3',
      silenceAfterMs: 9375,
    });
  });

  it('uses a short gap after a prayer without response', () => {
    const plan = planForStep(sign!, manifest, defaultAudioSettings);
    expect(plan).toEqual({
      kind: 'track',
      file: 'signum-crucis.leader.mp3',
      silenceAfterMs: 1200,
    });
  });

  it('holds a contemplative pause on the announcement', () => {
    const plan = planForStep(announce!, manifest, defaultAudioSettings);
    expect(plan.kind).toBe('silence');
  });

  it('keeps praying in silence when a track is missing', () => {
    const empty: AudioManifest = { ...manifest, tracks: {} };
    const plan = planForStep(ave!, empty, defaultAudioSettings);
    expect(plan.kind).toBe('silence');
  });
});
