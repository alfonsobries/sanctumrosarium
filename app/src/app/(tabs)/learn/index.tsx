import { allPrayers, mysteriesOf, mysteryTitle, prayerTitle } from '@sanctamaria/content';
import { mysterySets } from '@sanctamaria/rosary';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import { artworks } from '@/domains/artwork/artworks';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { Row } from '@/shared/ui/Row';
import { Text } from '@/shared/ui/Text';

const listedPrayers = [
  'sign-of-the-cross',
  'apostles-creed',
  'our-father',
  'hail-mary',
  'glory-be',
  'fatima-prayer',
  'hail-holy-queen',
  'rosary-closing-prayer',
  'litany-of-loreto',
];

function MysteryRow({ id, index }: { id: string; index: number }) {
  const locale = useContentLocale();
  const { colors } = useSkin();
  const artwork = artworks[id];
  return (
    <Link href={{ pathname: '/learn/mystery/[id]', params: { id } }} asChild>
      <Pressable accessibilityRole="button" className="flex-row items-center gap-3 px-4 py-2.5 active:bg-surface-raised">
        <View className="h-12 w-10 overflow-hidden rounded-md" style={{ backgroundColor: artwork?.color, borderCurve: 'continuous' }}>
          {artwork !== undefined && (
            <Image source={artwork.source} placeholder={{ thumbhash: artwork.thumbhash }} contentFit="cover" style={{ flex: 1 }} />
          )}
        </View>
        <Text variant="footnote" className="w-3 text-faint">
          {index + 1}
        </Text>
        <Text variant="callout" className="flex-1">
          {mysteryTitle(id, locale)}
        </Text>
        <Icon name="chevron" size={16} color={colors.faint} />
      </Pressable>
    </Link>
  );
}

export default function LearnScreen() {
  const { t } = useTranslation();
  const { colors } = useSkin();
  const locale = useContentLocale();
  const prayers = allPrayers().filter((prayer) => listedPrayers.includes(prayer.id));

  return (
    <>
      <Stack.Screen options={{ title: t('learn.title') }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-8 px-5 pb-16 pt-2">
        <Link href="/lesson/how-to-pray" asChild>
          <Pressable
            accessibilityRole="button"
            className="gap-4 rounded-card bg-surface p-5 active:opacity-80"
            style={{ borderCurve: 'continuous' }}
          >
            <Icon name="rosary" size={32} color={colors.accent} />
            <View className="gap-1">
              <Text variant="title">{t('learn.start')}</Text>
              <Text variant="footnote">{t('learn.startDetail')}</Text>
            </View>
          </Pressable>
        </Link>

        <View className="gap-3">
          <Text variant="eyebrow">{t('learn.mysteries')}</Text>
          {mysterySets.map((set) => (
            <View key={set} className="gap-1.5">
              <Text variant="footnote" className="px-1">
                {t(`sets.${set}`)}
              </Text>
              <Card>
                {mysteriesOf(set).map((mystery, index) => (
                  <MysteryRow key={mystery.id} id={mystery.id} index={index} />
                ))}
              </Card>
            </View>
          ))}
        </View>

        <View className="gap-3">
          <Text variant="eyebrow">{t('learn.prayers')}</Text>
          <Card>
            {prayers.map((prayer) => (
              <Link key={prayer.id} href={{ pathname: '/learn/prayer/[id]', params: { id: prayer.id } }} asChild>
                <Row title={prayerTitle(prayer.id, locale)} />
              </Link>
            ))}
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
