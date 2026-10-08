import { Stack } from 'expo-router';

import { useSkin } from '@/shared/theme/SkinProvider';

/** The stack inside each tab: native headers painted with the skin. */
export function TabStack() {
  const { colors, skin, screenBackground } = useSkin();
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: process.env.EXPO_OS === 'ios',
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTintColor: colors.accent,
        // Android has no large title; a larger one in the skin's display face reads as a medium top app bar.
        headerTitleStyle: {
          color: colors.foreground,
          fontFamily: skin.fonts.display,
          ...(process.env.EXPO_OS === 'android' ? { fontSize: 26 } : null),
        },
        headerLargeTitleStyle: { color: colors.foreground, fontFamily: skin.fonts.display },
        headerStyle: process.env.EXPO_OS === 'ios' ? undefined : { backgroundColor: colors.background },
        contentStyle: { backgroundColor: screenBackground },
      }}
    />
  );
}
