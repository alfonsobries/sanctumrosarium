/**
 * Builds the audio packs: for every locale, each prayer split into the part the leader
 * says and the part the others answer, every litany call and response, and the
 * announcement of each mystery. Writes MP3s, a manifest with durations and a registry
 * the app can require.
 *
 * Voices are ElevenLabs v4 read as evenly as the model allows: the most stable setting, no
 * style, and a spoken text without exclamations or hard breaks, which pull it toward
 * declaiming. The words on screen keep their punctuation. Tracks that already exist are
 * kept; delete a file (or pass --force) to regenerate it.
 *
 * The Gospel passages are their own packs, one per language (both Spanish locales read
 * the same translation), read by the leader at a lower bitrate that suits speech.
 *
 * Run: pnpm audio:generate [--locale=es-MX] [--force] [--dry-run]
 *      pnpm audio:generate --scripture [--language=es] [--force] [--dry-run]
 *      pnpm audio:generate --registry
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  hasPrayerText,
  passagesOf,
  litany,
  mysteriesOf,
  mysteryTitle,
  prayerText,
  type Locale,
} from '../content/src/index';
import { mysterySets } from '../packages/rosary/src/index';

const root = join(import.meta.dirname, '..');
const audioRoot = join(root, 'app/assets/audio');

type Voice = { id: string; name: string };
type PackSpec = {
  locale: Locale;
  languageCode: string;
  leader: Voice;
  response: Voice;
  announce: (order: number, set: string, title: string) => string;
};

const giacomo = { id: 'caehoaMH3nxY1mX2suSI', name: 'Giacomo' };
const tatiana = { id: '2rigMbVWLdqtBSCahJFX', name: 'Tatiana' };
const marcus = { id: 'C9fbwSpEaejywLWx722Z', name: 'Marcus' };
const katie = { id: 'm4hBEimiy2ffkQ0hHMVD', name: 'Katie' };

const esOrdinals = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto'];
const esSets: Record<string, string> = {
  joyful: 'gozoso',
  luminous: 'luminoso',
  sorrowful: 'doloroso',
  glorious: 'glorioso',
};
const enOrdinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
const enSets: Record<string, string> = {
  joyful: 'Joyful',
  luminous: 'Luminous',
  sorrowful: 'Sorrowful',
  glorious: 'Glorious',
};
const laOrdinals = ['Primum', 'Secundum', 'Tertium', 'Quartum', 'Quintum'];
const laSets: Record<string, string> = {
  joyful: 'gaudiosum',
  luminous: 'luminosum',
  sorrowful: 'dolorosum',
  glorious: 'gloriosum',
};

const packs: PackSpec[] = [
  {
    locale: 'es-MX',
    languageCode: 'es',
    leader: giacomo,
    response: tatiana,
    announce: (order, set, title) => `${esOrdinals[order - 1]} misterio ${esSets[set]}: ${title}.`,
  },
  {
    locale: 'es-ES',
    languageCode: 'es',
    leader: giacomo,
    response: tatiana,
    announce: (order, set, title) => `${esOrdinals[order - 1]} misterio ${esSets[set]}: ${title}.`,
  },
  {
    locale: 'en-US',
    languageCode: 'en',
    leader: marcus,
    response: katie,
    announce: (order, set, title) => `The ${enOrdinals[order - 1]} ${enSets[set]} Mystery: ${title}.`,
  },
  {
    locale: 'la',
    // Ecclesiastical Latin is read with Italian vowels and consonants.
    languageCode: 'it',
    leader: giacomo,
    response: tatiana,
    announce: (order, set, title) =>
      `Mysterium ${laSets[set]} ${laOrdinals[order - 1]?.toLowerCase()}: ${title}.`,
  },
];

type ScriptureSpec = { language: 'es' | 'en' | 'la'; languageCode: string; reader: Voice };

const scripturePacks: ScriptureSpec[] = [
  { language: 'es', languageCode: 'es', reader: giacomo },
  { language: 'en', languageCode: 'en', reader: marcus },
  { language: 'la', languageCode: 'it', reader: giacomo },
];

const rosaryPrayers = [
  'sign-of-the-cross',
  'apostles-creed',
  'our-father',
  'hail-mary',
  'glory-be',
  'fatima-prayer',
  'hail-holy-queen',
  'rosary-closing-prayer',
];

type Track = { file: string; durationMs: number };
type Manifest = {
  version: 1;
  locale: Locale;
  model: string;
  voices: { leader: string; response: string };
  tracks: Record<string, Track>;
};

const model = 'eleven_v4';
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const dryRun = args.has('--dry-run');
const only = [...args].find((arg) => arg.startsWith('--locale='))?.split('=')[1];

function apiKey(): string {
  if (process.env.ELEVENLABS_API_KEY !== undefined) {
    return process.env.ELEVENLABS_API_KEY;
  }
  const match = readFileSync(join(homedir(), '.config/aikit/audio-gen.env'), 'utf8').match(
    /^ELEVENLABS_API_KEY=(.+)$/m,
  );
  if (match?.[1] === undefined) {
    throw new Error('ELEVENLABS_API_KEY not found');
  }
  return match[1].trim();
}

function durationMs(file: string): number {
  const output = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    {
      encoding: 'utf8',
    },
  );
  return Math.round(Number.parseFloat(output.trim()) * 1000);
}

const delivery = { stability: 1, similarity_boost: 0.6, style: 0, use_speaker_boost: false, speed: 0.92 };
/** Changes whenever the delivery or the spoken text rules change, so every track is made again. */
const deliveryVersion = 'even-1';

