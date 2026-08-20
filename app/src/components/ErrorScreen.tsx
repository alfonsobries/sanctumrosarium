import { t } from 'i18next';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palettes, radius, spacing, touchTarget } from '@/theme/tokens';
import { typeScale } from '@/theme/typography';

type ErrorScreenProperties = {
  onRetry: () => void;
};

/**
 * Deliberately context-free: it also renders when the providers themselves failed,
 * so it reads the scheme and the copy without going through them.
 */
export function ErrorScreen({ onRetry }: ErrorScreenProperties) {
  const colors = palettes[useColorScheme() === 'light' ? 'light' : 'dark'];

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Text style={[typeScale.heading, { color: colors.text }]}>
          {t('error.screen')}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            { borderColor: colors.borderStrong },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[typeScale.label, { color: colors.accent }]}>
            {t('common.retry')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  button: {
    minHeight: touchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pressed: { opacity: 0.75 },
});
