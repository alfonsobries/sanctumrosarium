import { mysteriesOf, mysteryRefsOf, mysteryTitle } from '@sanctamaria/content';
import {
  formatLocalDate,
  localDateOf,
  mysterySetFor,
  mysterySets,
  type MysterySet,
} from '@sanctamaria/rosary';
import { Link, Stack, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtworkFrame } from '@/domains/artwork/ArtworkFrame';
import { useArtwork } from '@/domains/artwork/use-artwork';
import { hasAudio } from '@/domains/audio/use-rosary-audio';
import { weekOf } from '@/domains/calendar/dates';
import { useJournalDays } from '@/domains/journal/queries';
import { stepsFor } from '@/domains/prayer/session';
import { isResumable, startSession } from '@/domains/prayer/start';
import { useSession } from '@/domains/prayer/use-session';
import { useSettings } from '@/domains/settings/use-settings';
import { capitalizeFirst } from '@/shared/format';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { Text } from '@/shared/ui/Text';
import { readableWidth } from '@/shared/ui/layout';
import { useWideLayout } from '@/shared/ui/use-wide-layout';

function WeekDay({ label, prayed, today }: { label: string; prayed: boolean; today: boolean }) {
  return (
    <View className="flex-1 items-center gap-1.5">
      <Text variant="caption" className={today ? 'font-semibold text-foreground' : undefined}>
        {label}
      </Text>
      {/* An exact radius: Android draws a bordered view with the huge rounded-full radius square. */}
      <View
        className={`h-2.5 w-2.5 ${prayed ? 'bg-accent' : 'border border-border'}`}
        style={{ borderRadius: 5 }}
      />
    </View>
  );
}

