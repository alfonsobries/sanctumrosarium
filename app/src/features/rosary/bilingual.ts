import { latinLineMap, type Language, type PrayerText } from '@rosario/content';

/** One Latin line with the own-language lines that answer to it. */
export type BilingualLine = {
  readonly latin: string;
  readonly own: readonly string[];
};

/**
 * Interleaves the Latin text of a prayer with the same prayer in the reader's own
 * language, line by line. Nothing is translated here: both texts already exist in the
 * content package; the map only says which line answers to which (task 023).
 */
export function pairLatinLines(
  latin: PrayerText,
  own: PrayerText,
  ownLanguage: Exclude<Language, 'la'>,
): readonly BilingualLine[] {
  const map =
    latinLineMap[latin.id]?.[ownLanguage] ??
    (own.lines.length === latin.lines.length
      ? own.lines.map((_, index) => index)
      : undefined);
  if (map === undefined) {
    return latin.lines.map((line) => ({ latin: line, own: [] }));
  }
  return latin.lines.map((line, latinIndex) => ({
    latin: line,
    own: own.lines.filter((_, ownIndex) => map[ownIndex] === latinIndex),
  }));
}
