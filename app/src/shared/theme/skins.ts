export type SkinId = 'simple' | 'manuscript';

export type ColorRole =
  | 'background'
  | 'surface'
  | 'surface-raised'
  | 'foreground'
  | 'muted'
  | 'faint'
  | 'border'
  | 'accent'
  | 'accent-foreground'
  | 'rubric'
  | 'bead'
  | 'bead-done';

export type Palette = Record<ColorRole, string>;

export type Skin = {
  id: SkinId;
  fonts: { display: string; prayer: string; prayerItalic: string };
  /** Card corner radius; every rounded surface in the skin uses this one value. */
  radius: number;
  /** Illuminated initial on the first word of each prayer. */
  dropCap: boolean;
  light: Palette;
  dark: Palette;
};

export const skins: Record<SkinId, Skin> = {
  simple: {
    id: 'simple',
    fonts: {
      display: 'EBGaramond_600SemiBold',
      prayer: 'EBGaramond_400Regular',
      prayerItalic: 'EBGaramond_400Regular_Italic',
    },
    radius: 20,
    dropCap: false,
    light: {
      background: '#F7F4EE',
      surface: '#EFEBE3',
      'surface-raised': '#FFFFFF',
      foreground: '#1C1A17',
      muted: '#6B655C',
      faint: '#A39D93',
      border: '#DDD7CC',
      accent: '#8E6E2F',
      'accent-foreground': '#FFFFFF',
      rubric: '#A33A2E',
      bead: '#D9D3C8',
      'bead-done': '#8E6E2F',
    },
    dark: {
      background: '#0F0E0C',
      surface: '#1A1916',
      'surface-raised': '#24221E',
      foreground: '#EEE8DC',
      muted: '#A59E92',
      faint: '#6E685F',
      border: '#2E2B26',
      accent: '#D2AE66',
      'accent-foreground': '#17140E',
      rubric: '#D0715F',
      bead: '#38342E',
      'bead-done': '#D2AE66',
    },
  },
  manuscript: {
    id: 'manuscript',
    fonts: {
      display: 'UnifrakturMaguntia_400Regular',
      prayer: 'IMFellEnglish_400Regular',
      prayerItalic: 'IMFellEnglish_400Regular_Italic',
    },
    radius: 4,
    dropCap: true,
    light: {
      background: '#EFE4CC',
      surface: '#E6D8BA',
      'surface-raised': '#F6EDD8',
      foreground: '#2A1F14',
      muted: '#6E5B44',
      faint: '#9C8A6E',
      border: '#CDB991',
      accent: '#86621A',
      'accent-foreground': '#FFF8E8',
      rubric: '#9E2A1E',
      bead: '#D3C29E',
      'bead-done': '#9E2A1E',
    },
    dark: {
      background: '#17120B',
      surface: '#221A10',
      'surface-raised': '#2C2216',
      foreground: '#EADBBE',
      muted: '#B4A27F',
      faint: '#7A6A50',
      border: '#3A2E1E',
      accent: '#CFA548',
      'accent-foreground': '#1A140B',
      rubric: '#DA6A52',
      bead: '#3D3122',
      'bead-done': '#CFA548',
    },
  },
};

export const skinIds = Object.keys(skins) as SkinId[];

function triplet(hex: string): string {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

/** CSS variables a skin feeds to NativeWind's role classes (`bg-background`, `font-prayer`). */
export function skinVariables(skin: Skin, scheme: 'light' | 'dark'): Record<string, string> {
  const palette = skin[scheme];
  const variables: Record<string, string> = {
    '--font-display': skin.fonts.display,
    '--font-prayer': skin.fonts.prayer,
    '--font-prayer-italic': skin.fonts.prayerItalic,
    '--radius-card': `${skin.radius}px`,
  };
  for (const [role, hex] of Object.entries(palette)) {
    variables[`--color-${role}`] = triplet(hex);
  }
  return variables;
}
