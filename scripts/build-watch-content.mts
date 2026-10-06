/**
 * Exports what the Apple Watch prays, so Swift reads data instead of re-implementing the
 * content rules: the four sets as complete step sequences (with every optional prayer
 * included; the watch drops the Fatima prayer and the litany when they are off), the
 * weekday calendar, and per locale the prayer and mystery texts plus the audio parts of
 * each step, built with the same queue rules as the phone.
 *
 * Run after content or audio packs change: pnpm watch:content
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  hasPrayerText,
  litany,
  locales,
  mysteriesOf,
  mysteryRefsOf,
  mysteryTitle,
  passage,
  prayerText,
  prayerTitle,
  type Locale,
} from '../content/src/index';
import {
  buildSequence,
  decadesCompleted,
  mysterySetFor,
  mysterySets,
  type MysterySet,
  type Step,
} from '../packages/rosary/src/index';
import { buildQueue, type AudioManifest, type QueuePart } from '../app/src/domains/audio/queue';
import { beadRingState } from '../app/src/domains/prayer/bead-state';

const root = join(import.meta.dirname, '..');
const audioRoot = join(root, 'app/assets/audio');
const outDir = join(root, 'app/targets/watch/assets/content');

const allOptions = { fatimaPrayer: true, litany: true };

function sequenceFor(set: MysterySet, options: { fatimaPrayer: boolean; litany: boolean }): Step[] {
  return buildSequence({
    set,
    mysteries: mysteryRefsOf(set),
    scope: { kind: 'full' },
    opening: true,
    readingFor: null,
    fatimaPrayer: options.fatimaPrayer,
    hailHolyQueen: true,
    litany: options.litany,
    closingPrayer: true,
  });
}

function audioKeyOf(step: Step): string {
  if (step.kind === 'announce') {
    return `announce.${step.mystery.id}`;
  }
  if (step.kind === 'reading') {
    throw new Error('The watch sequence has no readings');
  }
  return step.prayer;
}

/**
 * The watch filters optional prayers out of the full sequence; check that this always
 * gives exactly what the engine builds with those options off.
 */
function assertFilterMatchesEngine(set: MysterySet, full: Step[]): void {
  for (const fatimaPrayer of [true, false]) {
    for (const withLitany of [true, false]) {
      const expected = sequenceFor(set, { fatimaPrayer, litany: withLitany }).map((step) => step.id);
      const filtered = full
        .filter((step) => step.kind !== 'prayer' || fatimaPrayer || step.prayer !== 'fatima-prayer')
        .filter((step) => step.kind !== 'prayer' || withLitany || step.prayer !== 'litany-of-loreto')
        .map((step) => step.id);
      if (JSON.stringify(expected) !== JSON.stringify(filtered)) {
        throw new Error(
          `Filtered ${set} sequence differs from the engine (fatima ${fatimaPrayer}, litany ${withLitany})`,
        );
      }
    }
  }
}

function exportSet(set: MysterySet) {
  const steps = sequenceFor(set, allOptions);
  assertFilterMatchesEngine(set, steps);
  return {
    id: set,
    mysteries: mysteriesOf(set).map((mystery) => mystery.id),
    steps: steps.map((step, index) => ({
      id: step.id,
      kind: step.kind,
      prayer: step.kind === 'prayer' ? step.prayer : null,
      section: step.section,
      decade: step.decade,
      mystery: step.kind === 'prayer' ? null : step.mystery.id,
      count: step.kind === 'prayer' ? step.count : null,
      ring: beadRingState(steps, index),
      decadesBefore: decadesCompleted(steps, index),
      audio: audioKeyOf(step),
    })),
  };
}

/** Weekday (0 Sunday) to set, from the engine's calendar. 2023-01-01 was a Sunday. */
function weekdays(): MysterySet[] {
  return Array.from({ length: 7 }, (_, weekday) => mysterySetFor({ year: 2023, month: 1, day: 1 + weekday }));
}

function readManifest(locale: Locale): AudioManifest | null {
  const path = join(audioRoot, locale, 'manifest.json');
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as AudioManifest) : null;
}

type WatchPart = { file: string; minGapMs: number; pause: boolean };

