import { Text as NativeText, type TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

type Variant = 'display' | 'title' | 'headline' | 'body' | 'callout' | 'footnote' | 'caption' | 'eyebrow';

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

export function Text({ variant = 'body', className, ...rest }: TextProperties) {
  return <NativeText className={twMerge(variants[variant], className)} {...rest} />;
}
