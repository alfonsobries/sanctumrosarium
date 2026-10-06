import { Switch, View } from 'react-native';

import { useSkin } from '@/shared/theme/SkinProvider';

import { Text } from './Text';

type SwitchRowProperties = {
  title: string;
  detail?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function SwitchRow({ title, detail, value, onChange }: SwitchRowProperties) {
  const { colors } = useSkin();
  return (
    <View className="min-h-[52px] flex-row items-center gap-3 px-4 py-3">
      <View className="flex-1 gap-0.5">
        <Text variant="callout">{title}</Text>
        {detail !== undefined && <Text variant="footnote">{detail}</Text>}
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.accent, false: colors.border }}
        thumbColor={process.env.EXPO_OS === 'android' ? colors['surface-raised'] : undefined}
      />
    </View>
  );
}
