import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type CardProperties = ViewProps;

export function Card({ style, ...rest }: CardProperties) {
  const colors = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.base,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
  },
});
