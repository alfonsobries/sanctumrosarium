import { mysteryRefsOf, mysteryTitle, type Locale } from '@sanctamaria/content';
import { decadesCompleted, type Step } from '@sanctamaria/rosary';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useKeepAwake } from 'expo-keep-awake';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useArtwork } from '@/domains/artwork/use-artwork';
import { hasAudio, useRosaryAudio } from '@/domains/audio/use-rosary-audio';
import { beadRingState } from '@/domains/prayer/bead-state';
import { ControlDock } from '@/domains/prayer/ControlDock';
import { StepStage } from '@/domains/prayer/StepStage';
import { BeadRow } from '@/domains/prayer/BeadRow';
import { guideFor } from '@/domains/prayer/guide';
import { stepsFor } from '@/domains/prayer/session';
import { StepContent, stepHeading } from '@/domains/prayer/StepContent';
import { useSession } from '@/domains/prayer/use-session';
import { useSessionJournal } from '@/domains/prayer/use-session-journal';
import { rates, type Settings } from '@/domains/settings/settings';
import type { QueueStep } from '@/domains/audio/queue';
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

type StepPageProperties = {
  step: Step;
  steps: readonly Step[];
  locale: Locale;
  headingLocale: Locale;
  textSize: Settings['textSize'];
  guided: boolean;
  queue: QueueStep[] | null;
  interrupted: boolean;
};

/** One leaf of the prayer: which mystery, a note for those learning, and the words. */
function StepPage({
  step,
  steps,
  locale,
  headingLocale,
  textSize,
  guided,
  queue,
  interrupted,
}: StepPageProperties) {
  const { t } = useTranslation();
  const index = steps.indexOf(step);
  const announce =
    step.decade === null ? undefined : steps.find((s) => s.kind === 'announce' && s.decade === step.decade);
  const thumbnail = useArtwork(
    announce?.kind === 'announce' && step.kind !== 'announce' ? announce.mystery.id : '',
  );
  const guide = guided ? guideFor(steps, index) : null;

  return (
    <View className="gap-4">
      {announce?.kind === 'announce' && step.kind !== 'announce' && (
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
              ordinal: t(`ordinal.${announce.mystery.order - 1}`),
              set: t(`setAdjective.${announce.mystery.set}`),
            })}
          </Text>
        </View>
      )}
      {guide !== null && (
        <Text variant="footnote" className="font-prayer-italic text-[16px] leading-[22px] text-rubric">
          {t(`guide.${guide}`)}
        </Text>
      )}
      {interrupted && (
        <Text variant="footnote" className="text-accent">
          {t('pray.interrupted')}
        </Text>
      )}
      {step.kind === 'prayer' && <Text variant="eyebrow">{stepHeading(step, headingLocale, t)}</Text>}
      <StepContent step={step} locale={locale} textSize={textSize} queue={queue} />
    </View>
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
  const headingLocale = useContentLocale();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const textSize = useSettings((state) => state.textSize);
  const guided = useSettings((state) => state.guided);
  const mode = useSettings((state) => state.mode);
  const updateSettings = useSettings((state) => state.update);
  const rate = useSettings((state) => state.rate);
  const pauseSeconds = useSettings((state) => state.pauseSeconds);
  const appearance = useSettings((state) => state.appearance);
  const compactControls = useSettings((state) => state.compactControls);
  const plan = useSession((state) => state.plan);
  const position = useSession((state) => state.position);
  const moveTo = useSession((state) => state.moveTo);
  const clear = useSession((state) => state.clear);
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

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
    setDirection(target >= position ? 1 : -1);
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
  const barTitle =
    mystery !== null && mystery.kind === 'announce'
      ? mysteryTitle(mystery.mystery.id, headingLocale)
      : step.section === 'closing'
        ? t('pray.closing')
        : t('pray.opening');
  const audioAvailable = hasAudio(plan.locale);
  const dialSize = Math.min(190, width * 0.48);
  const panelHeight = compactControls ? 64 : dialSize + 52;

  return (
    <>
      <Stack.Screen
        options={{
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

      <View className="flex-1 bg-background">
        <StepStage
          stepKey={step.id}
          direction={direction}
          canGoBack={position > 0}
          onSwipe={(towards) => (towards === 1 ? handleNext() : handlePrevious())}
          onTap={listening ? audio.toggle : handleNext}
          topInset={insets.top + 64}
          bottomInset={panelHeight + Math.max(insets.bottom, 12)}
          accessibilityHint={listening ? t('pray.pause') : t('pray.tapToContinue')}
        >
          <StepPage
            step={step}
            steps={steps}
            locale={plan.locale}
            headingLocale={headingLocale}
            textSize={textSize}
            guided={guided}
            queue={listening ? audio.queue : null}
            interrupted={listening && audio.status === 'interrupted'}
          />
        </StepStage>

        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 0, right: 0, bottom: Math.max(insets.bottom, 12) }}
          className="items-center"
        >
          <ControlDock
            expanded={!compactControls}
            onExpandedChange={(expanded) => updateSettings({ compactControls: !expanded })}
            ring={beadRingState(steps, position)}
            dialSize={dialSize}
            listening={listening}
            playing={audio.status === 'playing'}
            loading={audio.availability === 'loading'}
            canGoBack={position > 0}
            onToggle={listening ? audio.toggle : handleNext}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onTurn={(direction) => (direction === 1 ? handleNext() : handlePrevious())}
            isMajor={(direction) => {
              const target = steps[position + direction];
              return (
                target?.kind === 'announce' || (target?.kind === 'prayer' && target.prayer === 'our-father')
              );
            }}
            labels={{
              previous: t('pray.previous'),
              next: t('pray.next'),
              play: t('pray.play'),
              pause: t('pray.pause'),
              dial: t('pray.dial'),
              minimize: t('pray.minimize'),
              expand: t('pray.expand'),
            }}
          />
        </View>
        <View style={{ position: 'absolute', inset: 0, zIndex: -1 }} pointerEvents="none">
          <ScreenTexture />
        </View>
      </View>
    </>
  );
}
