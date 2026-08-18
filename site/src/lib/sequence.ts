import {
  allForms,
  type Locale,
  type PrayerId,
  type RosaryForm,
  type FormStep,
} from '@rosario/content';
import { buildRosary, type Step } from '@rosario/engine';

import type { UiLanguage } from '../i18n/ui';

export type OutlineEntry = {
  kind: 'prayer' | 'announce' | 'reading' | 'litany';
  label: string;
  times: number;
  optional: boolean;
};

export type Outline = {
  form: RosaryForm;
  locale: Locale;
  opening: readonly OutlineEntry[];
  decade: readonly OutlineEntry[];
  closing: readonly OutlineEntry[];
};

/** Prefer the page's own locale; otherwise the first one the form is written for. */
export function localeFor(form: RosaryForm, language: UiLanguage): Locale {
  const preferred: Locale = language === 'es' ? 'es-MX' : 'en-US';
  if (form.locales.includes(preferred)) {
    return preferred;
  }
  const own = form.locales.find((locale) => locale.startsWith(language));
  return own ?? form.locales[0] ?? preferred;
}

export function formsFor(language: UiLanguage): readonly RosaryForm[] {
  return allForms.filter((form) =>
    form.locales.some((locale) => locale.startsWith(language)),
  );
}

function optionalPrayers(steps: readonly FormStep[]): PrayerId[] {
  return steps.flatMap((step) =>
    (step.kind === 'prayer' || step.kind === 'prayer-times') && step.optional === true
      ? [step.prayer]
      : [],
  );
}

function hasOptionalLitany(form: RosaryForm): boolean {
  return form.closing.some((step) => step.kind === 'litany' && step.optional === true);
}

function labelOf(step: Step, labels: Labels): OutlineEntry | undefined {
  switch (step.kind) {
    case 'prayer':
      return {
        kind: 'prayer',
        label: step.prayer.title,
        times: 1,
        optional: step.optional,
      };
    case 'announce':
      return { kind: 'announce', label: labels.announce, times: 1, optional: false };
    case 'reading':
      return { kind: 'reading', label: labels.reading, times: 1, optional: true };
    case 'litany':
      return {
        kind: 'litany',
        label: labels.litany,
        times: 1,
        optional: labels.litanyOptional,
      };
    case 'silence':
      return undefined;
  }
}

/** Collapses consecutive repeats of the same prayer into one entry with a count. */
function collapse(entries: readonly OutlineEntry[]): OutlineEntry[] {
  return entries.reduce<OutlineEntry[]>((acc, entry) => {
    const last = acc[acc.length - 1];
    if (last && last.kind === 'prayer' && last.label === entry.label) {
      return [...acc.slice(0, -1), { ...last, times: last.times + entry.times }];
    }
    return [...acc, entry];
  }, []);
}

type Labels = {
  announce: string;
  reading: string;
  litany: string;
  litanyOptional: boolean;
};

export function outlineOf(
  form: RosaryForm,
  language: UiLanguage,
  labels: Omit<Labels, 'litanyOptional'>,
): Outline {
  const locale = localeFor(form, language);
  const include = [
    ...optionalPrayers(form.opening),
    ...optionalPrayers(form.decade.opening),
    ...optionalPrayers(form.decade.closing),
    ...optionalPrayers(form.closing),
  ];
  const steps = buildRosary({
    form: form.id,
    locale,
    set: 'gaudiosa',
    include,
    withLitany: true,
    withReading: form.decade.reading,
  });
  const full: Labels = { ...labels, litanyOptional: hasOptionalLitany(form) };
  const entries = steps.map((step) => ({ step, entry: labelOf(step, full) }));

  const firstDecade = entries.findIndex(
    ({ step }) => 'decade' in step && step.decade === 0,
  );
  const lastDecade = entries.reduce(
    (found, { step }, index) => ('decade' in step ? index : found),
    -1,
  );
  const pick = (list: typeof entries): OutlineEntry[] =>
    collapse(list.flatMap(({ entry }) => (entry ? [entry] : [])));

  return {
    form,
    locale,
    opening: pick(entries.slice(0, firstDecade)),
    decade: pick(entries.filter(({ step }) => 'decade' in step && step.decade === 0)),
    closing: pick(entries.slice(lastDecade + 1)),
  };
}
