/**
 * The only place colours live. Dark first: the Rosary is prayed at night.
 *
 * These are placeholders until the visual identity is decided (docs/DECISIONES.md, decision 2).
 */
export type ThemeColors = {
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly textMuted: string;
  readonly accent: string;
  readonly border: string;
};

export const tokens: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#FBF9F6',
    surface: '#FFFFFF',
    text: '#1A1714',
    textMuted: '#6B6259',
    accent: '#7A2E3B',
    border: '#E5DED4',
  },
  dark: {
    background: '#12100E',
    surface: '#1C1917',
    text: '#F2EDE6',
    textMuted: '#A39B90',
    accent: '#C98B96',
    border: '#2C2724',
  },
};
