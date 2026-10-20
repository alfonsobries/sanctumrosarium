import auxiliumFile from '../auxilium.json';
import type { Locale, Source } from './types';

export type AuxiliumBlock =
  | { kind: 'versicle'; call: string; response: string }
  /** `lead` marks a short spoken heading ("Let us pray."); `response` is what all answer after it. */
  | { kind: 'text'; text: string; lead?: boolean; response?: string }
  /** Items without a response are said by everyone, like the opening Kyrie. */
  | { kind: 'litany'; items: { call: string; response?: string }[] }
  /** A prayer of the Rosary, taken from prayers.json in the same locale. */
  | { kind: 'prayer'; prayer: 'our-father' | 'hail-mary' | 'glory-be' };

export const auxiliumSectionIds = [
  'opening',
  'offering',
  'saint-michael',
  'guardian-angel',
  'our-father',
  'hail-mary',
  'glory-be',
  'precious-blood',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'conclusion',
  'invocations',
  'sign-of-the-cross',
] as const;

export type AuxiliumSectionId = (typeof auxiliumSectionIds)[number];

export type AuxiliumSection = {
  id: AuxiliumSectionId;
  /** Said only on this weekday, 0 being Sunday. */
  day?: number;
  blocks: AuxiliumBlock[];
};

export type AuxiliumText = {
  source: Source;
  /** Texts the booklet only names, taken from these sources instead. */
  sectionSources?: Partial<Record<AuxiliumSectionId, Source>>;
  sections: AuxiliumSection[];
};

type StoredAuxilium = AuxiliumText | { sameAs: Locale };

const texts = auxiliumFile.texts as unknown as Record<Locale, StoredAuxilium>;

export const auxiliumLinks = auxiliumFile.links;

export function auxiliumText(locale: Locale): AuxiliumText {
  const stored = texts[locale];
  return 'sameAs' in stored ? auxiliumText(stored.sameAs) : stored;
}

/** The prayers of one day in the order they are said: every day's, with that weekday's own. */
export function auxiliumFor(locale: Locale, weekday: number): AuxiliumSection[] {
  return auxiliumText(locale).sections.filter(
    (section) => section.day === undefined || section.day === weekday,
  );
}
