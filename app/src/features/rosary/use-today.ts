import { mysteriesOfDay, mysteriesOfSet, type DayOfMysteries } from '@rosario/engine';
import type { Mystery } from '@rosario/content';
import { useMemo } from 'react';

export type Today = DayOfMysteries & {
  readonly mysteries: readonly Mystery[];
};

/** What is prayed today, and why. The "why" is shown: the app never switches in silence. */
export function useToday(now: Date = new Date()): Today {
  return useMemo(() => {
    const day = mysteriesOfDay(now);
    return { ...day, mysteries: mysteriesOfSet(day.set) };
  }, [now]);
}
