import type { Step } from '@rosario/engine';

import type { Settings } from '@/settings/store';

import type { AudioManifest, LineMark } from './types';

/**
 * What the guide does on one step: hold the silence for the part that is yours, say its
 * own, and hold again while you close. The guide only prays your half when the listen
 * mode of learning Latin asks for both (task 024); otherwise an unplayed half donates
 * its duration to size the silence (task 008).
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
      /** Second half said right after the first: the listen mode of learning Latin. */
      readonly follow?: {
        readonly file: string;
        readonly lines?: readonly LineMark[];
        readonly lineOffset?: number;
      };
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
  /** Learning Latin, the prayers whose two halves the guide says in full (task 024).
      Only read on a Latin manifest; reading and memory keep the normal halves. */
  readonly latinListen?: readonly string[];
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

/** Quiet the guide holds on a reading step, enough to open the passage and hear it. */
export const READING_MS = 20_000;

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
    if (
      manifest.locale === 'la' &&
      response !== undefined &&
      settings.latinListen?.includes(step.prayer.id) === true
    ) {
      // Listening to learn: the guide says both halves; nobody is waited on.
      const spoken = Math.round(
        (track.leader.durationMs + response.durationMs) / settings.rate,
      );
      const after =
        step.prayer.id === 'ave-maria' ? Math.max(GAP_MS, AVE_FLOOR_MS - spoken) : GAP_MS;
      return {
        kind: 'track',
        file: track.leader.file,
        silenceBeforeMs: 0,
        silenceAfterMs: after,
        ...(track.leader.lines === undefined ? {} : { lines: track.leader.lines }),
        follow: {
          file: response.file,
          ...(response.lines === undefined ? {} : { lines: response.lines }),
          ...(step.prayer.responseFrom === undefined
            ? {}
            : { lineOffset: step.prayer.responseFrom }),
        },
      };
    }
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
  if (step.kind === 'reading') {
    // No voice reads the passage while the translation licence is open (decision 10):
    // the guide holds enough quiet to read the reference in one's own Bible.
    return { kind: 'silence', silenceAfterMs: READING_MS };
  }
  // The litany gets its audio with task 043.
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
    latinListen: Object.entries(settings.latinLearn)
      .filter(([, mode]) => mode === 'listen')
      .map(([prayer]) => prayer),
  };
}
