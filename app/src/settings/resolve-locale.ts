import type { Language, Locale } from '@rosario/content';

import type { InterfaceLanguageSetting, PrayerLocaleSetting } from './store';

/** The language half of a prayer locale, for content keyed by language (mysteries). */
export function languageForLocale(locale: Locale): Language {
  if (locale === 'la') {
    return 'la';
  }
  return locale.startsWith('es') ? 'es' : 'en';
}

export type DeviceLocale = {
  readonly languageCode: string | null;
  readonly regionCode: string | null;
};

/** Interface languages the app ships. Latin has no interface: it is only prayed. */
export function resolveInterfaceLanguage(
  setting: InterfaceLanguageSetting,
  deviceLocales: readonly DeviceLocale[],
): 'es' | 'en' {
  if (setting !== 'system') {
    return setting;
  }
  for (const locale of deviceLocales) {
    if (locale.languageCode === 'es') {
      return 'es';
    }
    if (locale.languageCode === 'en') {
      return 'en';
    }
  }
  return 'en';
}

/** Following the system never lands on Latin: Latin is always an explicit choice. */
export function resolvePrayerLocale(
  setting: PrayerLocaleSetting,
  deviceLocales: readonly DeviceLocale[],
): Locale {
  if (setting !== 'system') {
    return setting;
  }
  for (const locale of deviceLocales) {
    if (locale.languageCode === 'es') {
      return locale.regionCode === 'ES' ? 'es-ES' : 'es-MX';
    }
    if (locale.languageCode === 'en') {
      return 'en-US';
    }
  }
  return 'en-US';
}

/**
 * Which regional form frames the Rosary for a prayer locale. Choosing a form by hand is
 * task 011; until then the region decides.
 */
export function formForPrayerLocale(locale: Locale): 'roman' | 'es-MX' | 'es-ES' {
  if (locale === 'es-MX' || locale === 'es-ES') {
    return locale;
  }
  return 'roman';
}
