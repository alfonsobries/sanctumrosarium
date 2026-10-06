import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { useInvalidateJournal } from '@/domains/journal/queries';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Card } from '@/shared/ui/Card';
import { Row } from '@/shared/ui/Row';
import { Text } from '@/shared/ui/Text';

import { apiUrl, deleteAccount, signInWithApple, signOut, syncNow, useAccount } from './account';

/** Optional account: shown only in builds that point at an API. */
export function AccountSection() {
  const { t, i18n } = useTranslation();
  const { scheme } = useSkin();
  const user = useAccount((state) => state.user);
  const lastSyncedAt = useAccount((state) => state.lastSyncedAt);
  const syncError = useAccount((state) => state.syncError);
  const syncing = useAccount((state) => state.syncing);
  const invalidate = useInvalidateJournal();
  const [failed, setFailed] = useState(false);

  if (apiUrl === null) {
    return null;
  }

  async function handleApple() {
    setFailed(false);
    try {
      await signInWithApple();
      await invalidate();
    } catch (error) {
      if ((error as { code?: string }).code !== 'ERR_REQUEST_CANCELED') {
        setFailed(true);
      }
    }
  }

  function handleDelete() {
    Alert.alert(t('settings.deleteAccount'), t('settings.deleteAccountDetail'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.deleteAccount'), style: 'destructive', onPress: () => void deleteAccount() },
    ]);
  }

  const when =
    lastSyncedAt === null
      ? null
      : new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(lastSyncedAt),
        );

  return (
    <View className="gap-2">
      <Text variant="eyebrow" className="px-1">
        {t('settings.account')}
      </Text>
      {user === null ? (
        <View className="gap-3">
          <Text variant="footnote" className="px-1">
            {t('settings.accountDetail')}
          </Text>
          {process.env.EXPO_OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={
                scheme === 'dark'
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={999}
              style={{ height: 52 }}
              onPress={() => void handleApple()}
            />
          )}
          {failed && (
            <Text variant="footnote" className="px-1 text-rubric">
              {t('common.error')}
            </Text>
          )}
        </View>
      ) : (
        <Card>
          <Row
            title={user.name ?? user.email ?? t('settings.signedInAs')}
            detail={
              syncError
                ? t('settings.syncError')
                : when === null
                  ? undefined
                  : t('settings.syncedAt', { when })
            }
            chevron={false}
          />
          <Row
            title={t('settings.syncNow')}
            chevron={false}
            disabled={syncing}
            onPress={() => void syncNow().then(invalidate)}
          />
          <Row title={t('settings.signOut')} chevron={false} onPress={() => void signOut()} />
          <Row title={t('settings.deleteAccount')} chevron={false} onPress={handleDelete} />
        </Card>
      )}
    </View>
  );
}
