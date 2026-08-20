import { describe, expect, it } from 'vitest';

import { en } from './en';
import { es } from './es';

function flatten(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') {
    return { [prefix]: value };
  }
  const entries: Record<string, string> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    Object.assign(entries, flatten(child, prefix === '' ? key : `${prefix}.${key}`));
  }
  return entries;
}

// A string that exists in only one language is an error, not a pending item (docs/voz.md).
describe('interface copy', () => {
  const flatEs = flatten(es);
  const flatEn = flatten(en);

  it('has the same keys in every language', () => {
    expect(Object.keys(flatEs).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it('has no empty strings', () => {
    for (const [key, text] of [...Object.entries(flatEs), ...Object.entries(flatEn)]) {
      expect(text.trim(), key).not.toBe('');
    }
  });

  it('uses the same interpolation placeholders in every language', () => {
    const placeholders = (text: string) =>
      [...text.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort();
    for (const key of Object.keys(flatEs)) {
      expect(placeholders(flatEs[key]), key).toEqual(placeholders(flatEn[key] ?? ''));
    }
  });
});
