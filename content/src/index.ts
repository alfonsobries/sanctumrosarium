import type { MysteryRef, MysterySet, Reading } from '@sanctamaria/rosary';

import mysteriesFile from '../mysteries.json';
import prayersFile from '../prayers.json';
import en from '../scripture/en.json';
import es from '../scripture/es.json';
import la from '../scripture/la.json';
import type { Locale, Mystery, Passage, Prayer, PrayerText, Source } from './types';

export * from './types';

const prayers = prayersFile.prayers as unknown as Prayer[];
const mysteries = mysteriesFile.mysteries as unknown as Mystery[];
const passages: Record<'es' | 'en' | 'la', Record<string, Passage>> = {
  es: (es as unknown as { passages: Record<string, Passage> }).passages,
  en: (en as unknown as { passages: Record<string, Passage> }).passages,
  la: (la as unknown as { passages: Record<string, Passage> }).passages,
};

const books: Record<string, string> = {
  Mt: 'Matthew',
  Mk: 'Mark',
  Lk: 'Luke',
  Jn: 'John',
};

export class MissingContentError extends Error {}

/** Locales tried, in order, when a text does not exist in the requested one. */
function fallbacks(locale: Locale): Locale[] {
  switch (locale) {
    case 'es-ES':
      return ['es-ES', 'es-MX'];
    case 'es-MX':
      return ['es-MX', 'es-ES'];
    default:
      return [locale];
  }
}

export function prayer(id: string): Prayer {
  const found = prayers.find((candidate) => candidate.id === id);
  if (found === undefined) {
    throw new MissingContentError(`Unknown prayer ${id}`);
  }
  return found;
}

type StoredText = PrayerText | { missing: true } | { sameAs: Locale } | { structured: LitanyStructure; source: Source };

function resolveText(id: string, locale: Locale, seen: Locale[] = []): StoredText | undefined {
  const stored = (prayer(id).texts as Partial<Record<Locale, StoredText>>)[locale];
  if (stored !== undefined && 'sameAs' in stored && !seen.includes(stored.sameAs)) {
    return resolveText(id, stored.sameAs, [...seen, locale]);
  }
  return stored;
}

export function hasPrayerText(id: string, locale: Locale): boolean {
  return fallbacks(locale).some((candidate) => {
    const text = resolveText(id, candidate);
    return text !== undefined && ('lines' in text || 'structured' in text);
  });
}

export function prayerText(id: string, locale: Locale): PrayerText {
  for (const candidate of fallbacks(locale)) {
    const text = resolveText(id, candidate);
    if (text === undefined || 'missing' in text || 'sameAs' in text) {
      continue;
    }
    if ('structured' in text) {
      const pairs = litanyPairs(text.structured);
      return { lines: pairs.map((pair) => `${pair.call} ${pair.response}`), responseFrom: null, source: text.source };
    }
    return text;
  }
  throw new MissingContentError(`Prayer ${id} has no text in ${locale}`);
}

export type LitanyPair = { call: string; response: string };

type LitanyStructure = {
  opening: LitanyPair[];
  trinity: LitanyPair[];
  invocations: string[];
  invocationResponse: string;
  agnusDei: LitanyPair[];
};

function litanyPairs(structure: LitanyStructure): LitanyPair[] {
  return [
    ...structure.opening,
    ...structure.trinity,
    ...structure.invocations.map((call) => ({ call, response: structure.invocationResponse })),
    ...structure.agnusDei,
  ];
}

/** The Litany of Loreto as call and response, for the screen and the two voices. */
export function litany(locale: Locale): { pairs: LitanyPair[]; source: Source } {
  for (const candidate of fallbacks(locale)) {
    const text = resolveText('litany-of-loreto', candidate);
    if (text !== undefined && 'structured' in text) {
      return { pairs: litanyPairs(text.structured), source: text.source };
    }
  }
  throw new MissingContentError(`No litany in ${locale}`);
}

export function prayerTitle(id: string, locale: Locale): string {
  const titles = prayer(id).titles;
  return fallbacks(locale).map((candidate) => titles[candidate]).find((t) => t !== undefined) ?? id;
}

export function allPrayers(): readonly Prayer[] {
  return prayers;
}

export function bookOf(ref: string): string {
  const abbreviation = ref.split(' ')[0] ?? ref;
  return books[abbreviation] ?? abbreviation;
}

function toRef(mystery: Mystery): MysteryRef {
  return {
    id: mystery.id,
    set: mystery.set,
    order: mystery.order,
    readings: mystery.readings.map((reading): Reading => ({ book: bookOf(reading.ref), ref: reading.ref })),
  };
}

export function mysteriesOf(set: MysterySet): Mystery[] {
  return mysteries.filter((mystery) => mystery.set === set).sort((a, b) => a.order - b.order);
}

export function mysteryRefsOf(set: MysterySet): MysteryRef[] {
  return mysteriesOf(set).map(toRef);
}

export function mystery(id: string): Mystery {
  const found = mysteries.find((candidate) => candidate.id === id);
  if (found === undefined) {
    throw new MissingContentError(`Unknown mystery ${id}`);
  }
  return found;
}

export function allMysteries(): readonly Mystery[] {
  return mysteries;
}

export function mysteryTitle(id: string, locale: Locale): string {
  const titles = mystery(id).titles;
  return fallbacks(locale).map((candidate) => titles[candidate]).find((t) => t !== undefined) ?? id;
}

/** Short id shared with the artwork and audio files: `sorrowful-1-agony-in-the-garden` → `agony-in-the-garden`. */
export function mysterySlug(id: string): string {
  return id.replace(/^(joyful|luminous|sorrowful|glorious)-\d-/, '');
}

export function passage(ref: string, locale: Locale): Passage | null {
  const language = locale === 'la' ? 'la' : locale === 'en-US' ? 'en' : 'es';
  return passages[language][ref] ?? null;
}
