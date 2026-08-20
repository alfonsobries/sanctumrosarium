import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import { palettes } from './tokens';

/** Navigation chrome (headers, transitions) painted with the app tokens. */
export function navigationTheme(scheme: 'light' | 'dark'): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = palettes[scheme];
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };
}
