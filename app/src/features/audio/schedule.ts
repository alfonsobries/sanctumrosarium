import type { Step } from '@rosario/engine';

import type { Settings } from '@/settings/store';

import type { AudioManifest, LineMark } from './types';

/**
 * What the guide does on one step: hold the silence for the part that is yours, say its
 * own, and hold again while you close. The app never prays your half (task 008): a half
 * that is not played only donates its duration to size the silence.
 */
export type StepAudioPlan =
  | {
      readonly kind: 'track';
      readonly file: string;
      /** Silence held before speaking: your call, when the app answers. */
      readonly silenceBeforeMs: number;
      readonly silenceAfterMs: number;
      readonly lines?: readonly LineMark[];
      /** Lines the played half skips: the highlight lands on the right line of the full text. */
      readonly lineOffset?: number;
    }
  | { readonly kind: 'silence'; readonly silenceAfterMs: number };

export type AudioSettings = {
  /** Playback rate. Normal or slower: there is no fast mode (MC 47, RVM 12). */
  readonly rate: number;
  /** Breathing room over the spoken length of the half the person prays. */
  readonly responseFactor: number;
  /** Silence taken in the mystery after its announcement. */
  readonly announceMs: number;
  /** Who leads the two choirs: the app calls and you answer, or the reverse (Rosa 46). */
  readonly choirRole: 'guide' | 'respond';
};

export const defaultAudioSettings: AudioSettings = {
  rate: 1,
  responseFactor: 1.25,
  announceMs: 4000,
  choirRole: 'guide',
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
    if (settings.choirRole === 'respond' && response !== undefined) {
      // You call: silence sized to the leader half, then the app answers.
      const call = Math.round(
        (track.leader.durationMs * settings.responseFactor) / settings.rate,
      );
      let after = GAP_MS;
      if (step.prayer.id === 'ave-maria') {
        const spoken = Math.round(response.durationMs / settings.rate);
        after = Math.max(GAP_MS, AVE_FLOOR_MS - call - spoken);
      }
      return {
        kind: 'track',
        file: response.file,
        silenceBeforeMs: call,
        silenceAfterMs: after,
        ...(response.lines === undefined ? {} : { lines: response.lines }),
        ...(step.prayer.responseFrom === undefined
          ? {}
          : { lineOffset: step.prayer.responseFrom }),
      };
    }
    if (settings.choirRole === 'respond') {
      // A prayer with no response half is all yours: the guide only keeps the time.
      const whole = Math.round(
        (track.leader.durationMs * settings.responseFactor) / settings.rate,
      );
      return { kind: 'silence', silenceAfterMs: whole + GAP_MS };
    }
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
      silenceBeforeMs: 0,
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
    choirRole: settings.choirRole,
  };
}
