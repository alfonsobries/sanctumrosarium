import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { useSkin } from '@/shared/theme/SkinProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type BeadRingState =
  | { kind: 'decade'; ourFather: 'pending' | 'current' | 'done'; prayed: number; current: number | null }
  /** Positions: 0 the cross, 1 the Our Father bead, 2-4 the three Hail Marys. */
  | { kind: 'opening'; prayed: number; current: number | null };

/** Degrees between beads on the ring; also one click of the wheel. */
export const beadSpacing = 30;

/**
 * Which bead sits under the marker at the top: the one being prayed, or the last one
 * prayed while the Glory Be closes the decade. Beads follow each other counterclockwise,
 * so turning the ring clockwise brings the next one up.
 */
export function beadUnderMarker(state: BeadRingState): number {
  if (state.kind === 'opening') {
    return state.current ?? state.prayed;
  }
  if (state.ourFather === 'current' || state.ourFather === 'pending') {
    return 0;
  }
  return state.current ?? state.prayed;
}

type BeadRingProperties = {
  state: BeadRingState;
  size: number;
  children?: React.ReactNode;
  /** How far the ring is turned, in degrees; it rests with the current bead at the top. */
  rotation?: SharedValue<number>;
};

const ease = Easing.bezier(0.23, 1, 0.32, 1);

function CurrentHalo({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const radius = useSharedValue(r);
  useEffect(() => {
    radius.set(r * 0.6);
    radius.set(withTiming(r, { duration: 260, easing: ease }));
  }, [cx, cy, r, radius]);
  const props = useAnimatedProps(() => ({ r: radius.get() }));
  return <AnimatedCircle cx={cx} cy={cy} animatedProps={props} fill="none" stroke={color} strokeWidth={2} />;
}

const toRadians = (degrees: number): number => ((degrees - 90) * Math.PI) / 180;

/**
 * The beads as a ring around whatever sits in the middle (the play button). The bead
 * being prayed rests at the top, beside a fixed mark: the crucifix during the opening, a
 * small notch during the decades, both just inside the ring. Prayed beads stay softly filled.
 */
export function BeadRing({ state, size, children, rotation }: BeadRingProperties) {
  const { colors } = useSkin();
  const turned = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation?.get() ?? 0}deg` }] }));
  const center = size / 2;
  const ringRadius = size * 0.42;
  const bead = size * 0.04;
  const at = (degrees: number) => ({
    x: center + ringRadius * Math.cos(toRadians(degrees)),
    y: center + ringRadius * Math.sin(toRadians(degrees)),
  });

  const slots: { key: string; x: number; y: number; r: number; done: boolean; current: boolean }[] = [];
  if (state.kind === 'opening') {
    for (let position = 1; position <= 4; position++) {
      slots.push({
        key: `o${position}`,
        ...at(-beadSpacing * position),
        r: position === 1 ? bead * 1.45 : bead,
        done: position <= state.prayed,
        current: state.current === position,
      });
    }
  } else {
    slots.push({
      key: 'of',
      ...at(0),
      r: bead * 1.45,
      done: state.ourFather === 'done',
      current: state.ourFather === 'current',
    });
    for (let index = 1; index <= 10; index++) {
      slots.push({
        key: `hm${index}`,
        ...at(-beadSpacing * index),
        r: bead,
        done: index <= state.prayed,
        current: state.current === index,
      });
    }
  }

  // Inside the ring, just under the current bead, clear of its halo.
  const markerY = center - ringRadius + bead * 4.6;
  const arm = bead * 1.15;
  const onCross = state.kind === 'opening' && state.current === 0;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Animated.View accessible={false} style={[{ position: 'absolute', inset: 0 }, turned]}>
        <Svg width={size} height={size}>
          {slots.map((slot) => (
            <G key={slot.key}>
              <Circle
                cx={slot.x}
                cy={slot.y}
                r={slot.current ? slot.r * 1.3 : slot.r}
                fill={slot.current ? colors.accent : slot.done ? colors['bead-done'] : colors.bead}
                fillOpacity={slot.done && !slot.current ? 0.4 : 1}
              />
              {slot.current && <CurrentHalo cx={slot.x} cy={slot.y} r={slot.r * 2.1} color={colors.accent} />}
            </G>
          ))}
        </Svg>
      </Animated.View>
      <View
        accessible={false}
        pointerEvents="none"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <Svg width={size} height={size} style={{ overflow: 'visible' }}>
          {state.kind === 'opening' ? (
            <Path
              d={`M${center} ${markerY - arm * 1.2} V${markerY + arm * 1.3} M${center - arm * 0.8} ${markerY - arm * 0.35} H${center + arm * 0.8}`}
              stroke={onCross ? colors.accent : colors.muted}
              strokeWidth={bead * 0.55}
              strokeLinecap="round"
            />
          ) : (
            <Path
              d={`M${center - bead} ${markerY + bead * 0.6} L${center} ${markerY - bead * 0.8} L${center + bead} ${markerY + bead * 0.6} Z`}
              fill={colors.accent}
            />
          )}
        </Svg>
      </View>
      {children}
    </View>
  );
}
