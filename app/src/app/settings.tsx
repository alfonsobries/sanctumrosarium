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
import type { PrayerId } from '@rosario/content';
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
    setRosesEnabled,
    setCaminoEnabled,
    setRecollectionEnabled,
    setWithLitany,
    setWithClauses,
    toggleLatinMix,
    setPace,
    setChoirRole,
  } = useSettings();

  // The prayers of the current form that can be mixed while praying in Latin:
  // essentials first, then the fixed prayers of the frame.
  const mixablePrayers: readonly PrayerId[] =
    prayerLocale === 'la'
      ? [
          'pater-noster',
          'ave-maria',
          'gloria-patri',
          ...new Set(
            [
              ...forms[prayerForm].opening,
              ...forms[prayerForm].decade.opening,
              ...forms[prayerForm].decade.closing,
              ...forms[prayerForm].closing,
            ].flatMap((step) =>
              (step.kind === 'prayer' || step.kind === 'prayer-times') &&
              step.optional !== true &&
              !['pater-noster', 'ave-maria', 'gloria-patri'].includes(step.prayer)
                ? [step.prayer]
                : [],
            ),
          ),
        ]
      : [];

  const availableForms = formsForLocale(prayerLocale);
  // The prayer after the litany only makes sense when the litany itself is on.
  const optionalPrayers = optionalPrayersOf(forms[prayerForm]).filter(
    (prayer) => prayer !== 'oratio-litaniarum' || settings.withLitany,
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
            onValueChange={() => toggleIncludedPrayer(prayer)}
          />
        ))}
        <SwitchRow
          label={t('litany.title')}
          description={t('litany.settingHint')}
          value={settings.withLitany}
          onValueChange={(value) => setWithLitany(value)}
        />
        <SwitchRow
          label={t('clauses.title')}
          description={t('clauses.hint')}
          value={settings.withClauses}
          divider={false}
          onValueChange={(value) => setWithClauses(value)}
        />
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

          <SectionHeader title={t('settingsLatin.mixTitle')} />
          <Card>
            {mixablePrayers.map((prayer, index) => (
              <SwitchRow
                key={prayer}
                label={findPrayer(prayer, 'la')?.title ?? prayer}
                value={settings.latinMixOwn.includes(prayer)}
                divider={index < mixablePrayers.length - 1}
                onValueChange={() => toggleLatinMix(prayer)}
              />
            ))}
          </Card>
          <AppText variant="caption" color="muted" style={styles.hint}>
            {t('settingsLatin.mixHint')}
          </AppText>

          <SectionHeader title={t('latinLearn.title')} />
          <Card>
            <ListRow
              label={t('latinLearn.title')}
              testID="open-latin-learn"
              divider={false}
              onPress={() => router.push('/latin')}
            />
          </Card>
          <AppText variant="caption" color="muted" style={styles.hint}>
            {t('latinLearn.settingsHint')}
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

      <SectionHeader title={t('camino.title')} />
      <Card>
        <SwitchRow
          label={t('camino.title')}
          description={t('camino.toggle')}
          value={settings.caminoEnabled}
          divider={false}
          onValueChange={(value) => setCaminoEnabled(value)}
        />
      </Card>

      <SectionHeader title={t('recollection.title')} />
      <Card>
        <SwitchRow
          label={t('recollection.title')}
          description={t('recollection.toggle')}
          value={settings.recollectionEnabled}
          divider={false}
          onValueChange={(value) => setRecollectionEnabled(value)}
        />
      </Card>

      <SectionHeader title={t('roses.title')} />
      <Card>
        <SwitchRow
          label={t('roses.title')}
          description={t('roses.toggle')}
          value={settings.rosesEnabled}
          divider={settings.rosesEnabled}
          onValueChange={(value) => setRosesEnabled(value)}
        />
        {settings.rosesEnabled ? (
          <ListRow
            label={t('roses.title')}
            testID="open-roses"
            divider={false}
            onPress={() => router.push('/roses')}
          />
        ) : null}
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

      <SectionHeader title={t('pace.title')} />
      <Card>
        {(['normal', 'calm'] as const).map((option, index) => (
          <ListRow
            key={option}
            label={t(`pace.rate.${option}`)}
            selected={settings.audioPace === option}
            divider={index < 1}
            onPress={() => setPace({ audioPace: option })}
          />
        ))}
      </Card>
      <Card style={styles.paceCard}>
        {(['normal', 'long'] as const).map((option, index) => (
          <ListRow
            key={option}
            label={t(`pace.silence.${option}`)}
            selected={settings.responseSilence === option}
            divider={index < 1}
            onPress={() => setPace({ responseSilence: option })}
          />
        ))}
      </Card>
      <Card style={styles.paceCard}>
        {(['short', 'medium', 'long'] as const).map((option, index) => (
          <ListRow
            key={option}
            label={t(`pace.announce.${option}`)}
            selected={settings.announcePause === option}
            divider={index < 2}
            onPress={() => setPace({ announcePause: option })}
          />
        ))}
      </Card>
      <AppText variant="caption" color="muted" style={styles.hint}>
        {t('pace.hint')}
      </AppText>

      <SectionHeader title={t('choir.title')} />
      <Card>
        {(['guide', 'respond'] as const).map((option, index) => (
          <ListRow
            key={option}
            label={t(`choir.${option}`)}
            selected={settings.choirRole === option}
            divider={index < 1}
            onPress={() => setChoirRole(option)}
          />
        ))}
      </Card>
      <AppText variant="caption" color="muted" style={styles.hint}>
        {t('choir.hint')}
      </AppText>

      <ReminderSection />
    </Screen>
  );
}

const styles = StyleSheet.create({
  paceCard: { marginTop: spacing.sm },
  hint: { marginTop: spacing.sm, paddingHorizontal: spacing.xs },
});
