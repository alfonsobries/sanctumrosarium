/**
 * Paints the illustrated mystery sets: each image comes from the set's style
 * (scripts/artwork/style-<set>.txt) plus the scene of the mystery (scripts/artwork/scenes.json,
 * where scripts/artwork/scenes-<set>.json may retell a scene for one set), through the OpenAI
 * Images API. Square, saved as JPG in app/assets/mysteries/<set>/, then
 * app/src/domains/artwork/illustrated.ts is rebuilt with a thumbhash and dominant color for
 * every image on disk.
 *
 * Images that already exist are kept; pass --force (optionally with --only) to repaint them.
 *
 * Run: pnpm artwork:generate --set=glass [--only=joyful-1-annunciation,...] [--force] [--concurrency=4]
 *      pnpm artwork:generate --registry
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';

const root = join(import.meta.dirname, '..');
const artworkDir = join(import.meta.dirname, 'artwork');
const mysteriesDir = join(root, 'app/assets/mysteries');
const registryFile = join(root, 'app/src/domains/artwork/illustrated.ts');

const model = 'gpt-image-2';
const size = 1024;

/** Every illustrated set, with the title its images carry in the app. */
const sets = {
  glass: 'Stained glass (generated)',
  guadalupana: 'Guadalupan devotional painting (generated)',
  trazo: 'Modern vector illustration (generated)',
  kids: 'Picture-book illustration (generated)',
  maestros: 'Old master painting (generated)',
} as const;
type SetId = keyof typeof sets;

const args = process.argv.slice(2);
const option = (name: string): string | undefined =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];
const force = args.includes('--force');
const registryOnly = args.includes('--registry');
const concurrency = Number(option('concurrency') ?? 4);
const only = option('only')?.split(',');

function apiKey(): string {
  if (process.env.OPENAI_API_KEY !== undefined) {
    return process.env.OPENAI_API_KEY;
  }
  const match = readFileSync(join(homedir(), '.config/aikit/image-gen.env'), 'utf8').match(
    /^OPENAI_API_KEY=(.+)$/m,
  );
  if (match?.[1] === undefined) {
    throw new Error('OPENAI_API_KEY not found');
  }
  return match[1].trim().replace(/^["']|["']$/g, '');
}

const scenes: Record<string, string> = JSON.parse(readFileSync(join(artworkDir, 'scenes.json'), 'utf8'));
const mysteryIds = Object.keys(scenes).sort();

function sceneOf(set: SetId, id: string): string {
  const overrides = join(artworkDir, `scenes-${set}.json`);
  const own: Record<string, string> = existsSync(overrides)
    ? JSON.parse(readFileSync(overrides, 'utf8'))
    : {};
  return own[id] ?? scenes[id] ?? '';
}

async function paint(set: SetId, id: string): Promise<void> {
  const style = readFileSync(join(artworkDir, `style-${set}.txt`), 'utf8').trim();
  const prompt = `${style}\n\nScene: ${sceneOf(set, id)}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          size: `${size}x${size}`,
          quality: 'high',
          output_format: 'png',
          moderation: 'low',
        }),
        signal: AbortSignal.timeout(300_000),
      });
      const body = (await response.json()) as { data?: { b64_json?: string }[]; error?: { message: string } };
      const image = body.data?.[0]?.b64_json;
      if (!response.ok || image === undefined) {
        throw new Error(body.error?.message ?? `HTTP ${response.status}`);
      }
      const file = join(mysteriesDir, set, `${id}.jpg`);
      const partial = `${file}.partial`;
      await sharp(Buffer.from(image, 'base64'))
        .resize(size, size)
        .jpeg({ quality: 84, mozjpeg: true })
        .toFile(partial);
      renameSync(partial, file);
      console.log(`  ${set}/${id}`);
      return;
    } catch (error) {
      if (attempt >= 3) {
        throw new Error(`${set}/${id}: ${(error as Error).message}`);
      }
      console.warn(`  ${set}/${id} failed (${(error as Error).message}), retrying`);
    }
  }
}

async function inPool<T>(items: T[], limit: number, work: (item: T) => Promise<void>): Promise<void> {
  const queue = [...items];
  const failures: unknown[] = [];
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) {
        await work(item).catch((error: unknown) => failures.push(error));
      }
    }),
  );
  if (failures.length > 0) {
    throw new AggregateError(failures, `${failures.length} image(s) failed`);
  }
}

async function describe(file: string): Promise<{ thumbhash: string; color: string }> {
  const { data, info } = await sharp(file)
    .resize(100, 100, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hash = rgbaToThumbHash(info.width, info.height, data);
  const { dominant } = await sharp(file).stats();
  const hex = [dominant.r, dominant.g, dominant.b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
  return { thumbhash: Buffer.from(hash).toString('base64').replace(/=+$/, ''), color: `#${hex}` };
}

async function writeRegistry(): Promise<void> {
  const blocks: string[] = [];
  for (const [set, title] of Object.entries(sets)) {
    const entries: string[] = [];
    for (const id of mysteryIds) {
      const file = join(mysteriesDir, set, `${id}.jpg`);
      if (!existsSync(file)) {
        continue;
      }
      const { thumbhash, color } = await describe(file);
      entries.push(
        [
          `    '${id}': {`,
          `      source: require('@/assets/mysteries/${set}/${id}.jpg'),`,
          `      thumbhash: '${thumbhash}',`,
          `      color: '${color}',`,
          `      title: '${title}',`,
          `      artist: 'Sanctum Rosarium',`,
          `      fill: 'cover',`,
          `    },`,
        ].join('\n'),
      );
    }
    blocks.push(`  ${set}: {\n${entries.join('\n')}\n  },`);
  }
  const source = [
    `import type { IllustratedStyle } from '@/shared/theme/skins';`,
    ``,
    `import type { Artwork } from './artworks';`,
    ``,
    `/** Illustrated mystery sets for the skins that use them; generated by scripts/generate-artwork.mts. */`,
    `export const illustrated: Record<IllustratedStyle, Record<string, Artwork>> = {`,
    ...blocks,
    `};`,
    ``,
  ].join('\n');
  writeFileSync(registryFile, source);
  execFileSync('pnpm', ['exec', 'prettier', '--write', registryFile], { cwd: root, stdio: 'ignore' });
  console.log(`Wrote ${registryFile}`);
}

if (!registryOnly) {
  const set = option('set');
  if (set === undefined || !(set in sets)) {
    throw new Error(`Pass --set=${Object.keys(sets).join('|')}`);
  }
  const setId = set as SetId;
  mkdirSync(join(mysteriesDir, setId), { recursive: true });
  const pending = mysteryIds.filter(
    (id) =>
      (only === undefined || only.includes(id)) &&
      (force || !existsSync(join(mysteriesDir, setId, `${id}.jpg`))),
  );
  console.log(`Painting ${pending.length} image(s) for ${setId} with ${model}`);
  try {
    await inPool(pending, concurrency, (id) => paint(setId, id));
  } finally {
    await writeRegistry();
  }
} else {
  await writeRegistry();
}
