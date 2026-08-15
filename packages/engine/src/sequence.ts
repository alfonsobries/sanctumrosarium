import {
  findPrayer,
  forms,
  mysteries,
  type FormId,
  type FormStep,
  type Locale,
  type Mystery,
  type MysterySetId,
  type PrayerId,
  type PrayerText,
} from '@rosario/content';

export type RosaryOptions = {
  readonly form: FormId;
  readonly locale: Locale;
  readonly set: MysterySetId;
  /** Optional steps the person turned on. Anything not listed here stays off. */
  readonly include?: readonly PrayerId[];
  readonly withLitany?: boolean;
  /** Read the scripture passage after announcing the mystery (RVM 30). */
  readonly withReading?: boolean;
  /** Seconds of silence after the reading (RVM 31). Zero means no silence step. */
  readonly silenceSeconds?: number;
  /** Add the clause after the name of Jesus in each Hail Mary (DPPL 201). */
  readonly withClauses?: boolean;
  /** Twenty mysteries in one sitting instead of five decades. */
  readonly fullRosary?: boolean;
};

export type Step =
  | {
      readonly kind: 'prayer';
      readonly prayer: PrayerText;
      readonly optional: boolean;
      readonly decade?: number;
      readonly beadInDecade?: number;
    }
  | { readonly kind: 'announce'; readonly mystery: Mystery; readonly decade: number }
  | { readonly kind: 'reading'; readonly mystery: Mystery; readonly decade: number }
  | { readonly kind: 'silence'; readonly seconds: number; readonly decade: number }
  | { readonly kind: 'litany' };

export class MissingPrayerError extends Error {
  constructor(prayer: PrayerId, locale: Locale) {
    super(`prayer ${prayer} is missing in ${locale}`);
    this.name = 'MissingPrayerError';
  }
}

function prayerStep(
  id: PrayerId,
  locale: Locale,
  optional: boolean,
  decade?: number,
  bead?: number,
): Step {
  const text = findPrayer(id, locale);
  if (text === undefined) {
    throw new MissingPrayerError(id, locale);
  }
  return {
    kind: 'prayer',
    prayer: text,
    optional,
    ...(decade === undefined ? {} : { decade }),
    ...(bead === undefined ? {} : { beadInDecade: bead }),
  };
}

function expand(step: FormStep, options: RosaryOptions): readonly Step[] {
  const on = (id: PrayerId, optional?: boolean): boolean =>
    optional !== true || (options.include ?? []).includes(id);

  switch (step.kind) {
    case 'prayer':
      return on(step.prayer, step.optional)
        ? [prayerStep(step.prayer, options.locale, step.optional === true)]
        : [];
    case 'prayer-times':
      return on(step.prayer, step.optional)
        ? Array.from({ length: step.times }, () =>
            prayerStep(step.prayer, options.locale, step.optional === true),
          )
        : [];
    case 'litany':
      return options.withLitany === true ? [{ kind: 'litany' }] : [];
    case 'decades':
      return [];
  }
}

function decadeSteps(
  mystery: Mystery,
  index: number,
  options: RosaryOptions,
  form: (typeof forms)[FormId],
): readonly Step[] {
  const steps: Step[] = [];

  if (form.decade.announce) {
    steps.push({ kind: 'announce', mystery, decade: index });
  }
  if (options.withReading === true) {
    steps.push({ kind: 'reading', mystery, decade: index });
  }
  const silence = options.silenceSeconds ?? 0;
  if (silence > 0) {
    steps.push({ kind: 'silence', seconds: silence, decade: index });
  }

  for (const step of form.decade.opening) {
    steps.push(...expand(step, options));
  }

  // What is essential and never configurable: Our Father, ten Hail Marys, Glory Be (MC 49).
  steps.push(prayerStep('pater-noster', options.locale, false, index));
  for (let bead = 1; bead <= 10; bead += 1) {
    steps.push(prayerStep('ave-maria', options.locale, false, index, bead));
  }
  steps.push(prayerStep('gloria-patri', options.locale, false, index));

  for (const step of form.decade.closing) {
    steps.push(...expand(step, options));
  }

  return steps;
}

const setOrder: readonly MysterySetId[] = [
  'gaudiosa',
  'luminosa',
  'dolorosa',
  'gloriosa',
];

/** The mysteries of one set, in order. */
export function mysteriesOfSet(set: MysterySetId): readonly Mystery[] {
  return mysteries
    .filter((mystery) => mystery.set === set)
    .slice()
    .sort((a, b) => a.order - b.order);
}

/**
 * Build the whole Rosary as a flat list of steps.
 *
 * The frame comes from the regional form; the decades are always mystery, Our Father, ten Hail
 * Marys and Glory Be, whatever the options say.
 */
export function buildRosary(options: RosaryOptions): readonly Step[] {
  const form = forms[options.form];
  const steps: Step[] = [];

  const sets = options.fullRosary === true ? setOrder : [options.set];
  let decade = 0;

  for (const formStep of form.opening) {
    if (formStep.kind === 'decades') {
      for (const set of sets) {
        for (const mystery of mysteriesOfSet(set)) {
          steps.push(...decadeSteps(mystery, decade, options, form));
          decade += 1;
        }
      }
      continue;
    }
    steps.push(...expand(formStep, options));
  }

  for (const formStep of form.closing) {
    steps.push(...expand(formStep, options));
  }

  return steps;
}

/** How many Hail Marys the built Rosary has. The number people check. */
export function countHailMarys(steps: readonly Step[]): number {
  return steps.filter((step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria')
    .length;
}
