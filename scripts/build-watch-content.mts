/**
 * Exports what the Apple Watch prays, bundled in the watch app, so Swift reads data
 * instead of re-implementing the content rules: each set as a complete Rosary and as each
 * single decade (every optional step included; the watch drops the Fatima prayer, the
 * litany, the prayer for the Pope and the Gospel readings when they are off) with its
 * opening in each other form of the opening Hail Marys, the weekday
 * calendar, the voice speeds offered, per locale the prayer and mystery texts, per
 * translation the Gospel passages, and a small square image per mystery for the Now
 * Playing cover. Audio is not bundled: the phone sends the chosen language's pack, with
 * the recordings of the passages it chose.
 *
 * Run after content changes: pnpm watch:content
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

import {
  hasPrayerText,
  litany,
  locales,
  mysteriesOf,
  mysteryRefsOf,
  mysteryTitle,
  passage,
  passagesOf,
  prayerText,
  prayerTitle,
  type Locale,
} from '../content/src/index';
import {
  decadesCompleted,
  mysterySetFor,
  mysterySets,
  openingFormPrayers,
  openingForms,
  type MysterySet,
  type Step,
} from '../packages/rosary/src/index';
import { coverMysteries } from '../app/src/domains/audio/now-playing';
import { readingSilenceMs } from '../app/src/domains/audio/queue';
import { beadState } from '../app/src/domains/prayer/bead-state';
import { rates } from '../app/src/domains/settings/settings';
import {
  audioKeyOf,
  everyOptionalPrayer,
  watchSequence,
  type WatchSequenceOptions,
} from '../app/src/domains/watch/watch-pack';

const root = join(import.meta.dirname, '..');
const outDir = join(root, 'app/targets/watch/assets/content');
const artworkDir = join(root, 'app/targets/watch/assets/artwork');

/**
 * The phone's artwork set the watch covers come from; any set whose images are keyed by
 * mystery id works, falling back to the classic paintings for a mystery it lacks.
 */
const artworkSet: 'classic' | 'glass' | 'guadalupana' | 'trazo' | 'kids' = 'classic';
const artworkSide = 300;

/** Source image of each mystery in the classic set, read from the phone's artwork table. */
function classicArtwork(): Record<string, string> {
  const table = readFileSync(join(root, 'app/src/domains/artwork/artworks.ts'), 'utf8');
  const pattern = /'([a-z0-9-]+)': \{\s*source: require\('@\/assets\/mysteries\/([^']+)'\)/g;
  return Object.fromEntries([...table.matchAll(pattern)].map((match) => [match[1], match[2]]));
}

/** One small square JPEG per mystery, named by mystery id, for the Now Playing cover. */
async function exportArtwork(): Promise<void> {
  rmSync(artworkDir, { recursive: true, force: true });
  mkdirSync(artworkDir, { recursive: true });
  const classic = classicArtwork();
  const ids = mysterySets.flatMap((set) => mysteriesOf(set).map((mystery) => mystery.id));
  let bytes = 0;
  for (const id of ids) {
    const own = join(root, 'app/assets/mysteries', artworkSet, `${id}.jpg`);
    const fallback = classic[id] === undefined ? null : join(root, 'app/assets/mysteries', classic[id]);
    const source = artworkSet !== 'classic' && existsSync(own) ? own : fallback;
    if (source === null) {
      throw new Error(`No artwork for ${id}`);
    }
    const info = await sharp(source)
      .resize(artworkSide, artworkSide, { fit: 'cover', position: 'attention' })
      .toColorspace('srgb')
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(join(artworkDir, `${id}.jpg`));
    bytes += info.size;
  }
  console.log(`artwork: ${ids.length} covers, ${Math.round(bytes / 1024)} KB`);
}

/** Whether the watch keeps a step, given the options; mirrored in PrayerSession.swift. */
function keeps(step: Step, options: WatchSequenceOptions): boolean {
  if (step.kind === 'reading') {
    return options.readings;
  }
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
 * The watch filters optional steps out of the full sequence and keeps each step's
 * exported ring and count; check that this always gives exactly what the engine builds
 * with those options off.
 */
function assertFilterMatchesEngine(set: MysterySet, full: Step[]): void {
  const exported = exportSteps(full);
  for (const fatimaPrayer of [true, false]) {
    for (const litany of [true, false]) {
      for (const prayerForThePope of [true, false]) {
        for (const readings of [true, false]) {
          const options = { fatimaPrayer, litany, prayerForThePope, readings };
          const expected = exportSteps(watchSequence(set, { kind: 'full' }, options));
          const filtered = exported.filter((_, index) => keeps(full[index] as Step, options));
          const shape = (steps: ReturnType<typeof exportSteps>) =>
            JSON.stringify(steps.map(({ id, ring, decadesBefore }) => ({ id, ring, decadesBefore })));
          if (shape(expected) !== shape(filtered)) {
            throw new Error(`Filtered ${set} sequence differs from the engine: ${JSON.stringify(options)}`);
          }
        }
      }
    }
  }
}

function exportSteps(steps: Step[]) {
  const covers = coverMysteries(steps);
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
    cover: covers[index] ?? null,
    /** On a reading, the passage it reads until the phone chooses one. */
    reading: step.kind === 'reading' ? step.reading.ref : null,
  }));
}

