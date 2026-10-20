import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';

import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

/** Shown when a reminder is on but the system blocks notifications: the way back is Settings. */
export function PermissionNotice() {
  const { t } = useTranslation();
  return (
    <View className="gap-2 px-4 py-3">
      <Text variant="footnote" className="text-accent">
        {t('reminders.denied')}
      </Text>
      <Button
        variant="secondary"
        label={t('reminders.openSettings')}
        onPress={() => void Linking.openSettings()}
      />
    </View>
  );
}
