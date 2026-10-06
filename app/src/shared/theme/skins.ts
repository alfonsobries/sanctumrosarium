export type SkinId = 'silence' | 'simple' | 'manuscript' | 'glass' | 'kids';

/** Which set of mystery images a skin shows; `none` keeps the prayer to text alone. */
export type TextureId = 'parchment';

export type ArtworkStyle = 'none' | 'classic' | 'glass' | 'kids';

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
  fonts: { display: string; prayer: string; prayerItalic: string; ui?: string };
  artwork: ArtworkStyle;
  /** A material behind the content; images live in textures.ts. */
  texture?: TextureId;
  /** Card corner radius; every rounded surface in the skin uses this one value. */
  radius: number;
  /** Illuminated initial on the first word of each prayer. */
  dropCap: boolean;
  light: Palette;
  dark: Palette;
};

const baseSkins = {
  simple: {
    id: 'simple',
    fonts: {
      display: 'EBGaramond_600SemiBold',
      prayer: 'EBGaramond_400Regular',
      prayerItalic: 'EBGaramond_400Regular_Italic',
    },
    radius: 20,
    dropCap: false,
    artwork: 'classic',
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
    artwork: 'classic',
    texture: 'parchment',
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
} satisfies Record<'simple' | 'manuscript', Skin>;

const silence: Skin = {
  id: 'silence',
  fonts: {
    display: 'EBGaramond_400Regular',
    prayer: 'EBGaramond_400Regular',
    prayerItalic: 'EBGaramond_400Regular_Italic',
  },
  radius: 12,
  dropCap: false,
  artwork: 'none',
  light: {
    background: '#FFFFFF',
    surface: '#F4F4F2',
    'surface-raised': '#FFFFFF',
    foreground: '#111111',
    muted: '#5E5E5B',
    faint: '#9B9B97',
    border: '#E3E3E0',
    accent: '#111111',
    'accent-foreground': '#FFFFFF',
    rubric: '#9E2B22',
    bead: '#DADAD6',
    'bead-done': '#111111',
  },
  dark: {
    background: '#000000',
    surface: '#111111',
    'surface-raised': '#1A1A1A',
    foreground: '#F2F2EF',
    muted: '#A3A39E',
    faint: '#66665F',
    border: '#242424',
    accent: '#F2F2EF',
    'accent-foreground': '#000000',
    rubric: '#E07A6A',
    bead: '#2E2E2C',
    'bead-done': '#F2F2EF',
  },
};

const glass: Skin = {
  id: 'glass',
  fonts: {
    display: 'Cinzel_600SemiBold',
    prayer: 'EBGaramond_400Regular',
    prayerItalic: 'EBGaramond_400Regular_Italic',
  },
  radius: 14,
  dropCap: false,
  artwork: 'glass',
  light: {
    background: '#F3F1EC',
    surface: '#E8E4DB',
    'surface-raised': '#FBFAF7',
    foreground: '#141A2E',
    muted: '#4E5672',
    faint: '#8A90A6',
    border: '#D6D1C4',
    accent: '#1F3A93',
    'accent-foreground': '#FFFFFF',
    rubric: '#9C1C2B',
    bead: '#D3CFC4',
    'bead-done': '#1F3A93',
  },
  dark: {
    background: '#0A0E1C',
    surface: '#121933',
    'surface-raised': '#1A2244',
    foreground: '#ECE7DA',
    muted: '#A9B0CC',
    faint: '#646C8C',
    border: '#232C52',
    accent: '#E0B54A',
    'accent-foreground': '#0A0E1C',
    rubric: '#E8697A',
    bead: '#2A3358',
    'bead-done': '#E0B54A',
  },
};

const kids: Skin = {
  id: 'kids',
  fonts: {
    display: 'Nunito_800ExtraBold',
    prayer: 'Nunito_600SemiBold',
    prayerItalic: 'Nunito_600SemiBold_Italic',
    ui: 'Nunito_600SemiBold',
  },
  radius: 28,
  dropCap: false,
  artwork: 'kids',
  light: {
    background: '#FFF8EC',
    surface: '#FBEBD3',
    'surface-raised': '#FFFFFF',
    foreground: '#2B2440',
    muted: '#5F5778',
    faint: '#A39CB8',
    border: '#F0DCBC',
    accent: '#2E6FB7',
    'accent-foreground': '#FFFFFF',
    rubric: '#B83A4B',
    bead: '#EED9B6',
    'bead-done': '#2E6FB7',
  },
  dark: {
    background: '#161A2E',
    surface: '#20264A',
    'surface-raised': '#2A315A',
    foreground: '#FFF4E2',
    muted: '#C9C2E0',
    faint: '#7D78A0',
    border: '#2F3763',
    accent: '#FFC857',
    'accent-foreground': '#1B1A2E',
    rubric: '#FF8F8F',
    bead: '#363E70',
    'bead-done': '#FFC857',
  },
};

export const skins: Record<SkinId, Skin> = {
  silence,
  simple: baseSkins.simple,
  manuscript: baseSkins.manuscript,
  glass,
  kids,
};

/** From the barest to the most detailed. */
export const skinIds: SkinId[] = ['silence', 'simple', 'manuscript', 'glass', 'kids'];

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
    '--font-ui': skin.fonts.ui ?? (process.env.EXPO_OS === 'android' ? 'sans-serif' : 'System'),
    '--radius-card': `${skin.radius}px`,
  };
  for (const [role, hex] of Object.entries(palette)) {
    variables[`--color-${role}`] = triplet(hex);
  }
  return variables;
}
