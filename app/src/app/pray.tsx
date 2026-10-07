import { mysteryRefsOf, mysteryTitle } from '@sanctamaria/content';
import { decadesCompleted, type Step } from '@sanctamaria/rosary';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useKeepAwake } from 'expo-keep-awake';
import type { SFSymbol } from 'sf-symbols-typescript';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useArtwork } from '@/domains/artwork/use-artwork';
import { hasAudio, useRosaryAudio } from '@/domains/audio/use-rosary-audio';
import { beadRingState } from '@/domains/prayer/bead-state';
import { BeadRow } from '@/domains/prayer/BeadRow';
import { guideFor } from '@/domains/prayer/guide';
import { stepsFor } from '@/domains/prayer/session';
import { StepContent, StepScroll, stepHeading } from '@/domains/prayer/StepContent';
import { useSession } from '@/domains/prayer/use-session';
import { useSessionJournal } from '@/domains/prayer/use-session-journal';
import { rates } from '@/domains/settings/settings';
import { useSettings } from '@/domains/settings/use-settings';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { ScreenTexture, useSkin } from '@/shared/theme/SkinProvider';
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

/** Bottom toolbar icons: SF Symbols in the iOS system bar, the same Lucide glyphs elsewhere. */
function toolbarIcon(symbol: SFSymbol, fallback: number): SFSymbol | number {
  return process.env.EXPO_OS === 'ios' ? symbol : fallback;
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
  const headingLocale = useContentLocale();
  const textSize = useSettings((state) => state.textSize);
  const guided = useSettings((state) => state.guided);
  const mode = useSettings((state) => state.mode);
  const updateSettings = useSettings((state) => state.update);
  const rate = useSettings((state) => state.rate);
  const pauseSeconds = useSettings((state) => state.pauseSeconds);
  const appearance = useSettings((state) => state.appearance);
  const plan = useSession((state) => state.plan);
  const position = useSession((state) => state.position);
  const moveTo = useSession((state) => state.moveTo);
  const clear = useSession((state) => state.clear);
  const [finished, setFinished] = useState(false);

  const steps = useMemo(() => (plan === null ? [] : stepsFor(plan, mysteryRefsOf(plan.set))), [plan]);
  const currentDecade = steps[position]?.decade ?? null;
  const currentAnnounce = steps.find((s) => s.kind === 'announce' && s.decade === currentDecade);
  const thumbnail = useArtwork(currentAnnounce?.kind === 'announce' ? currentAnnounce.mystery.id : '');
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
        <Stack.Screen options={{ headerShown: false }} />
        <Finished decades={decadesCompleted(steps, steps.length)} onDone={handleDone} />
      </SafeScreen>
    );
  }

  const mystery =
    step.decade === null
      ? null
      : (steps.find((s) => s.kind === 'announce' && s.decade === step.decade) ?? null);
  const guide = guided ? guideFor(steps, position) : null;
  const barTitle =
    mystery !== null && mystery.kind === 'announce'
      ? mysteryTitle(mystery.mystery.id, headingLocale)
      : step.section === 'closing'
        ? t('pray.closing')
        : t('pray.opening');
  const heading =
    mystery !== null && mystery.kind === 'announce' && step.kind !== 'announce' ? (
      <View className="flex-row items-center gap-3 pb-2">
        {thumbnail !== null && (
          <Image
            source={thumbnail.source}
            placeholder={{ thumbhash: thumbnail.thumbhash }}
            contentFit="cover"
            accessible={false}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: thumbnail.color }}
          />
        )}
        <Text variant="eyebrow" className="flex-1 text-accent">
          {t('pray.mystery', {
            ordinal: t(`ordinal.${mystery.mystery.order - 1}`),
            set: t(`setAdjective.${mystery.mystery.set}`),
          })}
        </Text>
      </View>
    ) : null;
  const audioAvailable = hasAudio(plan.locale);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: process.env.EXPO_OS === 'ios',
          headerShadowVisible: false,
          headerStyle: process.env.EXPO_OS === 'ios' ? undefined : { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          scrollEdgeEffects: { top: 'soft', bottom: 'soft', left: 'hidden', right: 'hidden' },
          headerTitle: () => (
            <View accessible accessibilityLabel={barTitle} className="max-w-[220px] items-center gap-1.5">
              <Text variant="footnote" numberOfLines={1} className="font-semibold text-foreground">
                {barTitle}
              </Text>
              <BeadRow
                state={beadRingState(steps, position)}
                colors={{ done: colors['bead-done'], pending: colors.bead, current: colors.accent }}
              />
            </View>
          ),
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={require('@/assets/images/toolbar/close.png')}
          accessibilityLabel={t('pray.close')}
          onPress={handleClose}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu
          icon={require('@/assets/images/toolbar/display.png')}
          accessibilityLabel={t('display.title')}
        >
          <Stack.Toolbar.Menu title={t('pray.goToDecade')}>
            {[1, 2, 3, 4, 5].map((decade) => (
              <Stack.Toolbar.MenuAction
                key={decade}
                isOn={step.decade === decade}
                onPress={() => {
                  const target = steps.findIndex((s) => s.kind === 'announce' && s.decade === decade);
                  if (target !== -1) {
                    goTo(target);
                  }
                }}
              >
                {t('pray.decadeOf', { decade })}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
          {audioAvailable && (
            <Stack.Toolbar.Menu title={t('options.mode')}>
              <Stack.Toolbar.MenuAction
                isOn={mode === 'listen'}
                onPress={() => updateSettings({ mode: 'listen' })}
              >
                {t('options.listen')}
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction isOn={mode === 'tap'} onPress={() => updateSettings({ mode: 'tap' })}>
                {t('options.tap')}
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
          )}
          {listening && (
            <Stack.Toolbar.Menu title={t('settings.rate')}>
              {rates.map((value) => (
                <Stack.Toolbar.MenuAction
                  key={value}
                  isOn={rate === value}
                  onPress={() => updateSettings({ rate: value })}
                >
                  {`${value}×`}
                </Stack.Toolbar.MenuAction>
              ))}
            </Stack.Toolbar.Menu>
          )}
          <Stack.Toolbar.Menu title={t('settings.theme')}>
            {(['system', 'light', 'dark'] as const).map((value) => (
              <Stack.Toolbar.MenuAction
                key={value}
                isOn={appearance === value}
                onPress={() => updateSettings({ appearance: value })}
              >
                {t(`settings.themes.${value}`)}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu title={t('settings.textSize')}>
            {(['regular', 'large', 'larger'] as const).map((value) => (
              <Stack.Toolbar.MenuAction
                key={value}
                isOn={textSize === value}
                onPress={() => updateSettings({ textSize: value })}
              >
                {t(`settings.textSizes.${value}`)}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      <Stack.Toolbar>
        <Stack.Toolbar.Button
          icon={toolbarIcon('backward.end.fill', require('@/assets/images/toolbar/previous.png'))}
          accessibilityLabel={t('pray.previous')}
          disabled={position === 0}
          onPress={handlePrevious}
        />
        <Stack.Toolbar.Spacer />
        {listening ? (
          <Stack.Toolbar.Button
            icon={
              audio.status === 'playing'
                ? toolbarIcon('pause.fill', require('@/assets/images/toolbar/pause.png'))
                : toolbarIcon('play.fill', require('@/assets/images/toolbar/play.png'))
            }
            accessibilityLabel={audio.status === 'playing' ? t('pray.pause') : t('pray.play')}
            variant="prominent"
            tintColor={colors.accent}
            onPress={audio.toggle}
          />
        ) : (
          <Stack.Toolbar.Button
            icon={toolbarIcon('chevron.forward', require('@/assets/images/toolbar/advance.png'))}
            accessibilityLabel={t('pray.next')}
            variant="prominent"
            tintColor={colors.accent}
            onPress={handleNext}
          />
        )}
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon={toolbarIcon('forward.end.fill', require('@/assets/images/toolbar/next.png'))}
          accessibilityLabel={t('pray.next')}
          onPress={handleNext}
        />
      </Stack.Toolbar>

      <View className="flex-1 bg-background">
        <StepScroll
          stepId={step.id}
          progress={listening && audio.status === 'playing' ? audio.progress : null}
          onTap={listening ? audio.toggle : handleNext}
          onSwipe={(direction) => (direction === 'next' ? handleNext() : handlePrevious())}
          accessibilityHint={listening ? t('pray.pause') : t('pray.tapToContinue')}
        >
          <Animated.View
            key={step.id}
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(120)}
            className="gap-4"
          >
            {heading}
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
            <StepContent
              step={step}
              locale={plan.locale}
              textSize={textSize}
              spoken={listening && audio.status !== 'idle' ? audio.spoken : null}
            />
          </Animated.View>
        </StepScroll>
        <View style={{ position: 'absolute', inset: 0, zIndex: -1 }} pointerEvents="none">
          <ScreenTexture />
        </View>
      </View>
    </>
  );
}
