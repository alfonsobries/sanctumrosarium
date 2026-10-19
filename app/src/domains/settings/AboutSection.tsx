import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';

import { siteLanguageOf, siteUrl, type SitePage } from '@/domains/about/links';
import { Card } from '@/shared/ui/Card';
import { Row } from '@/shared/ui/Row';
import { Text } from '@/shared/ui/Text';

import { SettingsSection } from './SettingsSection';

/** The website's pages and the app's version, at the foot of the settings. */
export function AboutSection() {
  const { t, i18n } = useTranslation();
  const language = siteLanguageOf(i18n.language);
  const version = Constants.expoConfig?.version;

  function handleOpen(page: SitePage) {
    void WebBrowser.openBrowserAsync(siteUrl(page, language));
  }

  return (
    <SettingsSection title={t('settings.about')}>
      <Card>
        <Row
          icon="website"
          title={t('settings.aboutWebsite')}
          detail={t('settings.aboutWebsiteDetail')}
          onPress={() => handleOpen('home')}
        />
        <Row
          icon="help"
          title={t('settings.aboutHelp')}
          detail={t('settings.aboutHelpDetail')}
          onPress={() => handleOpen('help')}
        />
        <Row icon="support" title={t('settings.aboutSupport')} onPress={() => handleOpen('support')} />
        <Row icon="privacy" title={t('settings.aboutPrivacy')} onPress={() => handleOpen('privacy')} />
        <Row icon="terms" title={t('settings.aboutTerms')} onPress={() => handleOpen('terms')} />
      </Card>
      {version !== undefined && (
        <Text variant="footnote" className="px-1 text-center">
          {t('settings.aboutVersion', { version })}
        </Text>
      )}
    </SettingsSection>
  );
}
