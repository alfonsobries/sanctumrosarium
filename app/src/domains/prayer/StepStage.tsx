import { createContext, use, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { ScrollView, useWindowDimensions, type View as NativeView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type Reveal = {
  /** Keeps a line in view: called with the line's view when the voice reaches it. */
  reveal: (line: NativeView | null) => void;
};

const RevealContext = createContext<Reveal | null>(null);

export function useReveal(): Reveal['reveal'] {
  return use(RevealContext)?.reveal ?? (() => undefined);
}

type StepStageProperties = {
  stepKey: string;
  /** Which way the last move went, so the new page slides in from the matching side. */
  direction: 1 | -1;
  canGoBack: boolean;
  onSwipe: (direction: 1 | -1) => void;
  onTap: () => void;
  /** Space under the title bar, and kept free at the bottom for the floating bead panel. */
  topInset: number;
  bottomInset: number;
  accessibilityHint: string;
  children: ReactNode;
};

const out = Easing.bezier(0.23, 1, 0.32, 1);

/**
 * The page being prayed: one vertical scroll (so the system bars blur what passes under
 * them), a sideways swipe that follows the finger and snaps to the next or previous
 * prayer, and a tap that advances or pauses.
 */
export function StepStage({
  stepKey,
  direction,
  canGoBack,
  onSwipe,
  onTap,
  topInset,
  bottomInset,
  accessibilityHint,
  children,
}: StepStageProperties) {
  const { width, height } = useWindowDimensions();
  const scroll = useRef<ScrollView>(null);
  const offset = useRef(0);
  const viewport = useRef(height);
  const userScrolled = useRef(false);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const latest = useRef({ onSwipe, onTap, canGoBack });
  latest.current = { onSwipe, onTap, canGoBack };

  // A new page arrives from the side it was swiped toward, the way a leaf turns.
  useEffect(() => {
    userScrolled.current = false;
    offset.current = 0;
    scroll.current?.scrollTo({ y: 0, animated: false });
    translateX.set(direction * Math.min(48, width * 0.12));
    opacity.set(0);
    translateX.set(withTiming(0, { duration: 260, easing: out }));
    opacity.set(withTiming(1, { duration: 220, easing: out }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  const gesture = useMemo(() => {
    const settle = (towards: 1 | -1) => {
      if (towards === -1 && !latest.current.canGoBack) {
        translateX.set(withSpring(0, { duration: 380, dampingRatio: 0.9 }));
        opacity.set(withTiming(1, { duration: 160 }));
        return;
      }
      latest.current.onSwipe(towards);
    };
    const tap = Gesture.Tap()
      .maxDistance(10)
      .runOnJS(true)
      .onEnd((_event, success) => {
        if (success) {
          latest.current.onTap();
        }
      });
    const swipe = Gesture.Pan()
      .activeOffsetX([-18, 18])
      .failOffsetY([-12, 12])
      .onUpdate((event) => {
        'worklet';
        // Resist a little, like paper under the thumb.
        translateX.set(event.translationX * 0.85);
        opacity.set(1 - Math.min(0.5, Math.abs(event.translationX) / width));
      })
      .onEnd((event) => {
        'worklet';
        const far = Math.abs(event.translationX) > width * 0.22 || Math.abs(event.velocityX) > 650;
        if (far) {
          const towards = event.translationX < 0 ? 1 : -1;
          translateX.set(withTiming(-towards * width * 0.4, { duration: 140, easing: out }));
          opacity.set(withTiming(0, { duration: 140 }));
          scheduleOnRN(settle, towards);
        } else {
          translateX.set(withSpring(0, { duration: 380, dampingRatio: 0.9 }));
          opacity.set(withTiming(1, { duration: 160 }));
        }
      });
    return Gesture.Race(swipe, tap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const moving = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: translateX.get() }],
  }));

  const reveal = useMemo<Reveal>(
    () => ({
      reveal: (line) => {
        if (line === null || userScrolled.current) {
          return;
        }
        line.measureInWindow((_x, top, _w, h) => {
          const screenBottom = viewport.current - bottomInset - 24;
          // Only when the words being said are about to leave the screen: then bring them
          // up to just under the title bar.
          if (top + h > screenBottom) {
            const target = Math.max(0, offset.current + (top - (topInset + 16)));
            offset.current = target;
            scroll.current?.scrollTo({ y: target, animated: true });
          }
        });
      },
    }),
    [topInset, bottomInset],
  );

  return (
    <RevealContext value={reveal}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[{ flex: 1 }, moving]}
          accessible
          accessibilityRole="button"
          accessibilityHint={accessibilityHint}
          onAccessibilityTap={onTap}
        >
          <ScrollView
            ref={scroll}
            className="flex-1"
            contentInsetAdjustmentBehavior="never"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: topInset,
              paddingBottom: bottomInset + 32,
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={64}
            onLayout={(event) => (viewport.current = event.nativeEvent.layout.height)}
            onScroll={(event) => (offset.current = event.nativeEvent.contentOffset.y)}
            onScrollBeginDrag={() => (userScrolled.current = true)}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </RevealContext>
  );
}
