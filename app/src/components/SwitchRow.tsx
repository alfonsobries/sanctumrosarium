import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './AppText';

type SwitchRowProperties = {
  label: string;
  /** One line: what it changes and where it comes from. */
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  divider?: boolean;
};

export function SwitchRow({
  label,
  description,
  value,
  onValueChange,
  divider = true,
}: SwitchRowProperties) {
  const colors = useTheme();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      android_ripple={{ color: colors.border }}
      style={[
        styles.row,
        divider && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.text}>
        <AppText variant="body">{label}</AppText>
        {description === undefined ? null : (
          <AppText variant="caption" color="muted">
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        importantForAccessibility="no"
        trackColor={{ true: colors.accentSoft }}
        thumbColor={value ? colors.accent : undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { flex: 1, gap: 2 },
});
