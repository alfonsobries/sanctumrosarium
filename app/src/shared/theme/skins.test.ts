import { describe, expect, it } from 'vitest';

import { skins, skinVariables } from './skins';

function luminance(hex: string): number {
  const channel = (offset: number): number => {
    const c = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe.each(Object.values(skins))('skin $id', (skin) => {
  it.each(['light', 'dark'] as const)('%s text passes WCAG AA on every surface', (scheme) => {
    const p = skin[scheme];
    for (const surface of [p.background, p.surface, p['surface-raised']]) {
      expect(contrast(p.foreground, surface)).toBeGreaterThanOrEqual(7);
      expect(contrast(p.muted, surface)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(p['accent-foreground'], p.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(p.rubric, p.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(p.accent, p.background)).toBeGreaterThanOrEqual(3);
  });

  it('feeds space-separated channels to NativeWind', () => {
    expect(skinVariables(skin, 'dark')['--color-background']).toMatch(/^\d+ \d+ \d+$/);
  });
});