/** What the voice is given to say: the same words, without what makes it declaim. */
function spoken(text: string): string {
  return text
    .replace(/[¡!]/g, '')
    .replaceAll(';', ',')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s+([,.:])/g, '$1')
    .replace(/ {2,}/g, ' ')
    .trim();
}

/** A request to ElevenLabs, tried again with growing waits when the network drops or the API is busy. */
async function request(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, init);
      if ((response.status === 429 || response.status >= 500) && attempt < 5) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** attempt));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt >= 5) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** attempt));
    }
  }
}

function fileFor(key: string, text: string, voice: Voice): string {
  const hash = createHash('sha1')
    .update(`${model}|${deliveryVersion}|${voice.id}|${text}`)
    .digest('hex')
    .slice(0, 8);
  return `${key}-${hash}.mp3`;
}

async function synthesize(
  text: string,
  voice: Voice,
  languageCode: string,
  out: string,
  bitrate = '64k',
): Promise<void> {
  const response = await request(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: spoken(text),
        model_id: model,
        language_code: languageCode,
        voice_settings: delivery,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  }
  const raw = `${out}.raw.mp3`;
  writeFileSync(raw, Buffer.from(await response.arrayBuffer()));
  // Same loudness for every track and both voices; mono 64 kbps keeps packs small.
  execFileSync('ffmpeg', [
    '-loglevel',
    'error',
    '-y',
    '-i',
    raw,
    '-af',
    'loudnorm=I=-18:TP=-2,silenceremove=start_periods=1:start_threshold=-50dB',
    '-ac',
    '1',
    '-b:a',
    bitrate,
    out,
  ]);
  execFileSync('rm', [raw]);
}

type Job = { key: string; text: string; voice: Voice };

function jobsFor(pack: PackSpec): Job[] {
  const jobs: Job[] = [];
  for (const id of rosaryPrayers) {
    if (!hasPrayerText(id, pack.locale)) {
      continue;
    }
    const { lines, responseFrom } = prayerText(id, pack.locale);
    const split = responseFrom ?? lines.length;
    jobs.push({ key: `${id}.leader`, text: lines.slice(0, split).join('\n'), voice: pack.leader });
    if (split < lines.length) {
      jobs.push({ key: `${id}.response`, text: lines.slice(split).join('\n'), voice: pack.response });
    }
  }
  const responses = new Map<string, string>();
  litany(pack.locale).pairs.forEach((pair, index) => {
    jobs.push({ key: `litany.${index}.call`, text: pair.call, voice: pack.leader });
    const known = responses.get(pair.response);
    if (known === undefined) {
      responses.set(pair.response, `litany.response.${responses.size}`);
    }
  });
  for (const [text, key] of responses) {
    jobs.push({ key, text, voice: pack.response });
  }
  for (const set of mysterySets) {
    for (const mystery of mysteriesOf(set)) {
      jobs.push({
        key: `announce.${mystery.id}`,
        text: pack.announce(mystery.order, set, mysteryTitle(mystery.id, pack.locale)),
        voice: pack.leader,
      });
    }
  }
  return jobs;
}

/** Litany responses are shared; each call maps to the key of its response track. */
function litanyResponses(pack: PackSpec): string[] {
  const keys = new Map<string, string>();
  return litany(pack.locale).pairs.map((pair) => {
    const key = keys.get(pair.response) ?? `litany.response.${keys.size}`;
    keys.set(pair.response, key);
    return key;
  });
}

async function buildPack(pack: PackSpec): Promise<number> {
  const dir = join(audioRoot, pack.locale);
  mkdirSync(dir, { recursive: true });
  const manifestPath = join(dir, 'manifest.json');
  const previous: Manifest | null = existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest)
    : null;
  const manifest: Manifest = {
    version: 1,
    locale: pack.locale,
    model,
    voices: { leader: pack.leader.name, response: pack.response.name },
    tracks: {},
  };

  let characters = 0;
  for (const job of jobsFor(pack)) {
    const file = fileFor(job.key, job.text, job.voice);
    const path = join(dir, file);
    if (!force && existsSync(path) && previous?.tracks[job.key]?.file === file) {
      const { file: keptFile, durationMs: keptDuration } = previous.tracks[job.key]!;
      manifest.tracks[job.key] = { file: keptFile, durationMs: keptDuration };
      continue;
    }
    characters += job.text.length;
    if (dryRun) {
      continue;
    }
    process.stdout.write(`${pack.locale} ${job.key}\n`);
    await synthesize(job.text, job.voice, pack.languageCode, path);
    manifest.tracks[job.key] = { file, durationMs: durationMs(path) };
  }

  if (!dryRun) {
    writeFileSync(
      manifestPath,
      `${JSON.stringify({ ...manifest, litanyResponses: litanyResponses(pack) }, null, 2)}\n`,
    );
    prune(dir, manifest.tracks);
  }
  return characters;
}

