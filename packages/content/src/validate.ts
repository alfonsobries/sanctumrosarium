import { allForms } from './forms';
import { lauretanae } from './litany';
import { mysteries } from './mysteries';
import { findPrayer, prayers } from './prayers';
import type { Locale } from './types';

export type ValidationIssue = {
  readonly kind:
    | 'missing-source'
    | 'missing-prayer'
    | 'empty-text'
    | 'bad-response-split'
    | 'bad-mystery';
  readonly detail: string;
};

/**
 * The gate every change to the content has to pass.
 *
 * A prayer without a source, a form pointing at a text that does not exist in its locale, or a
 * mystery missing its pieces are all failures, not warnings: this content is what people pray.
 */
export function validateContent(): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const prayer of prayers) {
    const where = `${prayer.id} (${prayer.locale})`;

    if (prayer.source.name.trim() === '') {
      issues.push({ kind: 'missing-source', detail: `${where} has no source` });
    }
    if (prayer.lines.length === 0 || prayer.lines.some((line) => line.trim() === '')) {
      issues.push({ kind: 'empty-text', detail: `${where} has an empty line` });
    }
    if (prayer.responseFrom !== undefined) {
      const valid = prayer.responseFrom > 0 && prayer.responseFrom < prayer.lines.length;
      if (!valid) {
        issues.push({
          kind: 'bad-response-split',
          detail: `${where} splits the response at line ${prayer.responseFrom} of ${prayer.lines.length}`,
        });
      }
    }
  }

  for (const form of allForms) {
    const steps = [
      ...form.opening,
      ...form.decade.opening,
      ...form.decade.closing,
      ...form.closing,
    ];
    for (const step of steps) {
      if (step.kind !== 'prayer' && step.kind !== 'prayer-times') {
        continue;
      }
      for (const locale of form.locales) {
        if (findPrayer(step.prayer, locale as Locale) === undefined) {
          issues.push({
            kind: 'missing-prayer',
            detail: `form ${form.id} uses ${step.prayer}, missing in ${locale}`,
          });
        }
      }
    }
  }

  for (const line of lauretanae.lines) {
    for (const language of ['es', 'en', 'la'] as const) {
      if (line.call[language].trim() === '') {
        issues.push({
          kind: 'empty-text',
          detail: `litany line ${line.id} missing in ${language}`,
        });
      }
    }
  }

  for (const mystery of mysteries) {
    for (const language of ['es', 'en', 'la'] as const) {
      const text = mystery.text[language];
      if (text.title.trim() === '' || text.fruit.trim() === '') {
        issues.push({
          kind: 'bad-mystery',
          detail: `${mystery.id} incomplete in ${language}`,
        });
      }
    }
    if (mystery.scriptureRef.trim() === '') {
      issues.push({
        kind: 'bad-mystery',
        detail: `${mystery.id} has no scripture reference`,
      });
    }
  }

  return issues;
}
