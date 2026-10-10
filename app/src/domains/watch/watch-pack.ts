import { hasPrayerText, mysteriesOf, mysteryRefsOf, openingFormsFor, type Locale } from '@sanctamaria/content';
import {
  buildSequence,
  chooseReading,
  mysterySets,
  type MysteryRef,
  type MysterySet,
  type OpeningForm,
  type ReadingPreference,
  type Scope,
  type Step,
} from '@sanctamaria/rosary';

import { buildQueue, type AudioManifest, type ManifestTrack, type QueuePart } from '../audio/queue';

export type WatchSequenceOptions = {
  fatimaPrayer: boolean;
  litany: boolean;
  prayerForThePope: boolean;
  /** A Gospel passage after each mystery is announced. */
  readings: boolean;
  /** The opening Hail Marys; the standard form when left out. */
  openingForm?: OpeningForm;
};

export const everyOptionalPrayer: WatchSequenceOptions = {
  fatimaPrayer: true,
  litany: true,
  prayerForThePope: true,
  readings: true,
};

/** Passage read for each mystery, by mystery id. */
export type WatchReadings = Record<string, string>;

/** The passage each mystery has before any is chosen: its primary one. */
export function defaultReadingRef(mystery: MysteryRef): string | null {
  const primary = mysteriesOf(mystery.set)
    .find((candidate) => candidate.id === mystery.id)
    ?.readings.find((reading) => reading.kind === 'primary');
  return primary?.ref ?? mystery.readings[0]?.ref ?? null;
}

/**
 * The sequence the watch prays: every optional prayer included by default and a reading
 * for each mystery (the watch drops the Fatima prayer, the litany, the prayer for the Pope
 * and the readings when they are off). Each mystery reads `readings[id]`, else its primary
 * passage.
 */
export function watchSequence(
  set: MysterySet,
  scope: Scope,
  options: WatchSequenceOptions = everyOptionalPrayer,
  readings: WatchReadings = {},
): Step[] {
  return buildSequence({
    set,
    mysteries: mysteryRefsOf(set),
    scope,
    opening: true,
    openingForm: options.openingForm ?? 'standard',
    readingFor: options.readings
      ? (mystery) => {
          const ref = readings[mystery.id] ?? defaultReadingRef(mystery);
          return mystery.readings.find((reading) => reading.ref === ref) ?? mystery.readings[0] ?? null;
        }
      : null,
    fatimaPrayer: options.fatimaPrayer,
    hailHolyQueen: true,
    litany: options.litany,
    prayerForThePope: options.prayerForThePope,
    closingPrayer: true,
  });
}

/**
 * The passage of every mystery the watch can pray, chosen as the phone would choose it
 * now: the preferred evangelist, or the next account in turn.
 */
export function watchReadings(gospel: ReadingPreference, counts: Record<string, number>): WatchReadings {
  const readings: WatchReadings = {};
  for (const set of mysterySets) {
    for (const mystery of mysteryRefsOf(set)) {
      const reading = chooseReading(mystery, gospel, counts[mystery.id] ?? 0);
      if (reading !== null) {
        readings[mystery.id] = reading.ref;
      }
    }
  }
  return readings;
}

/** Steps that sound the same share their audio: every Hail Mary, every Glory Be. */
export function audioKeyOf(step: Step): string {
  if (step.kind === 'announce') {
    return `announce.${step.mystery.id}`;
  }
  if (step.kind === 'reading') {
    return `reading.${step.mystery.id}`;
  }
  return step.prayer;
}

/** Pads the end of each step on the watch; it shares the recordings' format. */
export const watchSilenceFile = 'silence.mp3';

/**
 * `pause`: the gap stretches to the person's pause when that is longer than `minGapMs`.
 * `ref`: on a reading, the passage it reads.
 */
export type WatchAudioPart = { file: string; minGapMs: number; pause: boolean; ref?: string };

export type WatchAudioPack = {
  locale: string;
  /** Changes whenever any recording or gap changes, so the watch knows to replace it. */
  version: string;
  parts: Record<string, WatchAudioPart[]>;
  files: string[];
};

/** The Gospel read aloud for the pack: the chosen passages, their recordings and texts. */
export type WatchScripture = {
  readings: WatchReadings;
  track: (ref: string) => ManifestTrack | undefined;
  text: (ref: string) => string;
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
 * gaps that change are the ones the pause controls. With `scripture`, each mystery's
 * chosen passage is in it too, read aloud when it has a recording and otherwise silence
 * long enough to read it, as on the phone. A prayer the language has no text for (the
 * Fatima prayer in Latin) is never prayed in it, so it needs no recording. Null when the
 * pack is incomplete.
 */
export function watchAudioPack(
  locale: Locale,
  manifest: AudioManifest,
  scripture: WatchScripture | null = null,
): WatchAudioPack | null {
  const huge = 10_000_000;
  const timing = (pauseMs: number) => ({ pauseMs, responseGapMs: 450, afterAnnounceMs: 4000 });
  const options = {
    ...everyOptionalPrayer,
    fatimaPrayer: hasPrayerText('fatima-prayer', locale),
    readings: scripture !== null,
  };
  const text = scripture?.text ?? (() => '');
  const track = scripture?.track ?? (() => undefined);
  const parts: Record<string, WatchAudioPart[]> = {};
  const add = (steps: Step[], onlyNew = false): boolean => {
    const none = buildQueue(steps, manifest, timing(0), text, track);
    const long = buildQueue(steps, manifest, timing(huge), text, track);
    if (none === null || long === null) {
      return false;
    }
    steps.forEach((step, index) => {
      if (onlyNew && parts[audioKeyOf(step)] !== undefined) {
        return;
      }
      const short = none[index]?.parts ?? [];
      const stretched = long[index]?.parts ?? [];
      parts[audioKeyOf(step)] = short.map((part: QueuePart, partIndex) => {
        if (part.file === null && step.kind !== 'reading') {
          throw new Error(`Step ${step.id} has a silent part, which the watch does not expect`);
        }
        const pause = (stretched[partIndex]?.gapAfterMs ?? 0) >= huge;
        return {
          file: part.file ?? watchSilenceFile,
          minGapMs: part.gapAfterMs,
          pause,
          ...(step.kind === 'reading' ? { ref: step.reading.ref } : {}),
        };
      });
    });
    return true;
  };
  for (const set of mysterySets) {
    if (!add(watchSequence(set, { kind: 'full' }, options, scripture?.readings))) {
      return null;
    }
  }
  // Another form of the opening is only a few recordings more; without them the watch
  // prays the standard one.
  for (const openingForm of openingFormsFor(locale)) {
    if (openingForm !== 'standard') {
      add(watchSequence('joyful', { kind: 'full' }, { ...options, openingForm }, scripture?.readings), true);
    }
  }
  const files = [
    ...new Set([watchSilenceFile, ...Object.values(parts).flatMap((list) => list.map((part) => part.file))]),
  ].sort();
  const version = fnv1a(`${locale}\n${JSON.stringify(parts)}\n${files.join(',')}`);
  return { locale, version, parts, files };
}
