/**
 * The only place colours live. Dark first: the Rosary is prayed at night, so the dark
 * palette is the one designed for and the light one is derived from it. Same palette as
 * the site (site/src/styles/global.css): ink and stone, the copper rose of the beads.
 */
export type ThemeColors = {
  /** Screen background. */
  readonly background: string;
  /** Cards and grouped rows. */
  readonly surface: string;
  /** Elements raised above a surface (sheets, popovers). */
  readonly surfaceRaised: string;
  /** Primary reading text. */
  readonly text: string;
  /** Secondary text that still has to be read. */
  readonly textSecondary: string;
  /** De-emphasised text: hints, sources, counters. */
  readonly textMuted: string;
  /** The copper rose. Actions and emphasis. */
  readonly accent: string;
  /** Text sitting on top of an accent background. */
  readonly onAccent: string;
  /** Accent at rest on large areas: selection ticks, active track. */
  readonly accentSoft: string;
  /** Hairlines between rows. */
  readonly border: string;
  /** Borders that must survive next to an image or a filled surface. */
  readonly borderStrong: string;
  /** Destructive actions and failures. */
  readonly danger: string;
};

export const palettes: Record<'light' | 'dark', ThemeColors> = {
  dark: {
    background: '#0F1420',
    surface: '#161C2B',
    surfaceRaised: '#1D2434',
    text: '#ECE6DA',
    textSecondary: '#C9C4BA',
    textMuted: '#A4A9B6',
    accent: '#D4A48F',
    onAccent: '#0F1420',
    accentSoft: '#8F6D5E',
    border: '#273041',
    borderStrong: '#33405A',
    danger: '#DE9184',
  },
  light: {
    background: '#ECEEF1',
    surface: '#F6F7F9',
    surfaceRaised: '#FFFFFF',
    text: '#151B28',
    textSecondary: '#2B3344',
    textMuted: '#5A6272',
    accent: '#96563F',
    onAccent: '#F6F7F9',
    accentSoft: '#C69A86',
    border: '#D3D8E0',
    borderStrong: '#BCC3CF',
    danger: '#9C2F1F',
  },
};

/** 4-point spacing scale. Layout never hardcodes a gap. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 10,
  lg: 16,
  full: 999,
} as const;

/** Minimum touch target on both platforms (Material 48dp; HIG 44pt fits inside it). */
export const touchTarget = 48;
