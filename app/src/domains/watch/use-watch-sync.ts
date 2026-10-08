import { formatLocalDate, localDateOf } from '@sanctamaria/rosary';
import { useEffect, useRef } from 'react';

import { appJournal } from '@/domains/journal/app-journal';
import { useJournalEntries } from '@/domains/journal/queries';
import { useSettings } from '@/domains/settings/use-settings';

import {
  acknowledgeWatchSession,
  addWatchSessionListener,
  pendingWatchSessions,
  sendSettings,
  sendToday,
  setWatchAudioPack,
  type WatchSessionPayload,
} from '../../../modules/watch-bridge';

import { watchAudioPackOffer } from './watch-audio';
import { sameWatchSettings, watchEntryFrom, watchSettingsOf, watchTodayOf } from './watch-entry';

async function store(payloads: readonly WatchSessionPayload[]): Promise<boolean> {
  if (payloads.length === 0) {
    return false;
  }
  const journal = await appJournal();
  let saved = false;
  for (const payload of payloads) {
    const entry = watchEntryFrom(payload);
    if (entry !== null) {
      await journal.save(entry);
      saved = true;
    }
    if (typeof payload.id === 'string') {
      acknowledgeWatchSession(payload.id);
    }
  }
  return saved;
}

/**
 * Keeps the Apple Watch in step with the phone: sends the prayer settings, what was
 * prayed today and the audio pack of the prayer language whenever they change, and
 * writes each session prayed on the watch into the journal. A no-op where there is no
 * watch.
 */
export function useWatchSync(onJournalChange: () => Promise<void> | void): void {
  const onChange = useRef(onJournalChange);
  onChange.current = onJournalChange;

  useEffect(() => {
    sendSettings(watchSettingsOf(useSettings.getState()));
    return useSettings.subscribe((settings, previous) => {
      if (!sameWatchSettings(settings, previous)) {
        sendSettings(watchSettingsOf(settings));
      }
    });
  }, []);

  const prayerLocale = useSettings((state) => state.prayerLocale);
  useEffect(() => {
    let cancelled = false;
    void watchAudioPackOffer(prayerLocale)
      .then((offer) => {
        if (!cancelled) {
          setWatchAudioPack(offer);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [prayerLocale]);

  const today = formatLocalDate(localDateOf(new Date()));
  const { data: todayEntries } = useJournalEntries(today, today);
  useEffect(() => {
    if (todayEntries !== undefined) {
      sendToday(watchTodayOf(today, todayEntries));
    }
  }, [today, todayEntries]);

  useEffect(() => {
    let queue = Promise.resolve();
    const receive = (payloads: readonly WatchSessionPayload[]): void => {
      queue = queue
        .then(async () => {
          if (await store(payloads)) {
            await onChange.current();
          }
        })
        .catch(() => {});
    };
    receive(pendingWatchSessions());
    const subscription = addWatchSessionListener((payload) => receive([payload]));
    return () => subscription.remove();
  }, []);
}
