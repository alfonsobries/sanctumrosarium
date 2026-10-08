import type { ImageMetadata } from 'astro';

import type { Language } from '../i18n/routes';

type Screen = 'home' | 'prayLight' | 'prayDark' | 'gospel' | 'styles' | 'watch';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/screens/*/*.png', { eager: true });

const names: Record<Screen, string> = {
  home: 'home',
  prayLight: 'pray-light',
  prayDark: 'pray-dark',
  gospel: 'gospel',
  styles: 'styles',
  watch: 'watch',
};

/** App screenshots in the page's language, taken from a release build in the simulator. */
export function screensFor(language: Language): Record<Screen, ImageMetadata> {
  return Object.fromEntries(
    (Object.keys(names) as Screen[]).map((screen) => {
      const file = files[`../assets/screens/${language}/${names[screen]}.png`];
      if (file === undefined) {
        throw new Error(`Missing screenshot ${language}/${names[screen]}.png`);
      }
      return [screen, file.default];
    }),
  ) as Record<Screen, ImageMetadata>;
}
