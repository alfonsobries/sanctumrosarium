import { Pressable, View, type PressableProps } from 'react-native';

import { useSkin } from '@/shared/theme/SkinProvider';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type RowProperties = Omit<PressableProps, 'children'> & {
  title: string;
  detail?: string;
  value?: string;
  icon?: IconName;
  chevron?: boolean;
};

export function Row({ title, detail, value, icon, chevron = true, ...rest }: RowProperties) {
  const { colors } = useSkin();
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[52px] flex-row items-center gap-3 px-4 py-3 active:bg-surface"
      android_ripple={{ color: colors.border }}
      {...rest}
    >
      {icon !== undefined && <Icon name={icon} color={colors.accent} />}
      <View className="flex-1 gap-0.5">
        <Text variant="callout">{title}</Text>
        {detail !== undefined && <Text variant="footnote">{detail}</Text>}
      </View>
      {value !== undefined && <Text variant="callout" className="text-muted">{value}</Text>}
      {chevron && <Icon name="chevron" size={13} weight="semibold" color={colors.faint} />}
    </Pressable>
  );
}
