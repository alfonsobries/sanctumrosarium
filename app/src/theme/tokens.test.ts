import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { palettes } from './tokens';

const sourceRoot = join(__dirname, '..');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }
    return /\.tsx?$/.test(entry) ? [path] : [];
  });
}

describe('colour tokens', () => {
  it('are the only place a colour literal lives', () => {
    const offenders = sourceFiles(sourceRoot)
      .filter((path) => !path.endsWith(join('theme', 'tokens.ts')))
      .filter((path) => {
        const source = readFileSync(path, 'utf8');
        return /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(source);
      });
    expect(offenders).toEqual([]);
  });
});

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe.each(['light', 'dark'] as const)('%s palette contrast', (scheme) => {
  const colors = palettes[scheme];

  // WCAG AA: 4.5:1 for running text. The app is used at night and by older eyes.
  it.each([
    ['text', colors.text, colors.background],
    ['textSecondary', colors.textSecondary, colors.background],
    ['textMuted', colors.textMuted, colors.background],
    ['accent', colors.accent, colors.background],
    ['danger', colors.danger, colors.background],
    ['text on surface', colors.text, colors.surface],
    ['textMuted on surface', colors.textMuted, colors.surface],
    ['onAccent', colors.onAccent, colors.accent],
  ])('%s reads at AA', (_name, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
