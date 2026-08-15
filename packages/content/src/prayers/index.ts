import type { Locale, PrayerId, PrayerText } from '../types';
import { englishPrayers } from './en-US';
import { spanishCommonPrayers } from './es-common';
import { mexicanOnlyPrayers } from './es-MX';
import { spanishOnlyPrayers } from './es-ES';
import { latinPrayers } from './la';

export const prayers: readonly PrayerText[] = [
  ...spanishCommonPrayers('es-MX'),
  ...mexicanOnlyPrayers,
  ...spanishCommonPrayers('es-ES'),
  ...spanishOnlyPrayers,
  ...englishPrayers,
  ...latinPrayers,
];

/** Every prayer available in a locale. */
export function prayersFor(locale: Locale): readonly PrayerText[] {
  return prayers.filter((prayer) => prayer.locale === locale);
}

/** The text of a prayer in a locale, or undefined when that locale does not have it. */
export function findPrayer(id: PrayerId, locale: Locale): PrayerText | undefined {
  return prayers.find((prayer) => prayer.id === id && prayer.locale === locale);
}
