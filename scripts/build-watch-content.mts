/**
 * Exports what the Apple Watch prays, bundled in the watch app, so Swift reads data
 * instead of re-implementing the content rules: each set as a complete Rosary and as each
 * single decade (every optional prayer included; the watch drops the Fatima prayer, the
 * litany and the prayer for the Pope when they are off), the weekday calendar, and per locale the prayer and
 * mystery texts. Audio is not bundled: the phone sends the chosen language's pack.
 *
 * Run after content changes: pnpm watch:content
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
  decadesCompleted,
  mysterySetFor,
  mysterySets,
  type MysterySet,
  type Step,
} from '../packages/rosary/src/index';
import { beadState } from '../app/src/domains/prayer/bead-state';
import { audioKeyOf, watchSequence, type WatchSequenceOptions } from '../app/src/domains/watch/watch-pack';

const root = join(import.meta.dirname, '..');
const outDir = join(root, 'app/targets/watch/assets/content');

/** Whether the watch keeps a step, given the options; mirrored in PrayerSession.swift. */
function keeps(step: Step, options: WatchSequenceOptions): boolean {
  if (step.kind !== 'prayer') {
    return true;
  }
  if (step.prayer === 'fatima-prayer') {
    return options.fatimaPrayer;
  }
  if (step.prayer === 'litany-of-loreto') {
    return options.litany;
  }
  if (step.intention === 'pope') {
    return options.prayerForThePope;
  }
  return true;
}

/**
 * The watch filters optional prayers out of the full sequence; check that this always
 * gives exactly what the engine builds with those options off.
 */
function assertFilterMatchesEngine(set: MysterySet, full: Step[]): void {
  for (const fatimaPrayer of [true, false]) {
    for (const litany of [true, false]) {
      for (const prayerForThePope of [true, false]) {
        const options = { fatimaPrayer, litany, prayerForThePope };
        const expected = watchSequence(set, { kind: 'full' }, options).map((step) => step.id);
        const filtered = full.filter((step) => keeps(step, options)).map((step) => step.id);
        if (JSON.stringify(expected) !== JSON.stringify(filtered)) {
          throw new Error(`Filtered ${set} sequence differs from the engine: ${JSON.stringify(options)}`);
        }
      }
    }
  }
}

function exportSteps(steps: Step[]) {
  return steps.map((step, index) => ({
    id: step.id,
    kind: step.kind,
    prayer: step.kind === 'prayer' ? step.prayer : null,
    section: step.section,
    decade: step.decade,
    mystery: step.kind === 'prayer' ? null : step.mystery.id,
    count: step.kind === 'prayer' ? step.count : null,
    intention: step.kind === 'prayer' ? (step.intention ?? null) : null,
    ring: beadState(steps, index),
    decadesBefore: decadesCompleted(steps, index),
    audio: audioKeyOf(step),
  }));
}

function exportSet(set: MysterySet) {
  const steps = watchSequence(set, { kind: 'full' });
  assertFilterMatchesEngine(set, steps);
  return {
    id: set,
    mysteries: mysteriesOf(set).map((mystery) => mystery.id),
    steps: exportSteps(steps),
    decades: [1, 2, 3, 4, 5].map((decade) => exportSteps(watchSequence(set, { kind: 'decade', decade }))),
  };
}

/** Weekday (0 Sunday) to set, from the engine's calendar. 2023-01-01 was a Sunday. */
function weekdays(): MysterySet[] {
  return Array.from({ length: 7 }, (_, weekday) => mysterySetFor({ year: 2023, month: 1, day: 1 + weekday }));
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
        lines: pairs.map((pair) => `${pair.call} ${pair.response}`),
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

  return { version: 1, locale, setTitles, mysteries, prayers };
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

  const sets = Object.fromEntries(
    mysterySets.map((set) => [set, watchSequence(set, { kind: 'full' })]),
  ) as Record<MysterySet, Step[]>;

  const rosary = { version: 1, weekdays: weekdays(), sets: mysterySets.map(exportSet) };
  writeFileSync(join(outDir, 'rosary.json'), `${JSON.stringify(rosary)}\n`);
  console.log(`rosary.json: ${rosary.sets.length} sets, ${rosary.sets[0]?.steps.length} steps each`);

  for (const locale of locales) {
    const data = exportLocale(locale, sets);
    writeFileSync(join(outDir, `${locale}.json`), `${JSON.stringify(data)}\n`);
    console.log(`${locale}.json: ${Object.keys(data.prayers).length} prayers`);
  }
}

main();
