import { openingForms, type OpeningForm, type ReadingPreference } from '@sanctamaria/rosary';

import type { Locale } from '@sanctamaria/content';
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
  /** Form of the three opening Hail Marys; applied only when the prayer locale has it. */
  openingForm: OpeningForm;
  /** Off follows the week's order from before the luminous mysteries and hides them. */
  luminous: boolean;
  fatimaPrayer: boolean;
  prayerForThePope: boolean;
  litany: boolean;
  textSize: 'regular' | 'large' | 'larger';
  /** A daily notification to pray the Rosary. */
  rosaryReminder: boolean;
  /** Local time of the reminder, in minutes after midnight. */
  rosaryReminderAt: number;
  /** The Auxilium Christianorum prayers on Today, off until chosen. */
  auxilium: boolean;
  auxiliumReminder: boolean;
  auxiliumReminderAt: number;
  /** The bead wheel folded into a slim bar while praying. */
  onboarded: boolean;
};

/** Voice speeds offered; the player stretches time without changing pitch. */
export const rates = [0.8, 1, 1.2, 1.5, 2] as const;

export function nextRate(rate: number): number {
  const index = rates.findIndex((candidate) => candidate === rate);
  return rates[(index + 1) % rates.length] ?? 1;
}

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
  openingForm: 'standard',
  luminous: true,
  fatimaPrayer: true,
  prayerForThePope: true,
  litany: false,
  textSize: 'regular',
  rosaryReminder: false,
  rosaryReminderAt: 20 * 60,
  auxilium: false,
  auxiliumReminder: false,
  auxiliumReminderAt: 12 * 60,
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
  for (const key of ['rosaryReminderAt', 'auxiliumReminderAt'] as const) {
    if (!isMinuteOfDay(result[key])) {
      result[key] = defaultSettings[key];
    }
  }
  if (!(openingForms as readonly unknown[]).includes(result.openingForm)) {
    result.openingForm = defaultSettings.openingForm;
  }
  return result as Settings;
}

function isMinuteOfDay(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 24 * 60;
}
