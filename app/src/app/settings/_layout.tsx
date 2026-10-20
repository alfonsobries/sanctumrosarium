import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Text } from '@/shared/ui/Text';

export default function SettingsLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useSkin();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.accent,
        headerTitleStyle: { color: colors.foreground },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          // A sheet on iOS closes with Done; Android has its back arrow and gesture.
          headerRight:
            process.env.EXPO_OS === 'ios'
              ? () => (
                  <Pressable accessibilityRole="button" onPress={() => router.dismiss()} hitSlop={10}>
                    <Text variant="headline" className="text-accent">
                      {t('settings.done')}
                    </Text>
                  </Pressable>
                )
              : undefined,
        }}
      />
    </Stack>
  );
}
