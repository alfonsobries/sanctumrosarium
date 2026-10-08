import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { legacyRedirects } from '../src/lib/redirects';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');

describe('legacy redirects', () => {
  it('match what vercel.json ships (`pnpm --filter site redirects` regenerates it)', () => {
    const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')) as { redirects: unknown };
    expect(config.redirects).toEqual(legacyRedirects());
  });

  it('never redirect the English home', () => {
    expect(legacyRedirects().map((redirect) => redirect.source)).not.toContain('/');
  });

  it.skipIf(!existsSync(dist))('land on pages that exist', () => {
    for (const { destination } of legacyRedirects().filter((redirect) => !redirect.destination.includes(':'))) {
      expect(existsSync(join(dist, destination, 'index.html')), destination).toBe(true);
    }
  });
});
