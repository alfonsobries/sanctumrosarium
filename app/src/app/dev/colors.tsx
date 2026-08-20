import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { radius, spacing, type ThemeColors } from '@/theme/tokens';
import { useAppTheme } from '@/theme/use-theme';

function Swatch({ name, value }: { name: keyof ThemeColors; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.swatchRow}>
      <View
        style={[
          styles.swatch,
          { backgroundColor: value, borderColor: colors.borderStrong },
        ]}
      />
      <View style={styles.swatchText}>
        <AppText variant="label">{name}</AppText>
        <AppText variant="caption" color="muted">
          {value}
        </AppText>
      </View>
    </View>
  );
}

export default function DevColorsScreen() {
  const { colors, scheme } = useAppTheme();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: `Colores (${scheme})` }} />
      <View style={styles.list}>
        {(Object.entries(colors) as [keyof ThemeColors, string][]).map(
          ([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ),
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  swatchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  swatch: {
    width: 56,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatchText: { flex: 1 },
});
