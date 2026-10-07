import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon } from '@/shared/ui/Icon';

import { BeadDial } from './BeadDial';
import type { BeadRingState } from './BeadRing';
import { BeadRow } from './BeadRow';
import { GlassButton } from './GlassButton';

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

/** Liquid Glass where the system has it (the effect view itself carries the shape, so its rim is not clipped); a translucent surface elsewhere. */
function Glass({ style, children }: { style: ViewStyle; children?: React.ReactNode }) {
  const { colors } = useSkin();
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView glassEffectStyle="clear" tintColor={`${colors.background}4D`} style={style}>
        {children}
      </GlassView>
    );
  }
  return (
    <View
      style={[
        { backgroundColor: `${colors['surface-raised']}E6`, borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * The controls under the prayer: a bead wheel floating on glass that can fold into a
 * slim bar, the way a player shrinks to make room for what is being read.
 */
export function ControlDock(props: ControlDockProperties) {
  const { expanded, onExpandedChange, ring, dialSize, labels } = props;
  const { colors } = useSkin();

  const main = (size: 'regular' | 'large') =>
    props.listening && props.loading ? (
      <ActivityIndicator color={colors.accent} />
    ) : (
      <GlassButton
        symbol={props.listening ? (props.playing ? 'pause.fill' : 'play.fill') : 'chevron.forward'}
        icon={props.listening ? (props.playing ? 'pause' : 'play') : 'chevron'}
        label={props.listening ? (props.playing ? labels.pause : labels.play) : labels.next}
        onPress={props.onToggle}
        size={size}
        prominent
      />
    );

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
            <GlassButton
              symbol="backward.end.fill"
              icon="previous"
              label={labels.previous}
              onPress={props.onPrevious}
              disabled={!props.canGoBack}
              size="small"
            />
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
            {main('regular')}
            <GlassButton
              symbol="forward.end.fill"
              icon="next"
              label={labels.next}
              onPress={props.onNext}
              size="small"
            />
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
      <GlassButton
        symbol="chevron.down"
        icon="collapse"
        label={labels.minimize}
        onPress={() => {
          void Haptics.selectionAsync();
          onExpandedChange(false);
        }}
        size="small"
      />
      <View className="w-full flex-row items-center justify-center gap-6">
        <GlassButton
          symbol="backward.end.fill"
          icon="previous"
          label={labels.previous}
          onPress={props.onPrevious}
          disabled={!props.canGoBack}
          size="regular"
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
              {main('large')}
            </BeadDial>
          </View>
        </Glass>
        <GlassButton
          symbol="forward.end.fill"
          icon="next"
          label={labels.next}
          onPress={props.onNext}
          size="regular"
        />
      </View>
    </Animated.View>
  );
}
