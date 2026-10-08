/**
 * Photographs every social card template (src/pages/_og) at 1200x630 into public/og.
 * Run after changing the cards' copy or design: `pnpm --filter site og` (builds first).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

import { chromium } from 'playwright';

import { ogCards } from '../src/lib/og.ts';

const root = join(import.meta.dirname, '..');
execFileSync('npx', ['astro', 'build'], { cwd: root, stdio: 'inherit' });
// A minimal static server over dist: enough for the browser to load the templates.
const dist = join(root, 'dist');
const types: Record<string, string> = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname);
  const file = join(dist, path.endsWith('/') ? `${path}index.html` : path);
  if (!file.startsWith(dist) || !existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
}).listen(4390);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of ogCards) {
  const name = `${card.name}-${card.language}`;
  await page.goto(`http://localhost:4390/og-card/${name}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, 'public/og', `${name}.png`) });
  console.log(`  og/${name}.png`);
}
await browser.close();
server.close();
// The templates are only for photographing; they never ship.
rmSync(join(root, 'dist/og-card'), { recursive: true, force: true });
