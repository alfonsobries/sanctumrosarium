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
export type ReminderMode = 'off' | 'hour' | 'angelus';
export type AudioPaceSetting = 'calm' | 'normal';
export type ResponseSilenceSetting = 'normal' | 'long';
export type AnnouncePauseSetting = 'short' | 'medium' | 'long';
export type ChoirRoleSetting = 'guide' | 'respond';
export type LatinLearnMode = 'listen' | 'read' | 'memory';

export type Settings = {
  readonly version: 17;
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
  /** One plain reminder a day, or the three Angelus hours. Never more. */
  readonly reminderMode: ReminderMode;
  readonly reminderHour: number;
  readonly reminderMinute: number;
  /** Days of the week that remind, 0 = Sunday. */
  readonly reminderDays: readonly number[];
  /** The month's crown of roses: visual inventory, never accumulated power. Off is a
      first-class state: the app stays whole without it. */
  readonly rosesEnabled: boolean;
  /** Close the Rosary with the Litany of Loreto. An act of worship by itself (DPPL 203). */
  readonly withLitany: boolean;
  /** Praying in Latin, these prayers go in the reader's own language: whoever is
      learning mixes one prayer at a time (task 021). */
  readonly latinMixOwn: readonly PrayerId[];
  /** The clause of the mystery after the name of Jesus in each Hail Mary (DPPL 201). */
  readonly withClauses: boolean;
  /** The guide's pace: normal or slower. There is no fast mode (MC 47, RVM 12). */
  readonly audioPace: AudioPaceSetting;
  readonly responseSilence: ResponseSilenceSetting;
  readonly announcePause: AnnouncePauseSetting;
  /** Who leads when praying aloud with the guide: the app calls, or the app answers
      (Montfort, Rosa 46). Time and touch, never the microphone (decision 7). */
  readonly choirRole: ChoirRoleSetting;
  /** The Way: eight stages of learning. Off is first-class: the Rosary stays whole. */
  readonly caminoEnabled: boolean;
  /** Facts of the device after a session (duration, times out of the app). Never a
      grade: prayer is not measured (gamificacion.md 6). Off by default. */
  readonly recollectionEnabled: boolean;
  /** Per prayer, how the Latin is being learned: hear both halves, answer reading, or
      answer from memory with the text dimmed. Chosen by the person; the app never
      raises it (task 024). Absent means answering while reading. */
  readonly latinLearn: Readonly<Partial<Record<PrayerId, LatinLearnMode>>>;
  /** Read the scripture reference after announcing the mystery (RVM 30). */
  readonly withReading: boolean;
  /** Seconds of silence before the decade (RVM 31). Zero is a valid choice. */
  readonly silenceSeconds: number;
  /** Sacred art behind the mystery while praying. Off leaves the Rosary whole. */
  readonly mysteryImages: boolean;
  /** Write the duration of the Rosary as a mindfulness session (Health). Off by default. */
  readonly healthWrite: boolean;
};

