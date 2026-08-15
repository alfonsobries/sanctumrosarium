import { useColorScheme } from 'react-native';

import { tokens, type ThemeColors } from './tokens';

export function useTheme(): ThemeColors {
  return useColorScheme() === 'dark' ? tokens.dark : tokens.light;
}
