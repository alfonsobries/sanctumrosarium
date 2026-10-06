import { Stack } from 'expo-router';

import { useSkin } from '@/shared/theme/SkinProvider';

export default function TabStackLayout() {
  const { colors } = useSkin();
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: process.env.EXPO_OS === 'ios',
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTintColor: colors.accent,
        headerTitleStyle: { color: colors.foreground },
        headerLargeTitleStyle: { color: colors.foreground },
        headerStyle: process.env.EXPO_OS === 'ios' ? undefined : { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
