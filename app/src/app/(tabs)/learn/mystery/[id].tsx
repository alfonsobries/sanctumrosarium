import { bookOf, mystery as findMystery, mysteryTitle, passage } from '@sanctamaria/content';
import { evangelistOf } from '@sanctamaria/rosary';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import { artworks } from '@/domains/artwork/artworks';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';
import { Text } from '@/shared/ui/Text';

export default function MysteryScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const locale = useContentLocale();
  const { width } = useWindowDimensions();
  const mystery = findMystery(id ?? '');
  const [ref, setRef] = useState(mystery.readings[0]?.ref ?? '');
  const artwork = artworks[mystery.id];
  const text = passage(ref, locale);

  const label = (value: string): string => {
    const evangelist = evangelistOf({ book: bookOf(value), ref: value });
    return evangelist === null ? value.split(' ')[0] ?? value : t(`evangelists.${evangelist}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: t(`setShort.${mystery.set}`), headerLargeTitle: false }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-6 px-5 pb-16 pt-2">
        {artwork !== undefined && (
          <Card style={{ height: (width - 40) * 1.1, backgroundColor: artwork.color }}>
            <Image
              source={artwork.source}
              placeholder={{ thumbhash: artwork.thumbhash }}
              contentFit="cover"
              contentPosition="top"
              transition={200}
              style={{ flex: 1 }}
              accessibilityLabel={`${artwork.title}, ${artwork.artist}`}
            />
          </Card>
        )}
        <View className="gap-1">
          <Text variant="eyebrow">
            {t('pray.mystery', { ordinal: t(`ordinal.${mystery.order - 1}`), set: t(`setAdjective.${mystery.set}`) })}
          </Text>
          <Text variant="display">{mysteryTitle(mystery.id, locale)}</Text>
          {artwork !== undefined && (
            <Text variant="caption">
              {artwork.artist}, {artwork.title}
            </Text>
          )}
        </View>
        {mystery.readings.length > 1 && (
          <Segmented
            accessibilityLabel={t('pray.reading')}
            value={ref}
            onChange={setRef}
            options={mystery.readings.map((reading) => ({ value: reading.ref, label: label(reading.ref) }))}
          />
        )}
        {text !== null && (
          <View className="gap-3">
            <Text variant="eyebrow" className="text-rubric">
              {text.displayRef}
            </Text>
            <Text className="font-prayer text-[20px] leading-[30px] text-foreground" selectable>
              {text.text}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
