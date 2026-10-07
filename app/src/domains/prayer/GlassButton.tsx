import { Button, Host } from '@expo/ui/swift-ui';
import { buttonBorderShape, buttonStyle, controlSize, labelStyle, tint } from '@expo/ui/swift-ui/modifiers';
import { Pressable } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon, type IconName } from '@/shared/ui/Icon';

type GlassButtonProperties = {
  /** SF Symbol on iOS, where the button is the system's own Liquid Glass button. */
  symbol: SFSymbol;
  /** The same glyph elsewhere. */
  icon: IconName;
  label: string;
  onPress: () => void;
  size: 'small' | 'regular' | 'large';
  /** The one main action: tinted with the accent, like `glassProminent` buttons. */
  prominent?: boolean;
  disabled?: boolean;
};

const nativeSize = { small: 'small', regular: 'large', large: 'extraLarge' } as const;
const fallbackSize = { small: 36, regular: 52, large: 64 } as const;

/**
 * A round control with the platform's own press feel: the native SwiftUI glass button on
 * iOS (bounce, shimmer and edge light come from the system), a plain round button elsewhere.
 */
export function GlassButton({
  symbol,
  icon,
  label,
  onPress,
  size,
  prominent = false,
  disabled = false,
}: GlassButtonProperties) {
  const { colors } = useSkin();

  if (process.env.EXPO_OS === 'ios') {
    return (
      <Host matchContents>
        <Button
          systemImage={symbol}
          label={label}
          onPress={disabled ? undefined : onPress}
          modifiers={[
            buttonStyle(prominent ? 'glassProminent' : 'glass'),
            buttonBorderShape('circle'),
            controlSize(nativeSize[size]),
            labelStyle('iconOnly'),
            ...(prominent ? [tint(colors.accent)] : [tint(colors.foreground)]),
          ]}
        />
      </Host>
    );
  }

  const dimension = fallbackSize[size];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: colors.border, borderless: true }}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        opacity: disabled ? 0.4 : 1,
        backgroundColor: prominent ? colors.accent : colors['surface-raised'],
      }}
      className="items-center justify-center"
    >
      <Icon
        name={icon}
        size={dimension * 0.42}
        color={prominent ? colors['accent-foreground'] : colors.foreground}
      />
    </Pressable>
  );
}
