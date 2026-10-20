import { View } from 'react-native';

import { Text } from '@/shared/ui/Text';

type SettingsSectionProperties = {
  title?: string;
  footer?: string;
  children: React.ReactNode;
};

/** A group of settings under a small heading, with an optional note below it. */
export function SettingsSection({ title, footer, children }: SettingsSectionProperties) {
  return (
    <View className="gap-2">
      {title !== undefined && (
        <Text variant="eyebrow" className="px-1">
          {title}
        </Text>
      )}
      {children}
      {footer !== undefined && (
        <Text variant="footnote" className="px-1">
          {footer}
        </Text>
      )}
    </View>
  );
}
