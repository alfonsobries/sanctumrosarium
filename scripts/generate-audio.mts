/**
 * Builds the audio packs: for every locale, each prayer split into the part the leader
 * says and the part the others answer, every litany call and response, and the
 * announcement of each mystery. Writes MP3s, a manifest with durations and a registry
 * the app can require.
 *
 * Every pack is read as evenly as its model allows: the most stable setting and a spoken
 * text without exclamations or hard breaks, which pull it toward declaiming. The words on
 * screen keep their punctuation. Spanish is read by Multilingual v2: Eleven v4 hears
 * "Oh Jesús mío" or "Señor, ten piedad" as exclamations and stretches their vowels, and no
 * v4 setting, text or audio tag flattens it (tags on short lines make it repeat words).
 * English and Latin stay on v4, which reads them evenly and is the only one that takes the
 * Italian pronunciation Latin needs. Tracks that already exist are kept; delete a file
 * (or pass --force) to regenerate it.
 *
 * The Gospel passages are their own packs, one per language (both Spanish locales read
 * the same translation), read by the leader at a lower bitrate that suits speech.
 *
 * The Auxilium Christianorum prayers are their own packs, one per language, read by the
 * same two voices as that language's Rosary; the Our Father, Hail Mary and Glory Be come
 * from the Rosary pack. A response said many times is recorded once.
 *
 * Run: pnpm audio:generate [--locale=es-MX] [--force] [--dry-run]
 *      pnpm audio:generate --scripture [--language=es] [--force] [--dry-run]
 *      pnpm audio:generate --auxilium [--language=es] [--force] [--dry-run]
 *      pnpm audio:generate --registry
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  auxiliumText,
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
/** Every recording and the silence share this rate; the player relies on it. */
const sampleRate = 48_000;

type Voice = { id: string; name: string };
type Delivery = {
  model: string;
  /** Changes whenever the settings or the spoken text rules change, so every track is made again. */
  version: string;
  settings: Record<string, number | boolean>;
  /** Multilingual v2 rejects a language code and detects the language from the text. */
  takesLanguageCode: boolean;
};

/** v4 only reads stability and similarity; style and speed are not available on it. */
const v4: Delivery = {
  model: 'eleven_v4',
  version: 'even-1',
  settings: { stability: 1, similarity_boost: 0.6 },
  takesLanguageCode: true,
};
const multilingualV2: Delivery = {
  model: 'eleven_multilingual_v2',
  version: 'even-2',
  settings: { stability: 1, similarity_boost: 0.6, style: 0, use_speaker_boost: false, speed: 0.85 },
  takesLanguageCode: false,
};

type PackSpec = {
  locale: Locale;
  languageCode: string;
  delivery: Delivery;
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
    delivery: multilingualV2,
    leader: giacomo,
    response: tatiana,
    announce: (order, set, title) => `${esOrdinals[order - 1]} misterio ${esSets[set]}: ${title}.`,
  },
  {
    locale: 'es-ES',
    languageCode: 'es',
    delivery: multilingualV2,
    leader: giacomo,
    response: tatiana,
    announce: (order, set, title) => `${esOrdinals[order - 1]} misterio ${esSets[set]}: ${title}.`,
  },
  {
    locale: 'en-US',
    languageCode: 'en',
    delivery: v4,
    leader: marcus,
    response: katie,
    announce: (order, set, title) => `The ${enOrdinals[order - 1]} ${enSets[set]} Mystery: ${title}.`,
  },
  {
    locale: 'la',
    // Ecclesiastical Latin is read with Italian vowels and consonants.
    languageCode: 'it',
    delivery: v4,
    leader: giacomo,
    response: tatiana,
    announce: (order, set, title) =>
      `Mysterium ${laSets[set]} ${laOrdinals[order - 1]?.toLowerCase()}: ${title}.`,
  },
];

type ScriptureSpec = {
  language: 'es' | 'en' | 'la';
  languageCode: string;
  delivery: Delivery;
  reader: Voice;
};

const scripturePacks: ScriptureSpec[] = [
  { language: 'es', languageCode: 'es', delivery: v4, reader: giacomo },
  { language: 'en', languageCode: 'en', delivery: v4, reader: marcus },
  { language: 'la', languageCode: 'it', delivery: v4, reader: giacomo },
];

type AuxiliumSpec = { language: 'es' | 'en' | 'la'; pack: Locale };

/** Both Spanish locales share one booklet, so one pack read by the Mexican voices. */
const auxiliumPacks: AuxiliumSpec[] = [
  { language: 'es', pack: 'es-MX' },
  { language: 'en', pack: 'en-US' },
  { language: 'la', pack: 'la' },
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
  'hail-mary-faith',
  'hail-mary-hope',
  'hail-mary-charity',
  'trinity-salutation',
];

