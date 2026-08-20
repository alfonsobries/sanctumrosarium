import {
  advance,
  buildRosary,
  goBack,
  mysteriesOfDay,
  progressOf,
  startSession,
  type SessionState,
} from '@rosario/engine';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelRatio, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { audioPacks } from '@/features/audio/packs.generated';
import { useAudioGuide } from '@/features/audio/use-audio-guide';
import { BeadTrack } from '@/features/rosary/BeadTrack';
import {
  clearSession,
  isFromToday,
  loadSession,
  localDateOf,
  saveSession,
  type SavedSession,
} from '@/features/rosary/session-store';
import { languageForLocale } from '@/settings/resolve-locale';
import { useSettings } from '@/settings/settings-context';
import { appKv } from '@/storage/app-kv';
import { leaveToHome } from '@/features/rosary/leave';
import { spacing, touchTarget } from '@/theme/tokens';

export default function PrayScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { prayerLocale, prayerForm, settings } = useSettings();

  const [saved] = useState<SavedSession | undefined>(() => loadSession(appKv));
  const [resumeChoice, setResumeChoice] = useState<'pending' | 'made'>(
    saved === undefined ? 'made' : 'pending',
  );
  const [buildOptions, setBuildOptions] = useState(() =>
    saved === undefined
      ? {
          form: prayerForm,
          locale: prayerLocale,
          set: mysteriesOfDay(new Date()).set,
          include: settings.includedPrayers,
        }
      : saved.options,
  );
  const [session, setSession] = useState<SessionState>(() =>
    saved === undefined ? startSession(new Date()) : saved.state,
  );

  const steps = useMemo(() => buildRosary(buildOptions), [buildOptions]);
  const language = languageForLocale(buildOptions.locale);
  const progress = progressOf(session, steps);
  const step = steps[progress.stepIndex];
  const totalDecades = useMemo(
    () =>
      new Set(
        steps.flatMap((s) => ('decade' in s && s.decade !== undefined ? [s.decade] : [])),
      ).size,
    [steps],
  );

  // The bead survives leaving the screen: saved on every step, cleared when finished.
  useEffect(() => {
    if (resumeChoice !== 'made') {
      return;
    }
    if (progress.finished) {
      clearSession(appKv);
      return;
    }
    saveSession(appKv, {
      version: 1,
      state: session,
      options: buildOptions,
      localDate: localDateOf(new Date()),
    });
  }, [session, buildOptions, progress.finished, resumeChoice]);

  const handleNext = () => {
    void Haptics.selectionAsync();
    setSession((current) => advance(current, steps, new Date()));
  };
  const audio = useAudioGuide({
    steps,
    stepIndex: progress.stepIndex,
    pack: audioPacks[buildOptions.locale],
    onAdvance: handleNext,
  });

  // The current line stays in view while the guide says it, without stealing the
  // scroll: a hand on the screen pauses the following for a few seconds.
  const scrollRef = useRef<ScrollView | null>(null);
  const draggedAtRef = useRef(0);
  const activeLine = audio.activeLine;
  useEffect(() => {
    if (activeLine === undefined || Date.now() - draggedAtRef.current < 5000) {
      return;
    }
    const lineHeight = 34 * Math.min(PixelRatio.getFontScale(), 1.6) + spacing.xs;
    scrollRef.current?.scrollTo({
      y: Math.max(0, activeLine * lineHeight - 80),
      animated: true,
    });
  }, [activeLine]);
  const handlePrevious = () => {
    setSession((current) => goBack(current));
  };
  const handleResume = () => {
    setResumeChoice('made');
  };
  const handleStartOver = () => {
    clearSession(appKv);
    const today = mysteriesOfDay(new Date());
    setBuildOptions({
      form: prayerForm,
      locale: prayerLocale,
      set: today.set,
      include: settings.includedPrayers,
    });
    setSession(startSession(new Date()));
    setResumeChoice('made');
  };

  const fling = useMemo(
    () =>
      Gesture.Race(
        Gesture.Fling().direction(Directions.LEFT).runOnJS(true).onEnd(handleNext),
        Gesture.Fling().direction(Directions.RIGHT).runOnJS(true).onEnd(handlePrevious),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps],
  );

  if (resumeChoice === 'pending' && saved !== undefined) {
    return (
      <ResumeScreen saved={saved} onResume={handleResume} onStartOver={handleStartOver} />
    );
  }

  if (step === undefined) {
    return <FinishedScreen set={buildOptions.set} session={session} />;
  }

  const mystery = 'mystery' in step ? step.mystery : undefined;

  return (
    <Screen scroll={false}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('pray.leave')}
          accessibilityHint={t('pray.leaveHint')}
          hitSlop={12}
          onPress={() => leaveToHome(router)}
          style={({ pressed }) => [styles.leave, pressed && styles.pressed]}
        >
          <AppText variant="label" color="muted">
            {t('pray.leave')}
          </AppText>
        </Pressable>
        {progress.decade === undefined ? null : (
          <AppText variant="caption" color="muted">
            {t('pray.decadeCount', {
              decade: progress.decade + 1,
              total: totalDecades,
            })}
          </AppText>
        )}
      </View>

      {/* The mystery never leaves the screen while its decade is prayed. */}
      {mystery === undefined ? null : (
        <View style={styles.mysteryHeader}>
          <AppText variant="overline" color="muted">
            {t(`sets.${buildOptions.set}`).toUpperCase()}
          </AppText>
          <AppText variant="heading" accessibilityRole="header">
            {mystery.text[language].title}
          </AppText>
        </View>
      )}

      <GestureDetector gesture={fling}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.grow}
          onScrollBeginDrag={() => {
            draggedAtRef.current = Date.now();
          }}
        >
          <Pressable
            accessibilityHint={t('pray.advanceHint')}
            style={[styles.grow, styles.stepArea]}
            onPress={handleNext}
          >
            {step.kind === 'prayer' ? (
              <>
                <AppText variant="caption" color="muted">
                  {step.prayer.title}
                </AppText>
                <View style={styles.lines}>
                  {step.prayer.lines.map((line, index) => (
                    <AppText
                      key={`${index}-${line}`}
                      variant="prayer"
                      color={
                        audio.activeLine === undefined || audio.activeLine === index
                          ? 'text'
                          : 'muted'
                      }
                    >
                      {line}
                    </AppText>
                  ))}
                </View>
              </>
            ) : null}

            {/* The announce step does not repeat the title: the header already
                carries it. It gives the intro and the fruit their moment. */}
            {step.kind === 'announce' ? (
              <>
                {step.mystery.text[language].intro === undefined ? null : (
                  <AppText variant="bodySerif" color="secondary">
                    {step.mystery.text[language].intro}
                  </AppText>
                )}
                <AppText variant="caption" color="muted">
                  {t('pray.fruit', { fruit: step.mystery.text[language].fruit })}
                </AppText>
              </>
            ) : null}

            {/* reading, silence and litany steps arrive with tasks 032, 035 and 043;
                the default options never produce them. */}
          </Pressable>
        </ScrollView>
      </GestureDetector>

      <View style={styles.bottom}>
        {progress.decade === undefined ? null : (
          <View style={styles.beads}>
            <BeadTrack bead={progress.beadInDecade} />
            {progress.beadInDecade === undefined ? null : (
              <AppText variant="caption" color="muted">
                {t('pray.beadCount', { bead: progress.beadInDecade })}
              </AppText>
            )}
          </View>
        )}
        <View style={styles.controls}>
          <View style={styles.control}>
            <Button
              label={t('common.back')}
              variant="secondary"
              onPress={handlePrevious}
              accessibilityHint={t('pray.backHint')}
            />
          </View>
          {audio.available ? (
            <View style={styles.control}>
              <Button
                label={audio.playing ? t('pray.pause') : t('pray.listen')}
                variant="secondary"
                onPress={audio.toggle}
                accessibilityHint={t('pray.listenHint')}
              />
            </View>
          ) : null}
          <View style={styles.control}>
            <Button label={t('pray.next')} onPress={handleNext} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

