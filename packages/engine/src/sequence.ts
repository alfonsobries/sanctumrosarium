import {
  findPrayer,
  forms,
  mysteries,
  type FormId,
  type FormStep,
  type Language,
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
  /**
   * How many decades to pray from the chosen set, in order. A single decade is a
   * complete act of that length (task 040), not a broken Rosary.
   */
  readonly decadeCount?: number;
  /**
   * Pray some prayers in another language (task 021): whoever is learning Latin mixes
   * one prayer at a time. A prayer missing in the override locale falls back to the
   * base locale, never to an error.
   */
  readonly localeOverrides?: Readonly<Partial<Record<PrayerId, Locale>>>;
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

function languageOf(locale: Locale): Language {
  if (locale === 'la') {
    return 'la';
  }
  return locale.startsWith('es') ? 'es' : 'en';
}

/**
 * The clause after the name of Jesus in each Hail Mary (DPPL 201): the phrase of the
 * mystery being meditated, appended to the line that names him. The call/response cut
 * keeps its index, so praying in two voices is untouched.
 */
function withClauseAfterJesus(text: PrayerText, clause: string): PrayerText {
  const jesus = /(Jesús|Jesus|Iesus)([.,]?)$/;
  return {
    ...text,
    lines: text.lines.map((line) =>
      jesus.test(line) ? line.replace(jesus, (_m, name) => `${name}, ${clause}.`) : line,
    ),
  };
}

function prayerStep(
  id: PrayerId,
  locale: Locale,
  optional: boolean,
  decade?: number,
  bead?: number,
  mystery?: Mystery,
  override?: Locale,
): Step {
  const text =
    (override === undefined ? undefined : findPrayer(id, override)) ??
    findPrayer(id, locale);
  if (text === undefined) {
    throw new MissingPrayerError(id, locale);
  }
  return {
    kind: 'prayer',
    prayer: text,
    optional,
    ...(decade === undefined ? {} : { decade }),
    ...(bead === undefined ? {} : { beadInDecade: bead }),
    ...(mystery === undefined ? {} : { mystery }),
  };
}

function expand(
  step: FormStep,
  options: RosaryOptions,
  context?: { decade: number; mystery: Mystery },
): readonly Step[] {
  const on = (id: PrayerId, optional?: boolean): boolean =>
    optional !== true || (options.include ?? []).includes(id);

  switch (step.kind) {
    case 'prayer':
      return on(step.prayer, step.optional)
        ? [
            prayerStep(
              step.prayer,
              options.locale,
              step.optional === true,
              context?.decade,
              undefined,
              context?.mystery,
              options.localeOverrides?.[step.prayer],
            ),
          ]
        : [];
    case 'prayer-times':
      return on(step.prayer, step.optional)
        ? Array.from({ length: step.times }, () =>
            prayerStep(
              step.prayer,
              options.locale,
              step.optional === true,
              context?.decade,
              undefined,
              context?.mystery,
              options.localeOverrides?.[step.prayer],
            ),
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

  const context = { decade: index, mystery };

  for (const step of form.decade.opening) {
    steps.push(...expand(step, options, context));
  }

  // What is essential and never configurable: Our Father, ten Hail Marys, Glory Be (MC 49).
  steps.push(
    prayerStep(
      'pater-noster',
      options.locale,
      false,
      index,
      undefined,
      mystery,
      options.localeOverrides?.['pater-noster'],
    ),
  );
  for (let bead = 1; bead <= 10; bead += 1) {
    const ave = prayerStep(
      'ave-maria',
      options.locale,
      false,
      index,
      bead,
      mystery,
      options.localeOverrides?.['ave-maria'],
    );
    if (options.withClauses === true && ave.kind === 'prayer') {
      const clause =
        mystery.text[languageOf(ave.prayer.locale)].clause ??
        mystery.text[languageOf(options.locale)].clause;
      steps.push(
        clause === undefined
          ? ave
          : { ...ave, prayer: withClauseAfterJesus(ave.prayer, clause) },
      );
    } else {
      steps.push(ave);
    }
  }
  steps.push(
    prayerStep(
      'gloria-patri',
      options.locale,
      false,
      index,
      undefined,
      mystery,
      options.localeOverrides?.['gloria-patri'],
    ),
  );

  for (const step of form.decade.closing) {
    steps.push(...expand(step, options, context));
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
        const mysteries = mysteriesOfSet(set);
        const limit = options.decadeCount ?? mysteries.length;
        for (const mystery of mysteries.slice(0, limit)) {
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
