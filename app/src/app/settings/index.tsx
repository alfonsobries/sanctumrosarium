import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { dateAt } from '@/domains/reminders/reminders';
import { AboutSection } from '@/domains/settings/AboutSection';
import { SettingsField } from '@/domains/settings/SettingsField';
import { SettingsPage } from '@/domains/settings/SettingsPage';
import { SettingsSection } from '@/domains/settings/SettingsSection';
import { useSettings } from '@/domains/settings/use-settings';
import { formatTime } from '@/shared/format';
import { Card } from '@/shared/ui/Card';
import { Row } from '@/shared/ui/Row';
import { Segmented } from '@/shared/ui/Segmented';
import { Text } from '@/shared/ui/Text';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const settings = useSettings();
  const listens = settings.mode === 'listen';

  function open(href: Href) {
    router.push(href);
  }

  return (
    <SettingsPage title={t('settings.title')}>
      <SettingsSection title={t('settings.prayer')}>
        <Card>
          <SettingsField icon="language" label={t('settings.language')}>
            <Segmented
              accessibilityLabel={t('settings.language')}
              value={settings.prayerLocale}
              onChange={(value) => settings.update({ prayerLocale: value })}
              options={(['es-MX', 'es-ES', 'en-US', 'la'] as const).map((value) => ({
                value,
                label: value === 'es-MX' ? 'MX' : value === 'es-ES' ? 'ES' : value === 'en-US' ? 'EN' : 'LA',
              }))}
            />
            <Text variant="footnote">{t(`locales.${settings.prayerLocale}`)}</Text>
          </SettingsField>
          <Row
            icon={listens ? 'listen' : 'tap'}
            title={t('settings.voice')}
            value={listens ? `${t('options.listen')} · ${settings.rate}×` : t('options.tap')}
            onPress={() => open('/settings/voice')}
          />
          <Row
            icon="rosary"
            title={t('settings.rosaryOptions')}
            detail={t('settings.rosaryOptionsDetail')}
            onPress={() => open('/settings/rosary')}
          />
        </Card>
      </SettingsSection>

      <SettingsSection title={t('reminders.title')}>
        <Card>
          <Row
            icon="bell"
            title={t('settings.reminder')}
            value={
              settings.rosaryReminder
                ? formatTime(dateAt(settings.rosaryReminderAt), i18n.language)
                : t('settings.off')
            }
            onPress={() => open('/settings/reminder')}
          />
        </Card>
      </SettingsSection>

      <SettingsSection title={t('settings.devotions')}>
        <Card>
          <Row
            icon="shield"
            title={t('auxilium.title')}
            value={settings.auxilium ? t('settings.on') : t('settings.off')}
            onPress={() => open('/settings/auxilium')}
          />
        </Card>
      </SettingsSection>

      <SettingsSection title={t('settings.appearance')}>
        <Card>
          <Row
            icon="skin"
            title={t(`settings.skins.${settings.skin}`)}
            detail={t('settings.appearanceDetail')}
            onPress={() => open('/settings/appearance')}
          />
        </Card>
      </SettingsSection>

      <AboutSection />
    </SettingsPage>
  );
}
