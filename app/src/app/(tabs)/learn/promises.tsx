import { rosaryPromises } from '@sanctamaria/content';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';
import { readableWidth } from '@/shared/ui/layout';

export default function PromisesScreen() {
  const { t, i18n } = useTranslation();
  const content = rosaryPromises(i18n.language === 'en' ? 'en' : 'es');
  const sources = [...new Map(content.promises.map((p) => [p.source.url, p.source])).values()];

  return (
    <>
      <Stack.Screen options={{ title: t('learn.promises'), headerLargeTitle: false }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-7 px-5 pb-16 pt-4 ${readableWidth}`}
      >
        <View className="gap-3">
          <View className="self-start rounded-full border border-rubric px-3 py-1">
            <Text variant="caption" className="text-rubric">
              {t('learn.piousTradition')}
            </Text>
          </View>
          <Text variant="body" className="text-[18px] leading-[27px]">
            {content.intro}
          </Text>
        </View>

        <Card className="gap-5 px-5 py-5">
          {content.promises.map((promise) => (
            <View key={promise.n} className="flex-row gap-3">
              <Text
                variant="footnote"
                className="w-6 pt-1 text-right font-semibold text-accent"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {promise.n}
              </Text>
              <Text className="flex-1 font-prayer text-[18px] leading-[26px] text-foreground" selectable>
                {promise.text}
              </Text>
            </View>
          ))}
        </Card>

        <View className="gap-4">
          <Text variant="eyebrow">{t('learn.howToRead')}</Text>
          {content.understanding.map((entry) => (
            <View key={entry.topic} className="gap-1">
              <Text variant="callout" className="leading-[23px]">
                {entry.text}
              </Text>
              <Text variant="caption" selectable>
                {entry.source.publisher}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-1">
          <Text variant="eyebrow">{t('learn.sources')}</Text>
          {sources.map((source) => (
            <Text key={source.url} variant="caption" selectable>
              {source.publisher}, {source.title}
            </Text>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
