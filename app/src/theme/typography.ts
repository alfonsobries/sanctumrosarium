import { Platform, type TextStyle } from 'react-native';

/**
 * Two families: Alegreya (the site's serif) carries everything that is prayed or read
 * slowly; the system face carries interface chrome so controls feel native.
 *
 * Sizes are unscaled: React Native multiplies them by the system font size, and every
 * layout has to survive that multiplier at its maximum.
 */
export const fonts = {
  serif: 'Alegreya_500Medium',
  serifSemiBold: 'Alegreya_600SemiBold',
  serifItalic: 'Alegreya_500Medium_Italic',
  sans: Platform.select({ ios: 'System', default: 'sans-serif' }),
  sansMedium: Platform.select({ ios: 'System', default: 'sans-serif-medium' }),
} as const;

export type TypeVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'prayer'
  | 'body'
  | 'bodySerif'
  | 'label'
  | 'caption'
  | 'overline';

export const typeScale: Record<TypeVariant, TextStyle> = {
  /** The mystery of the day, the end of the Rosary. */
  display: { fontFamily: fonts.serifSemiBold, fontSize: 34, lineHeight: 42 },
  /** Screen titles. */
  title: { fontFamily: fonts.serifSemiBold, fontSize: 26, lineHeight: 33 },
  /** Section titles inside a screen. */
  heading: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 27 },
  /** The prayed line. The largest running text in the app. */
  prayer: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 34 },
  /** Interface copy. */
  body: { fontFamily: fonts.sans, fontSize: 17, lineHeight: 23 },
  /** Reading copy: explanations, meditations. */
  bodySerif: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 27 },
  /** Row labels and buttons. */
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 17,
    lineHeight: 22,
    ...(Platform.OS === 'ios' ? { fontWeight: '500' as const } : null),
  },
  /** Sources, counters, footnotes. */
  caption: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 19 },
  /** Small caps-feel markers: the set above a mystery. */
  overline: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, letterSpacing: 1.1 },
};
