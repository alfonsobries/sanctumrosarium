import { hasPrayerText, mysteryRefsOf, openingFormFor } from '@sanctamaria/content';
import { formatLocalDate, localDateOf, type MysterySet, type Scope } from '@sanctamaria/rosary';
import { randomUUID } from 'expo-crypto';

import { appJournal } from '@/domains/journal/app-journal';
import { useSettings } from '@/domains/settings/use-settings';

import { planSession } from './session';
import { useSession } from './use-session';

/** Plans a new session from the current settings and makes it the active one. */
export async function startSession(set: MysterySet, scope: Scope): Promise<void> {
  const settings = useSettings.getState();
  const now = new Date();
  const readingCounts = settings.reading ? await (await appJournal()).readingCounts() : {};

  useSession.getState().begin(
    planSession({
      id: randomUUID(),
      set,
      scope,
      locale: settings.prayerLocale,
      openingForm: openingFormFor(settings.openingForm, settings.prayerLocale),
      fatimaPrayer: settings.fatimaPrayer && hasPrayerText('fatima-prayer', settings.prayerLocale),
      litany: settings.litany,
      prayerForThePope: settings.prayerForThePope,
      reading: settings.reading,
      gospel: settings.gospel,
      readingCounts,
      mysteries: mysteryRefsOf(set),
      now,
      prayedOn: formatLocalDate(localDateOf(now)),
    }),
  );
}

const resumeWindowMs = 12 * 60 * 60 * 1000;

/** A session counts as resumable only for half a day; after that it is simply over. */
export function isResumable(startedAt: string, now: Date = new Date()): boolean {
  return now.getTime() - Date.parse(startedAt) < resumeWindowMs;
}
