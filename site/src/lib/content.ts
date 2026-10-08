import type { ImageMetadata } from 'astro';
import {
  allMysteries,
  hasPrayerText,
  litany,
  mysteriesOf,
  mysteryTitle,
  passage,
  prayer,
  prayerText,
  prayerTitle,
  rosaryPromises,
  type Locale,
  type Mystery,
  type PrayerText,
  type Source,
} from '@sanctamaria/content';
import { mysterySets, type MysterySet } from '@sanctamaria/rosary';

import credits from '../../../app/assets/mysteries/credits.json';
import type { Language, PrayerPageId } from '../i18n/routes';

export { mysterySets };
export { setTitle, weekdaysOf } from './sets';
export type { MysterySet, Mystery, PrayerText, Source };

/** The text each site language shows: Mexican Spanish and American English, as in the app. */
export function localeOf(language: Language): Locale {
  return language === 'es' ? 'es-MX' : 'en-US';
}

export function mysteries(set: MysterySet): Mystery[] {
  return mysteriesOf(set);
}

export function titleOf(mystery: Mystery, language: Language): string {
  return mysteryTitle(mystery.id, localeOf(language));
}

/** The Gospel passages that tell a mystery, with the reference written the way each language writes it. */
export function readingsOf(mystery: Mystery, language: Language): { ref: string; display: string; primary: boolean }[] {
  return mystery.readings
    .filter((reading) => reading.kind === 'primary' || reading.kind === 'parallel')
    .map((reading) => ({
      ref: reading.ref,
      display: passage(reading.ref, localeOf(language))?.displayRef ?? reading.ref,
      primary: reading.kind === 'primary',
    }));
}

/** The traditional fruit of a mystery; only the English source names them, so only English pages show it. */
export function fruitOf(mystery: Mystery, language: Language): string | null {
  return language === 'en' ? (mystery.fruit?.['en-US'] ?? null) : null;
}

export function allMysteryList(): readonly Mystery[] {
  return allMysteries();
}

// Public domain paintings from the app's classic set; credits.json records each source.
const artworkFiles = import.meta.glob<{ default: ImageMetadata }>('../../../app/assets/mysteries/*.jpg', {
  eager: true,
});

const artworkByMystery: Record<string, string> = {
  'joyful-1-annunciation': 'annunciation',
  'joyful-2-visitation': 'visitation',
  'joyful-3-nativity': 'nativity',
  'joyful-4-presentation': 'presentation',
  'joyful-5-finding-in-the-temple': 'finding-in-the-temple',
  'luminous-1-baptism': 'baptism',
  'luminous-2-wedding-at-cana': 'wedding-at-cana',
  'luminous-3-proclamation-of-the-kingdom': 'proclamation',
  'luminous-4-transfiguration': 'transfiguration',
  'luminous-5-institution-of-the-eucharist': 'institution-of-the-eucharist',
  'sorrowful-1-agony-in-the-garden': 'agony-in-the-garden',
  'sorrowful-2-scourging-at-the-pillar': 'scourging',
  'sorrowful-3-crowning-with-thorns': 'crowning-with-thorns',
  'sorrowful-4-carrying-of-the-cross': 'carrying-the-cross',
  'sorrowful-5-crucifixion': 'crucifixion',
  'glorious-1-resurrection': 'resurrection',
  'glorious-2-ascension': 'ascension',
  'glorious-3-descent-of-the-holy-spirit': 'pentecost',
  'glorious-4-assumption': 'assumption',
  'glorious-5-coronation': 'coronation-of-mary',
};

type Credit = {
  id: string;
  title: string;
  artist: string;
  year: string;
  location: string;
  commonsUrl: string;
  license: string;
  dominantColor: string;
};

export type Artwork = { image: ImageMetadata; credit: Credit };

export function artworkOf(mystery: Mystery): Artwork | null {
  const file = artworkByMystery[mystery.id];
  const image = file === undefined ? undefined : artworkFiles[`../../../app/assets/mysteries/${file}.jpg`]?.default;
  const credit = (credits as Credit[]).find((entry) => entry.id === file);
  return image === undefined || credit === undefined ? null : { image, credit };
}

export function hasPrayerPage(id: PrayerPageId, language: Language): boolean {
  return hasPrayerText(id, localeOf(language));
}

export function prayerName(id: string, language: Language): string {
  return prayerTitle(id, localeOf(language));
}

export function prayerLines(id: string, language: Language): PrayerText {
  return prayerText(id, localeOf(language));
}

export function latinLines(id: string): PrayerText | null {
  return hasPrayerText(id, 'la') ? prayerText(id, 'la') : null;
}

export function prayerCategory(id: string): 'magisterium' | 'liturgy' | 'pious-tradition' {
  return prayer(id).category;
}

export function litanyOf(language: Language) {
  return litany(localeOf(language));
}

export function promisesOf(language: Language) {
  return rosaryPromises(language);
}
