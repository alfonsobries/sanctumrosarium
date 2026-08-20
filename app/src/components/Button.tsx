import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { radius, spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProperties = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
};

export function Button({
  label,
  variant = 'primary',
  disabled,
  ...rest
}: ButtonProperties) {
  const colors = useTheme();

  const background = {
    primary: colors.accent,
    secondary: colors.surface,
    ghost: 'transparent',
  }[variant];

  const textColor = variant === 'primary' ? ('onAccent' as const) : ('accent' as const);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled === true }}
      disabled={disabled}
      android_ripple={{ color: colors.accentSoft }}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: background },
        variant === 'secondary' && { borderWidth: 1, borderColor: colors.borderStrong },
        pressed && styles.pressed,
        disabled === true && styles.disabled,
      ]}
    >
      <AppText variant="label" color={textColor}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
});
