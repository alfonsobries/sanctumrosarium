import { findPrayer, forms } from '@rosario/content';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { SwitchRow } from '@/components/SwitchRow';
import { AppText } from '@/components/AppText';
import { ReminderSection } from '@/features/reminder/ReminderSection';
import { formsForLocale, optionalPrayersOf } from '@/features/rosary/forms';
import { useSettings } from '@/settings/settings-context';
import type {
  AppearanceSetting,
  InterfaceLanguageSetting,
  PrayerLocaleSetting,
} from '@/settings/store';
import { spacing } from '@/theme/tokens';
import { StyleSheet } from 'react-native';

const appearanceOptions: readonly AppearanceSetting[] = ['system', 'light', 'dark'];
const appLanguageOptions: readonly InterfaceLanguageSetting[] = ['system', 'es', 'en'];
const prayerOptions: readonly PrayerLocaleSetting[] = [
  'system',
  'es-MX',
  'es-ES',
  'en-US',
  'la',
];

const appearanceLabels: Record<AppearanceSetting, string> = {
  system: 'settings.system',
  light: 'settings.light',
  dark: 'settings.dark',
};

const appLanguageLabels: Record<InterfaceLanguageSetting, string> = {
  system: 'settings.system',
  es: 'settings.languageEs',
  en: 'settings.languageEn',
};

const prayerLabels: Record<PrayerLocaleSetting, string> = {
  system: 'settings.system',
  'es-MX': 'settings.prayerEsMX',
  'es-ES': 'settings.prayerEsES',
  'en-US': 'settings.prayerEnUS',
  la: 'settings.prayerLa',
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    settings,
    prayerLocale,
    prayerForm,
    setAppearance,
    setInterfaceLanguage,
    setPrayerLocale,
    setPrayerForm,
    toggleIncludedPrayer,
    setHaptics,
    setLatinText,
  } = useSettings();

  const availableForms = formsForLocale(prayerLocale);
  // The prayer after the litany waits for the litany itself (task 043): offering it
  // alone would insert it without the litany it answers to.
  const optionalPrayers = optionalPrayersOf(forms[prayerForm]).filter(
    (prayer) => prayer !== 'oratio-litaniarum',
  );

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <SectionHeader title={t('settings.appearance')} />
      <Card>
        {appearanceOptions.map((option, index) => (
          <ListRow
            key={option}
            label={t(appearanceLabels[option])}
            selected={settings.appearance === option}
            divider={index < appearanceOptions.length - 1}
            onPress={() => setAppearance(option)}
          />
        ))}
      </Card>

      <SectionHeader title={t('settings.appLanguage')} />
      <Card>
        {appLanguageOptions.map((option, index) => (
          <ListRow
            key={option}
            label={t(appLanguageLabels[option])}
            selected={settings.interfaceLanguage === option}
            divider={index < appLanguageOptions.length - 1}
            onPress={() => setInterfaceLanguage(option)}
          />
        ))}
      </Card>

      <SectionHeader title={t('settings.prayerLanguage')} />
      <Card>
        {prayerOptions.map((option, index) => (
          <ListRow
            key={option}
            label={t(prayerLabels[option])}
            selected={settings.prayerLocale === option}
            divider={index < prayerOptions.length - 1}
            onPress={() => setPrayerLocale(option)}
          />
        ))}
      </Card>
      <AppText variant="caption" color="muted" style={styles.hint}>
        {t('settings.prayerLanguageHint')}
      </AppText>

      <SectionHeader title={t('settings.prayerForm')} />
      <Card>
        <ListRow
          label={t('forms.auto')}
          selected={settings.prayerForm === 'auto'}
          onPress={() => setPrayerForm('auto')}
        />
        {availableForms.map((form, index) => (
          <ListRow
            key={form.id}
            label={t(`forms.${form.id}`)}
            selected={settings.prayerForm === form.id}
            divider={index < availableForms.length - 1}
            onPress={() => setPrayerForm(form.id)}
          />
        ))}
      </Card>
      <AppText variant="caption" color="muted" style={styles.hint}>
        {t('settings.prayerFormHint')}
      </AppText>

      <SectionHeader title={t('settings.optionalPrayers')} />
      <Card>
        {optionalPrayers.map((prayer, index) => (
          <SwitchRow
            key={prayer}
            label={findPrayer(prayer, prayerLocale)?.title ?? prayer}
            description={t(`optional.${prayer}`)}
            value={settings.includedPrayers.includes(prayer)}
            divider={index < optionalPrayers.length - 1}
            onValueChange={() => toggleIncludedPrayer(prayer)}
          />
        ))}
      </Card>

      {prayerLocale === 'la' ? (
        <>
          <SectionHeader title={t('settingsLatin.title')} />
          <Card>
            {(['both', 'la', 'own'] as const).map((option, index) => (
              <ListRow
                key={option}
                label={t(`settingsLatin.${option}`)}
                selected={settings.latinText === option}
                divider={index < 2}
                onPress={() => setLatinText(option)}
              />
            ))}
          </Card>
          <AppText variant="caption" color="muted" style={styles.hint}>
            {t('settingsLatin.hint')}
          </AppText>
        </>
      ) : null}

      <SectionHeader title={t('rule.title')} />
      <Card>
        <ListRow
          label={t(`rule.names.${settings.rule}`)}
          testID="open-rule"
          divider={false}
          onPress={() => router.push('/rule')}
        />
      </Card>

      <SectionHeader title={t('intentions.title')} />
      <Card>
        <ListRow
          label={t('intentions.history')}
          testID="open-intentions"
          divider={false}
          onPress={() => router.push('/intentions')}
        />
      </Card>

      <SectionHeader title={t('settingsHaptics.title')} />
      <Card>
        {(['off', 'gentle', 'strong'] as const).map((option, index) => (
          <ListRow
            key={option}
            label={t(`settingsHaptics.${option}`)}
            selected={settings.haptics === option}
            divider={index < 2}
            onPress={() => setHaptics(option)}
          />
        ))}
      </Card>
      <AppText variant="caption" color="muted" style={styles.hint}>
        {t('settingsHaptics.hint')}
      </AppText>

      <ReminderSection />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: spacing.sm, paddingHorizontal: spacing.xs },
});
