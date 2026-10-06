/**
 * Builds the audio packs: for every locale, each prayer split into the part the leader
 * says and the part the others answer, every litany call and response, and the
 * announcement of each mystery. Writes MP3s, a manifest with durations and a registry
 * the app can require.
 *
 * Voices are ElevenLabs v4 with a calm, even delivery. Tracks that already exist are
 * kept; delete a file (or pass --force) to regenerate it.
 *
 * Run: pnpm audio:generate [--locale=es-MX] [--force] [--dry-run]
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  hasPrayerText,
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
const esSets: Record<string, string> = { joyful: 'gozoso', luminous: 'luminoso', sorrowful: 'doloroso', glorious: 'glorioso' };
const enOrdinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
const enSets: Record<string, string> = { joyful: 'Joyful', luminous: 'Luminous', sorrowful: 'Sorrowful', glorious: 'Glorious' };
const laOrdinals = ['Primum', 'Secundum', 'Tertium', 'Quartum', 'Quintum'];
const laSets: Record<string, string> = { joyful: 'gaudiosum', luminous: 'luminosum', sorrowful: 'dolorosum', glorious: 'gloriosum' };

const packs: PackSpec[] = [
  {
    locale: 'es-MX',
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
    announce: (order, set, title) => `Mysterium ${laSets[set]} ${laOrdinals[order - 1]?.toLowerCase()}: ${title}.`,
  },
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
  const match = readFileSync(join(homedir(), '.config/aikit/audio-gen.env'), 'utf8').match(/^ELEVENLABS_API_KEY=(.+)$/m);
  if (match?.[1] === undefined) {
    throw new Error('ELEVENLABS_API_KEY not found');
  }
  return match[1].trim();
}

function durationMs(file: string): number {
  const output = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {
    encoding: 'utf8',
  });
  return Math.round(Number.parseFloat(output.trim()) * 1000);
}

function fileFor(key: string, text: string, voice: Voice): string {
  const hash = createHash('sha1').update(`${model}|${voice.id}|${text}`).digest('hex').slice(0, 8);
  return `${key}-${hash}.mp3`;
}

async function synthesize(text: string, voice: Voice, languageCode: string, out: string): Promise<void> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: model,
        language_code: languageCode,
        voice_settings: { stability: 0.7, similarity_boost: 0.8, speed: 0.95 },
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  }
  const raw = `${out}.raw.mp3`;
  writeFileSync(raw, Buffer.from(await response.arrayBuffer()));
  // Same loudness for every track and both voices; mono 64 kbps keeps packs small.
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-18:TP=-2,silenceremove=start_periods=1:start_threshold=-50dB', '-ac', '1', '-b:a', '64k', out]);
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
  const previous: Manifest | null = existsSync(manifestPath) ? (JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest) : null;
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
      manifest.tracks[job.key] = previous.tracks[job.key]!;
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
    writeFileSync(manifestPath, `${JSON.stringify({ ...manifest, litanyResponses: litanyResponses(pack) }, null, 2)}\n`);
  }
  return characters;
}

function writeRegistry(): void {
  const lines = [
    '// Generated by scripts/generate-audio.mts. Do not edit.',
    'export const audioPacks = {',
  ];
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
  lines.push('} as const;', '');
  writeFileSync(join(root, 'app/src/domains/audio/packs.gen.ts'), lines.join('\n'));
}

let total = 0;
const selected = only === undefined ? ['es-MX'] : [only];
for (const pack of packs.filter((candidate) => selected.includes(candidate.locale))) {
  total += await buildPack(pack);
}
process.stdout.write(`${dryRun ? 'Would synthesize' : 'Synthesized'} ${total} characters\n`);
if (!dryRun) {
  mkdirSync(join(root, 'app/src/domains/audio'), { recursive: true });
  writeRegistry();
}
