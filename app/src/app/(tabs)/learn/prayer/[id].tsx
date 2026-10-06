import {
  hasPrayerText,
  litany,
  prayer as findPrayer,
  prayerText,
  prayerTitle,
  type Locale,
} from '@sanctamaria/content';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { Segmented } from '@/shared/ui/Segmented';
import { Text } from '@/shared/ui/Text';

const shown: Locale[] = ['es-MX', 'en-US', 'la'];

export default function PrayerScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const contentLocale = useContentLocale();
  const prayer = findPrayer(id ?? '');
  const available = shown.filter((locale) => hasPrayerText(prayer.id, locale));
  const [locale, setLocale] = useState<Locale>(
    available.includes(contentLocale) ? contentLocale : (available[0] ?? 'es-MX'),
  );
  const text = prayer.id === 'litany-of-loreto' ? null : prayerText(prayer.id, locale);
  const litanyText = prayer.id === 'litany-of-loreto' ? litany(locale) : null;
  const source = text?.source ?? litanyText?.source;

  return (
    <>
      <Stack.Screen options={{ title: prayerTitle(prayer.id, contentLocale), headerLargeTitle: false }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-16 pt-4"
      >
        {available.length > 1 && (
          <Segmented
            accessibilityLabel={t('options.language')}
            value={locale}
            onChange={setLocale}
            options={available.map((value) => ({
              value,
              label: value === 'la' ? 'Latina' : value === 'en-US' ? 'English' : 'Español',
            }))}
          />
        )}
        <Text variant="title">{prayerTitle(prayer.id, locale)}</Text>
        {text !== null && (
          <View className="gap-1">
            {text.lines.map((line, index) => (
              <Text
                key={index}
                selectable
                className={`text-[21px] leading-[31px] ${index >= (text.responseFrom ?? text.lines.length) ? 'font-prayer-italic text-muted' : 'font-prayer text-foreground'}`}
              >
                {line}
              </Text>
            ))}
          </View>
        )}
        {litanyText !== null && (
          <View className="gap-2">
            {litanyText.pairs.map((pair, index) => (
              <Text key={index} selectable className="font-prayer text-[19px] leading-[27px] text-foreground">
                {pair.call} <Text className="font-prayer-italic text-muted">{pair.response}</Text>
              </Text>
            ))}
          </View>
        )}
        {text?.responseFrom !== null && text !== null && (
          <Text variant="footnote" className="font-prayer-italic text-rubric">
            {t('guide.response')}
          </Text>
        )}
        {source !== undefined && (
          <Text variant="caption" selectable>
            {t('learn.source')}: {source.publisher}, {source.title}
          </Text>
        )}
      </ScrollView>
    </>
  );
}
