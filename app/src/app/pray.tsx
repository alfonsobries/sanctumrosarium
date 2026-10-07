import { mysteryRefsOf, mysteryTitle } from '@sanctamaria/content';
import { decadesCompleted, type Step } from '@sanctamaria/rosary';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { hasAudio, useRosaryAudio } from '@/domains/audio/use-rosary-audio';
import { beadRingState, decadeFills } from '@/domains/prayer/bead-state';
import { BeadRing } from '@/domains/prayer/BeadRing';
import { DecadeProgress } from '@/domains/prayer/DecadeProgress';
import { guideFor } from '@/domains/prayer/guide';
import { stepsFor } from '@/domains/prayer/session';
import { StepContent, StepScroll, stepHeading } from '@/domains/prayer/StepContent';
import { useSession } from '@/domains/prayer/use-session';
import { useSessionJournal } from '@/domains/prayer/use-session-journal';
import { nextRate } from '@/domains/settings/settings';
import { useSettings } from '@/domains/settings/use-settings';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { SafeScreen } from '@/shared/ui/SafeScreen';
import { Text } from '@/shared/ui/Text';

function hapticFor(step: Step | undefined): void {
  if (step === undefined) {
    return;
  }
  if (step.kind === 'announce' || (step.kind === 'prayer' && step.prayer === 'our-father')) {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return;
  }
  void Haptics.selectionAsync();
}

function ControlButton({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string;
  icon: 'previous' | 'next';
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useSkin();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      className="h-14 w-14 items-center justify-center rounded-full active:bg-surface"
      style={{ opacity: disabled ? 0.35 : 1 }}
    >
      <Icon name={icon} size={26} color={colors.foreground} />
    </Pressable>
  );
}

function Finished({ decades, onDone }: { decades: number; onDone: () => void }) {
  const { t } = useTranslation();
  const { colors } = useSkin();
  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1 items-center justify-center gap-6 px-8">
      <Icon name="cross" size={44} color={colors.accent} />
      <View className="items-center gap-2">
        <Text variant="title" className="text-center">
          {t('pray.doneTitle')}
        </Text>
        <Text variant="callout" className="text-center text-muted">
          {t('pray.doneDecades', { count: decades })}
        </Text>
      </View>
      <Button label={t('pray.done')} onPress={onDone} className="self-stretch" />
    </Animated.View>
  );
}

