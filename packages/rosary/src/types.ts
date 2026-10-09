export type MysterySet = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export const mysterySets: readonly MysterySet[] = ['joyful', 'luminous', 'sorrowful', 'glorious'];

export type Evangelist = 'matthew' | 'mark' | 'luke' | 'john';

/** A scripture passage that tells a mystery. `book` is the canonical English book id. */
export type Reading = {
  book: string;
  ref: string;
};

export type MysteryRef = {
  id: string;
  set: MysterySet;
  order: number;
  readings: readonly Reading[];
};

export type PrayerId =
  | 'sign-of-the-cross'
  | 'apostles-creed'
  | 'our-father'
  | 'hail-mary'
  | 'glory-be'
  | 'fatima-prayer'
  | 'hail-holy-queen'
  | 'rosary-closing-prayer'
  | 'litany-of-loreto'
  | 'hail-mary-faith'
  | 'hail-mary-hope'
  | 'hail-mary-charity'
  | 'trinity-salutation';

/**
 * How the three Hail Marys before the first mystery are said. `three-virtues` is the
 * Hispanic form where each Hail Mary opens with a salutation entrusting faith, hope and
 * charity to Mary, followed by a salutation to her as temple of the Trinity.
 */
export type OpeningForm = 'standard' | 'three-virtues';

export const openingForms: readonly OpeningForm[] = ['standard', 'three-virtues'];

export type Section = 'opening' | 'decade' | 'closing';

/** Where on a physical rosary a step is prayed. */
export type Bead =
  | { kind: 'crucifix' }
  | { kind: 'opening-large' }
  | { kind: 'opening-small'; index: number }
  | { kind: 'centerpiece' }
  | { kind: 'decade-large'; decade: number }
  | { kind: 'decade-small'; decade: number; index: number };

type StepBase = {
  /** Stable within one sequence; used as a React key and for resuming. */
  id: string;
  section: Section;
  bead: Bead | null;
};

export type Step =
  | (StepBase & {
      kind: 'prayer';
      prayer: PrayerId;
      decade: number | null;
      /** For counted prayers (the Hail Marys): position and total. */
      count: { index: number; total: number } | null;
      /** Said for a particular intention rather than as part of a decade. */
      intention?: 'pope';
    })
  | (StepBase & { kind: 'announce'; decade: number; mystery: MysteryRef })
  | (StepBase & { kind: 'reading'; decade: number; mystery: MysteryRef; reading: Reading });

export type Scope = { kind: 'full' } | { kind: 'decade'; decade: number };

export type RosaryOptions = {
  set: MysterySet;
  /** The five mysteries of the set, in order. */
  mysteries: readonly MysteryRef[];
  scope: Scope;
  /** Creed, Our Father, three Hail Marys and Glory Be before the first mystery. */
  opening: boolean;
  openingForm: OpeningForm;
  /** Reading chosen for each mystery, or none to skip the reading step. */
  readingFor: ((mystery: MysteryRef) => Reading | null) | null;
  fatimaPrayer: boolean;
  /** Our Father and Hail Mary for the intentions of the Pope, which conclude the prayer (RVM 37). */
  prayerForThePope: boolean;
  hailHolyQueen: boolean;
  litany: boolean;
  closingPrayer: boolean;
};
