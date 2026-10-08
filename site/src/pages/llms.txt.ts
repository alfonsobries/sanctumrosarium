import type { APIRoute } from 'astro';

import { prayerPageIds, prayerRoute, route, setRoute, stores } from '../i18n/routes';
import { hasPrayerPage, mysterySets, prayerName, setTitle } from '../lib/content';

/** A plain map of the site for language models, in the llms.txt format. */
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const lines = [
    '# Sanctum Rosarium',
    '',
    '> A free Catholic app with no ads to pray the Holy Rosary on iPhone, Apple Watch and Android, in Spanish, English and Latin. No account and no server: what you pray stays on your device. Every prayer comes from an official Church source.',
    '',
    `- App Store: ${stores.appStore}`,
    '',
    '## Guides (English)',
    `- [How to pray the Rosary](${url(route('how', 'en'))}): every step in order, with Rosarium Virginis Mariae`,
    `- [Today's mysteries](${url(route('today', 'en'))}): which set is prayed each day of the week`,
    `- [The mysteries of the Rosary](${url(route('mysteries', 'en'))})`,
    ...mysterySets.map((set) => `- [${setTitle(set, 'en')}](${url(setRoute(set, 'en'))})`),
    `- [The prayers of the Rosary](${url(route('prayers', 'en'))})`,
    ...prayerPageIds.filter((id) => hasPrayerPage(id, 'en')).map((id) => `- [${prayerName(id, 'en')}](${url(prayerRoute(id, 'en'))})`),
    `- [The fifteen promises](${url(route('promises', 'en'))}): a pious tradition, with its origin`,
    '',
    '## Guías (español)',
    `- [Cómo rezar el Rosario](${url(route('how', 'es'))})`,
    `- [Misterios de hoy](${url(route('today', 'es'))})`,
    `- [Los misterios del Rosario](${url(route('mysteries', 'es'))})`,
    ...mysterySets.map((set) => `- [${setTitle(set, 'es')}](${url(setRoute(set, 'es'))})`),
    `- [Las oraciones del Rosario](${url(route('prayers', 'es'))})`,
    ...prayerPageIds.filter((id) => hasPrayerPage(id, 'es')).map((id) => `- [${prayerName(id, 'es')}](${url(prayerRoute(id, 'es'))})`),
    '',
    '## Project',
    `- [How to help](${url(route('help', 'en'))}): donations and contributions`,
    `- [Support](${url(route('support', 'en'))}): questions and how to reach us`,
    `- [Privacy](${url(route('privacy', 'en'))}): no data collected`,
    `- [Terms of use](${url(route('terms', 'en'))})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
