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

const steps = buildRosary({
  form: 'roman',
  locale: 'es-MX',
  set: 'gloriosa',
  withReading: true,
  silenceSeconds: 10,
});
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
      silenceBeforeMs: 0,
      silenceAfterMs: 7500,
    });
  });

  it('stretches the response silence when the rate slows down', () => {
    const plan = planForStep(ave!, manifest, {
      ...defaultAudioSettings,
      rate: 0.8,
    });
    expect(plan).toEqual({
      kind: 'track',
      file: 'ave-maria.leader.mp3',
      silenceBeforeMs: 0,
      silenceAfterMs: 9375,
    });
  });

  it('uses a short gap after a prayer without response', () => {
    const plan = planForStep(sign!, manifest, defaultAudioSettings);
    expect(plan).toEqual({
      kind: 'track',
      file: 'signum-crucis.leader.mp3',
      silenceBeforeMs: 0,
      silenceAfterMs: 1200,
    });
  });

  it('holds a contemplative pause on the announcement, as configured', () => {
    const plan = planForStep(announce!, manifest, {
      ...defaultAudioSettings,
      announceMs: 8000,
    });
    expect(plan).toEqual({ kind: 'silence', silenceAfterMs: 8000 });
  });

  it('an automatic Hail Mary never goes under the floor', () => {
    const quick: AudioManifest = {
      ...manifest,
      tracks: {
        'ave-maria': {
          leader: { file: 'ave-maria.leader.mp3', durationMs: 3000 },
          response: { file: 'ave-maria.response.mp3', durationMs: 2000 },
        },
      },
    };
    const plan = planForStep(ave!, quick, defaultAudioSettings);
    expect(plan.kind).toBe('track');
    if (plan.kind === 'track') {
      expect(3000 + plan.silenceAfterMs).toBeGreaterThanOrEqual(12_000);
    }
  });

  it('the automatic mode never skips the response silence', () => {
    const plan = planForStep(ave!, manifest, { ...defaultAudioSettings, rate: 0.85 });
    expect(plan.kind === 'track' && plan.silenceAfterMs > 0).toBe(true);
  });

  it('answering role holds your call first and then plays the response', () => {
    const plan = planForStep(ave!, manifest, {
      ...defaultAudioSettings,
      choirRole: 'respond',
    });
    expect(plan.kind).toBe('track');
    if (plan.kind === 'track') {
      expect(plan.file).toBe('ave-maria.response.mp3');
      expect(plan.silenceBeforeMs).toBe(10_000);
      expect(plan.lineOffset).toBe(ave!.kind === 'prayer' ? ave!.prayer.responseFrom : 0);
    }
  });

  it('answering role leaves a whole prayer without response to the person', () => {
    const plan = planForStep(sign!, manifest, {
      ...defaultAudioSettings,
      choirRole: 'respond',
    });
    expect(plan).toEqual({ kind: 'silence', silenceAfterMs: 6200 });
  });

  it('answering role keeps the Hail Mary floor', () => {
    const quick: AudioManifest = {
      ...manifest,
      tracks: {
        'ave-maria': {
          leader: { file: 'ave-maria.leader.mp3', durationMs: 3000 },
          response: { file: 'ave-maria.response.mp3', durationMs: 2000 },
        },
      },
    };
    const plan = planForStep(ave!, quick, {
      ...defaultAudioSettings,
      choirRole: 'respond',
    });
    expect(plan.kind).toBe('track');
    if (plan.kind === 'track') {
      expect(plan.silenceBeforeMs + 2000 + plan.silenceAfterMs).toBeGreaterThanOrEqual(
        12_000,
      );
    }
  });

  it('listen mode says both halves and keeps the floor', () => {
    const latin: AudioManifest = { ...manifest, locale: 'la' };
    const plan = planForStep(ave!, latin, {
      ...defaultAudioSettings,
      latinListen: ['ave-maria'],
    });
    expect(plan.kind).toBe('track');
    if (plan.kind === 'track') {
      expect(plan.file).toBe('ave-maria.leader.mp3');
      expect(plan.follow?.file).toBe('ave-maria.response.mp3');
      expect(8000 + 6000 + plan.silenceAfterMs).toBeGreaterThanOrEqual(12_000);
    }
  });

  it('listen mode only applies to a Latin manifest', () => {
    const plan = planForStep(ave!, manifest, {
      ...defaultAudioSettings,
      latinListen: ['ave-maria'],
    });
    expect(plan.kind === 'track' && plan.follow === undefined).toBe(true);
  });

  it('holds a long quiet on the reading, and the chosen seconds on the silence', () => {
    const reading = steps.find((step) => step.kind === 'reading');
    const silence = steps.find((step) => step.kind === 'silence');
    expect(planForStep(reading!, manifest, defaultAudioSettings)).toEqual({
      kind: 'silence',
      silenceAfterMs: 20_000,
    });
    expect(planForStep(silence!, manifest, defaultAudioSettings)).toEqual({
      kind: 'silence',
      silenceAfterMs: 10_000,
    });
  });

  it('keeps praying in silence when a track is missing', () => {
    const empty: AudioManifest = { ...manifest, tracks: {} };
    const plan = planForStep(ave!, empty, defaultAudioSettings);
    expect(plan.kind).toBe('silence');
  });
});
