import {
  bookOf,
  hasPrayerText,
  litany,
  mysteryTitle,
  passage,
  prayerText,
  prayerTitle,
  type Locale,
} from '@sanctamaria/content';
import { evangelistOf, type Step } from '@sanctamaria/rosary';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text as NativeText, ScrollView, View, useWindowDimensions } from 'react-native';

import { ArtworkFrame } from '@/domains/artwork/ArtworkFrame';
import { useArtwork } from '@/domains/artwork/use-artwork';
import type { QueueStep, Spoken } from '@/domains/audio/queue';
import { useSpoken, useStepProgress } from '@/domains/audio/use-rosary-audio';
import type { Settings } from '@/domains/settings/settings';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Text } from '@/shared/ui/Text';

const sizes: Record<Settings['textSize'], { size: number; line: number }> = {
  regular: { size: 22, line: 32 },
  large: { size: 26, line: 37 },
  larger: { size: 31, line: 43 },
};

type StepContentProperties = {
  step: Step;
  locale: Locale;
  textSize: Settings['textSize'];
  /** When the voice is reading, the queue it plays; the text then lights up with it. */
  queue?: QueueStep[] | null;
};

type PrayerLinesProperties = {
  id: string;
  locale: Locale;
  textSize: Settings['textSize'];
  /** While the voice reads, the words already said light up and the rest wait dimmed. */
  spoken: Spoken | null;
};

function PrayerLines({ id, locale, textSize, spoken }: PrayerLinesProperties) {
  const { skin, colors } = useSkin();
  const text = prayerText(id, locale);
  const { size, line } = sizes[textSize];
  const split = text.responseFrom ?? text.lines.length;
  const firstLetter = text.lines[0]?.charAt(0) ?? '';

  let leaderOffset = 0;
  let responseOffset = 0;

  return (
    <View className="gap-1">
      {text.lines.map((value, index) => {
        const isResponse = index >= split;
        const offset = isResponse ? responseOffset : leaderOffset;
        if (isResponse) {
          responseOffset += value.length + 1;
        } else {
          leaderOffset += value.length + 1;
        }

        let said = value.length;
        if (spoken !== null) {
          if (spoken.role === 'leader') {
            said = isResponse ? 0 : Math.max(0, Math.min(value.length, spoken.chars - offset));
          } else if (isResponse) {
            said = Math.max(0, Math.min(value.length, spoken.chars - offset));
          }
        }

        const dropCap = skin.dropCap && index === 0 && firstLetter !== '';
        const body = dropCap ? value.slice(1) : value;
        const saidInBody = dropCap ? Math.max(0, said - 1) : said;
        const base = isResponse ? 'font-prayer-italic' : 'font-prayer';
        const settled = spoken === null ? (isResponse ? 'text-muted' : 'text-foreground') : 'text-foreground';

        return (
          <Text key={index} className={`${base} ${settled}`} style={{ fontSize: size, lineHeight: line }}>
            {dropCap && (
              <Text className="font-display text-rubric" style={{ fontSize: size * 1.6, lineHeight: line }}>
                {firstLetter}
              </Text>
            )}
            {body.slice(0, saidInBody)}
            {saidInBody < body.length && (
              <NativeText style={{ color: colors.faint }}>{body.slice(saidInBody)}</NativeText>
            )}
          </Text>
        );
      })}
    </View>
  );
}

function VoicedPrayerLines({
  queue,
  ...rest
}: Omit<PrayerLinesProperties, 'spoken'> & { queue: QueueStep[] }) {
  const spoken = useSpoken(queue);
  return <PrayerLines {...rest} spoken={spoken} />;
}