function ResumeScreen({
  saved,
  onResume,
  onStartOver,
}: {
  saved: SavedSession;
  onResume: () => void;
  onStartOver: () => void;
}) {
  const { t } = useTranslation();
  const steps = useMemo(() => buildRosary(saved.options), [saved.options]);
  const progress = progressOf(saved.state, steps);

  return (
    <Screen center>
      <View style={styles.resume}>
        <AppText variant="overline" color="muted">
          {t(`sets.${saved.options.set}`).toUpperCase()}
        </AppText>
        <AppText variant="title" accessibilityRole="header">
          {progress.decade === undefined
            ? t('pray.resumeStarted')
            : t('pray.resumeInDecade', { decade: progress.decade + 1 })}
        </AppText>
        {isFromToday(saved, new Date()) ? null : (
          <AppText variant="body" color="muted">
            {t('pray.resumeOtherDay')}
          </AppText>
        )}
        <View style={styles.resumeActions}>
          <Button label={t('pray.resume')} onPress={onResume} />
          <Button label={t('pray.startOver')} variant="secondary" onPress={onStartOver} />
        </View>
      </View>
    </Screen>
  );
}

function FinishedScreen({
  set,
  session,
}: {
  set: 'gaudiosa' | 'luminosa' | 'dolorosa' | 'gloriosa';
  session: SessionState;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const minutes = useMemo(() => {
    if (session.finishedAt === undefined) {
      return undefined;
    }
    const elapsed =
      new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime();
    const whole = Math.round(elapsed / 60_000);
    // A session resumed from another day would show a nonsense number.
    return whole >= 1 && whole <= 180 ? whole : undefined;
  }, [session.finishedAt, session.startedAt]);

  return (
    <Screen center>
      <View style={styles.resume}>
        <AppText variant="display" accessibilityRole="header">
          {t(`sets.${set}`)}
        </AppText>
        <AppText variant="bodySerif" color="secondary">
          {t('pray.doneDecades')}
        </AppText>
        {minutes === undefined ? null : (
          <AppText variant="caption" color="muted">
            {t('pray.duration', { count: minutes })}
          </AppText>
        )}
        <View style={styles.resumeActions}>
          <Button label={t('pray.finish')} onPress={() => leaveToHome(router)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leave: { minHeight: touchTarget, justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  mysteryHeader: { gap: spacing.xs, marginTop: spacing.sm },
  stepArea: { justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.md },
  lines: { gap: spacing.xs },
  bottom: { gap: spacing.md, paddingTop: spacing.sm },
  beads: { alignItems: 'center', gap: spacing.sm },
  controls: { flexDirection: 'row', gap: spacing.md },
  control: { flex: 1 },
  resume: { gap: spacing.md },
  resumeActions: { gap: spacing.sm, marginTop: spacing.lg },
});
