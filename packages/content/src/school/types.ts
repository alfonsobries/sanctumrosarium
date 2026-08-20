import type { Source } from '../types';

export type SchoolPageId =
  'what-it-is' | 'history' | 'method' | 'promises' | 'indulgences' | 'the-object';

/**
 * One block of a school page. `kind` separates what the Church teaches from what pious
 * tradition hands down: the reader always sees which one they are reading.
 */
export type SchoolBlock = {
  readonly text: string;
  /** Where this statement comes from, visible to the reader. */
  readonly cite?: string;
  readonly kind?: 'magisterium' | 'liturgy' | 'tradition' | 'note';
};

export type SchoolPageText = {
  readonly title: string;
  /** One line under the title. */
  readonly lead: string;
  readonly blocks: readonly SchoolBlock[];
};

export type SchoolPage = {
  readonly id: SchoolPageId;
  readonly text: Readonly<Record<'es' | 'en', SchoolPageText>>;
  /** Main source per language, so the English reader gets the English edition. */
  readonly source: Readonly<Record<'es' | 'en', Source>>;
};
