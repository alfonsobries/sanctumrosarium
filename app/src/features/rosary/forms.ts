import {
  allForms,
  forms,
  type FormId,
  type FormStep,
  type Locale,
  type PrayerId,
  type RosaryForm,
} from '@rosario/content';

import { formForPrayerLocale } from '@/settings/resolve-locale';
import type { PrayerFormSetting } from '@/settings/store';

/** Forms that can actually be prayed in a locale: every prayer of the form exists in it. */
export function formsForLocale(locale: Locale): readonly RosaryForm[] {
  return allForms.filter((form) => form.locales.includes(locale));
}

/**
 * The form the Rosary is built with. A chosen form that the prayer language cannot pray
 * falls back to following the language, never to a broken sequence.
 */
export function effectiveForm(setting: PrayerFormSetting, locale: Locale): FormId {
  if (setting !== 'auto' && forms[setting].locales.includes(locale)) {
    return setting;
  }
  return formForPrayerLocale(locale);
}

function prayerOf(step: FormStep): PrayerId | undefined {
  return step.kind === 'prayer' || step.kind === 'prayer-times' ? step.prayer : undefined;
}

/** The optional prayers a form offers, in the order they appear in the sequence. */
export function optionalPrayersOf(form: RosaryForm): readonly PrayerId[] {
  const steps: readonly FormStep[] = [
    ...form.opening,
    ...form.decade.opening,
    ...form.decade.closing,
    ...form.closing,
  ];
  const seen = new Set<PrayerId>();
  for (const step of steps) {
    const prayer = prayerOf(step);
    if (
      prayer !== undefined &&
      (step.kind === 'prayer' || step.kind === 'prayer-times') &&
      step.optional === true
    ) {
      seen.add(prayer);
    }
  }
  return [...seen];
}
