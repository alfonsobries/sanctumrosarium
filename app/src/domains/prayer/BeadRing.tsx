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

/**
 * One decade drawn as a circle of ten beads with its Our Father bead at the top: the
 * beads already prayed are filled, the current one carries a halo. During the opening,
 * the cross and the three beads before the first decade.
 */
export function BeadRing({ state, size }: BeadRingProperties) {
  const { colors } = useSkin();
  const center = size / 2;
  const ringRadius = size * 0.38;
  const bead = size * 0.045;

  if (state.kind === 'opening') {
    const spacing = bead * 4.2;
    const arm = bead * 1.5;
    const crossY = center - spacing * 2.1;
    const beads = [
      { position: 1, y: crossY + spacing * 1.25, r: bead * 1.45 },
      { position: 2, y: crossY + spacing * 2.25, r: bead },
      { position: 3, y: crossY + spacing * 3.05, r: bead },
      { position: 4, y: crossY + spacing * 3.85, r: bead },
    ];
    return (
      <View accessible={false} style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Path
            d={`M${center} ${crossY - arm * 1.2} V${crossY + arm * 1.7} M${center - arm} ${crossY - arm * 0.3} H${center + arm}`}
            stroke={state.current === 0 || state.prayed > 0 ? colors['bead-done'] : colors.bead}
            strokeWidth={bead * 0.55}
            strokeLinecap="round"
          />
          {state.current === 0 && <CurrentHalo cx={center} cy={crossY + arm * 0.2} r={arm * 1.75} color={colors.accent} />}
          {beads.map(({ position, y, r }) => (
            <G key={position}>
              <Circle cx={center} cy={y} r={r} fill={position <= state.prayed ? colors['bead-done'] : colors.bead} />
              {state.current === position && (
                <CurrentHalo cx={center} cy={y} r={r * 1.9} color={colors.accent} />
              )}
            </G>
          ))}
        </Svg>
      </View>
    );
  }

  const positions = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / 12;
    return { x: center + ringRadius * Math.cos(angle), y: center + ringRadius * Math.sin(angle) };
  });
  const ourFather = { x: center, y: center - ringRadius };

  return (
    <View accessible={false} style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={ringRadius} fill="none" stroke={colors.border} strokeWidth={1} />
        <Circle
          cx={ourFather.x}
          cy={ourFather.y}
          r={bead * 1.45}
          fill={state.ourFather === 'pending' ? colors.bead : colors['bead-done']}
        />
        {state.ourFather === 'current' && (
          <CurrentHalo cx={ourFather.x} cy={ourFather.y} r={bead * 2.4} color={colors.accent} />
        )}
        {positions.map((position, i) => {
          const index = i + 1;
          return (
            <G key={index}>
              <Circle
                cx={position.x}
                cy={position.y}
                r={bead}
                fill={index <= state.prayed ? colors['bead-done'] : colors.bead}
              />
              {state.current === index && (
                <CurrentHalo cx={position.x} cy={position.y} r={bead * 1.9} color={colors.accent} />
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