type Track = { file: string; durationMs: number };
type Manifest = {
  version: 1;
  locale: Locale;
  model: string;
  voices: { leader: string; response: string };
  tracks: Record<string, Track>;
};

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

/** What the voice is given to say: the same words, without what makes it declaim. */
function spoken(text: string): string {
  return text
    .replace(/[¡!]/g, '')
    .replace(/✠\s*/g, '')
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

function fileFor(key: string, text: string, voice: Voice, delivery: Delivery): string {
  const hash = createHash('sha1')
    .update(`${delivery.model}|${delivery.version}|${voice.id}|${text}`)
    .digest('hex')
    .slice(0, 8);
  return `${key}-${hash}.mp3`;
}

async function synthesize(
  text: string,
  voice: Voice,
  languageCode: string,
  delivery: Delivery,
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
        model_id: delivery.model,
        ...(delivery.takesLanguageCode ? { language_code: languageCode } : {}),
        voice_settings: delivery.settings,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  }
  const raw = `${out}.raw.mp3`;
  writeFileSync(raw, Buffer.from(await response.arrayBuffer()));
  encode(['-i', raw], out, bitrate, [
    'loudnorm=I=-18:TP=-2',
    'silenceremove=start_periods=1:start_threshold=-50dB',
  ]);
  execFileSync('rm', [raw]);
}

/**
 * The one encoding every recording goes through: same loudness for every track and both
 * voices, mono 64 kbps to keep packs small. The silence the player pads steps with comes
 * out of it too, so it always shares the voices' format (a composition that mixes formats
 * loses its timing on iOS).
 */
function encode(input: string[], out: string, bitrate: string, filters: string[]): void {
  execFileSync('ffmpeg', [
    '-loglevel',
    'error',
    '-y',
    ...input,
    ...(filters.length === 0 ? [] : ['-af', filters.join(',')]),
    '-ar',
    String(sampleRate),
    '-ac',
    '1',
    '-b:a',
    bitrate,
    out,
  ]);
}

