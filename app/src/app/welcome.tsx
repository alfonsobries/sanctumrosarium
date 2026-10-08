import { getLocales } from 'expo-localization';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { Locale } from '@/domains/sync/api.gen';
import { useSettings } from '@/domains/settings/use-settings';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Button } from '@/shared/ui/Button';
import { BrandMark } from '@/shared/ui/BrandMark';
import { Segmented } from '@/shared/ui/Segmented';
import { SafeScreen } from '@/shared/ui/SafeScreen';
import { Text } from '@/shared/ui/Text';

function deviceLocale(): Locale {
  const locale = getLocales()[0];
  if (locale?.languageCode === 'en') {
    return 'en-US';
  }
  return locale?.regionCode === 'ES' ? 'es-ES' : 'es-MX';
}

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useSkin();
  const prayerLocale = useSettings((state) => state.prayerLocale);
  const update = useSettings((state) => state.update);

  useEffect(() => {
    update({ prayerLocale: deviceLocale() });
  }, [update]);

  function handleKnow() {
    update({ onboarded: true, guided: false });
  }

  function handleLearn() {
    update({ onboarded: true, guided: true });
    setTimeout(() => router.push('/lesson/how-to-pray'), 0);
  }

  return (
    <SafeScreen className="justify-between px-6" extraTop={24} extraBottom={12}>
      <Animated.View entering={FadeIn.duration(400)} className="flex-1 items-center justify-center gap-5">
        <BrandMark size={112} color={colors.accent} />
        <View className="items-center gap-2">
          <Text variant="display" className="text-center">
            {t('onboarding.title')}
          </Text>
          <Text variant="callout" className="text-center text-muted">
            {t('onboarding.subtitle')}
          </Text>
        </View>
      </Animated.View>

      <View className="gap-8">
        <View className="gap-2">
          <Text variant="eyebrow" className="text-center">
            {t('onboarding.language')}
          </Text>
          <Segmented
            accessibilityLabel={t('onboarding.language')}
            value={prayerLocale === 'es-ES' ? 'es-MX' : prayerLocale}
            onChange={(value) =>
              update({
                prayerLocale:
                  value === 'es-MX' ? (deviceLocale().startsWith('es') ? deviceLocale() : 'es-MX') : value,
              })
            }
            options={[
              { value: 'es-MX', label: 'Español' },
              { value: 'en-US', label: 'English' },
              { value: 'la', label: 'Latina' },
            ]}
          />
        </View>
        <View className="gap-3">
          <Button label={t('onboarding.know')} onPress={handleKnow} />
          <Button label={t('onboarding.learn')} variant="secondary" onPress={handleLearn} />
        </View>
      </View>
    </SafeScreen>
  );
}
