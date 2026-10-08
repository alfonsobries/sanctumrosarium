import { allPrayers, mysteriesOf, mysteryTitle, prayerTitle } from '@sanctamaria/content';
import { mysterySets } from '@sanctamaria/rosary';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import { useArtwork } from '@/domains/artwork/use-artwork';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { Row } from '@/shared/ui/Row';
import { Text } from '@/shared/ui/Text';
import { readableWidth } from '@/shared/ui/layout';
import { useWideLayout } from '@/shared/ui/use-wide-layout';

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
  const artwork = useArtwork(id);
  return (
    <Link href={{ pathname: '/learn/mystery/[id]', params: { id } }} asChild>
      <Pressable
        accessibilityRole="button"
        className="flex-row items-center gap-3 px-4 py-2.5 active:bg-surface-raised"
      >
        <View
          className="h-12 w-10 overflow-hidden rounded-md"
          style={{ backgroundColor: artwork?.color, borderCurve: 'continuous' }}
        >
          {artwork !== null && (
            <Image
              source={artwork.source}
              placeholder={{ thumbhash: artwork.thumbhash }}
              contentFit="cover"
              style={{ flex: 1 }}
            />
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
  const wide = useWideLayout();
  // Two columns on a wide screen: half the row less half the gap between them.
  const column = wide ? 'w-[49%]' : 'w-full';

  return (
    <>
      <Stack.Screen options={{ title: t('learn.title') }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-8 px-5 pb-16 pt-2 ${wide ? '' : readableWidth}`}
      >
        <View className={wide ? 'flex-row justify-between' : 'gap-8'}>
          <Link href="/lesson/how-to-pray" asChild>
            <Pressable
              accessibilityRole="button"
              className={`gap-4 rounded-card bg-surface p-5 active:opacity-80 ${column}`}
              style={{ borderCurve: 'continuous' }}
            >
              <Icon name="rosary" size={32} color={colors.accent} />
              <View className="gap-1">
                <Text variant="title">{t('learn.start')}</Text>
                <Text variant="footnote">{t('learn.startDetail')}</Text>
              </View>
            </Pressable>
          </Link>

          {wide ? (
            <Link href="/learn/promises" asChild>
              <Pressable
                accessibilityRole="button"
                className={`gap-4 rounded-card bg-surface p-5 active:opacity-80 ${column}`}
                style={{ borderCurve: 'continuous' }}
              >
                <Icon name="rosary" size={32} color={colors.accent} />
                <View className="gap-1">
                  <Text variant="title">{t('learn.promises')}</Text>
                  <Text variant="footnote">{t('learn.promisesDetail')}</Text>
                </View>
              </Pressable>
            </Link>
          ) : (
            <Card>
              <Link href="/learn/promises" asChild>
                <Row title={t('learn.promises')} detail={t('learn.promisesDetail')} icon="rosary" />
              </Link>
            </Card>
          )}
        </View>

        <View className="gap-3">
          <Text variant="eyebrow">{t('learn.mysteries')}</Text>
          <View className={wide ? 'flex-row flex-wrap justify-between gap-y-5' : 'gap-3'}>
            {mysterySets.map((set) => (
              <View key={set} className={`gap-1.5 ${column}`}>
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
        </View>

        <View className="gap-3">
          <Text variant="eyebrow">{t('learn.prayers')}</Text>
          <View className={wide ? 'flex-row items-start justify-between' : ''}>
            {(wide ? [prayers.slice(0, 5), prayers.slice(5)] : [prayers]).map((group) => (
              <Card key={group[0]?.id} className={column}>
                {group.map((prayer) => (
                  <Link
                    key={prayer.id}
                    href={{ pathname: '/learn/prayer/[id]', params: { id: prayer.id } }}
                    asChild
                  >
                    <Row title={prayerTitle(prayer.id, locale)} />
                  </Link>
                ))}
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