/**
 * The opening section of the whole Rosary in each other form of the opening Hail Marys.
 * The watch swaps it in for the standard opening; check that doing so gives exactly the
 * sequence the engine builds in that form.
 */
function exportOpenings(set: MysterySet, standard: ReturnType<typeof exportSteps>) {
  const openings: Record<string, ReturnType<typeof exportSteps>> = {};
  for (const openingForm of openingForms) {
    if (openingForm === 'standard') {
      continue;
    }
    const full = exportSteps(watchSequence(set, { kind: 'full' }, { ...everyOptionalPrayer, openingForm }));
    const opening = full.filter((step) => step.section === 'opening');
    const spliced = [...opening, ...standard.filter((step) => step.section !== 'opening')];
    if (JSON.stringify(spliced) !== JSON.stringify(full)) {
      throw new Error(`The ${openingForm} opening of ${set} does not splice into the standard sequence`);
    }
    openings[openingForm] = opening;
  }
  return openings;
}

function exportSet(set: MysterySet) {
  const steps = watchSequence(set, { kind: 'full' });
  assertFilterMatchesEngine(set, steps);
  const exported = exportSteps(steps);
  return {
    id: set,
    mysteries: mysteriesOf(set).map((mystery) => mystery.id),
    steps: exported,
    openings: exportOpenings(set, exported),
    decades: [1, 2, 3, 4, 5].map((decade) => exportSteps(watchSequence(set, { kind: 'decade', decade }))),
  };
}

/** Weekday (0 Sunday) to set, from the engine's calendar. 2023-01-01 was a Sunday. */
function weekdays(): MysterySet[] {
  return Array.from({ length: 7 }, (_, weekday) => mysterySetFor({ year: 2023, month: 1, day: 1 + weekday }));
}

function exportLocale(locale: Locale, sets: Record<MysterySet, Step[]>) {
  const prayerIds = [
    ...new Set([
      ...Object.values(sets)
        .flat()
        .flatMap((step) => (step.kind === 'prayer' ? [step.prayer] : [])),
      ...openingForms.flatMap(openingFormPrayers),
    ]),
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

/**
 * Every passage a mystery can read, per translation, with how long the phone leaves to
 * read it in silence when it has no recording.
 */
function exportPassages(language: 'es' | 'en' | 'la') {
  const texts = passagesOf(language);
  const refs = mysterySets.flatMap((set) =>
    mysteriesOf(set).flatMap((mystery) => mystery.readings.map((r) => r.ref)),
  );
  const passages = Object.fromEntries(
    [...new Set(refs)].map((ref) => {
      const found = texts[ref];
      if (found === undefined) {
        throw new Error(`No ${language} text for ${ref}`);
      }
      return [
        ref,
        { displayRef: found.displayRef, text: found.text, silenceMs: readingSilenceMs(found.text) },
      ];
    }),
  );
  return { version: 1, language, passages };
}

type SetFile = { sets: { id: MysterySet; titles: Partial<Record<Locale, string>> }[] };
const setFile = JSON.parse(readFileSync(join(root, 'content/mysteries.json'), 'utf8')) as SetFile;

function setTitle(set: MysterySet, locale: Locale): string {
  const titles = setFile.sets.find((candidate) => candidate.id === set)?.titles ?? {};
  const fallback = locale === 'es-MX' ? 'es-ES' : locale === 'es-ES' ? 'es-MX' : locale;
  return titles[locale] ?? titles[fallback] ?? set;
}

async function main(): Promise<void> {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const sets = Object.fromEntries(
    mysterySets.map((set) => [set, watchSequence(set, { kind: 'full' })]),
  ) as Record<MysterySet, Step[]>;

  const rosary = { version: 1, weekdays: weekdays(), rates, sets: mysterySets.map(exportSet) };
  writeFileSync(join(outDir, 'rosary.json'), `${JSON.stringify(rosary)}\n`);
  console.log(`rosary.json: ${rosary.sets.length} sets, ${rosary.sets[0]?.steps.length} steps each`);

  for (const locale of locales) {
    const data = exportLocale(locale, sets);
    writeFileSync(join(outDir, `${locale}.json`), `${JSON.stringify(data)}\n`);
    console.log(`${locale}.json: ${Object.keys(data.prayers).length} prayers`);
  }

  for (const language of ['es', 'en', 'la'] as const) {
    const data = exportPassages(language);
    writeFileSync(join(outDir, `passages-${language}.json`), `${JSON.stringify(data)}\n`);
    console.log(`passages-${language}.json: ${Object.keys(data.passages).length} passages`);
  }

  await exportArtwork();
}

await main();
