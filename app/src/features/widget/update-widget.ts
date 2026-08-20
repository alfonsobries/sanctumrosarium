import type { Language, MysterySetId } from '@rosario/content';
import { Platform } from 'react-native';

import type { Journal } from '@/features/journal/db';
import type { RuleId } from '@/features/journal/rule';

import { mysteryWidget } from './MysteryWidget';
import { mysteryWidgetTimeline, widgetTodayNote } from './timeline';

export function syncMysteryWidget(input: {
  prayerLanguage: Language;
  rule: RuleId;
  journal: Pick<Journal, 'between'>;
  setName: (set: MysterySetId) => string;
  prayedTodayLabel: string;
  now?: Date;
}): void {
  if (Platform.OS !== 'ios') {
    return;
  }
  try {
    const now = input.now ?? new Date();
    const entries = mysteryWidgetTimeline({
      now,
      language: input.prayerLanguage,
      setName: input.setName,
      todayNote: widgetTodayNote(input.rule, input.journal, now, input.prayedTodayLabel),
    });
    mysteryWidget.updateTimeline(entries);
  } catch {
    // An older dev client without the widget module: the app never breaks over it.
  }
}
