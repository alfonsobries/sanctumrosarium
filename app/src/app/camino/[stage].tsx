import { caminoStages, type CaminoStageId } from '@rosario/engine';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { stageProgress, stageUnit, type StageProgress } from '@/features/camino/progress';
import { appJournal } from '@/features/journal/app-journal';
import { localDateOf } from '@/features/rosary/session-store';
import { spacing } from '@/theme/tokens';

/**
 * One stage of the Way: what it teaches, how to pray that way, and how far it has been
 * walked. For the ways the app cannot detect (singing, praying with others), the
 * person's word is the count: one mark per day, never more.
 */
export default function CaminoStageScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ stage: string }>();
  const stage = caminoStages.find((candidate) => candidate.id === params.stage);
  const [progress, setProgress] = useState<StageProgress | undefined>(undefined);
  const [markedToday, setMarkedToday] = useState(false);

  const refresh = useCallback(() => {
    if (stage !== undefined) {
      setProgress(stageProgress(appJournal, stage));
      if (!stage.detectable) {
        setMarkedToday(appJournal.markedWay(stage.id, localDateOf(new Date())));
      }
    }
  }, [stage]);

  useFocusEffect(refresh);

  if (stage === undefined) {
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        <AppText variant="body" style={styles.block}>
          {t('error.screen')}
        </AppText>
      </Screen>
    );
  }

  const id = stage.id as CaminoStageId;

  const handleMark = () => {
    appJournal.markWay(id, localDateOf(new Date()));
    refresh();
  };
  const handleUnmark = () => {
    appJournal.unmarkWay(id, localDateOf(new Date()));
    refresh();
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: t(`camino.stages.${id}.title`) }} />
      <AppText variant="bodySerif" style={styles.block}>
        {t(`camino.stages.${id}.teach`)}
      </AppText>
      <AppText variant="body" color="secondary" style={styles.block}>
        {t(`camino.stages.${id}.how`)}
      </AppText>
      {progress === undefined ? null : (
        <AppText variant="caption" color="muted" style={styles.block}>
          {progress.state === 'walked'
            ? t(`camino.stages.${id}.walked`)
            : progress.state === 'walking'
              ? t(
                  stageUnit(stage) === 'days'
                    ? 'camino.timesDays'
                    : 'camino.timesRosaries',
                  { done: progress.times, target: stage.timesToWalk },
                )
              : t('camino.state.notStarted')}
        </AppText>
      )}
      {stage.detectable ? null : (
        <View style={styles.mark}>
          {markedToday ? (
            <View>
              <AppText variant="body" color="secondary">
                {t('camino.marked')}
              </AppText>
              <Button label={t('camino.unmark')} variant="ghost" onPress={handleUnmark} />
            </View>
          ) : (
            <Button label={t('camino.mark')} variant="secondary" onPress={handleMark} />
          )}
          <AppText variant="caption" color="muted" style={styles.markHint}>
            {t('camino.markHint')}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: spacing.md },
  mark: { marginTop: spacing.xl },
  markHint: { marginTop: spacing.sm },
});