export const defaultSettings: Settings = {
  version: 17,
  appearance: 'system',
  interfaceLanguage: 'system',
  prayerLocale: 'system',
  prayerForm: 'auto',
  includedPrayers: [],
  haptics: 'gentle',
  latinText: 'both',
  rule: 'none',
  reminderMode: 'off',
  reminderHour: 8,
  reminderMinute: 0,
  reminderDays: [0, 1, 2, 3, 4, 5, 6],
  rosesEnabled: true,
  withLitany: false,
  latinMixOwn: [],
  withClauses: false,
  audioPace: 'normal',
  responseSilence: 'normal',
  announcePause: 'short',
  choirRole: 'guide',
  caminoEnabled: true,
  recollectionEnabled: false,
  latinLearn: {},
  withReading: false,
  silenceSeconds: 0,
  mysteryImages: true,
  healthWrite: false,
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
  5: (stored) => ({
    reminderMode: 'off',
    reminderHour: 8,
    reminderMinute: 0,
    reminderDays: [0, 1, 2, 3, 4, 5, 6],
    ...stored,
    version: 6,
  }),
  6: (stored) => ({ rosesEnabled: true, ...stored, version: 7 }),
  7: (stored) => ({ withLitany: false, ...stored, version: 8 }),
  8: (stored) => ({ latinMixOwn: [], ...stored, version: 9 }),
  9: (stored) => ({ withClauses: false, ...stored, version: 10 }),
  10: (stored) => ({
    audioPace: 'normal',
    responseSilence: 'normal',
    announcePause: 'short',
    ...stored,
    version: 11,
  }),
  11: (stored) => ({ choirRole: 'guide', ...stored, version: 12 }),
  12: (stored) => ({ caminoEnabled: true, ...stored, version: 13 }),
  13: (stored) => ({ recollectionEnabled: false, ...stored, version: 14 }),
  14: (stored) => ({ latinLearn: {}, ...stored, version: 15 }),
  15: (stored) => ({ withReading: false, silenceSeconds: 0, ...stored, version: 16 }),
  16: (stored) => ({ mysteryImages: true, healthWrite: false, ...stored, version: 17 }),
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
const reminderModes: readonly ReminderMode[] = ['off', 'hour', 'angelus'];
const audioPaces: readonly AudioPaceSetting[] = ['calm', 'normal'];
const responseSilences: readonly ResponseSilenceSetting[] = ['normal', 'long'];
const announcePauses: readonly AnnouncePauseSetting[] = ['short', 'medium', 'long'];
const choirRoles: readonly ChoirRoleSetting[] = ['guide', 'respond'];
const latinLearnModes: readonly LatinLearnMode[] = ['listen', 'read', 'memory'];
/** Short by design: a pause to hear the Word, not a fifteen-minute meditation. */
export const silenceOptions: readonly number[] = [0, 10, 30, 60];

function sanitizeLatinLearn(
  stored: unknown,
): Readonly<Partial<Record<PrayerId, LatinLearnMode>>> {
  if (typeof stored !== 'object' || stored === null) {
    return {};
  }
  const result: Partial<Record<PrayerId, LatinLearnMode>> = {};
  for (const [prayer, mode] of Object.entries(stored)) {
    if (knownPrayerIds.has(prayer) && isOneOf(mode, latinLearnModes)) {
      result[prayer as PrayerId] = mode;
    }
  }
  return result;
}
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
    version: 17,
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
    reminderMode: isOneOf(stored.reminderMode, reminderModes)
      ? stored.reminderMode
      : defaultSettings.reminderMode,
    reminderHour:
      typeof stored.reminderHour === 'number' &&
      stored.reminderHour >= 0 &&
      stored.reminderHour <= 23
        ? Math.floor(stored.reminderHour)
        : defaultSettings.reminderHour,
    reminderMinute:
      typeof stored.reminderMinute === 'number' &&
      stored.reminderMinute >= 0 &&
      stored.reminderMinute <= 59
        ? Math.floor(stored.reminderMinute)
        : defaultSettings.reminderMinute,
    reminderDays: Array.isArray(stored.reminderDays)
      ? stored.reminderDays.filter(
          (day): day is number => typeof day === 'number' && day >= 0 && day <= 6,
        )
      : defaultSettings.reminderDays,
    rosesEnabled:
      typeof stored.rosesEnabled === 'boolean'
        ? stored.rosesEnabled
        : defaultSettings.rosesEnabled,
    withLitany:
      typeof stored.withLitany === 'boolean'
        ? stored.withLitany
        : defaultSettings.withLitany,
    latinMixOwn: Array.isArray(stored.latinMixOwn)
      ? (stored.latinMixOwn.filter(
          (id): id is PrayerId => typeof id === 'string' && knownPrayerIds.has(id),
        ) as readonly PrayerId[])
      : defaultSettings.latinMixOwn,
    withClauses:
      typeof stored.withClauses === 'boolean'
        ? stored.withClauses
        : defaultSettings.withClauses,
    audioPace: isOneOf(stored.audioPace, audioPaces)
      ? stored.audioPace
      : defaultSettings.audioPace,
    responseSilence: isOneOf(stored.responseSilence, responseSilences)
      ? stored.responseSilence
      : defaultSettings.responseSilence,
    announcePause: isOneOf(stored.announcePause, announcePauses)
      ? stored.announcePause
      : defaultSettings.announcePause,
    choirRole: isOneOf(stored.choirRole, choirRoles)
      ? stored.choirRole
      : defaultSettings.choirRole,
    caminoEnabled:
      typeof stored.caminoEnabled === 'boolean'
        ? stored.caminoEnabled
        : defaultSettings.caminoEnabled,
    recollectionEnabled:
      typeof stored.recollectionEnabled === 'boolean'
        ? stored.recollectionEnabled
        : defaultSettings.recollectionEnabled,
    latinLearn: sanitizeLatinLearn(stored.latinLearn),
    withReading:
      typeof stored.withReading === 'boolean'
        ? stored.withReading
        : defaultSettings.withReading,
    silenceSeconds: silenceOptions.includes(stored.silenceSeconds as number)
      ? (stored.silenceSeconds as number)
      : defaultSettings.silenceSeconds,
    mysteryImages:
      typeof stored.mysteryImages === 'boolean'
        ? stored.mysteryImages
        : defaultSettings.mysteryImages,
    healthWrite:
      typeof stored.healthWrite === 'boolean'
        ? stored.healthWrite
        : defaultSettings.healthWrite,
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