/**
 * Audio parts per step, from the phone's queue rules. The person's pause is chosen on the
 * phone at runtime, so each gap is exported as a fixed minimum plus whether it stretches
 * to that pause: the queue is built with no pause and with a huge one, and the gaps that
 * change are the ones the pause controls.
 */
function exportAudio(locale: Locale, sets: Record<MysterySet, Step[]>): Record<string, WatchPart[]> | null {
  const manifest = readManifest(locale);
  if (manifest === null) {
    return null;
  }
  const huge = 10_000_000;
  const timing = (pauseMs: number) => ({ pauseMs, responseGapMs: 450, afterAnnounceMs: 4000 });
  const parts: Record<string, WatchPart[]> = {};
  for (const set of mysterySets) {
    const steps = sets[set];
    const none = buildQueue(steps, manifest, timing(0), () => '');
    const long = buildQueue(steps, manifest, timing(huge), () => '');
    if (none === null || long === null) {
      console.warn(`  ${locale}: audio pack is incomplete, the watch prays it without audio`);
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
  return parts;
}

function exportLocale(locale: Locale, sets: Record<MysterySet, Step[]>) {
  const prayerIds = [
    ...new Set(
      Object.values(sets)
        .flat()
        .flatMap((step) => (step.kind === 'prayer' ? [step.prayer] : [])),
    ),
  ];
  const prayers: Record<string, { title: string; lines: string[]; responseFrom: number | null }> = {};
  for (const id of prayerIds) {
    if (!hasPrayerText(id, locale)) {
      continue;
    }
    if (id === 'litany-of-loreto') {
      const pairs = litany(locale).pairs;
      prayers[id] = {
        title: prayerTitle(id, locale),
        lines: pairs.slice(0, 1).map((pair) => `${pair.call} ${pair.response}`),
        responseFrom: null,
      };
      continue;
    }
    const text = prayerText(id, locale);
    prayers[id] = { title: prayerTitle(id, locale), lines: text.lines, responseFrom: text.responseFrom };
  }

  const setTitles = Object.fromEntries(mysterySets.map((set) => [set, setTitle(set, locale)])) as Record<
    MysterySet,
    string
  >;

  const mysteries = Object.fromEntries(
    mysterySets.flatMap((set) =>
      mysteriesOf(set).map((mystery) => {
        const primary = mystery.readings.find((reading) => reading.kind === 'primary') ?? mystery.readings[0];
        const reading =
          primary === undefined ? null : (passage(primary.ref, locale)?.displayRef ?? primary.ref);
        return [mystery.id, { title: mysteryTitle(mystery.id, locale), reading }];
      }),
    ),
  );

  return { version: 1, locale, setTitles, mysteries, prayers, audio: exportAudio(locale, sets) };
}

type SetFile = { sets: { id: MysterySet; titles: Partial<Record<Locale, string>> }[] };
const setFile = JSON.parse(readFileSync(join(root, 'content/mysteries.json'), 'utf8')) as SetFile;

function setTitle(set: MysterySet, locale: Locale): string {
  const titles = setFile.sets.find((candidate) => candidate.id === set)?.titles ?? {};
  const fallback = locale === 'es-MX' ? 'es-ES' : locale === 'es-ES' ? 'es-MX' : locale;
  return titles[locale] ?? titles[fallback] ?? set;
}

function main(): void {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const sets = Object.fromEntries(mysterySets.map((set) => [set, sequenceFor(set, allOptions)])) as Record<
    MysterySet,
    Step[]
  >;

  const rosary = { version: 1, weekdays: weekdays(), sets: mysterySets.map(exportSet) };
  writeFileSync(join(outDir, 'rosary.json'), `${JSON.stringify(rosary)}\n`);
  console.log(`rosary.json: ${rosary.sets.length} sets, ${rosary.sets[0]?.steps.length} steps each`);

  for (const locale of locales) {
    const data = exportLocale(locale, sets);
    writeFileSync(join(outDir, `${locale}.json`), `${JSON.stringify(data)}\n`);
    console.log(
      `${locale}.json: ${Object.keys(data.prayers).length} prayers, audio ${data.audio === null ? 'none' : 'yes'}`,
    );
  }
}

main();
