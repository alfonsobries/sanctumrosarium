import type { ImageMetadata } from 'astro';

import gospel from '../assets/screens/gospel.png';
import home from '../assets/screens/home.png';
import prayDark from '../assets/screens/pray-dark.png';
import prayLight from '../assets/screens/pray-light.png';
import styles from '../assets/screens/styles.png';
import watch from '../assets/screens/watch.png';

/** App screenshots, taken from a release build in the simulator. */
export const screens: Record<'home' | 'prayLight' | 'prayDark' | 'gospel' | 'styles' | 'watch', ImageMetadata> = {
  home,
  prayLight,
  prayDark,
  gospel,
  styles,
  watch,
};
