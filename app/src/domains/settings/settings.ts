import type { ReadingPreference } from '@sanctamaria/rosary';

import type { Locale } from '@/domains/sync/api.gen';
import type { SkinId } from '@/shared/theme/skins';

export type PrayMode = 'listen' | 'tap';
export type Appearance = 'system' | 'light' | 'dark';

export type Settings = {
  /** Language the prayers are said in; independent of the interface language. */
  prayerLocale: Locale;
  skin: SkinId;
  appearance: Appearance;
  mode: PrayMode;
  /** Short explanations before each part, for someone learning how to pray it. */
  guided: boolean;
  reading: boolean;
  gospel: ReadingPreference;
  /** Silence after each prayer, to meditate. */
  pauseSeconds: number;
  rate: number;
  fatimaPrayer: boolean;
  prayerForThePope: boolean;
  litany: boolean;
  textSize: 'regular' | 'large' | 'larger';
  onboarded: boolean;
};

export const defaultSettings: Settings = {
  prayerLocale: 'es-MX',
  skin: 'simple',
  appearance: 'system',
  mode: 'listen',
  guided: false,
  reading: true,
  gospel: 'rotate',
  pauseSeconds: 1,
  rate: 1,
  fatimaPrayer: true,
  prayerForThePope: true,
  litany: false,
  textSize: 'regular',
  onboarded: false,
};

/** Fills gaps and drops unknown keys, so an older or newer stored shape never crashes. */
export function normalizeSettings(stored: unknown): Settings {
  if (typeof stored !== 'object' || stored === null) {
    return defaultSettings;
  }
  const source = stored as Record<string, unknown>;
  const result: Record<string, unknown> = { ...defaultSettings };
  for (const key of Object.keys(defaultSettings) as (keyof Settings)[]) {
    if (typeof source[key] === typeof defaultSettings[key]) {
      result[key] = source[key];
    }
  }
  return result as Settings;
}
