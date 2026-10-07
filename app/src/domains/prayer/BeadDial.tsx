import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { BeadRing, beadSpacing, beadUnderMarker, type BeadRingState } from './BeadRing';

type BeadDialProperties = {
  state: BeadRingState;
  size: number;
  /** Called once per bead that passes the marker: +1 forward, -1 back. */
  onTurn: (direction: 1 | -1) => void;
  /** Our Father or a new mystery: the click under the finger is firmer. */
  isMajor: (direction: 1 | -1) => boolean;
  accessibilityLabel: string;
  children?: React.ReactNode;
};

const settle = { duration: 450, dampingRatio: 0.85 };

/** The angle equivalent to `target` that is closest to `from`, so the ring never spins the long way. */
function nearest(from: number, target: number): number {
  const delta = ((((target - from) % 360) + 540) % 360) - 180;
  return from + delta;
}

/**
 * The beads as a wheel the thumb can turn, like a rosary slipping through the fingers:
 * the ring follows the finger, each bead that passes the mark at the top clicks and moves
 * the prayer on, and when the prayer moves by itself the ring turns to the new bead.
 */
export function BeadDial({ state, size, onTurn, isMajor, accessibilityLabel, children }: BeadDialProperties) {
  const target = beadUnderMarker(state) * beadSpacing;
  const rotation = useSharedValue(target);
  const dragging = useSharedValue(false);
  const lastAngle = useSharedValue(0);
  const passed = useSharedValue(0);
  const latest = useRef({ onTurn, isMajor });
  latest.current = { onTurn, isMajor };

  // Follow the prayer when it moves without a finger on the ring (voice, arrows, swipes).
  useEffect(() => {
    if (!dragging.get()) {
      rotation.set(withSpring(nearest(rotation.get(), target), settle));
    }
  }, [target, rotation, dragging]);

  const turn = (direction: 1 | -1) => {
    void (latest.current.isMajor(direction)
      ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      : Haptics.selectionAsync());
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
        passed.set(0);
      })
      .onStart(() => {
        'worklet';
        dragging.set(true);
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
        rotation.set(rotation.get() + delta);
        // A bead clicks each time a full spacing has passed under the mark.
        let moved = passed.get() + delta;
        while (moved >= beadSpacing) {
          moved -= beadSpacing;
          scheduleOnRN(turn, 1);
        }
        while (moved <= -beadSpacing) {
          moved += beadSpacing;
          scheduleOnRN(turn, -1);
        }
        passed.set(moved);
      })
      .onFinalize(() => {
        'worklet';
        dragging.set(false);
        scheduleOnRN(snapHome);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // After the finger lifts, rest exactly on the bead the prayer is on.
  const latestTarget = useRef(target);
  latestTarget.current = target;
  function snapHome() {
    rotation.set(withSpring(nearest(rotation.get(), latestTarget.current), settle));
  }

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
