import { Pressable, StyleSheet, View } from 'react-native';

import { spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './AppText';

type ListRowProperties = {
  label: string;
  /** Secondary text on the right edge. */
  value?: string;
  /** Renders a selection mark and announces it to the screen reader. */
  selected?: boolean;
  onPress?: () => void;
  /** Hairline under the row; the last row of a group turns it off. */
  divider?: boolean;
};

export function ListRow({
  label,
  value,
  selected,
  onPress,
  divider = true,
}: ListRowProperties) {
  const colors = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress === undefined ? undefined : 'button'}
      accessibilityState={selected === undefined ? undefined : { selected }}
      disabled={onPress === undefined}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
      style={({ pressed }) => [pressed && { backgroundColor: colors.surfaceRaised }]}
    >
      <View
        style={[
          styles.row,
          divider && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <AppText variant="body" style={styles.label}>
          {label}
        </AppText>
        {value === undefined ? null : (
          <AppText variant="body" color="muted">
            {value}
          </AppText>
        )}
        {selected === true ? (
          <AppText variant="body" color="accent" importantForAccessibility="no">
            ●
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  label: { flex: 1 },
});