function SetChip({ set, onPress, active }: { set: MysterySet; onPress: () => void; active: boolean }) {
  const { t } = useTranslation();
  const { colors } = useSkin();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
      className={`ios:active:opacity-70 min-h-[44px] grow basis-[45%] items-center justify-center overflow-hidden rounded-full border px-4 ${active ? 'border-accent bg-surface-raised' : 'border-border'}`}
    >
      <Text variant="callout" className={active ? 'text-accent' : 'text-muted'}>
        {t(`setShort.${set}`)}
      </Text>
    </Pressable>
  );
}

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useSkin();
  const locale = useContentLocale();
  const { width } = useWindowDimensions();
  const wide = useWideLayout();
  const insets = useSafeAreaInsets();
  const mode = useSettings((state) => state.mode);
  const prayerLocale = useSettings((state) => state.prayerLocale);
  const listens = mode === 'listen' && hasAudio(prayerLocale);
  const plan = useSession((state) => state.plan);
  const position = useSession((state) => state.position);

  const now = new Date();
  const today = localDateOf(now);
  const todaySet = mysterySetFor(today);
  const mysteries = mysteriesOf(todaySet);
  const lead = mysteries[0];
  const artwork = useArtwork(lead?.id ?? '');

  const week = useMemo(() => weekOf(today), [today.year, today.month, today.day]);
  const first = week[0];
  const last = week[6];
  const days = useJournalDays(
    first === undefined ? '' : formatLocalDate(first),
    last === undefined ? '' : formatLocalDate(last),
  );
  const prayedDays = new Set(days.data?.map((day) => day.prayedOn));
  const weekdayFormat = new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' });
  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const resumable = plan !== null && isResumable(plan.startedAt) ? plan : null;
  const resumeDecade =
    resumable === null ? 1 : (stepsFor(resumable, mysteryRefsOf(resumable.set))[position]?.decade ?? 1);

  async function handleStart(set: MysterySet, scope: 'full' | 'decade') {
    const prayedToday = days.data?.find((day) => day.prayedOn === formatLocalDate(today))?.decades ?? 0;
    await startSession(
      set,
      scope === 'full' ? { kind: 'full' } : { kind: 'decade', decade: (prayedToday % 5) + 1 },
    );
    router.push('/pray');
  }

  return (
    <>
      <Stack.Screen options={{ title: t('tabs.pray'), headerLargeTitle: false, headerShown: false }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-8 px-5 pb-16 ${readableWidth}`}
        // iOS insets the scroll under the status bar by itself; Android needs the room given.
        contentContainerStyle={process.env.EXPO_OS === 'android' ? { paddingTop: insets.top } : undefined}
      >
        <View className="flex-row items-center justify-between pt-3">
          <Text variant="footnote">{capitalizeFirst(dateFormat.format(now))}</Text>
          <Link href="/settings" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('settings.title')}
              hitSlop={10}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
            >
              <Icon name="settings" color={colors.muted} />
            </Pressable>
          </Link>
        </View>

        <View className="gap-5">
          <View className="gap-1">
            <Text variant="eyebrow">{t('home.today')}</Text>
            <Text variant="display">{t(`sets.${todaySet}`)}</Text>
          </View>

          {artwork !== null && (
            <ArtworkFrame
              artwork={artwork}
              style={{ height: Math.min(width - 40, wide ? 600 : 460) * 0.95 }}
            />
          )}

          <View className="gap-2.5">
            {mysteries.map((mystery, index) => (
              <View key={mystery.id} className="flex-row items-baseline gap-3">
                <Text variant="footnote" className="w-4 text-faint" style={{ fontVariant: ['tabular-nums'] }}>
                  {index + 1}
                </Text>
                <Text variant="callout" className="flex-1 font-prayer text-[18px] leading-[24px]">
                  {mysteryTitle(mystery.id, locale)}
                </Text>
              </View>
            ))}
          </View>

          <View className="gap-3">
            <Button label={t('home.pray')} onPress={() => void handleStart(todaySet, 'full')} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/begin', params: { set: todaySet } })}
              className="min-h-[44px] flex-row items-center justify-center gap-2 active:opacity-60"
            >
              <Icon name={listens ? 'listen' : 'tap'} size={18} color={colors.muted} />
              <Text variant="footnote">
                {listens ? t('home.summaryListen') : t('home.summaryTap')} · {t(`locales.${prayerLocale}`)}
              </Text>
              <Icon name="chevron" size={14} color={colors.faint} />
            </Pressable>
          </View>
        </View>

        {resumable !== null && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/pray')}
            className="flex-row items-center gap-4 rounded-card bg-surface p-4 active:opacity-80"
            style={{ borderCurve: 'continuous' }}
          >
            <Icon name="rosary" color={colors.accent} />
            <View className="flex-1 gap-0.5">
              <Text variant="headline">{t('home.resume')}</Text>
              <Text variant="footnote">
                {t('home.resumeDetail', {
                  decade: resumeDecade,
                  set: t(`setShort.${resumable.set}`),
                })}
              </Text>
            </View>
            <Icon name="chevron" size={18} color={colors.faint} />
          </Pressable>
        )}

        <View className="gap-3">
          <Text variant="eyebrow">{t('home.week')}</Text>
          <View className="flex-row">
            {week.map((day) => {
              const key = formatLocalDate(day);
              return (
                <WeekDay
                  key={key}
                  label={weekdayFormat.format(new Date(day.year, day.month - 1, day.day))}
                  prayed={prayedDays.has(key)}
                  today={key === formatLocalDate(today)}
                />
              );
            })}
          </View>
        </View>

        <View className="gap-3">
          <Text variant="eyebrow">{t('home.otherSets')}</Text>
          <View className="flex-row flex-wrap gap-2">
            {mysterySets.map((set) => (
              <SetChip
                key={set}
                set={set}
                active={set === todaySet}
                onPress={() => router.push({ pathname: '/begin', params: { set } })}
              />
            ))}
          </View>
          <Button
            label={t('home.decade')}
            variant="plain"
            onPress={() => void handleStart(todaySet, 'decade')}
          />
        </View>
      </ScrollView>
      {process.env.EXPO_OS === 'android' && (
        // Edge to edge, the page would scroll under the clock and icons with nothing behind them.
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-0 bg-background"
          style={{ height: insets.top }}
        />
      )}
    </>
  );
}