export default function PrayScreen() {
  useKeepAwake();
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useSkin();
  const { width } = useWindowDimensions();
  const headingLocale = useContentLocale();
  const textSize = useSettings((state) => state.textSize);
  const guided = useSettings((state) => state.guided);
  const mode = useSettings((state) => state.mode);
  const updateSettings = useSettings((state) => state.update);
  const rate = useSettings((state) => state.rate);
  const pauseSeconds = useSettings((state) => state.pauseSeconds);
  const plan = useSession((state) => state.plan);
  const position = useSession((state) => state.position);
  const moveTo = useSession((state) => state.moveTo);
  const clear = useSession((state) => state.clear);
  const [finished, setFinished] = useState(false);
  const [headingHidden, setHeadingHidden] = useState(false);

  const steps = useMemo(() => (plan === null ? [] : stepsFor(plan, mysteryRefsOf(plan.set))), [plan]);
  useSessionJournal(plan, steps, finished ? steps.length - 1 : position);

  const audio = useRosaryAudio({
    enabled: mode === 'listen' && !finished,
    sessionId: plan?.id ?? null,
    steps,
    locale: plan?.locale ?? 'es-MX',
    position,
    rate,
    pauseSeconds,
    nowPlaying: {
      album: plan === null ? '' : t(`sets.${plan.set}`),
      artist: 'SanctaMaria',
      titles: (s) => stepHeading(s, headingLocale, t),
    },
    onStep: (index) => moveTo(index),
  });
  const listening = mode === 'listen' && audio.availability === 'ready';

  useEffect(() => {
    if (listening && audio.status === 'ended') {
      setFinished(true);
    }
  }, [listening, audio.status]);

  if (plan === null) {
    return <Redirect href="/" />;
  }

  const step = steps[position];
  const last = steps.length - 1;

  function goTo(target: number) {
    moveTo(target);
    hapticFor(steps[target]);
    if (listening) {
      audio.skipTo(target);
    }
  }

  function handleNext() {
    if (position >= last) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFinished(true);
      return;
    }
    goTo(position + 1);
  }

  function handlePrevious() {
    if (position > 0) {
      goTo(position - 1);
    }
  }

  function handleDone() {
    clear();
    router.back();
  }

  function handleClose() {
    if (decadesCompleted(steps, position) === 0 && position < 3) {
      handleDone();
      return;
    }
    Alert.alert(t('pray.leaveTitle'), t('pray.leaveDetail'), [
      { text: t('pray.stay'), style: 'cancel' },
      { text: t('pray.leave'), style: 'destructive', onPress: handleDone },
    ]);
  }

  if (finished || step === undefined) {
    return (
      <SafeScreen>
        <Finished decades={decadesCompleted(steps, steps.length)} onDone={handleDone} />
      </SafeScreen>
    );
  }

  const mystery =
    step.decade === null
      ? null
      : (steps.find((s) => s.kind === 'announce' && s.decade === step.decade) ?? null);
  const guide = guided ? guideFor(steps, position) : null;
  const compactTitle =
    mystery !== null && mystery.kind === 'announce'
      ? mysteryTitle(mystery.mystery.id, headingLocale)
      : t(`sets.${plan.set}`);
  const heading = (
    <View className="min-h-[52px] gap-0.5 pb-4 pt-2">
      {mystery !== null && mystery.kind === 'announce' ? (
        <>
          <Text variant="eyebrow" className="text-accent">
            {t('pray.mystery', {
              ordinal: t(`ordinal.${mystery.mystery.order - 1}`),
              set: t(`setAdjective.${mystery.mystery.set}`),
            })}
          </Text>
          {step.kind !== 'announce' && (
            <Text variant="headline" className="font-prayer text-[20px] leading-[26px]" numberOfLines={2}>
              {mysteryTitle(mystery.mystery.id, headingLocale)}
            </Text>
          )}
        </>
      ) : (
        <Text variant="headline" className="font-prayer text-[20px] leading-[26px]">
          {t(`sets.${plan.set}`)}
        </Text>
      )}
    </View>
  );
  const ringSize = Math.min(168, width * 0.44);

  return (
    <SafeScreen>
      <View className="gap-4 px-5 pb-1 pt-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('pray.close')}
            onPress={handleClose}
            hitSlop={10}
            className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
          >
            <Icon name="close" color={colors.muted} />
          </Pressable>
          <Animated.View
            key={headingHidden ? 'title' : 'decade'}
            entering={FadeIn.duration(180)}
            className="flex-1 items-center px-2"
          >
            <Text
              variant="footnote"
              numberOfLines={1}
              className={headingHidden ? 'font-semibold text-foreground' : undefined}
            >
              {headingHidden
                ? compactTitle
                : step.decade === null
                  ? step.section === 'closing'
                    ? t('pray.closing')
                    : t('pray.opening')
                  : t('pray.decadeOf', { decade: step.decade })}
            </Text>
          </Animated.View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('display.title')}
            onPress={() => router.push('/display')}
            hitSlop={10}
            className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
          >
            <Icon name="text" color={colors.muted} />
          </Pressable>
        </View>
        <DecadeProgress
          onSelect={(decade) => {
            const target = steps.findIndex((s) => s.kind === 'announce' && s.decade === decade);
            if (target !== -1) {
              goTo(target);
            }
          }}
          decadeLabel={(decade) => t('pray.decadeOf', { decade })}
          fills={decadeFills(steps, position)}
          label={step.decade === null ? t('pray.opening') : t('pray.progress', { decade: step.decade })}
        />
      </View>

      <StepScroll
        stepId={step.id}
        progress={listening && audio.status === 'playing' ? audio.progress : null}
        onTap={listening ? audio.toggle : handleNext}
        onSwipe={(direction) => (direction === 'next' ? handleNext() : handlePrevious())}
        header={heading}
        onHeaderHidden={setHeadingHidden}
        accessibilityHint={listening ? t('pray.pause') : t('pray.tapToContinue')}
      >
        <Animated.View
          key={step.id}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(120)}
          className="gap-4"
        >
          {guide !== null && (
            <Text variant="footnote" className="font-prayer-italic text-[16px] leading-[22px] text-rubric">
              {t(`guide.${guide}`)}
            </Text>
          )}
          {listening && audio.status === 'interrupted' && (
            <Text variant="footnote" className="text-accent">
              {t('pray.interrupted')}
            </Text>
          )}
          {step.kind === 'prayer' && <Text variant="eyebrow">{stepHeading(step, headingLocale, t)}</Text>}
          <StepContent step={step} locale={plan.locale} textSize={textSize} />
        </Animated.View>
      </StepScroll>

      <View className="flex-row items-center justify-between px-6 pb-2 pt-3">
        <ControlButton
          label={t('pray.previous')}
          icon="previous"
          onPress={handlePrevious}
          disabled={position === 0}
        />
        <BeadRing state={beadRingState(steps, position)} size={ringSize}>
          {listening ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={audio.status === 'playing' ? t('pray.pause') : t('pray.play')}
              onPress={audio.toggle}
              className="h-16 w-16 items-center justify-center rounded-full bg-accent active:opacity-80"
            >
              <Icon
                name={audio.status === 'playing' ? 'pause' : 'play'}
                size={28}
                color={colors['accent-foreground']}
              />
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('pray.next')}
              onPress={handleNext}
              className="h-16 w-16 items-center justify-center rounded-full bg-accent active:opacity-80"
            >
              <Icon name="chevron" size={30} color={colors['accent-foreground']} />
            </Pressable>
          )}
        </BeadRing>
        <ControlButton label={t('pray.next')} icon="next" onPress={handleNext} />
      </View>
    </SafeScreen>
  );
}
