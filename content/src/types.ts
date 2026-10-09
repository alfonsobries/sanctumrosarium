import type { MysterySet, OpeningForm } from '@sanctamaria/rosary';

export type Locale = 'es-MX' | 'es-ES' | 'en-US' | 'la';
export const locales: readonly Locale[] = ['es-MX', 'es-ES', 'en-US', 'la'];

export type Category = 'magisterium' | 'liturgy' | 'pious-tradition';

export type Source = {
  publisher: string;
  title: string;
  url: string;
  accessed: string;
};

export type PrayerText = {
  lines: string[];
  /** Index of the first line said by those responding, when prayed in community. */
  responseFrom: number | null;
  source: Source;
  notes?: string;
};

export type Prayer = {
  id: string;
  category: Category;
  titles: Partial<Record<Locale, string>>;
  texts: Partial<Record<Locale, PrayerText>>;
  /** Part of an alternative form of the opening Hail Marys. */
  openingForm?: Exclude<OpeningForm, 'standard'>;
};

export type MysteryReading = { ref: string; kind: 'primary' | 'parallel' | string };

export type Mystery = {
  id: string;
  set: MysterySet;
  order: number;
  titles: Partial<Record<Locale, string>>;
  readings: MysteryReading[];
  fruit?: { category: Category } & Partial<Record<Locale, string>>;
};

export type Passage = { displayRef: string; text: string };
