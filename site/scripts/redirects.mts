/**
 * Writes vercel.json with the redirects from the old URLs: `pnpm --filter site redirects`.
 * Run after adding or renaming a page in src/i18n/routes.ts.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { legacyRedirects } from '../src/lib/redirects.ts';

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  // Astro builds every page as a folder; this keeps one URL per page, the one with the slash.
  trailingSlash: true,
  redirects: legacyRedirects(),
};

writeFileSync(join(import.meta.dirname, '../vercel.json'), `${JSON.stringify(config, null, 2)}\n`);
console.log(`  vercel.json: ${config.redirects.length} redirects`);
