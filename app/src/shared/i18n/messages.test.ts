import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { en } from './messages/en';
import { es } from './messages/es';

function keysOf(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    keysOf(child, prefix === '' ? key : `${prefix}.${key}`),
  );
}

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return sources(path);
    }
    return /\.tsx?$/.test(entry) && !entry.endsWith('.test.ts') ? [path] : [];
  });
}

describe('interface messages', () => {
  it('has the same keys in Spanish and English', () => {
    expect(keysOf(es).sort()).toEqual(keysOf(en).sort());
  });

  it('defines every literal key the screens ask for', () => {
    const known = new Set(keysOf(es).map((key) => key.replace(/_(one|other)$/, '')));
    const missing = sources(join(import.meta.dirname, '../..'))
      .flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/\bt\('([a-zA-Z]+(?:\.[a-zA-Z-]+)+)'/g)])
      .map((match) => match[1] as string)
      .filter((key) => !known.has(key));
    expect([...new Set(missing)]).toEqual([]);
  });
});
