/**
 * Builds the audio pack of a locale: one track per prayer half (leader / response),
 * a manifest with durations and line marks for the synced highlight, and a static
 * registry the app can require.
 *
 * The synthesized voices are development scaffolding while the voice decision
 * (docs/DECISIONES.md, 5) is open: `provisional: true` travels in every manifest.
 *
 * Talks to ElevenLabs directly (with-timestamps) so every track carries the start and
 * end of each line. Key: ELEVENLABS_API_KEY or ~/.config/aikit/audio-gen.env.
 * Voices resolve through the personal catalog (~/.config/aikit/audio-gen/voices.tsv).
 *
 * Run: pnpm audio:generate   (skips tracks that already exist; delete a file to redo it)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { prayersFor, type Locale, type PrayerText } from '../packages/content/src';

const root = join(__dirname, '..');
const audioRoot = join(root, 'app/assets/audio');

type PackSpec = { locale: Locale; voice: string };

const packs: PackSpec[] = [
  { locale: 'es-MX', voice: 'camila' },
  { locale: 'en-US', voice: 'sarah' },
];

type LineMark = { startMs: number; endMs: number };
type TrackEntry = { file: string; durationMs: number; lines?: LineMark[] };
type ManifestTrack = { leader: TrackEntry; response?: TrackEntry };
type Manifest = {
  version: 2;
  locale: Locale;
  voice: string;
  provisional: true;
  tracks: Record<string, ManifestTrack>;
};

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

function apiKey(): string {
  if (process.env.ELEVENLABS_API_KEY !== undefined) {
    return process.env.ELEVENLABS_API_KEY;
  }
  const envFile = join(homedir(), '.config/aikit/audio-gen.env');
  const match = readFileSync(envFile, 'utf8').match(/^ELEVENLABS_API_KEY=(.+)$/m);
  if (match === null) {
    throw new Error('ELEVENLABS_API_KEY not found');
  }
  return match[1].trim();
}

function voiceIdOf(alias: string): string {
  const catalog = readFileSync(
    join(homedir(), '.config/aikit/audio-gen/voices.tsv'),
    'utf8',
  );
  for (const line of catalog.split('\n')) {
    const columns = line.split('\t');
    if (columns[0] === alias) {
      return columns[2];
    }
  }
  throw new Error(`voice alias not in catalog: ${alias}`);
}

function halvesOf(prayer: PrayerText): { half: 'leader' | 'response'; text: string }[] {
  if (prayer.responseFrom === undefined) {
    return [{ half: 'leader', text: prayer.lines.join('\n') }];
  }
  return [
    { half: 'leader', text: prayer.lines.slice(0, prayer.responseFrom).join('\n') },
    { half: 'response', text: prayer.lines.slice(prayer.responseFrom).join('\n') },
  ];
}

function durationMsOf(file: string): number {
  const output = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    { encoding: 'utf8' },
  );
  return Math.round(Number.parseFloat(output.trim()) * 1000);
}

/** Start and end of every non-empty line, from the character-level alignment. */
function lineMarksOf(text: string, alignment: Alignment): LineMark[] {
  const marks: LineMark[] = [];
  let cursor = 0;
  for (const line of text.split('\n')) {
    const start = cursor;
    const end = cursor + line.length;
    if (line.trim() !== '') {
      const first = alignment.character_start_times_seconds[start];
      const last = alignment.character_end_times_seconds[Math.max(start, end - 1)];
      if (first !== undefined && last !== undefined) {
        marks.push({
          startMs: Math.round(first * 1000),
          endMs: Math.round(last * 1000),
        });
      }
    }
    cursor = end + 1;
  }
  return marks;
}

async function generateTrack(
  text: string,
  voiceId: string,
  outFile: string,
): Promise<LineMark[]> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
    },
  );
  if (!response.ok) {
    throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  }
  const payload = (await response.json()) as {
    audio_base64: string;
    alignment: Alignment;
  };
  writeFileSync(outFile, Buffer.from(payload.audio_base64, 'base64'));
  return lineMarksOf(text, payload.alignment);
}

async function main(): Promise<void> {
  for (const pack of packs) {
    const voiceId = voiceIdOf(pack.voice);
    const dir = join(audioRoot, pack.locale, pack.voice);
    mkdirSync(dir, { recursive: true });
    const manifest: Manifest = {
      version: 2,
      locale: pack.locale,
      voice: pack.voice,
      provisional: true,
      tracks: {},
    };

    for (const prayer of prayersFor(pack.locale)) {
      const entry: Partial<ManifestTrack> = {};
      for (const { half, text } of halvesOf(prayer)) {
        const fileName = `${prayer.id}.${half}.mp3`;
        const file = join(dir, fileName);
        let lines: LineMark[] | undefined;
        if (!existsSync(file)) {
          console.log(`  ${pack.locale}/${pack.voice}/${fileName}`);
          lines = await generateTrack(text, voiceId, file);
        }
        entry[half] = {
          file: fileName,
          durationMs: durationMsOf(file),
          ...(lines === undefined || lines.length === 0 ? {} : { lines }),
        };
      }
      manifest.tracks[prayer.id] = entry as ManifestTrack;
    }

    writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(
      `manifest ${pack.locale}/${pack.voice} (${Object.keys(manifest.tracks).length} prayers)`,
    );
  }

  // Static registry: Metro only bundles literal require() paths.
  const lines: string[] = [
    '// Generated by scripts/generate-rosary-audio.ts - do not edit by hand.',
    '/* eslint-disable @typescript-eslint/no-require-imports */',
    "import type { AudioPack } from './types';",
    '',
    'export const audioPacks: Partial<Record<string, AudioPack>> = {',
  ];
  for (const pack of packs) {
    const dir = join(audioRoot, pack.locale, pack.voice);
    const files = readdirSync(dir).filter((file) => file.endsWith('.mp3'));
    lines.push(`  '${pack.locale}': {`);
    lines.push(
      `    manifest: require('@/assets/audio/${pack.locale}/${pack.voice}/manifest.json'),`,
    );
    lines.push('    sources: {');
    for (const file of files.sort()) {
      lines.push(
        `      '${file}': require('@/assets/audio/${pack.locale}/${pack.voice}/${file}'),`,
      );
    }
    lines.push('    },');
    lines.push('  },');
  }
  lines.push('};');
  lines.push('');
  writeFileSync(
    join(root, 'app/src/features/audio/packs.generated.ts'),
    lines.join('\n'),
  );
  console.log('registry app/src/features/audio/packs.generated.ts');
}

void main();
