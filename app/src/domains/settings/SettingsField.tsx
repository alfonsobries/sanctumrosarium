import { View } from 'react-native';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon, type IconName } from '@/shared/ui/Icon';
import { Text } from '@/shared/ui/Text';

type SettingsFieldProperties = {
  label: string;
  icon: IconName;
  hint?: string;
  children: React.ReactNode;
};

/** A labelled setting whose control sits under its name, like a segmented choice. */
export function SettingsField({ label, icon, hint, children }: SettingsFieldProperties) {
  const { colors } = useSkin();
  return (
    <View className="gap-2 px-4 py-3">
      <View className="flex-row items-center gap-3">
        <Icon name={icon} size={20} color={colors.accent} />
        <Text variant="callout">{label}</Text>
      </View>
      {children}
      {hint !== undefined && <Text variant="footnote">{hint}</Text>}
    </View>
  );
}