/** The body of the current step: the prayer's words, the mystery, the reading or the litany. */
export function StepContent({ step, locale, textSize, queue = null }: StepContentProperties) {
  const { t } = useTranslation();
  const announceArtwork = useArtwork(step.kind === 'announce' ? step.mystery.id : '');
  const { width } = useWindowDimensions();
  const { size, line } = sizes[textSize];

  if (step.kind === 'announce') {
    const artwork = announceArtwork;
    return (
      <View className="items-center gap-6">
        {artwork !== null && (
          <ArtworkFrame artwork={artwork} style={{ width: '100%', height: Math.min(width * 1.05, 460) }} />
        )}
        <Text
          className="text-center font-prayer text-foreground"
          style={{ fontSize: size + 4, lineHeight: line + 4 }}
        >
          {mysteryTitle(step.mystery.id, locale)}
        </Text>
      </View>
    );
  }

  if (step.kind === 'reading') {
    const text = passage(step.reading.ref, locale);
    const evangelist = evangelistOf(step.reading);
    return (
      <View className="gap-4">
        <Text variant="eyebrow" className="text-rubric">
          {evangelist === null
            ? (text?.displayRef ?? step.reading.ref)
            : `${t('pray.readingFrom', { evangelist: t(`evangelists.${evangelist}`) })} · ${text?.displayRef ?? step.reading.ref}`}
        </Text>
        <Text className="font-prayer text-foreground" style={{ fontSize: size - 2, lineHeight: line - 2 }}>
          {text?.text ?? bookOf(step.reading.ref)}
        </Text>
      </View>
    );
  }

  if (step.prayer === 'litany-of-loreto') {
    const { pairs } = litany(locale);
    return (
      <View className="gap-2">
        {pairs.map((pair, index) => (
          <Text
            key={index}
            className="font-prayer text-foreground"
            style={{ fontSize: size - 3, lineHeight: line - 4 }}
          >
            {pair.call} <Text className="font-prayer-italic text-muted">{pair.response}</Text>
          </Text>
        ))}
      </View>
    );
  }

  if (!hasPrayerText(step.prayer, locale)) {
    return null;
  }

  return queue === null ? (
    <PrayerLines id={step.prayer} locale={locale} textSize={textSize} spoken={null} />
  ) : (
    <VoicedPrayerLines id={step.prayer} locale={locale} textSize={textSize} queue={queue} />
  );
}

/** Heading over the step: which prayer, and the count for the Hail Marys. */
export function stepHeading(
  step: Step,
  locale: Locale,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  if (step.kind === 'announce') {
    return t('pray.mystery', {
      ordinal: t(`ordinal.${step.mystery.order - 1}`),
      set: t(`setAdjective.${step.mystery.set}`),
    });
  }
  if (step.kind === 'reading') {
    return t('pray.reading');
  }
  const title =
    step.intention === 'pope'
      ? `${t('pray.forThePope')} · ${prayerTitle(step.prayer, locale)}`
      : prayerTitle(step.prayer, locale);
  return step.count === null ? title : `${title} · ${t('pray.hailMaryCount', step.count)}`;
}

type StepScrollProperties = {
  children: React.ReactNode;
  /** While the voice reads, the text scrolls along with it. */
  followVoice: boolean;
  stepId: string;
  /** A tap that did not move: advances, or pauses the voice. Dragging only scrolls. */
  onTap: () => void;
  accessibilityHint?: string;
};

export function StepScroll({
  children,
  followVoice,
  stepId,
  onTap,
  accessibilityHint,
}: StepScrollProperties) {
  const scroll = useRef<ScrollView>(null);
  const progress = useStepProgress(followVoice);
  const [viewport, setViewport] = useState(0);
  const [content, setContent] = useState(0);
  const overflow = Math.max(0, content - viewport);
  // Once the person scrolls by hand, the text stops following the voice for this step.
  const [following, setFollowing] = useState(true);
  const latest = useRef({ onTap });
  latest.current = { onTap };

  const gesture = useMemo(() => {
    const tap = Gesture.Tap()
      .maxDistance(10)
      .runOnJS(true)
      .onEnd((_event, success) => {
        if (success) {
          latest.current.onTap();
        }
      });
    return tap;
  }, []);

  useEffect(() => {
    setFollowing(true);
    scroll.current?.scrollTo({ y: 0, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  useEffect(() => {
    if (progress === null || overflow === 0 || !following) {
      return;
    }
    // Keep the line being said a little above the middle: start moving after a fifth of the step.
    const eased = Math.min(1, Math.max(0, (progress - 0.2) / 0.7));
    scroll.current?.scrollTo({ y: eased * overflow, animated: true });
  }, [progress, overflow, following]);

  return (
    <GestureDetector gesture={gesture}>
      <View
        className="flex-1"
        accessible
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        onAccessibilityTap={onTap}
      >
        <ScrollView
          ref={scroll}
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-6 py-6"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          onLayout={(event) => setViewport(event.nativeEvent.layout.height)}
          onContentSizeChange={(_, height) => setContent(height)}
          onScrollBeginDrag={() => setFollowing(false)}
        >
          {children}
        </ScrollView>
      </View>
    </GestureDetector>
  );
}
