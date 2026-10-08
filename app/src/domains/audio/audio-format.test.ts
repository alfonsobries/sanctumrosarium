import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const audioRoot = join(__dirname, '../../../assets/audio');

type Format = { version: string; layer: number; sampleRate: number; channels: number };

const sampleRates: Record<string, number[]> = {
  '1': [44_100, 48_000, 32_000],
  '2': [22_050, 24_000, 16_000],
  '2.5': [11_025, 12_000, 8_000],
};

/** Reads the first MPEG audio frame header, after any ID3v2 tag. */
function formatOf(path: string): Format {
  const bytes = readFileSync(path);
  let offset = 0;
  if (bytes.toString('latin1', 0, 3) === 'ID3') {
    const size =
      ((bytes[6]! & 0x7f) << 21) |
      ((bytes[7]! & 0x7f) << 14) |
      ((bytes[8]! & 0x7f) << 7) |
      (bytes[9]! & 0x7f);
    offset = 10 + size;
  }
  while (offset < bytes.length - 4 && !(bytes[offset] === 0xff && (bytes[offset + 1]! & 0xe0) === 0xe0)) {
    offset += 1;
  }
  const b1 = bytes[offset + 1]!;
  const b2 = bytes[offset + 2]!;
  const b3 = bytes[offset + 3]!;
  const version = ({ 0: '2.5', 2: '2', 3: '1' } as Record<number, string>)[(b1 >> 3) & 0x03] ?? 'reserved';
  return {
    version,
    layer: 4 - ((b1 >> 1) & 0x03),
    sampleRate: sampleRates[version]?.[(b2 >> 2) & 0x03] ?? 0,
    channels: ((b3 >> 6) & 0x03) === 3 ? 1 : 2,
  };
}

function recordings(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return recordings(path);
    }
    return name.endsWith('.mp3') ? [path] : [];
  });
}

describe('audio packs', () => {
  // The player pads each step with this silence; on iOS a step that mixes formats plays
  // out of step with the screen, so every recording must match it.
  const silence = formatOf(join(audioRoot, 'silence.mp3'));

  it('has a mono 48 kHz MPEG layer III silence', () => {
    expect(silence).toEqual({ version: '1', layer: 3, sampleRate: 48_000, channels: 1 });
  });

  it('records every prayer and reading in the format of the silence', () => {
    const mismatched = recordings(audioRoot)
      .filter((path) => !path.endsWith('silence.mp3'))
      .filter((path) => JSON.stringify(formatOf(path)) !== JSON.stringify(silence));
    expect(mismatched).toEqual([]);
  });
});
