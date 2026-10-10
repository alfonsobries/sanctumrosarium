import { openingFormFor, type Locale } from '@sanctamaria/content';
import { mysterySets, type MysterySet } from '@sanctamaria/rosary';

import type { JournalEntry } from '@/domains/journal/journal';
import type { Settings } from '@/domains/settings/settings';

import type { WatchSettings, WatchToday } from '../../../modules/watch-bridge';

import { watchReadings } from './watch-pack';

export type WatchJournalEntry = Omit<JournalEntry, 'clientUpdatedAt' | 'deletedAt'>;

const locales: readonly Locale[] = ['es-MX', 'es-ES', 'en-US', 'la'];

/**
 * The part of the settings the watch prays with, and with readings on, the passage each
 * mystery reads next given how many times each was prayed (`readingCounts`).
 */
export function watchSettingsOf(
  settings: Settings,
  readingCounts: Record<string, number> = {},
): WatchSettings {
  return {
    prayerLocale: settings.prayerLocale,
    fatimaPrayer: settings.fatimaPrayer,
    litany: settings.litany,
    prayerForThePope: settings.prayerForThePope,
    pauseSeconds: settings.pauseSeconds,
    rate: settings.rate,
    mode: settings.mode,
    reading: settings.reading,
    readings: settings.reading ? watchReadings(settings.gospel, readingCounts) : {},
    openingForm: openingFormFor(settings.openingForm, settings.prayerLocale),
  };
}

export function sameWatchSettings(a: Settings, b: Settings): boolean {
  return JSON.stringify(watchSettingsOf(a)) === JSON.stringify(watchSettingsOf(b));
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isReadings(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((ref) => typeof ref === 'string')
  );
}

/**
 * Checks a session sent by the watch before it touches the journal. Anything malformed
 * is dropped rather than stored half right.
 */
export function watchEntryFrom(payload: Record<string, unknown>): WatchJournalEntry | null {
  const {
    id,
    kind,
    mysterySet,
    locale,
    prayedOn,
    startedAt,
    completedAt,
    decades,
    durationSeconds,
    readings,
  } = payload;
  if (!isString(id) || (kind !== 'rosary' && kind !== 'decade')) {
    return null;
  }
  if (!mysterySets.includes(mysterySet as MysterySet) || !locales.includes(locale as Locale)) {
    return null;
  }
  if (!isString(prayedOn) || !/^\d{4}-\d{2}-\d{2}$/.test(prayedOn) || !isString(startedAt)) {
    return null;
  }
  if (Number.isNaN(Date.parse(startedAt))) {
    return null;
  }
  if (completedAt !== undefined && completedAt !== null && !isString(completedAt)) {
    return null;
  }
  if (typeof decades !== 'number' || !Number.isInteger(decades) || decades < 1 || decades > 5) {
    return null;
  }
  if (typeof durationSeconds !== 'number' || !Number.isFinite(durationSeconds) || durationSeconds < 0) {
    return null;
  }
  if (readings !== undefined && readings !== null && !isReadings(readings)) {
    return null;
  }
  return {
    id,
    kind,
    mysterySet: mysterySet as MysterySet,
    locale: locale as Locale,
    prayedOn,
    startedAt,
    completedAt: completedAt ?? null,
    decades,
    durationSeconds: Math.round(durationSeconds),
    readings: readings ?? null,
  };
}

/**
 * A Rosary continued on the watch reports only the passages read there; the ones read
 * before, on the phone, stay in the entry.
 */
export function withEarlierReadings(
  entry: WatchJournalEntry,
  stored: Pick<JournalEntry, 'readings'> | null,
): WatchJournalEntry {
  if (stored?.readings === null || stored?.readings === undefined) {
    return entry;
  }
  return { ...entry, readings: { ...stored.readings, ...entry.readings } };
}

/** Today's journal for the watch, without null values (they cannot cross to it). */
export function watchTodayOf(date: string, entries: readonly JournalEntry[]): WatchToday {
  return {
    date,
    entries: entries
      .filter((entry) => entry.deletedAt === null && entry.prayedOn === date)
      .map((entry) => ({
        id: entry.id,
        kind: entry.kind,
        mysterySet: entry.mysterySet,
        locale: entry.locale,
        prayedOn: entry.prayedOn,
        startedAt: entry.startedAt,
        ...(entry.completedAt === null ? {} : { completedAt: entry.completedAt }),
        decades: entry.decades,
        durationSeconds: entry.durationSeconds,
      })),
  };
}
