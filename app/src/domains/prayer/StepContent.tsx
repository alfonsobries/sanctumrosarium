import {
  bookOf,
  hasPrayerText,
  litany,
  mysteryTitle,
  passage,
  prayerText,
  prayerTitle,
  type Locale,
} from '@sanctamaria/content';
import { evangelistOf, type Step } from '@sanctamaria/rosary';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';

import { ArtworkFrame } from '@/domains/artwork/ArtworkFrame';
import { useArtwork } from '@/domains/artwork/use-artwork';

import type { Settings } from '@/domains/settings/settings';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Text } from '@/shared/ui/Text';

const sizes: Record<Settings['textSize'], { size: number; line: number }> = {
  regular: { size: 22, line: 32 },
  large: { size: 26, line: 37 },
  larger: { size: 31, line: 43 },
};

type StepContentProperties = {
  step: Step;
  locale: Locale;
  textSize: Settings['textSize'];
};

type PrayerLinesProperties = {
  id: string;
  locale: Locale;
  textSize: Settings['textSize'];
};

/** A prayer line by line; the part the others answer is set apart in italics. */
function PrayerLines({ id, locale, textSize }: PrayerLinesProperties) {
  const { skin } = useSkin();
  const text = prayerText(id, locale);
  const { size, line } = sizes[textSize];
  const split = text.responseFrom ?? text.lines.length;
  const firstLetter = text.lines[0]?.charAt(0) ?? '';

  return (
    <View className="gap-1">
      {text.lines.map((value, index) => {
        const isResponse = index >= split;
        const dropCap = skin.dropCap && index === 0 && firstLetter !== '';
        return (
          <Text
            key={index}
            className={isResponse ? 'font-prayer-italic text-muted' : 'font-prayer text-foreground'}
            style={{ fontSize: size, lineHeight: line }}
          >
            {dropCap && (
              <Text className="font-display text-rubric" style={{ fontSize: size * 1.6, lineHeight: line }}>
                {firstLetter}
              </Text>
            )}
            {dropCap ? value.slice(1) : value}
          </Text>
        );
      })}
    </View>
  );
}

/** The body of the current step: the prayer's words, the mystery, the reading or the litany. */
export function StepContent({ step, locale, textSize }: StepContentProperties) {
  const { t } = useTranslation();
  const announceArtwork = useArtwork(step.kind === 'announce' ? step.mystery.id : '');
  const { width, height } = useWindowDimensions();
  const { size, line } = sizes[textSize];

  if (step.kind === 'announce') {
    const artwork = announceArtwork;
    return (
      <View className="items-center gap-6">
        {artwork !== null && (
          <ArtworkFrame
            artwork={artwork}
            style={{ width: '100%', height: Math.min(width * 1.1, height * 0.46) }}
          />
        )}
        <Text
          className="text-center font-prayer text-foreground"
          style={{ fontSize: size + 4, lineHeight: line + 4 }}
        >
          {mysteryTitle(step.mystery.id, locale)}
        </Text>
      </View>
    );
  }

  if (step.kind === 'reading') {
    const text = passage(step.reading.ref, locale);
    const evangelist = evangelistOf(step.reading);
    return (
      <View className="gap-4">
        <Text variant="eyebrow" className="text-rubric">
          {evangelist === null
            ? (text?.displayRef ?? step.reading.ref)
            : `${t('pray.readingFrom', { evangelist: t(`evangelists.${evangelist}`) })} · ${text?.displayRef ?? step.reading.ref}`}
        </Text>
        <Text className="font-prayer text-foreground" style={{ fontSize: size - 2, lineHeight: line - 2 }}>
          {text?.text ?? bookOf(step.reading.ref)}
        </Text>
      </View>
    );
  }

  if (step.prayer === 'litany-of-loreto') {
    const { pairs } = litany(locale);
    return (
      <View className="gap-2">
        {pairs.map((pair, index) => (
          <Text
            key={index}
            className="font-prayer text-foreground"
            style={{ fontSize: size - 3, lineHeight: line - 4 }}
          >
            {pair.call} <Text className="font-prayer-italic text-muted">{pair.response}</Text>
          </Text>
        ))}
      </View>
    );
  }

  if (!hasPrayerText(step.prayer, locale)) {
    return null;
  }

  return <PrayerLines id={step.prayer} locale={locale} textSize={textSize} />;
}

/** Heading over the step: which prayer, and the count for the Hail Marys. */
export function stepHeading(
  step: Step,
  locale: Locale,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  if (step.kind === 'announce') {
    return t('pray.mystery', {
      ordinal: t(`ordinal.${step.mystery.order - 1}`),
      set: t(`setAdjective.${step.mystery.set}`),
    });
  }
  if (step.kind === 'reading') {
    return t('pray.reading');
  }
  const title =
    step.intention === 'pope'
      ? `${t('pray.forThePope')} · ${prayerTitle(step.prayer, locale)}`
      : prayerTitle(step.prayer, locale);
  return step.count === null ? title : `${title} · ${t('pray.hailMaryCount', step.count)}`;
}
