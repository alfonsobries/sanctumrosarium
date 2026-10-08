import { mysterySets, type MysterySet } from '@sanctamaria/rosary';

import { prayerPageIds, setSlugs, type Language, type PrayerPageId } from '../i18n/routes';
import { t } from '../i18n/ui';
import { hasPrayerPage, prayerName } from './content';
import { setTitle } from './sets';

/**
 * A social card. `art` names a painting in app/assets/mysteries/original; without one the
 * card shows the medallion.
 */
export type OgCard = { name: string; language: Language; kicker: string; title: string; subtitle?: string; art?: string };

const setArt: Record<MysterySet, string> = {
  joyful: 'nativity',
  luminous: 'baptism',
  sorrowful: 'agony-in-the-garden',
  glorious: 'resurrection',
};

const prayerArt: Partial<Record<PrayerPageId, string>> = {
  'hail-mary': 'visitation',
  'hail-holy-queen': 'coronation-of-mary',
  'litany-of-loreto': 'assumption',
};

export const prayerCard = (id: PrayerPageId): string => `prayer-${id}`;

/** One social card per page kind and language; Base picks `/og/<name>-<language>.png`. */
export const ogCards: OgCard[] = (['es', 'en'] as const).flatMap((language) => {
  const translate = t(language);
  const kicker = translate('home.kicker');
  return [
    { name: 'default', language, kicker, title: translate('site.tagline'), subtitle: translate('home.lead') },
    { name: 'home', language, kicker, title: translate('home.headline'), subtitle: translate('home.lead'), art: 'annunciation' },
    { name: 'how', language, kicker: translate('how.kicker'), title: translate('how.title'), art: 'finding-in-the-temple' },
    { name: 'mysteries', language, kicker: translate('mysteries.kicker'), title: translate('mysteries.title'), art: 'transfiguration' },
    { name: 'today', language, kicker: translate('today.kicker'), title: translate('today.title') },
    { name: 'prayers', language, kicker: translate('prayers.kicker'), title: translate('prayers.title'), art: 'presentation' },
    { name: 'promises', language, kicker: translate('promises.kicker'), title: translate('promises.title'), art: 'coronation-of-mary' },
    { name: 'help', language, kicker: translate('help.kicker'), title: translate('help.headline'), art: 'pentecost' },
    ...mysterySets.map((set) => ({
      name: `set-${setSlugs[set].en}`,
      language,
      kicker: translate('mysteries.kicker'),
      title: setTitle(set, language),
      art: setArt[set],
    })),
    ...prayerPageIds
      .filter((id) => hasPrayerPage(id, language))
      .map((id) => ({
        name: prayerCard(id),
        language,
        kicker: translate('prayers.kicker'),
        title: prayerName(id, language),
        art: prayerArt[id],
      })),
  ];
});
