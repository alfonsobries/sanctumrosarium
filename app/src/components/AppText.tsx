import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { typeScale, type TypeVariant } from '@/theme/typography';

type TextColor = 'text' | 'secondary' | 'muted' | 'accent' | 'onAccent' | 'danger';

type AppTextProperties = TextProps & {
  variant?: TypeVariant;
  color?: TextColor;
};

export function AppText({
  variant = 'body',
  color = 'text',
  style,
  ...rest
}: AppTextProperties) {
  const colors = useTheme();
  const colorValue = {
    text: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    accent: colors.accent,
    onAccent: colors.onAccent,
    danger: colors.danger,
  }[color];

  return <Text {...rest} style={[typeScale[variant], { color: colorValue }, style]} />;
}