type ScriptureManifest = { version: 1; language: string; model: string; reader: string; tracks: Record<string, Track> };

async function buildScripture(spec: ScriptureSpec): Promise<number> {
  const dir = join(audioRoot, `scripture-${spec.language}`);
  mkdirSync(dir, { recursive: true });
  const manifestPath = join(dir, 'manifest.json');
  const previous: ScriptureManifest | null = existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, 'utf8')) as ScriptureManifest)
    : null;
  const manifest: ScriptureManifest = {
    version: 1,
    language: spec.language,
    model,
    reader: spec.reader.name,
    tracks: {},
  };

  let characters = 0;
  for (const [ref, passage] of Object.entries(passagesOf(spec.language))) {
    // References carry spaces and colons; file names stay to letters, digits and dashes.
    const file = fileFor(`reading.${ref.replace(/[^A-Za-z0-9]+/g, '-')}`, passage.text, spec.reader);
    const path = join(dir, file);
    const kept = previous?.tracks[ref];
    if (!force && kept !== undefined && kept.file.slice(-13) === file.slice(-13) && existsSync(join(dir, kept.file))) {
      // Same recording under an older name: rename it rather than pay for it again.
      if (kept.file !== file) {
        renameSync(join(dir, kept.file), path);
      }
      manifest.tracks[ref] = { file, durationMs: kept.durationMs };
      continue;
    }
    characters += passage.text.length;
    if (dryRun) {
      continue;
    }
    process.stdout.write(`scripture-${spec.language} ${ref}\n`);
    await synthesize(passage.text, spec.reader, spec.languageCode, path, '40k');
    manifest.tracks[ref] = { file, durationMs: durationMs(path) };
    // Saved as it goes: a long run that stops halfway keeps what it already paid for.
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
  if (!dryRun) {
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    prune(dir, manifest.tracks);
  }
  return characters;
}

/** Drops recordings no manifest points to any more, so the app never bundles them. */
function prune(dir: string, tracks: Record<string, Track>): void {
  const kept = new Set(Object.values(tracks).map((track) => track.file));
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.mp3') && !kept.has(file)) {
      unlinkSync(join(dir, file));
    }
  }
}

function writeRegistry(): void {
  const lines = ['// Generated by scripts/generate-audio.mts. Do not edit.', 'export const audioPacks = {'];
  for (const pack of packs) {
    const manifestPath = join(audioRoot, pack.locale, 'manifest.json');
    if (!existsSync(manifestPath)) {
      continue;
    }
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
    lines.push(`  '${pack.locale}': {`);
    lines.push(`    manifest: require('@/assets/audio/${pack.locale}/manifest.json'),`);
    lines.push('    files: {');
    for (const track of Object.values(manifest.tracks)) {
      lines.push(`      '${track.file}': require('@/assets/audio/${pack.locale}/${track.file}'),`);
    }
    lines.push('    },');
    lines.push('  },');
  }
  lines.push('} as const;', '', 'export const scripturePacks = {');
  for (const spec of scripturePacks) {
    const folder = `scripture-${spec.language}`;
    const manifestPath = join(audioRoot, folder, 'manifest.json');
    if (!existsSync(manifestPath)) {
      continue;
    }
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ScriptureManifest;
    lines.push(`  ${spec.language}: {`);
    lines.push(`    manifest: require('@/assets/audio/${folder}/manifest.json'),`);
    lines.push('    files: {');
    for (const track of Object.values(manifest.tracks)) {
      lines.push(`      '${track.file}': require('@/assets/audio/${folder}/${track.file}'),`);
    }
    lines.push('    },');
    lines.push('  },');
  }
  lines.push('} as const;', '');
  writeFileSync(join(root, 'app/src/domains/audio/packs.gen.ts'), lines.join('\n'));
}

let total = 0;
if (args.has('--registry')) {
  // Only rewrites the app's registry from the packs already on disk.
} else if (args.has('--scripture')) {
  const language = [...args].find((arg) => arg.startsWith('--language='))?.split('=')[1];
  for (const spec of scripturePacks.filter((candidate) => language === undefined || candidate.language === language)) {
    total += await buildScripture(spec);
  }
} else {
  const selected = only === undefined ? ['es-MX'] : [only];
  for (const pack of packs.filter((candidate) => selected.includes(candidate.locale))) {
    total += await buildPack(pack);
  }
}
process.stdout.write(`${dryRun ? 'Would synthesize' : 'Synthesized'} ${total} characters\n`);
if (!dryRun) {
  mkdirSync(join(root, 'app/src/domains/audio'), { recursive: true });
  writeRegistry();
}
