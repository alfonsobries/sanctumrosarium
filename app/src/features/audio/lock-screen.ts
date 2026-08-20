import type { Language, MysterySetId } from '@rosario/content';
import { mysteriesOfSet, type Step } from '@rosario/engine';

export type LockScreenInfo = {
  readonly title: string;
  readonly artist: string;
};

/**
 * What the lock screen, the headphones and the car should say: the mystery, then the
 * prayer. Never a count, never a streak (task 020).
 */
export function lockScreenOf(
  step: Step | undefined,
  set: MysterySetId,
  language: Language,
  setName: string,
): LockScreenInfo {
  if (step === undefined) {
    return { title: setName, artist: setName };
  }
  const decade = 'decade' in step ? step.decade : undefined;
  const mystery =
    step.kind === 'announce' || step.kind === 'reading'
      ? step.mystery
      : decade !== undefined
        ? mysteriesOfSet(set)[decade]
        : undefined;
  const mysteryTitle = mystery?.text[language].title;
  const prayerTitle = step.kind === 'prayer' ? step.prayer.title : undefined;
  if (mysteryTitle !== undefined) {
    return { title: mysteryTitle, artist: prayerTitle ?? setName };
  }
  return { title: prayerTitle ?? setName, artist: setName };
}
