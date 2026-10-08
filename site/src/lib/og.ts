import { setSlugs, type Language } from '../i18n/routes';
import { t } from '../i18n/ui';
import { mysterySets } from '@sanctamaria/rosary';

import { setTitle } from './sets';

export type OgCard = { name: string; language: Language; kicker: string; title: string; subtitle?: string };

/** One social card per section and language; Base picks `/og/<name>-<language>.png`. */
export const ogCards: OgCard[] = (['es', 'en'] as const).flatMap((language) => {
  const translate = t(language);
  const kicker = translate('home.kicker');
  return [
    { name: 'default', language, kicker, title: translate('site.tagline'), subtitle: translate('home.lead') },
    { name: 'home', language, kicker, title: translate('home.headline'), subtitle: translate('home.lead') },
    { name: 'how', language, kicker: translate('how.kicker'), title: translate('how.title') },
    { name: 'mysteries', language, kicker: translate('mysteries.kicker'), title: translate('mysteries.title') },
    { name: 'today', language, kicker: translate('today.kicker'), title: translate('today.title') },
    { name: 'prayers', language, kicker: translate('prayers.kicker'), title: translate('prayers.title') },
    { name: 'help', language, kicker: translate('help.kicker'), title: translate('help.headline') },
    ...mysterySets.map((set) => ({
      name: `set-${setSlugs[set].en}`,
      language,
      kicker: translate('mysteries.kicker'),
      title: setTitle(set, language),
    })),
  ];
});
