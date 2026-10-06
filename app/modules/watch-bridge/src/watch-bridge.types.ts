/** What the watch needs to pray the way the phone does. */
export type WatchSettings = {
  prayerLocale: string;
  fatimaPrayer: boolean;
  litany: boolean;
  pauseSeconds: number;
  rate: number;
  mode: 'listen' | 'tap';
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
