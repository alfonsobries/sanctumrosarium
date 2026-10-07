import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon } from '@/shared/ui/Icon';

import { BeadDial } from './BeadDial';
import type { BeadRingState } from './BeadRing';
import { BeadRow } from './BeadRow';

type Labels = {
  previous: string;
  next: string;
  play: string;
  pause: string;
  dial: string;
  minimize: string;
  expand: string;
};

type ControlDockProperties = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  ring: BeadRingState;
  dialSize: number;
  listening: boolean;
  playing: boolean;
  loading: boolean;
  canGoBack: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTurn: (direction: 1 | -1) => void;
  isMajor: (direction: 1 | -1) => boolean;
  labels: Labels;
};

/** Liquid Glass where the system has it; a translucent surface elsewhere. */
function Glass({ style, children }: { style: object; children?: React.ReactNode }) {
  const { colors } = useSkin();
  const glass = isLiquidGlassAvailable();
  return (
    <View
      style={[
        { overflow: 'hidden', borderCurve: 'continuous' },
        glass
          ? { borderWidth: 0.5, borderColor: `${colors.foreground}1F` }
          : { backgroundColor: `${colors['surface-raised']}E6`, borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {glass && (
        <GlassView
          glassEffectStyle="clear"
          // A breath of the page color keeps the beads readable over the text the lens shows.
          tintColor={`${colors.background}4D`}
          isInteractive
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
      {children}
    </View>
  );
}

function RoundButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: 'previous' | 'next';
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useSkin();
  return (
    <Glass style={{ width: 52, height: 52, borderRadius: 26, opacity: disabled ? 0.4 : 1 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        className="flex-1 items-center justify-center active:opacity-60"
      >
        <Icon name={icon} size={22} color={colors.foreground} />
      </Pressable>
    </Glass>
  );
}

function MainButton({
  listening,
  playing,
  loading,
  onPress,
  labels,
  size,
}: {
  listening: boolean;
  playing: boolean;
  loading: boolean;
  onPress: () => void;
  labels: Labels;
  size: number;
}) {
  const { colors } = useSkin();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={listening ? (playing ? labels.pause : labels.play) : labels.next}
      onPress={onPress}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="items-center justify-center bg-accent active:scale-95"
    >
      {listening && loading ? (
        <ActivityIndicator color={colors['accent-foreground']} />
      ) : (
        <Icon
          name={listening ? (playing ? 'pause' : 'play') : 'chevron'}
          size={size * 0.42}
          color={colors['accent-foreground']}
        />
      )}
    </Pressable>
  );
}

/**
 * The controls under the prayer: a bead wheel floating on glass that can fold into a
 * slim bar, the way a player shrinks to make room for what is being read.
 */
export function ControlDock(props: ControlDockProperties) {
  const { expanded, onExpandedChange, ring, dialSize, labels } = props;
  const { colors } = useSkin();

  if (!expanded) {
    return (
      <Animated.View
        key="bar"
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(120)}
        className="w-full items-center"
      >
        <Glass style={{ borderRadius: 30, height: 60, width: '88%', maxWidth: 420 }}>
          <View className="flex-1 flex-row items-center gap-1 px-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={labels.previous}
              disabled={!props.canGoBack}
              onPress={props.onPrevious}
              className="h-11 w-11 items-center justify-center active:opacity-60"
              style={{ opacity: props.canGoBack ? 1 : 0.35 }}
            >
              <Icon name="previous" size={20} color={colors.foreground} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={labels.expand}
              onPress={() => {
                void Haptics.selectionAsync();
                onExpandedChange(true);
              }}
              className="h-11 flex-1 items-center justify-center"
            >
              <BeadRow
                state={ring}
                colors={{ done: colors['bead-done'], pending: colors.bead, current: colors.accent }}
              />
            </Pressable>
            <MainButton
              listening={props.listening}
              playing={props.playing}
              loading={props.loading}
              onPress={props.onToggle}
              labels={labels}
              size={44}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={labels.next}
              onPress={props.onNext}
              className="h-11 w-11 items-center justify-center active:opacity-60"
            >
              <Icon name="next" size={20} color={colors.foreground} />
            </Pressable>
          </View>
        </Glass>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      key="dial"
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(120)}
      className="w-full items-center gap-1"
    >
      <Glass style={{ width: 44, height: 28, borderRadius: 14 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={labels.minimize}
          onPress={() => {
            void Haptics.selectionAsync();
            onExpandedChange(false);
          }}
          hitSlop={10}
          className="flex-1 items-center justify-center active:opacity-60"
        >
          <Icon name="collapse" size={18} color={colors.muted} />
        </Pressable>
      </Glass>
      <View className="w-full flex-row items-center justify-center gap-6">
        <RoundButton
          icon="previous"
          label={labels.previous}
          onPress={props.onPrevious}
          disabled={!props.canGoBack}
        />
        <Glass style={{ width: dialSize + 16, height: dialSize + 16, borderRadius: (dialSize + 16) / 2 }}>
          <View className="flex-1 items-center justify-center">
            <BeadDial
              state={ring}
              size={dialSize}
              onTurn={props.onTurn}
              isMajor={props.isMajor}
              accessibilityLabel={labels.dial}
            >
              <MainButton
                listening={props.listening}
                playing={props.playing}
                loading={props.loading}
                onPress={props.onToggle}
                labels={labels}
                size={56}
              />
            </BeadDial>
          </View>
        </Glass>
        <RoundButton icon="next" label={labels.next} onPress={props.onNext} />
      </View>
    </Animated.View>
  );
}
