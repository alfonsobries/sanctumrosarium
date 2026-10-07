import { createContext, use, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { View, useWindowDimensions, type View as NativeView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type Reveal = {
  /**
   * Keeps a line in view: called with the line's view when the voice reaches it, or with
   * a block of text and where the line sits inside it.
   */
  reveal: (line: NativeView | null, within?: { y: number; height: number }) => void;
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
  /** Short pages (a mystery and its image) sit in the middle of the screen when they fit. */
  centered?: boolean;
  /**
   * The skin's material, held still behind the words. It lives inside the scroll view so
   * the scroll view stays the screen's first view, which is how the system bars find it
   * to soften what passes under them.
   */
  backdrop?: ReactNode;
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
  centered = false,
  backdrop,
  children,
}: StepStageProperties) {
  const { width, height } = useWindowDimensions();
  const scroll = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const viewport = useRef(height);
  const userScrolled = useRef(false);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const latest = useRef({ onSwipe, onTap, canGoBack });
  latest.current = { onSwipe, onTap, canGoBack };

  // A new page arrives from the side it was swiped toward, the way a leaf turns.
  useEffect(() => {
    userScrolled.current = false;
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

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  const still = useAnimatedStyle(() => ({ transform: [{ translateY: scrollY.get() }] }));

  const moving = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: translateX.get() }],
  }));

  const reveal = useMemo<Reveal>(
    () => ({
      reveal: (line, within) => {
        if (line === null || userScrolled.current) {
          return;
        }
        line.measureInWindow((_x, blockTop, _w, blockHeight) => {
          const top = blockTop + (within?.y ?? 0);
          const h = within?.height ?? blockHeight;
          const screenBottom = viewport.current - bottomInset - 24;
          // Only when the words being said are about to leave the screen: then bring them
          // up to just under the title bar.
          if (top + h > screenBottom) {
            const target = scrollY.get() + (top - (topInset + 16));
            if (target > scrollY.get()) {
              scroll.current?.scrollTo({ y: target, animated: true });
            }
          }
        });
      },
    }),
    [topInset, bottomInset, scroll, scrollY],
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
          {/* A fresh scroll per page starts at its top; the system insets it under the
              title bar, which is what lets the bar soften the words passing beneath it. */}
          <Animated.ScrollView
            key={stepKey}
            ref={scroll}
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 12,
              // A centred page grows to the whole scroll view, which also runs under the
              // title bar; the same room at the bottom keeps it centred in what is visible.
              paddingBottom: centered ? bottomInset + topInset + 12 : bottomInset + 32,
              ...(centered ? { flexGrow: 1, justifyContent: 'center' } : null),
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onLayout={(event) => (viewport.current = event.nativeEvent.layout.height)}
            onScroll={onScroll}
            onScrollBeginDrag={() => (userScrolled.current = true)}
          >
            {backdrop !== undefined && (
              <Animated.View
                pointerEvents="none"
                style={[{ position: 'absolute', left: 0, top: 0, width, height }, still]}
              >
                {backdrop}
              </Animated.View>
            )}
            <View>{children}</View>
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </RevealContext>
  );
}
