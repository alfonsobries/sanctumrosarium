import type { OpeningForm } from '@sanctamaria/rosary';

/** What the watch needs to pray the way the phone does. */
export type WatchSettings = {
  prayerLocale: string;
  /** Off follows the week's order from before the luminous mysteries and hides them. */
  luminous: boolean;
  fatimaPrayer: boolean;
  litany: boolean;
  prayerForThePope: boolean;
  pauseSeconds: number;
  rate: number;
  mode: 'listen' | 'tap';
  /** A Gospel passage after each mystery is announced. */
  reading: boolean;
  /** The passage each mystery reads next, by mystery id; empty with readings off. */
  readings: Record<string, string>;
  /** The opening Hail Marys, already the standard form where the language has no other. */
  openingForm: OpeningForm;
};

/** A journal entry as the watch reads it; values that would be null are left out. */
export type WatchTodayEntry = {
  id: string;
  kind: 'rosary' | 'decade';
  mysterySet: string;
  locale: string;
  prayedOn: string;
  startedAt: string;
  completedAt?: string;
  decades: number;
  durationSeconds: number;
};

export type WatchToday = { date: string; entries: WatchTodayEntry[] };

export type WatchAudioPackOffer = {
  locale: string;
  version?: string;
  /** JSON of the playback plan per audio key. */
  parts?: string;
  files: { name: string; path: string }[];
};

/**
 * A session prayed on the watch, as it arrives: the shape of a journal entry, but
 * unchecked. Optional values the watch leaves out arrive as missing keys.
 */
export type WatchSessionPayload = Record<string, unknown>;

export type WatchBridgeEvents = {
  onWatchSession: (entry: WatchSessionPayload) => void;
};

export type WatchBridgeSubscription = { remove: () => void };
