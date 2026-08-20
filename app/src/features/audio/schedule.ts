import type { Step } from '@rosario/engine';

import type { Settings } from '@/settings/store';

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
  /** Playback rate. Normal or slower: there is no fast mode (MC 47, RVM 12). */
  readonly rate: number;
  /** Breathing room over the spoken length of the response. */
  readonly responseFactor: number;
  /** Silence taken in the mystery after its announcement. */
  readonly announceMs: number;
};

export const defaultAudioSettings: AudioSettings = {
  rate: 1,
  responseFactor: 1.25,
  announceMs: 4000,
};

/** Small pause after a prayer nobody responds to. */
const GAP_MS = 1200;

/**
 * Minimum time an automatic Hail Mary takes, voice plus silence. A floor, never a
 * ceiling: nothing rewards going faster.
 */
export const AVE_FLOOR_MS = 12_000;

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
    let silence =
      response === undefined
        ? GAP_MS
        : Math.round((response.durationMs * settings.responseFactor) / settings.rate);
    if (step.prayer.id === 'ave-maria') {
      const spoken = Math.round(track.leader.durationMs / settings.rate);
      silence = Math.max(silence, AVE_FLOOR_MS - spoken);
    }
    return {
      kind: 'track',
      file: track.leader.file,
      silenceAfterMs: silence,
      ...(track.leader.lines === undefined ? {} : { lines: track.leader.lines }),
    };
  }
  if (step.kind === 'announce') {
    return { kind: 'silence', silenceAfterMs: settings.announceMs };
  }
  if (step.kind === 'silence') {
    return { kind: 'silence', silenceAfterMs: step.seconds * 1000 };
  }
  // reading and litany get their audio with tasks 032 and 043.
  return { kind: 'silence', silenceAfterMs: GAP_MS };
}

/** The person's pace choices, mapped to the guide's numbers. */
export function audioSettingsOf(settings: Settings): AudioSettings {
  return {
    rate: settings.audioPace === 'calm' ? 0.85 : 1,
    responseFactor: settings.responseSilence === 'long' ? 1.6 : 1.25,
    announceMs:
      settings.announcePause === 'long'
        ? 12_000
        : settings.announcePause === 'medium'
          ? 8000
          : 4000,
  };
}
