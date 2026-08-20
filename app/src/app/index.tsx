import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useToday } from '@/features/rosary/use-today';
import { useSettings } from '@/settings/settings-context';
import { spacing, touchTarget } from '@/theme/tokens';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { prayerLanguage } = useSettings();
  const today = useToday();

  const reason =
    today.reason === 'solemnity'
      ? t('home.todayReasonSolemnity', { feast: today.feast })
      : today.reason === 'season'
        ? t('home.todayReasonSeason', { season: t(`seasons.${today.season}`) })
        : t('home.todayReasonWeekday');

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.settings')}
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settingsLink, pressed && styles.pressed]}
        >
          <AppText variant="label" color="accent">
            {t('home.settings')}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.today}>
        <AppText variant="display" accessibilityRole="header">
          {t(`sets.${today.set}`)}
        </AppText>
        <AppText variant="body" color="muted">
          {reason}
        </AppText>

        <View style={styles.mysteries}>
          {today.mysteries.map((mystery) => (
            <AppText key={mystery.id} variant="bodySerif" color="secondary">
              {mystery.text[prayerLanguage].title}
            </AppText>
          ))}
        </View>
      </View>

      <Button label={t('home.start')} onPress={() => router.push('/pray')} />

      {__DEV__ ? (
        <View style={styles.devLink}>
          <Button
            label="Galería de UI"
            variant="ghost"
            onPress={() => router.push('/dev')}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { alignItems: 'flex-end' },
  settingsLink: { minHeight: touchTarget, justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  today: { gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xxl },
  mysteries: { gap: spacing.sm, marginTop: spacing.md },
  devLink: { marginTop: spacing.sm },
});
