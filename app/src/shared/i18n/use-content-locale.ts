import type { Locale } from '@sanctamaria/content';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/domains/settings/use-settings';

/** Locale for content shown as reading material (titles, lessons), following the interface language. */
export function useContentLocale(): Locale {
  const { i18n } = useTranslation();
  const prayerLocale = useSettings((state) => state.prayerLocale);
  if (i18n.language === 'en') {
    return 'en-US';
  }
  return prayerLocale === 'es-ES' ? 'es-ES' : 'es-MX';
}
