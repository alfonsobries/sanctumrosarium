import type { Step } from '@rosario/engine';

import type { AudioManifest, LineMark } from './types';

/**
 * What the guide does on one step: say its track and then hold the silence where the
 * person prays their part. The app does not pray for you (task 008): the leader half
 * plays, the response half only donates its duration to size the silence.
 */
export type StepAudioPlan =
  | {
      readonly kind: 'track';
      readonly file: string;
      readonly silenceAfterMs: number;
      readonly lines?: readonly LineMark[];
    }
  | { readonly kind: 'silence'; readonly silenceAfterMs: number };

export type AudioSettings = {
  /** Playback rate. The response silence stretches with it so nobody prays rushed. */
  readonly rate: number;
  /** Breathing room over the spoken length of the response. */
  readonly responseFactor: number;
};

export const defaultAudioSettings: AudioSettings = { rate: 1, responseFactor: 1.25 };

/** Silence to take in the mystery after its announcement. */
const ANNOUNCE_MS = 4000;
/** Small pause after a prayer nobody responds to. */
const GAP_MS = 1200;

export function planForStep(
  step: Step,
  manifest: AudioManifest,
  settings: AudioSettings,
): StepAudioPlan {
  if (step.kind === 'prayer') {
    const track = manifest.tracks[step.prayer.id];
    if (track === undefined) {
      return { kind: 'silence', silenceAfterMs: GAP_MS };
    }
    const response = track.response;
    const silence =
      response === undefined
        ? GAP_MS
        : Math.round((response.durationMs * settings.responseFactor) / settings.rate);
    return {
      kind: 'track',
      file: track.leader.file,
      silenceAfterMs: silence,
      ...(track.leader.lines === undefined ? {} : { lines: track.leader.lines }),
    };
  }
  if (step.kind === 'announce') {
    return { kind: 'silence', silenceAfterMs: ANNOUNCE_MS };
  }
  if (step.kind === 'silence') {
    return { kind: 'silence', silenceAfterMs: step.seconds * 1000 };
  }
  // reading and litany get their audio with tasks 032 and 043.
  return { kind: 'silence', silenceAfterMs: GAP_MS };
}
