import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { useSkin } from '@/shared/theme/SkinProvider';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useSkin();
  const android = process.env.EXPO_OS === 'android';

  return (
    <NativeTabs
      tintColor={colors.accent}
      {...(android
        ? {
            backgroundColor: colors.surface,
            indicatorColor: colors['surface-raised'],
            labelStyle: { selected: { color: colors.foreground } },
          }
        : {})}
    >
      <NativeTabs.Trigger name="(pray)">
        <NativeTabs.Trigger.Label>{t('tabs.pray')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/pray.png')} renderingMode="template" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="learn">
        <NativeTabs.Trigger.Label>{t('tabs.learn')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/learn.png')} renderingMode="template" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journal">
        <NativeTabs.Trigger.Label>{t('tabs.journal')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/journal.png')} renderingMode="template" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
