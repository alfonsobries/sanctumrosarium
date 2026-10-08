import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const css = readFileSync(join(import.meta.dirname, '../src/styles/global.css'), 'utf8');

function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
}

function luminance(hex: string): number {
  const channel = (offset: number): number => {
    const c = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (high + 0.05) / (low + 0.05);
}

const dark = tokens(':root');
const light = { ...dark, ...tokens(":root[data-theme='light']") };

describe.each([
  ['dark', dark],
  ['light', light],
] as const)('%s theme', (_, palette) => {
  const surfaces = ['bg', 'bg-deep', 'surface', 'surface-raised'].map((name) => palette[name]!);

  it('keeps every text colour readable (WCAG AA) on every surface', () => {
    for (const surface of surfaces) {
      expect(contrast(palette.ink!, surface)).toBeGreaterThanOrEqual(7);
      expect(contrast(palette.mute!, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(palette.faint!, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(palette.accent!, surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the solid button label readable', () => {
    expect(contrast(palette['accent-ink']!, palette.accent!)).toBeGreaterThanOrEqual(4.5);
  });
});
