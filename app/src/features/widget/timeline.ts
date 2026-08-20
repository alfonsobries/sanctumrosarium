import type { Language, MysterySetId } from '@rosario/content';
import { mysteriesOfDay, mysteriesOfSet } from '@rosario/engine';

import type { Journal } from '@/features/journal/db';
import type { RuleId } from '@/features/journal/rule';
import { localDateOf } from '@/features/rosary/session-store';

/** How far the app can see without being opened again. After that the last day holds. */
export const WIDGET_DAYS_AHEAD = 60;

export const WIDGET_URL = 'sanctamaria://pray';

export type MysteryWidgetProperties = {
  /** Localized set name, frozen at scheduling time. */
  readonly setName: string;
  /** The five titles of the day, already localized. */
  readonly titles: string[];
  /** Quiet fact when a Rule is on and today already has a Rosary. Empty otherwise. */
  readonly note: string;
};

export type MysteryWidgetEntry = {
  readonly date: Date;
  readonly props: MysteryWidgetProperties;
};

function titlesOf(set: MysterySetId, language: Language): string[] {
  return mysteriesOfSet(set).map((mystery) => mystery.text[language].title);
}

/**
 * Sixty midnights of the same calendar the prayer uses, so liturgical exceptions match
 * by construction. Text is frozen here: the widget runtime has no i18n of its own.
 */
export function mysteryWidgetTimeline(input: {
  now: Date;
  language: Language;
  setName: (set: MysterySetId) => string;
  todayNote?: string;
  daysAhead?: number;
}): MysteryWidgetEntry[] {
  const daysAhead = input.daysAhead ?? WIDGET_DAYS_AHEAD;
  const note = input.todayNote ?? '';
  return Array.from({ length: daysAhead }, (_, index) => {
    const date = new Date(input.now);
    date.setDate(date.getDate() + index);
    if (index > 0) {
      date.setHours(0, 0, 0, 0);
    }
    const { set } = mysteriesOfDay(date);
    return {
      date,
      props: {
        setName: input.setName(set),
        titles: titlesOf(set, input.language),
        note: index === 0 ? note : '',
      },
    };
  });
}

/**
 * The widget may say that today was prayed, never that it was not, and never a number.
 * Only with a Rule: without one there is nothing to be faithful to.
 */
export function widgetTodayNote(
  rule: RuleId,
  journal: Pick<Journal, 'between'>,
  now: Date,
  note: string,
): string | undefined {
  if (rule === 'none') {
    return undefined;
  }
  const day = localDateOf(now);
  const prayed = journal
    .between(day, day)
    .some((entry) => (entry.kind ?? 'rosary') === 'rosary' && entry.decades > 0);
  if (!prayed) {
    return undefined;
  }
  return note;
}
