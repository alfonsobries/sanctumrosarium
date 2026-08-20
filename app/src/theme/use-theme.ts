import { useColorScheme } from 'react-native';

import { useSettings } from '@/settings/settings-context';

import { palettes, type ThemeColors } from './tokens';

export type AppTheme = {
  readonly scheme: 'light' | 'dark';
  readonly colors: ThemeColors;
};

export function useAppTheme(): AppTheme {
  const { settings } = useSettings();
  const system = useColorScheme();
  // Dark is the design default: an undecided system lands at night, not in the light.
  const scheme =
    settings.appearance !== 'system'
      ? settings.appearance
      : system === 'light'
        ? 'light'
        : 'dark';
  return { scheme, colors: palettes[scheme] };
}

export function useTheme(): ThemeColors {
  return useAppTheme().colors;
}
