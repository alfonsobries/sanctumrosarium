import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { BeadRing, type BeadRingState } from './BeadRing';

/** One bead per this many degrees of turn, like the spacing of beads on the ring. */
const detent = 30;

type BeadDialProperties = {
  state: BeadRingState;
  size: number;
  /** Called once per bead the finger passes: +1 forward (clockwise), -1 back. */
  onTurn: (direction: 1 | -1) => void;
  /** Our Father or a new mystery: the tick under the finger is firmer. */
  isMajor: (direction: 1 | -1) => boolean;
  accessibilityLabel: string;
  children?: React.ReactNode;
};

/**
 * The beads as a wheel the thumb can turn: each bead that passes clicks under the
 * finger and moves the prayer on by one, the way beads slip through the fingers.
 */
export function BeadDial({ state, size, onTurn, isMajor, accessibilityLabel, children }: BeadDialProperties) {
  const rotation = useSharedValue(0);
  const lastAngle = useSharedValue(0);
  const latest = useRef({ onTurn, isMajor });
  latest.current = { onTurn, isMajor };

  const turn = (direction: 1 | -1) => {
    const major = latest.current.isMajor(direction);
    void (major ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) : Haptics.selectionAsync());
    latest.current.onTurn(direction);
  };

  const gesture = useMemo(() => {
    const center = size / 2;
    const angleOf = (x: number, y: number): number => {
      'worklet';
      return (Math.atan2(y - center, x - center) * 180) / Math.PI;
    };
    return Gesture.Pan()
      .minDistance(4)
      .onBegin((event) => {
        'worklet';
        lastAngle.set(angleOf(event.x, event.y));
      })
      .onUpdate((event) => {
        'worklet';
        const angle = angleOf(event.x, event.y);
        let delta = angle - lastAngle.get();
        if (delta > 180) {
          delta -= 360;
        } else if (delta < -180) {
          delta += 360;
        }
        lastAngle.set(angle);
        let next = rotation.get() + delta;
        while (next >= detent) {
          next -= detent;
          scheduleOnRN(turn, 1);
        }
        while (next <= -detent) {
          next += detent;
          scheduleOnRN(turn, -1);
        }
        rotation.set(next);
      })
      .onFinalize(() => {
        'worklet';
        rotation.set(withSpring(0, { duration: 400, dampingRatio: 1 }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <GestureDetector gesture={gesture}>
      {/* The center control stays its own accessible element; screen readers move with the arrows. */}
      <View accessibilityLabel={accessibilityLabel}>
        <BeadRing state={state} size={size} rotation={rotation}>
          {children}
        </BeadRing>
      </View>
    </GestureDetector>
  );
}
