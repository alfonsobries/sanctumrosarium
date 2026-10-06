import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { useSkin } from '@/shared/theme/SkinProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type BeadRingState =
  | { kind: 'decade'; ourFather: 'pending' | 'current' | 'done'; prayed: number; current: number | null }
  /** Positions: 0 the cross, 1 the Our Father bead, 2-4 the three Hail Marys. */
  | { kind: 'opening'; prayed: number; current: number | null };

type BeadRingProperties = {
  state: BeadRingState;
  size: number;
  children?: React.ReactNode;
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
 * The beads drawn as a circle around whatever sits in the middle (the play button):
 * for a decade, its Our Father bead at the top and ten Hail Marys around; during the
 * opening, the crucifix at the top and the four beads that follow it. Prayed beads are
 * filled, the current one carries a halo.
 */
export function BeadRing({ state, size, children }: BeadRingProperties) {
  const { colors } = useSkin();
  const center = size / 2;
  // Leave room above the top slot for the crucifix, which is taller than a bead.
  const ringRadius = size * 0.39;
  const bead = size * 0.04;
  const at = (degrees: number) => ({
    x: center + ringRadius * Math.cos(toRadians(degrees)),
    y: center + ringRadius * Math.sin(toRadians(degrees)),
  });

  const slots: { key: string; x: number; y: number; r: number; done: boolean; current: boolean }[] = [];
  let cross: { x: number; y: number; done: boolean; current: boolean } | null = null;

  if (state.kind === 'opening') {
    cross = { ...at(0), done: state.prayed > 0 || state.current !== 0, current: state.current === 0 };
    [72, 144, 216, 288].forEach((degrees, i) => {
      const position = i + 1;
      slots.push({
        key: `o${position}`,
        ...at(degrees),
        r: position === 1 ? bead * 1.45 : bead,
        done: position <= state.prayed,
        current: state.current === position,
      });
    });
  } else {
    slots.push({
      key: 'of',
      ...at(0),
      r: bead * 1.45,
      done: state.ourFather !== 'pending',
      current: state.ourFather === 'current',
    });
    for (let index = 1; index <= 10; index++) {
      slots.push({
        key: `hm${index}`,
        ...at(30 + ((index - 1) * 300) / 9),
        r: bead,
        done: index <= state.prayed,
        current: state.current === index,
      });
    }
  }

  const arm = bead * 1.3;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <View accessible={false} style={{ position: 'absolute', inset: 0 }}>
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={ringRadius} fill="none" stroke={colors.border} strokeWidth={1} />
          {cross !== null && (
            <>
              <Circle cx={cross.x} cy={cross.y} r={arm * 1.6} fill={colors.background} />
              <Path
                d={`M${cross.x} ${cross.y - arm * 1.3} V${cross.y + arm * 1.4} M${cross.x - arm} ${cross.y - arm * 0.35} H${cross.x + arm}`}
                stroke={cross.done || cross.current ? colors['bead-done'] : colors.bead}
                strokeWidth={bead * 0.55}
                strokeLinecap="round"
              />
              {cross.current && <CurrentHalo cx={cross.x} cy={cross.y} r={arm * 2} color={colors.accent} />}
            </>
          )}
          {slots.map((slot) => (
            <G key={slot.key}>
              <Circle
                cx={slot.x}
                cy={slot.y}
                r={slot.r}
                fill={slot.done ? colors['bead-done'] : colors.bead}
              />
              {slot.current && <CurrentHalo cx={slot.x} cy={slot.y} r={slot.r * 1.9} color={colors.accent} />}
            </G>
          ))}
        </Svg>
      </View>
      {children}
    </View>
  );
}
