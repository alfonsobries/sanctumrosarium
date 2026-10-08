import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import Animated, { Easing, ZoomIn } from 'react-native-reanimated';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon, type IconName } from '@/shared/ui/Icon';

import type { BeadState } from './bead-places';
import { BeadRow } from './BeadRow';

type Labels = {
  previous: string;
  next: string;
  play: string;
  pause: string;
};

type ControlDockProperties = {
  beads: BeadState;
  width: number;
  listening: boolean;
  playing: boolean;
  loading: boolean;
  canGoBack: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
  labels: Labels;
};

const orb = 64;
const side = 52;
const pill = 32;
const gap = 10;

/** How much of the screen the dock covers, so the prayer can scroll clear of it. */
export const dockHeight = pill + gap + orb;

const ease = Easing.bezier(0.23, 1, 0.32, 1);

type GlassProperties = {
  style: ViewStyle;
  tint?: string;
  interactive?: boolean;
  children?: React.ReactNode;
};

/**
 * Liquid Glass where the system has it, tinted with the skin's raised surface so what
 * sits on it stays legible over the prayer scrolling underneath; elsewhere the same
 * surface, nearly opaque.
 */
function Glass({ style, tint, interactive = false, children }: GlassProperties) {
  const { colors, scheme } = useSkin();
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={scheme}
        isInteractive={interactive}
        tintColor={tint ?? `${colors['surface-raised']}${scheme === 'dark' ? 'D9' : 'B3'}`}
        style={style}
      >
        {children}
      </GlassView>
    );
  }
  return (
    <View
      style={[
        tint === undefined
          ? { backgroundColor: `${colors['surface-raised']}F2`, borderWidth: 1, borderColor: colors.border }
          : { backgroundColor: tint },
        { overflow: 'hidden' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type RoundProperties = {
  size: number;
  icon: IconName;
  label: string;
  onPress: () => void;
  prominent?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * A round glass button. The glass itself answers the touch (the system's interactive
 * Liquid Glass); the main action is tinted with the accent, as the system tints a
 * prominent button.
 */
function Round({
  size,
  icon,
  label,
  onPress,
  prominent = false,
  disabled = false,
  loading = false,
}: RoundProperties) {
  const { colors } = useSkin();
  const ink = prominent ? colors['accent-foreground'] : colors.foreground;
  const solid = icon === 'play' || icon === 'pause';
  return (
    <View style={{ opacity: disabled ? 0.4 : 1 }}>
      <Glass
        interactive={!disabled}
        tint={prominent ? colors.accent : undefined}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled, busy: loading }}
          disabled={disabled || loading}
          onPress={onPress}
          android_ripple={{ color: prominent ? `${ink}33` : colors.border, borderless: true }}
          className="flex-1 items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator color={ink} />
          ) : (
            <Animated.View key={icon} entering={ZoomIn.duration(180).easing(ease)}>
              <View style={{ marginLeft: icon === 'play' ? size * 0.04 : 0 }}>
                <Icon
                  name={icon}
                  size={Math.round(size * (prominent ? 0.38 : 0.4))}
                  color={ink}
                  strokeWidth={solid ? 1.5 : 2}
                  fill={solid ? ink : undefined}
                />
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Glass>
    </View>
  );
}

/**
 * The controls under the prayer: the decade's beads in a small pill, and under it the
 * main action between previous and next, each its own glass button. Every action appears
 * once: in tap mode the main button moves the prayer on, so there is no separate "next".
 */
export function ControlDock(props: ControlDockProperties) {
  const { width, labels } = props;

  return (
    <View style={{ width, gap }} className="items-center">
      <Glass style={{ height: pill, borderRadius: pill / 2 }}>
        <View accessible={false} className="flex-1 justify-center px-3">
          <BeadRow state={props.beads} />
        </View>
      </Glass>

      <View className="flex-row items-center justify-center" style={{ gap: 22 }}>
        <Round
          size={side}
          icon={props.listening ? 'previous' : 'back'}
          label={labels.previous}
          onPress={props.onPrevious}
          disabled={!props.canGoBack}
        />
        <Round
          size={orb}
          prominent
          icon={props.listening ? (props.playing ? 'pause' : 'play') : 'chevron'}
          label={props.listening ? (props.playing ? labels.pause : labels.play) : labels.next}
          loading={props.listening && props.loading}
          onPress={props.onToggle}
        />
        {props.listening ? (
          <Round size={side} icon="next" label={labels.next} onPress={props.onNext} />
        ) : null}
      </View>
    </View>
  );
}
