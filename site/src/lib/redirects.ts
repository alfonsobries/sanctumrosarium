import { mysterySets } from '@sanctamaria/rosary';

import { prayerPageIds, prayerRoute, routes, setRoute, type RouteName } from '../i18n/routes';

export type Redirect = { source: string; destination: string; statusCode: 301 };

const spanishPrefix = '/es/';

/** Spanish pages used to live at the root: the same path without `/es`. */
function rootOf(path: string): string {
  return `/${path.slice(spanishPrefix.length)}`;
}

/**
 * Permanent redirects for the URLs the site served when Spanish lived at the root and English
 * under /en/. The home page is left out: `/` is now the English home.
 */
export function legacyRedirects(): Redirect[] {
  const spanish = [
    ...(Object.keys(routes) as RouteName[]).filter((name) => name !== 'home').map((name) => routes[name].es),
    ...mysterySets.map((set) => setRoute(set, 'es')),
    ...prayerPageIds.map((id) => prayerRoute(id, 'es')),
  ];
  return [
    { source: '/en/', destination: '/', statusCode: 301 },
    { source: '/en/:path*/', destination: '/:path*/', statusCode: 301 },
    ...spanish.map((path) => ({ source: rootOf(path), destination: path, statusCode: 301 as const })),
  ];
}
