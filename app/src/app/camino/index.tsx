import { caminoStages, type CaminoStage, type CaminoStageId } from '@rosario/engine';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { stageProgress, stageUnit, type StageProgress } from '@/features/camino/progress';
import { appJournal } from '@/features/journal/app-journal';
import { spacing } from '@/theme/tokens';

/**
 * The Way: eight manners of praying the same Rosary. Walked by praying, in any order;
 * no points, no badges, and the whole thing can be turned off in Settings.
 */
export default function CaminoScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [progress, setProgress] = useState<Partial<Record<CaminoStageId, StageProgress>>>(
    {},
  );

  useFocusEffect(
    useCallback(() => {
      const next: Partial<Record<CaminoStageId, StageProgress>> = {};
      for (const stage of caminoStages) {
        next[stage.id] = stageProgress(appJournal, stage);
      }
      setProgress(next);
    }, []),
  );

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="caption" color="muted" style={styles.intro}>
        {t('camino.intro')}
      </AppText>
      <Card>
        {caminoStages.map((stage, index) => (
          <CaminoStageRow
            key={stage.id}
            stage={stage}
            progress={progress[stage.id]}
            divider={index < caminoStages.length - 1}
            onOpen={() => router.push(`/camino/${stage.id}`)}
          />
        ))}
      </Card>
      <View style={styles.footer}>
        <AppText variant="caption" color="muted">
          {t('camino.anyOrder')}
        </AppText>
      </View>
    </Screen>
  );
}

type CaminoStageRowProperties = {
  stage: CaminoStage;
  progress: StageProgress | undefined;
  divider: boolean;
  onOpen: () => void;
};

function CaminoStageRow({ stage, progress, divider, onOpen }: CaminoStageRowProperties) {
  const { t } = useTranslation();
  const value =
    progress === undefined || progress.state === 'not-started'
      ? undefined
      : progress.state === 'walked'
        ? t('camino.state.walked')
        : t(stageUnit(stage) === 'days' ? 'camino.timesDays' : 'camino.timesRosaries', {
            done: progress.times,
            target: stage.timesToWalk,
          });
  return (
    <ListRow
      label={t(`camino.stages.${stage.id}.title`)}
      value={value}
      divider={divider}
      onPress={onOpen}
    />
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.md, marginBottom: spacing.md },
  footer: { marginTop: spacing.md },
});
