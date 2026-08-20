import { findPrayer, type Locale, type PrayerId } from '@rosario/content';
import {
  advance,
  buildRosary,
  decadesCompleted,
  goBack,
  mysteriesOfDay,
  progressOf,
  recordOf,
  startSession,
  type RosaryOptions,
  type SessionState,
  type Step,
} from '@rosario/engine';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { audioPacks } from '@/features/audio/packs.generated';
import { audioSettingsOf } from '@/features/audio/schedule';
import { appJournal } from '@/features/journal/app-journal';
import { useAudioGuide } from '@/features/audio/use-audio-guide';
import { LitanyView } from '@/features/rosary/LitanyView';
import { pairLatinLines } from '@/features/rosary/bilingual';
import { hapticForStep } from '@/features/rosary/haptic-patterns';
import { playHaptic } from '@/features/rosary/haptics';
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
import { nightBlack, radius, spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { fonts, typeScale } from '@/theme/typography';

export default function PrayScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { prayerLocale, prayerForm, settings, systemPrayerLocale } = useSettings();

  const [saved] = useState<SavedSession | undefined>(() => loadSession(appKv));
  const [phase, setPhase] = useState<'resume-pending' | 'intention' | 'praying'>(
    saved === undefined ? 'intention' : 'resume-pending',
  );
  const [inTheDark, setInTheDark] = useState(false);
  const [buildOptions, setBuildOptions] = useState(() =>
    saved === undefined
      ? {
          form: prayerForm,
          locale: prayerLocale,
          set: mysteriesOfDay(new Date()).set,
          include: settings.includedPrayers,
          withLitany: settings.withLitany,
          withClauses: settings.withClauses,
          ...latinOverrides(prayerLocale, settings.latinMixOwn, systemPrayerLocale),
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
    if (phase !== 'praying') {
      return;
    }
    if (progress.finished) {
      // The finished Rosary becomes one entry in the journal: an act counted, local,
      // recorded once (the insert ignores a repeated session).
      const record = recordOf(session, steps);
      if (record !== undefined) {
        appJournal.add({
          startedAt: record.startedAt,
          finishedAt: record.finishedAt,
          decades: record.decades,
          localDate: localDateOf(new Date(record.finishedAt)),
          ...(record.intention === undefined ? {} : { intention: record.intention }),
        });
      }
      clearSession(appKv);
      return;
    }
    saveSession(appKv, {
      version: 1,
      state: session,
      options: buildOptions,
      localDate: localDateOf(new Date()),
    });
  }, [session, buildOptions, steps, progress.finished, phase]);

  const handleNext = () => {
    void playHaptic(hapticForStep(steps[progress.stepIndex + 1]), settings.haptics);
    setSession((current) => advance(current, steps, new Date()));
  };
  const paceSettings = useMemo(() => audioSettingsOf(settings), [settings]);
  const audio = useAudioGuide({
    steps,
    stepIndex: progress.stepIndex,
    pack: audioPacks[buildOptions.locale],
    settings: paceSettings,
    onAdvance: handleNext,
  });

  // The current line stays in view while the guide says it, without stealing the
  // scroll: a hand on the screen pauses the following for a few seconds.
  const scrollRef = useRef<ScrollView | null>(null);
  const draggedAtRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const activeLine = audio.activeLine;
  useEffect(() => {
    if (activeLine === undefined || Date.now() - draggedAtRef.current < 5000) {
      return;
    }
    const lineHeight = 34 * Math.min(PixelRatio.getFontScale(), 1.6) + spacing.xs;
    scrollRef.current?.scrollTo({
      y: Math.max(0, activeLine * lineHeight - 80),
      animated: !reducedMotion,
    });
  }, [activeLine, reducedMotion]);
  const handlePrevious = () => {
    setSession((current) => goBack(current));
  };
  const handleResume = () => {
    setPhase('praying');
  };
  const handleStartOver = () => {
    // The loose decades of the discarded session still count: the Rule measures
    // faithfulness, not continuity (task 030; Montfort recommends praying in parts).
    if (saved !== undefined) {
      const prayed = decadesCompleted(saved.state, buildRosary(saved.options));
      if (prayed >= 1) {
        appJournal.add({
          startedAt: saved.state.startedAt,
          finishedAt: new Date().toISOString(),
          decades: prayed,
          localDate: localDateOf(new Date(saved.state.startedAt)),
          ...(saved.state.intention === undefined
            ? {}
            : { intention: saved.state.intention }),
        });
      }
    }
    clearSession(appKv);
    setPhase('intention');
  };
  const handleBegin = (intention: string | undefined) => {
    if (intention !== undefined) {
      appJournal.saveIntention(intention);
    }
    const today = mysteriesOfDay(new Date());
    setBuildOptions({
      form: prayerForm,
      locale: prayerLocale,
      set: today.set,
      include: settings.includedPrayers,
      withLitany: settings.withLitany,
      withClauses: settings.withClauses,
      ...latinOverrides(prayerLocale, settings.latinMixOwn, systemPrayerLocale),
    });
    setSession(startSession(new Date(), intention));
    setPhase('praying');
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

  if (phase === 'resume-pending' && saved !== undefined) {
    return (
      <ResumeScreen saved={saved} onResume={handleResume} onStartOver={handleStartOver} />
    );
  }

  if (phase === 'intention') {
    return <IntentionScreen onBegin={handleBegin} />;
  }

  if (step === undefined) {
    return <FinishedScreen set={buildOptions.set} session={session} />;
  }

  const mystery = 'mystery' in step ? step.mystery : undefined;

  if (inTheDark) {
    return (
      <GestureDetector gesture={fling}>
        <DarkScreen
          mysteryTitle={mystery?.text[language].title}
          count={
            progress.beadInDecade === undefined
              ? undefined
              : t('pray.beadCount', { bead: progress.beadInDecade })
          }
          onAdvance={handleNext}
          onExit={() => setInTheDark(false)}
        />
      </GestureDetector>
    );
  }

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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('pray.dark')}
          accessibilityHint={t('pray.darkEnterHint')}
          hitSlop={12}
          onPress={() => setInTheDark(true)}
          style={({ pressed }) => [styles.leave, pressed && styles.pressed]}
        >
          <AppText variant="label" color="muted">
            {t('pray.dark')}
          </AppText>
        </Pressable>
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
            onLongPress={() => setInTheDark(true)}
            delayLongPress={600}
          >
            {step.kind === 'prayer' ? (
              <PrayerText
                step={step}
                language={language}
                latinText={settings.latinText}
                companionLocale={systemPrayerLocale}
                activeLine={audio.activeLine}
              />
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

            {step.kind === 'litany' ? (
              <LitanyView
                language={language}
                companion={
                  language === 'la' && settings.latinText === 'both'
                    ? languageForLocale(systemPrayerLocale) === 'la'
                      ? undefined
                      : (languageForLocale(systemPrayerLocale) as 'es' | 'en')
                    : undefined
                }
              />
            ) : null}

            {/* reading and silence steps arrive with tasks 032 and 035; the default
                options never produce them. */}
          </Pressable>
        </ScrollView>
      </GestureDetector>

      <View style={styles.bottom}>
        {session.intention === undefined ? null : (
          <AppText variant="caption" color="muted" style={styles.intention}>
            {t('intentions.during', { who: session.intention })}
          </AppText>
        )}
        {progress.decade === undefined ? null : (
          <View style={styles.beads}>
            <BeadTrack bead={progress.beadInDecade} />
            <AppText variant="caption" color="muted">
              {[
                progress.beadInDecade === undefined
                  ? undefined
                  : t('pray.beadCount', { bead: progress.beadInDecade }),
                progress.decade === undefined
                  ? undefined
                  : t('pray.decadeCount', {
                      decade: progress.decade + 1,
                      total: totalDecades,
                    }),
              ]
                .filter((part) => part !== undefined)
                .join(' · ')}
            </AppText>
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

function IntentionScreen({
  onBegin,
}: {
  onBegin: (intention: string | undefined) => void;
}) {
  const { t } = useTranslation();
  const colors = useTheme();
  const [text, setText] = useState('');
  const [savedIntentions] = useState(() => appJournal.savedIntentions().slice(0, 5));

  return (
    <Screen center>
      <View style={styles.resume}>
        <AppText variant="title" accessibilityRole="header">
          {t('intentions.question')}
        </AppText>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('intentions.placeholder')}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.intentionInput,
            { color: colors.text, borderColor: colors.borderStrong },
          ]}
        />
        {savedIntentions.map((intention) => (
          <Pressable
            key={intention}
            accessibilityRole="button"
            onPress={() => setText(text === intention ? '' : intention)}
            style={({ pressed }) => [
              styles.savedIntention,
              { borderColor: colors.border },
              text === intention && { borderColor: colors.accentSoft },
              pressed && styles.pressed,
            ]}
          >
            <AppText variant="caption" color={text === intention ? 'text' : 'muted'}>
              {intention}
            </AppText>
          </Pressable>
        ))}
        <View style={styles.resumeActions}>
          <Button
            label={t('home.start')}
            onPress={() => onBegin(text.trim() === '' ? undefined : text.trim())}
          />
        </View>
      </View>
    </Screen>
  );
}

/** Praying in Latin, the mixed prayers go in the reader's own language (task 021). */
function latinOverrides(
  locale: Locale,
  mixOwn: readonly PrayerId[],
  ownLocale: Locale,
): Pick<RosaryOptions, 'localeOverrides'> {
  if (locale !== 'la' || mixOwn.length === 0 || ownLocale === 'la') {
    return {};
  }
  return {
    localeOverrides: Object.fromEntries(mixOwn.map((id) => [id, ownLocale])),
  };
}

const INDULGENCE_NOTE_KEY = 'indulgence-note-shown';

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
  const { interfaceLanguage } = useSettings();
  const steps = useMemo(() => buildRosary(saved.options), [saved.options]);
  const progress = progressOf(saved.state, steps);
  // Said once and with precision, never repeated day after day (task 030): praying in
  // parts is prayer; it simply does not meet that one condition.
  const [showNote] = useState(() => {
    if (appKv.get(INDULGENCE_NOTE_KEY) !== null) {
      return false;
    }
    appKv.set(INDULGENCE_NOTE_KEY, '1');
    return true;
  });

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
        {showNote ? (
          <Pressable
            accessibilityRole="link"
            onPress={() =>
              void Linking.openURL(
                interfaceLanguage === 'es'
                  ? 'https://sanctamaria.app/preguntas/'
                  : 'https://sanctamaria.app/en/questions/',
              )
            }
            style={({ pressed }) => [styles.note, pressed && styles.pressed]}
          >
            <AppText variant="caption" color="muted">
              {t('pray.partsNote')}
            </AppText>
            <AppText variant="caption" color="accent">
              {t('pray.partsNoteLink')}
            </AppText>
          </Pressable>
        ) : null}
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
        {session.intention === undefined ? null : (
          <AppText variant="bodySerif" color="secondary">
            {t('intentions.offeredFor', { who: session.intention })}
          </AppText>
        )}
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

function PrayerText({
  step,
  language,
  latinText,
  companionLocale,
  activeLine,
}: {
  step: Extract<Step, { kind: 'prayer' }>;
  language: ReturnType<typeof languageForLocale>;
  latinText: 'both' | 'la' | 'own';
  companionLocale: Locale;
  activeLine: number | undefined;
}) {
  // Praying in Latin, the reader's own language can run line by line underneath
  // (task 023). Nothing is translated: the texts are paired from the content package.
  // The mixed prayers already come in the reader's language: only true Latin text
  // pairs with a companion.
  const companion =
    step.prayer.locale === 'la' && latinText !== 'la'
      ? findPrayer(step.prayer.id, companionLocale)
      : undefined;

  if (companion !== undefined && latinText === 'own') {
    return (
      <>
        <AppText variant="caption" color="muted">
          {companion.title}
        </AppText>
        <View style={styles.lines}>
          {companion.lines.map((line, index) => (
            <AppText key={`${index}-${line}`} variant="prayer">
              {line}
            </AppText>
          ))}
        </View>
      </>
    );
  }

  if (companion !== undefined) {
    const ownLanguage = languageForLocale(companionLocale);
    const pairs = pairLatinLines(
      step.prayer,
      companion,
      ownLanguage === 'la' ? 'en' : ownLanguage,
    );
    return (
      <>
        <AppText variant="caption" color="muted">
          {step.prayer.title}
        </AppText>
        <View style={styles.pairs}>
          {pairs.map((pair, index) => (
            <View key={`${index}-${pair.latin}`} style={styles.pair}>
              <AppText variant="prayer">{pair.latin}</AppText>
              {pair.own.map((line) => (
                <AppText key={line} variant="bodySerif" color="muted">
                  {line}
                </AppText>
              ))}
            </View>
          ))}
        </View>
      </>
    );
  }

  return (
    <>
      <AppText variant="caption" color="muted">
        {step.prayer.title}
      </AppText>
      <View style={styles.lines}>
        {step.prayer.lines.map((line, index) => (
          <AppText
            key={`${index}-${line}`}
            variant="prayer"
            color={activeLine === undefined || activeLine === index ? 'text' : 'muted'}
            style={activeLine === index && styles.saidLine}
          >
            {line}
          </AppText>
        ))}
      </View>
    </>
  );
}

function DarkScreen({
  mysteryTitle,
  count,
  onAdvance,
  onExit,
}: {
  mysteryTitle: string | undefined;
  count: string | undefined;
  onAdvance: () => void;
  onExit: () => void;
}) {
  const { t } = useTranslation();
  useKeepAwake();

  return (
    <Pressable
      accessibilityHint={t('pray.advanceHint')}
      onPress={onAdvance}
      onLongPress={onExit}
      delayLongPress={600}
      style={darkStyles.fill}
    >
      <StatusBar hidden />
      <View style={darkStyles.center}>
        {mysteryTitle === undefined ? null : (
          <AppText variant="heading" color="muted" style={darkStyles.dim}>
            {mysteryTitle}
          </AppText>
        )}
        {count === undefined ? null : (
          <AppText variant="caption" color="muted" style={darkStyles.dim}>
            {count}
          </AppText>
        )}
      </View>
      <AppText variant="caption" color="muted" style={[darkStyles.dim, darkStyles.hint]}>
        {t('pray.darkExitHint')}
      </AppText>
    </Pressable>
  );
}

const darkStyles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: nightBlack },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  dim: { opacity: 0.55 },
  hint: { textAlign: 'center', marginBottom: spacing.xxl },
});

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
  // The highlight never relies on colour alone: the said line also carries a line under.
  saidLine: { textDecorationLine: 'underline' },
  pairs: { gap: spacing.md },
  pair: { gap: spacing.xs },
  bottom: { gap: spacing.md, paddingTop: spacing.sm },
  intention: { textAlign: 'center', fontStyle: 'italic' },
  beads: { alignItems: 'center', gap: spacing.sm },
  controls: { flexDirection: 'row', gap: spacing.md },
  control: { flex: 1 },
  resume: { gap: spacing.md },
  // No lineHeight on TextInput: it mis-positions the text vertically on iOS.
  intentionInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.sans,
    fontSize: typeScale.body.fontSize,
    minHeight: touchTarget,
  },
  savedIntention: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    minHeight: touchTarget,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  resumeActions: { gap: spacing.sm, marginTop: spacing.lg },
  note: { gap: spacing.xs, marginTop: spacing.lg },
});
