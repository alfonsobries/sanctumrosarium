import type { Language, Source } from '../types';

export type LitanyGroup = 'kyrie' | 'trinity' | 'marian' | 'agnus' | 'versicle';

/** The response the people give. Marian invocations answer "pray for us". */
export type LitanyResponse =
  'miserere' | 'ora-pro-nobis' | 'parce' | 'exaudi' | 'versicle';

export type LitanyLine = {
  readonly id: string;
  readonly group: LitanyGroup;
  readonly call: Readonly<Record<Language, string>>;
  readonly response: LitanyResponse;
  /** Year the invocation was added to the litany, for the ones that were. */
  readonly addedIn?: 1980 | 1995 | 2020;
};

export type Litany = {
  readonly id: 'lauretanae';
  readonly lines: readonly LitanyLine[];
  readonly responses: Readonly<
    Record<LitanyResponse, Readonly<Record<Language, string>>>
  >;
  readonly source: Source;
};
