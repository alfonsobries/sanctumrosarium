import { findPrayer, prayers, type PrayerId } from '@rosario/content';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { audioPacks } from '@/features/audio/packs.generated';
import { useSettings } from '@/settings/settings-context';
import { spacing } from '@/theme/tokens';

import type { LatinLearnMode } from '@/settings/store';

const modes: readonly LatinLearnMode[] = ['listen', 'read', 'memory'];

/**
 * Learning the Latin, prayer by prayer: hear both halves, answer reading, or answer
 * from memory with the text dimmed. The person chooses; the app never raises the mode
 * and never grades (task 024).
 */
export default function LatinLearnScreen() {
  const { t } = useTranslation();
  const { settings, setLatinLearn } = useSettings();

  const pack = audioPacks['la'];
  const tracked = pack?.manifest.tracks ?? {};
  const learnable = prayers
    .filter((prayer) => prayer.locale === 'la' && prayer.responseFrom !== undefined)
    .filter((prayer) => tracked[prayer.id]?.response !== undefined)
    .map((prayer) => prayer.id);

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="caption" color="muted" style={styles.intro}>
        {t('latinLearn.intro')}
      </AppText>
      {pack?.manifest.provisional === true ? (
        <AppText variant="caption" color="muted" style={styles.intro}>
          {t('latinLearn.provisional')}
        </AppText>
      ) : null}
      {learnable.map((prayer) => (
        <LatinPrayerModes
          key={prayer}
          prayer={prayer}
          mode={settings.latinLearn[prayer] ?? 'read'}
          onSelect={(mode) => setLatinLearn(prayer, mode)}
        />
      ))}
      <AppText variant="caption" color="muted" style={styles.hint}>
        {t('latinLearn.hint')}
      </AppText>
    </Screen>
  );
}

type LatinPrayerModesProperties = {
  prayer: PrayerId;
  mode: LatinLearnMode;
  onSelect: (mode: LatinLearnMode) => void;
};

function LatinPrayerModes({ prayer, mode, onSelect }: LatinPrayerModesProperties) {
  const { t } = useTranslation();
  return (
    <View style={styles.prayer}>
      <AppText variant="caption" color="secondary" style={styles.prayerTitle}>
        {findPrayer(prayer, 'la')?.title ?? prayer}
      </AppText>
      <Card>
        {modes.map((option, index) => (
          <ListRow
            key={option}
            label={t(`latinLearn.modes.${option}`)}
            selected={mode === option}
            divider={index < modes.length - 1}
            onPress={() => onSelect(option)}
          />
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.md },
  prayer: { marginTop: spacing.lg },
  prayerTitle: { marginBottom: spacing.sm },
  hint: { marginTop: spacing.lg },
});
