import {
  forms,
  prayers,
  type FormId,
  type Locale,
  type PrayerId,
} from '@rosario/content';

import type { RuleId } from '@/features/journal/rule';
import type { KvDriver } from '@/storage/kv';

export type AppearanceSetting = 'system' | 'light' | 'dark';
export type InterfaceLanguageSetting = 'system' | 'es' | 'en';
export type PrayerLocaleSetting = 'system' | Locale;
export type PrayerFormSetting = 'auto' | FormId;
export type HapticsSetting = 'off' | 'gentle' | 'strong';
export type LatinTextSetting = 'both' | 'la' | 'own';

export type Settings = {
  readonly version: 5;
  readonly appearance: AppearanceSetting;
  /** Language of the interface. Independent from what is prayed. */
  readonly interfaceLanguage: InterfaceLanguageSetting;
  /** Language and region of what is prayed. Someone can use the app in Spanish and pray in Latin. */
  readonly prayerLocale: PrayerLocaleSetting;
  /** Regional form framing the Rosary. 'auto' follows the prayer language. */
  readonly prayerForm: PrayerFormSetting;
  /** Optional prayers turned on. What is essential is never here: the engine always prays it. */
  readonly includedPrayers: readonly PrayerId[];
  /** The fingers' count: one touch per bead, distinct for Our Father and Glory Be. */
  readonly haptics: HapticsSetting;
  /** What the screen shows when praying in Latin: both languages, Latin alone, or the
      reader's own language. Both is the default for whoever is still learning. */
  readonly latinText: LatinTextSetting;
  /** The Rule: what this person commits to. Chosen by them; the app never raises it. */
  readonly rule: RuleId;
};

export const defaultSettings: Settings = {
  version: 5,
  appearance: 'system',
  interfaceLanguage: 'system',
  prayerLocale: 'system',
  prayerForm: 'auto',
  includedPrayers: [],
  haptics: 'gentle',
  latinText: 'both',
  rule: 'none',
};

const SETTINGS_KEY = 'settings';

/**
 * Each entry upgrades one stored version to the next. The journal of what someone prays
 * will live behind the same rule: data written by an old build always has a path forward.
 */
const migrations: Record<
  number,
  (stored: Record<string, unknown>) => Record<string, unknown>
> = {
  0: (stored) => ({ ...stored, version: 1 }),
  1: (stored) => ({ ...stored, version: 2, prayerForm: 'auto', includedPrayers: [] }),
  2: (stored) => ({ ...stored, version: 3, haptics: 'gentle' }),
  3: (stored) => ({ ...stored, version: 4, latinText: 'both' }),
  // Defaults go first: if the stored data already carries a rule, migration keeps it.
  4: (stored) => ({ rule: 'none', ...stored, version: 5 }),
};

function migrate(stored: Record<string, unknown>): Record<string, unknown> {
  let current = stored;
  let version = typeof current.version === 'number' ? current.version : 0;
  while (version < defaultSettings.version) {
    const step = migrations[version];
    if (step === undefined) {
      return {};
    }
    current = step(current);
    version = typeof current.version === 'number' ? current.version : version + 1;
  }
  return current;
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && (options as readonly string[]).includes(value);
}

const appearances: readonly AppearanceSetting[] = ['system', 'light', 'dark'];
const interfaceLanguages: readonly InterfaceLanguageSetting[] = ['system', 'es', 'en'];
const prayerLocales: readonly PrayerLocaleSetting[] = [
  'system',
  'es-MX',
  'es-ES',
  'en-US',
  'la',
];
const prayerForms: readonly PrayerFormSetting[] = [
  'auto',
  ...(Object.keys(forms) as FormId[]),
];
const knownPrayerIds: ReadonlySet<string> = new Set(prayers.map((prayer) => prayer.id));
const hapticsOptions: readonly HapticsSetting[] = ['off', 'gentle', 'strong'];
const latinTextOptions: readonly LatinTextSetting[] = ['both', 'la', 'own'];
const ruleOptions: readonly RuleId[] = [
  'none',
  'daily-decade',
  'daily-rosary',
  'weekly-fifteen',
  'full-rosary',
];

/** Unknown values fall back field by field: a corrupt setting never takes the rest down. */
function sanitize(stored: Record<string, unknown>): Settings {
  return {
    version: 5,
    appearance: isOneOf(stored.appearance, appearances)
      ? stored.appearance
      : defaultSettings.appearance,
    interfaceLanguage: isOneOf(stored.interfaceLanguage, interfaceLanguages)
      ? stored.interfaceLanguage
      : defaultSettings.interfaceLanguage,
    prayerLocale: isOneOf(stored.prayerLocale, prayerLocales)
      ? stored.prayerLocale
      : defaultSettings.prayerLocale,
    prayerForm: isOneOf(stored.prayerForm, prayerForms)
      ? stored.prayerForm
      : defaultSettings.prayerForm,
    includedPrayers: Array.isArray(stored.includedPrayers)
      ? (stored.includedPrayers.filter(
          (id): id is PrayerId => typeof id === 'string' && knownPrayerIds.has(id),
        ) as readonly PrayerId[])
      : defaultSettings.includedPrayers,
    haptics: isOneOf(stored.haptics, hapticsOptions)
      ? stored.haptics
      : defaultSettings.haptics,
    latinText: isOneOf(stored.latinText, latinTextOptions)
      ? stored.latinText
      : defaultSettings.latinText,
    rule: isOneOf(stored.rule, ruleOptions) ? stored.rule : defaultSettings.rule,
  };
}

export function loadSettings(driver: KvDriver): Settings {
  const raw = driver.get(SETTINGS_KEY);
  if (raw === null) {
    return defaultSettings;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return defaultSettings;
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return defaultSettings;
  }
  return sanitize(migrate(parsed as Record<string, unknown>));
}

export function saveSettings(driver: KvDriver, settings: Settings): void {
  driver.set(SETTINGS_KEY, JSON.stringify(settings));
}
