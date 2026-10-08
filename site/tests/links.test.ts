import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/** Runs against the built site (`pnpm --filter site test` builds first). */
const dist = join(import.meta.dirname, '../dist');

function pages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? pages(join(dir, entry.name)) : entry.name.endsWith('.html') ? [join(dir, entry.name)] : [],
  );
}

function resolves(href: string): boolean {
  const path = decodeURIComponent(href.split('#')[0]!.split('?')[0]!);
  const file = join(dist, path);
  return path.endsWith('/') ? existsSync(join(file, 'index.html')) : existsSync(file);
}

describe.skipIf(!existsSync(dist))('built site', () => {
  const html = pages(dist).map((file) => ({ file: file.slice(dist.length), text: readFileSync(file, 'utf8') }));

  it('links only to pages and files that exist', () => {
    const broken: string[] = [];
    for (const page of html) {
      for (const [, href] of page.text.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        if (!resolves(href!)) {
          broken.push(`${page.file} -> ${href}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('gives every page a title, a description, a canonical URL and both languages', () => {
    for (const page of html.filter((p) => !p.file.startsWith('/404'))) {
      expect(page.text, page.file).toMatch(/<title>[^<]{10,}<\/title>/);
      expect(page.text, page.file).toMatch(/<meta name="description" content="[^"]{50,}"/);
      expect(page.text, page.file).toMatch(/<link rel="canonical" href="https:\/\/sanctamaria\.app\//);
      expect(page.text, page.file).toContain('hreflang="es"');
      expect(page.text, page.file).toContain('hreflang="en"');
    }
  });

  it('points every alternate language link at a page that exists', () => {
    for (const page of html) {
      for (const [, href] of page.text.matchAll(/hreflang="(?:es|en|x-default)" href="https:\/\/sanctamaria\.app([^"]*)"/g)) {
        expect(resolves(href!), `${page.file} -> ${href}`).toBe(true);
      }
    }
  });
});
