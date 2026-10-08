import { Text as NativeText, type TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useSkin } from '@/shared/theme/SkinProvider';

type Variant = 'display' | 'title' | 'headline' | 'body' | 'callout' | 'footnote' | 'caption' | 'eyebrow';

/** Size and line height of each variant, so a skin can scale them together. */
const metrics: Record<Variant, { size: number; line: number }> = {
  display: { size: 34, line: 40 },
  title: { size: 26, line: 32 },
  headline: { size: 17, line: 22 },
  body: { size: 17, line: 24 },
  callout: { size: 16, line: 21 },
  footnote: { size: 13, line: 18 },
  caption: { size: 12, line: 16 },
  eyebrow: { size: 12, line: 16 },
};

const variants: Record<Variant, string> = {
  display: 'font-display text-[34px] leading-[40px] text-foreground',
  title: 'font-display text-[26px] leading-[32px] text-foreground',
  headline: 'font-ui text-[17px] leading-[22px] font-semibold text-foreground',
  body: 'font-ui text-[17px] leading-[24px] text-foreground',
  callout: 'font-ui text-[16px] leading-[21px] text-foreground',
  footnote: 'font-ui text-[13px] leading-[18px] text-muted',
  caption: 'font-ui text-[12px] leading-[16px] text-muted',
  eyebrow: 'font-ui text-[12px] leading-[16px] font-semibold uppercase tracking-[1.2px] text-muted',
};

export type TextProperties = TextProps & { variant?: Variant };

/** The size a class asks for (`text-[11px]`, `leading-[15px]`), so a skin scales that one and not the variant's. */
function sizeIn(className: string | undefined, prefix: 'text' | 'leading'): number | undefined {
  const match = className?.match(new RegExp(`(?:^|\\s)${prefix}-\\[(\\d+(?:\\.\\d+)?)px\\]`));
  return match?.[1] === undefined ? undefined : Number(match[1]);
}

export function Text({ variant = 'body', className, style, ...rest }: TextProperties) {
  const scale = useSkin().skin.textScale ?? 1;
  let scaled: { fontSize: number; lineHeight?: number } | undefined;
  if (scale !== 1) {
    const size = sizeIn(className, 'text');
    const line = sizeIn(className, 'leading');
    scaled =
      size === undefined
        ? { fontSize: metrics[variant].size * scale, lineHeight: (line ?? metrics[variant].line) * scale }
        : { fontSize: size * scale, ...(line === undefined ? {} : { lineHeight: line * scale }) };
  }
  return <NativeText className={twMerge(variants[variant], className)} style={[scaled, style]} {...rest} />;
}
