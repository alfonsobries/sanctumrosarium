import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { appJournal } from '@/features/journal/app-journal';
import { LitanyView } from '@/features/rosary/LitanyView';
import { leaveToHome } from '@/features/rosary/leave';
import { localDateOf } from '@/features/rosary/session-store';
import { languageForLocale } from '@/settings/resolve-locale';
import { useSettings } from '@/settings/settings-context';
import { spacing } from '@/theme/tokens';

/** The litany prayed on its own: an act of worship by itself (DPPL 203). */
export default function LitanyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { prayerLanguage, settings, systemPrayerLocale } = useSettings();
  const [startedAt] = useState(() => new Date().toISOString());

  const companion =
    prayerLanguage === 'la' && settings.latinText === 'both'
      ? languageForLocale(systemPrayerLocale)
      : undefined;

  const handleFinish = () => {
    const now = new Date();
    appJournal.add({
      startedAt,
      finishedAt: now.toISOString(),
      decades: 0,
      localDate: localDateOf(now),
      kind: 'litany',
    });
    leaveToHome(router);
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="caption" color="muted" style={styles.note}>
        {t('litany.note')}
      </AppText>
      <LitanyView
        language={prayerLanguage}
        companion={companion === 'la' ? undefined : companion}
      />
      <View style={styles.finish}>
        <Button label={t('pray.finish')} onPress={handleFinish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { marginTop: spacing.md, marginBottom: spacing.lg },
  finish: { marginTop: spacing.xl },
});