/** One second of silence in the recordings' format; loudness filters stay out of it. */
function writeSilence(): void {
  encode(
    ['-f', 'lavfi', '-t', '1', '-i', `anullsrc=r=${sampleRate}:cl=mono`],
    join(audioRoot, 'silence.mp3'),
    '64k',
    [],
  );
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
    model: pack.delivery.model,
    voices: { leader: pack.leader.name, response: pack.response.name },
    tracks: {},
  };

  // A file name stands for one request (model, delivery, voice and text), so a track another
  // pack in the same language already holds is copied instead of paid for again.
  const siblings = packs
    .filter((other) => other.locale !== pack.locale && other.languageCode === pack.languageCode)
    .map((other) => join(audioRoot, other.locale));

  let characters = 0;
  for (const job of jobsFor(pack)) {
    const file = fileFor(job.key, job.text, job.voice, pack.delivery);
    const path = join(dir, file);
    if (!force && existsSync(path)) {
      const kept = previous?.tracks[job.key];
      manifest.tracks[job.key] = {
        file,
        durationMs: kept?.file === file ? kept.durationMs : durationMs(path),
      };
      continue;
    }
    const twin = siblings.map((sibling) => join(sibling, file)).find((candidate) => existsSync(candidate));
    if (!force && twin !== undefined) {
      if (!dryRun) {
        copyFileSync(twin, path);
        manifest.tracks[job.key] = { file, durationMs: durationMs(path) };
      }
      continue;
    }
    characters += job.text.length;
    if (dryRun) {
      continue;
    }
    process.stdout.write(`${pack.locale} ${job.key}\n`);
    await synthesize(job.text, job.voice, pack.languageCode, pack.delivery, path);
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

type ScriptureManifest = {
  version: 1;
  language: string;
  model: string;
  reader: string;
  tracks: Record<string, Track>;
};

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
    model: spec.delivery.model,
    reader: spec.reader.name,
    tracks: {},
  };

  let characters = 0;
  for (const [ref, passage] of Object.entries(passagesOf(spec.language))) {
    // References carry spaces and colons; file names stay to letters, digits and dashes.
    const file = fileFor(
      `reading.${ref.replace(/[^A-Za-z0-9]+/g, '-')}`,
      passage.text,
      spec.reader,
      spec.delivery,
    );
    const path = join(dir, file);
    const kept = previous?.tracks[ref];
    if (
      !force &&
      kept !== undefined &&
      kept.file.slice(-13) === file.slice(-13) &&
      existsSync(join(dir, kept.file))
    ) {
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
    await synthesize(passage.text, spec.reader, spec.languageCode, spec.delivery, path, '40k');
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

type AuxiliumManifest = {
  version: 1;
  language: string;
  model: string;
  voices: { leader: string; response: string };
  /** Keyed by section, block and part; repeated responses point to the same file. */
  tracks: Record<string, Track>;
};

function auxiliumJobs(spec: AuxiliumSpec, pack: PackSpec): Job[] {
  const jobs: Job[] = [];
  const response = (key: string, text: string) => jobs.push({ key, text, voice: pack.response });
  for (const section of auxiliumText(spec.pack).sections) {
    section.blocks.forEach((block, index) => {
      const at = `${section.id}.${index}`;
      if (block.kind === 'versicle') {
        jobs.push({ key: `${at}.call`, text: block.call, voice: pack.leader });
        response(`${at}.response`, block.response);
      } else if (block.kind === 'text') {
        jobs.push({ key: `${at}.text`, text: block.text, voice: pack.leader });
        if (block.response !== undefined) {
          response(`${at}.response`, block.response);
        }
      } else if (block.kind === 'litany') {
        block.items.forEach((item, line) => {
          jobs.push({ key: `${at}.${line}.call`, text: item.call, voice: pack.leader });
          if (item.response !== undefined) {
            response(`${at}.${line}.response`, item.response);
          }
        });
      }
    });
  }
  return jobs;
}

async function buildAuxilium(spec: AuxiliumSpec): Promise<number> {
  const pack = packs.find((candidate) => candidate.locale === spec.pack);
  if (pack === undefined) {
    throw new Error(`No pack for ${spec.pack}`);
  }
  const dir = join(audioRoot, `auxilium-${spec.language}`);
  mkdirSync(dir, { recursive: true });
  const manifestPath = join(dir, 'manifest.json');
  const previous: AuxiliumManifest | null = existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, 'utf8')) as AuxiliumManifest)
    : null;
  const known = new Map(Object.values(previous?.tracks ?? {}).map((track) => [track.file, track.durationMs]));
  const manifest: AuxiliumManifest = {
    version: 1,
    language: spec.language,
    model: pack.delivery.model,
    voices: { leader: pack.leader.name, response: pack.response.name },
    tracks: {},
  };

  let characters = 0;
  for (const job of auxiliumJobs(spec, pack)) {
    // A response is named by its words alone, so every repetition shares one recording.
    const isResponse = job.voice === pack.response;
    const file = fileFor(isResponse ? 'response' : job.key, job.text, job.voice, pack.delivery);
    const path = join(dir, file);
    if (manifest.tracks[job.key] !== undefined) {
      continue;
    }
    const recorded = Object.values(manifest.tracks).find((track) => track.file === file);
    if (recorded !== undefined) {
      manifest.tracks[job.key] = recorded;
      continue;
    }
    if (!force && existsSync(path)) {
      manifest.tracks[job.key] = { file, durationMs: known.get(file) ?? durationMs(path) };
      continue;
    }
    characters += job.text.length;
    if (dryRun) {
      continue;
    }
    process.stdout.write(`auxilium-${spec.language} ${job.key}\n`);
    await synthesize(job.text, job.voice, pack.languageCode, pack.delivery, path);
    manifest.tracks[job.key] = { file, durationMs: durationMs(path) };
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
  lines.push('} as const;', '', 'export const auxiliumPacks = {');
  for (const spec of auxiliumPacks) {
    const folder = `auxilium-${spec.language}`;
    const manifestPath = join(audioRoot, folder, 'manifest.json');
    if (!existsSync(manifestPath)) {
      continue;
    }
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as AuxiliumManifest;
    lines.push(`  ${spec.language}: {`);
    lines.push(`    manifest: require('@/assets/audio/${folder}/manifest.json'),`);
    lines.push('    files: {');
    for (const file of new Set(Object.values(manifest.tracks).map((track) => track.file))) {
      lines.push(`      '${file}': require('@/assets/audio/${folder}/${file}'),`);
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
} else if (args.has('--auxilium')) {
  const language = [...args].find((arg) => arg.startsWith('--language='))?.split('=')[1];
  for (const spec of auxiliumPacks.filter(
    (candidate) => language === undefined || candidate.language === language,
  )) {
    total += await buildAuxilium(spec);
  }
} else if (args.has('--scripture')) {
  const language = [...args].find((arg) => arg.startsWith('--language='))?.split('=')[1];
  for (const spec of scripturePacks.filter(
    (candidate) => language === undefined || candidate.language === language,
  )) {
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
  writeSilence();
  writeRegistry();
}
