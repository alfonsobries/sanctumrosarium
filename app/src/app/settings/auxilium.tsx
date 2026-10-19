import { auxiliumLinks, auxiliumText } from '@sanctamaria/content';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ReminderControls } from '@/domains/reminders/ReminderControls';
import { SettingsPage } from '@/domains/settings/SettingsPage';
import { SettingsSection } from '@/domains/settings/SettingsSection';
import { useSettings } from '@/domains/settings/use-settings';
import { Card } from '@/shared/ui/Card';
import { Row } from '@/shared/ui/Row';
import { SwitchRow } from '@/shared/ui/SwitchRow';
import { Text } from '@/shared/ui/Text';

export default function AuxiliumSettingsScreen() {
  const { t, i18n } = useTranslation();
  const settings = useSettings();
  const update = settings.update;
  const text = auxiliumText(settings.prayerLocale);
  const booklet = auxiliumText(i18n.language === 'en' ? 'en-US' : 'es-MX').source.url;
  const sources = [text.source, ...Object.values(text.sectionSources ?? {})];

  function open(url: string) {
    void WebBrowser.openBrowserAsync(url);
  }

  return (
    <SettingsPage title={t('auxilium.title')}>
      <View className="gap-3 px-1">
        <Text variant="body">{t('auxilium.what')}</Text>
        <Text variant="body">{t('auxilium.membership')}</Text>
        <Text variant="footnote">{t('auxilium.approval')}</Text>
      </View>

      <SettingsSection>
        <Card>
          <SwitchRow
            icon="cross"
            title={t('auxilium.enable')}
            detail={t('auxilium.enableDetail')}
            value={settings.auxilium}
            onChange={(value) => update({ auxilium: value })}
          />
          {settings.auxilium && (
            <ReminderControls
              enabled={settings.auxiliumReminder}
              minutes={settings.auxiliumReminderAt}
              onEnabledChange={(value) => update({ auxiliumReminder: value })}
              onMinutesChange={(value) => update({ auxiliumReminderAt: value })}
            />
          )}
        </Card>
      </SettingsSection>

      <SettingsSection title={t('auxilium.links')}>
        <Card>
          <Row icon="website" title={t('auxilium.site')} onPress={() => open(auxiliumLinks.home)} />
          <Row
            icon="help"
            title={t('auxilium.requirements')}
            onPress={() => open(auxiliumLinks.requirements)}
          />
          <Row icon="support" title={t('auxilium.faq')} onPress={() => open(auxiliumLinks.faq)} />
          <Row icon="terms" title={t('auxilium.booklet')} onPress={() => open(booklet)} />
        </Card>
      </SettingsSection>

      <SettingsSection title={t('auxilium.sources')}>
        <Card>
          {sources.map((source) => (
            <Row
              key={source.url}
              icon="external"
              title={source.publisher}
              detail={source.title}
              onPress={() => open(source.url)}
            />
          ))}
        </Card>
      </SettingsSection>
    </SettingsPage>
  );
}
