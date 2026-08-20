import { NOVENA_DAYS, novenaDay } from '@rosario/engine';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { appJournal } from '@/features/journal/app-journal';
import { localDateOf } from '@/features/rosary/session-store';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type NovenaState = {
  readonly runId: number;
  readonly daysDone: number;
  readonly markedToday: boolean;
};

type PastNovena = {
  readonly runId: number;
  readonly startedDate: string;
  readonly daysDone: number;
};

/**
 * The 54-day novena of Pompeii: 27 boxes in petition, 27 in thanksgiving, cycling
 * joyful, sorrowful and glorious. Boxes fill one by one; a missed day is simply the
 * next box waiting, never a reset (task 044). Its own count: not the Rule, not roses.
 */
export default function NovenaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, setState] = useState<NovenaState | undefined>(undefined);
  const [past, setPast] = useState<PastNovena | undefined>(undefined);

  const refresh = useCallback(() => {
    const run = appJournal.activeNovena();
    setState(
      run === undefined
        ? undefined
        : {
            runId: run.id,
            daysDone: appJournal.novenaDaysDone(run.id),
            markedToday: appJournal.novenaMarkedOn(run.id, localDateOf(new Date())),
          },
    );
    const ended = appJournal.lastEndedNovena();
    setPast(
      ended === undefined || ended.daysDone === 0 || ended.daysDone >= NOVENA_DAYS
        ? undefined
        : { runId: ended.id, startedDate: ended.startedDate, daysDone: ended.daysDone },
    );
  }, []);
  useFocusEffect(refresh);

  const handleStart = () => {
    appJournal.startNovena(localDateOf(new Date()));
    refresh();
  };
  const handleResume = () => {
    if (past !== undefined) {
      appJournal.reopenNovena(past.runId);
      refresh();
    }
  };

  if (state === undefined) {
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        <AppText variant="bodySerif" color="secondary" style={styles.lead}>
          {t('novena.lead')}
        </AppText>
        <AppText variant="bodySerif" style={styles.block}>
          {t('novena.what')}
        </AppText>
        <AppText variant="bodySerif" style={styles.block}>
          {t('novena.ownPrayers')}
        </AppText>
        <AppText variant="caption" color="muted" style={styles.block}>
          {t('novena.status')}
        </AppText>
        <View style={styles.actions}>
          <Button label={t('novena.start')} onPress={handleStart} />
          {past === undefined ? null : (
            <View style={styles.action}>
              <Button
                label={t('novena.resume', {
                  day: past.daysDone,
                  date: past.startedDate,
                })}
                variant="secondary"
                onPress={handleResume}
              />
            </View>
          )}
        </View>
      </Screen>
    );
  }

  const finished = state.daysDone >= NOVENA_DAYS;
  const current = finished ? undefined : novenaDay(state.daysDone + 1);

  const handleMark = () => {
    appJournal.markNovenaDay(state.runId, state.daysDone + 1, localDateOf(new Date()));
    refresh();
  };
  const handleClose = () => {
    appJournal.endNovena(state.runId, localDateOf(new Date()));
    refresh();
  };
  const handleUnmark = () => {
    appJournal.unmarkNovenaDay(state.runId, state.daysDone);
    refresh();
  };
  const handleLeave = () => {
    appJournal.endNovena(state.runId, localDateOf(new Date()));
    refresh();
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      {current === undefined ? (
        <>
          <AppText variant="bodySerif" style={styles.lead}>
            {t('novena.done')}
          </AppText>
          <View style={styles.actions}>
            <Button label={t('novena.close')} variant="secondary" onPress={handleClose} />
          </View>
        </>
      ) : (
        <>
          <AppText variant="bodySerif" color="secondary" style={styles.lead}>
            {t(`novena.phase.${current.phase}`)}
          </AppText>
          <AppText variant="heading" accessibilityRole="header">
            {t('novena.day', { day: current.day, total: NOVENA_DAYS })}
          </AppText>
          <AppText variant="bodySerif" color="secondary">
            {t(`sets.${current.set}`)}
          </AppText>
        </>
      )}

      <NovenaGrid daysDone={state.daysDone} />

      <AppText variant="caption" color="muted" style={styles.block}>
        {t('novena.ownPrayers')}
      </AppText>
      <AppText variant="caption" color="muted" style={styles.block}>
        {t('novena.continuous')}
      </AppText>

      {current === undefined ? null : (
        <View style={styles.actions}>
          <Button
            label={t('novena.pray')}
            onPress={() => router.push(`/pray?set=${current.set}`)}
          />
          <View style={styles.action}>
            {state.markedToday ? (
              <AppText variant="body" color="secondary">
                {t('novena.markedToday')}
              </AppText>
            ) : (
              <Button label={t('novena.mark')} variant="secondary" onPress={handleMark} />
            )}
          </View>
          {state.daysDone > 0 && state.markedToday ? (
            <View style={styles.action}>
              <Button label={t('novena.unmark')} variant="ghost" onPress={handleUnmark} />
            </View>
          ) : null}
          <View style={styles.action}>
            <Button label={t('novena.leave')} variant="ghost" onPress={handleLeave} />
          </View>
        </View>
      )}
    </Screen>
  );
}

function NovenaGrid({ daysDone }: { daysDone: number }) {
  const { t } = useTranslation();
  const palette = useTheme();
  return (
    <View style={styles.grid}>
      {(['petition', 'thanksgiving'] as const).map((phase, half) => (
        <View key={phase} style={styles.gridHalf}>
          <AppText variant="caption" color="muted">
            {t(`novena.phase.${phase}`)}
          </AppText>
          <View
            style={styles.dots}
            accessibilityLabel={t('novena.gridLabel', {
              done: Math.max(0, Math.min(27, daysDone - half * 27)),
              phase: t(`novena.phase.${phase}`),
            })}
          >
            {Array.from({ length: 27 }, (_, index) => {
              const day = half * 27 + index + 1;
              const done = day <= daysDone;
              const isCurrent = day === daysDone + 1;
              return (
                <View
                  key={day}
                  style={[
                    styles.dot,
                    { borderColor: palette.accent },
                    done && { backgroundColor: palette.accent },
                    isCurrent && styles.dotCurrent,
                  ]}
                />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: spacing.md, marginBottom: spacing.xs },
  block: { marginTop: spacing.lg },
  actions: { marginTop: spacing.xl },
  action: { marginTop: spacing.sm },
  grid: { marginTop: spacing.lg, gap: spacing.md },
  gridHalf: { gap: spacing.sm },
  dots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  dotCurrent: { transform: [{ scale: 1.25 }] },
});
