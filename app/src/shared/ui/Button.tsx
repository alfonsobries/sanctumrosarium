import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps } from 'react-native';

import { Text } from './Text';

type ButtonProperties = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'plain';
};

const containers = {
  primary: 'bg-accent',
  secondary: 'bg-surface-raised border border-border',
  plain: '',
};

const labels = {
  primary: 'text-accent-foreground',
  secondary: 'text-foreground',
  plain: 'text-accent',
};

export function Button({ label, variant = 'primary', className, onPressIn, ...rest }: ButtonProperties) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[52px] items-center justify-center rounded-full px-6 active:opacity-80 ${containers[variant]} ${className ?? ''}`}
      style={{ borderCurve: 'continuous' }}
      onPressIn={(event) => {
        if (variant === 'primary') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(event);
      }}
      {...rest}
    >
      <Text variant="headline" className={labels[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
