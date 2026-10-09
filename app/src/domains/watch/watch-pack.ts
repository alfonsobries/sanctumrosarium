import { mysteryRefsOf } from '@sanctamaria/content';
import { buildSequence, mysterySets, type MysterySet, type Scope, type Step } from '@sanctamaria/rosary';

import { buildQueue, type AudioManifest, type QueuePart } from '../audio/queue';

export type WatchSequenceOptions = { fatimaPrayer: boolean; litany: boolean; prayerForThePope: boolean };

export const everyOptionalPrayer: WatchSequenceOptions = {
  fatimaPrayer: true,
  litany: true,
  prayerForThePope: true,
};

/**
 * The sequence the watch prays: by default every optional prayer included (the watch
 * drops the Fatima prayer, the litany and the prayer for the Pope when they are off), the
 * standard opening Hail Marys and no Gospel readings, which are not for the wrist.
 */
export function watchSequence(
  set: MysterySet,
  scope: Scope,
  options: WatchSequenceOptions = everyOptionalPrayer,
): Step[] {
  return buildSequence({
    set,
    mysteries: mysteryRefsOf(set),
    scope,
    opening: true,
    openingForm: 'standard',
    readingFor: null,
    fatimaPrayer: options.fatimaPrayer,
    hailHolyQueen: true,
    litany: options.litany,
    prayerForThePope: options.prayerForThePope,
    closingPrayer: true,
  });
}

/** Steps that sound the same share their audio: every Hail Mary, every Glory Be. */
export function audioKeyOf(step: Step): string {
  if (step.kind === 'announce') {
    return `announce.${step.mystery.id}`;
  }
  if (step.kind === 'reading') {
    throw new Error('The watch sequence has no readings');
  }
  return step.prayer;
}

/** `pause`: the gap stretches to the person's pause when that is longer than `minGapMs`. */
/** Pads the end of each step on the watch; it shares the recordings' format. */
export const watchSilenceFile = 'silence.mp3';

export type WatchAudioPart = { file: string; minGapMs: number; pause: boolean };

export type WatchAudioPack = {
  locale: string;
  /** Changes whenever any recording or gap changes, so the watch knows to replace it. */
  version: string;
  parts: Record<string, WatchAudioPart[]>;
  files: string[];
};

function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * What the watch needs to play a language's pack, from the phone's queue rules. The pause
 * is chosen at runtime, so each gap is exported as a fixed minimum plus whether it
 * stretches to that pause: the queue is built with no pause and with a huge one, and the
 * gaps that change are the ones the pause controls. Null when the pack is incomplete.
 */
export function watchAudioPack(locale: string, manifest: AudioManifest): WatchAudioPack | null {
  const huge = 10_000_000;
  const timing = (pauseMs: number) => ({ pauseMs, responseGapMs: 450, afterAnnounceMs: 4000 });
  const parts: Record<string, WatchAudioPart[]> = {};
  for (const set of mysterySets) {
    const steps = watchSequence(set, { kind: 'full' });
    const none = buildQueue(steps, manifest, timing(0), () => '');
    const long = buildQueue(steps, manifest, timing(huge), () => '');
    if (none === null || long === null) {
      return null;
    }
    steps.forEach((step, index) => {
      const short = none[index]?.parts ?? [];
      const stretched = long[index]?.parts ?? [];
      parts[audioKeyOf(step)] = short.map((part: QueuePart, partIndex) => {
        if (part.file === null) {
          throw new Error(`Step ${step.id} has a silent part, which the watch does not expect`);
        }
        const pause = (stretched[partIndex]?.gapAfterMs ?? 0) >= huge;
        return { file: part.file, minGapMs: part.gapAfterMs, pause };
      });
    });
  }
  const files = [
    ...new Set([watchSilenceFile, ...Object.values(parts).flatMap((list) => list.map((part) => part.file))]),
  ].sort();
  const version = fnv1a(`${locale}\n${JSON.stringify(parts)}\n${files.join(',')}`);
  return { locale, version, parts, files };
}
