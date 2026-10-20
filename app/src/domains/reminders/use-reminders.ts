import * as Notifications from 'expo-notifications';
import { useRootNavigationState, useRouter, type Href } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState } from 'react-native';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { useSettings } from '@/domains/settings/use-settings';

import { permissionState, requestPermission, syncReminders, type PermissionState } from './notifications';
import { remindersFor } from './reminders';

const usePermission = create<{ state: PermissionState | null }>(() => ({ state: null }));

function refreshPermission(): void {
  void permissionState().then((state) => usePermission.setState({ state }));
}

/** Asks for permission and lets every screen and the scheduler know the answer. */
export async function askPermission(): Promise<PermissionState> {
  const state = await requestPermission();
  usePermission.setState({ state });
  return state;
}

/** Whether notifications are allowed, read again each time the app comes back to the front. */
export function useNotificationPermission(): PermissionState | null {
  useEffect(() => {
    refreshPermission();
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        refreshPermission();
      }
    });
    return () => subscription.remove();
  }, []);
  return usePermission((store) => store.state);
}

/**
 * Keeps the daily notifications in step with the settings, the language and the
 * permission, and opens the screen a notification points to when it is tapped.
 */
export function useReminders(): void {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const permission = useNotificationPermission();
  const choices = useSettings(
    useShallow((settings) => ({
      rosaryReminder: settings.rosaryReminder,
      rosaryReminderAt: settings.rosaryReminderAt,
      auxilium: settings.auxilium,
      auxiliumReminder: settings.auxiliumReminder,
      auxiliumReminderAt: settings.auxiliumReminderAt,
    })),
  );
  const reminders = remindersFor(choices);
  const key = JSON.stringify(reminders);

  useEffect(() => {
    if (permission === null) {
      return;
    }
    syncReminders(reminders, t).catch((error: unknown) => {
      console.error('Reminders failed to schedule', error);
    });
    // The key stands for the reminders' content; t changes with the language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, permission, i18n.language]);

  const response = Notifications.useLastNotificationResponse();
  // A tap can relaunch the app; navigating before the root navigator exists is lost.
  const navigationReady = useRootNavigationState()?.key !== undefined;
  useEffect(() => {
    const url: unknown = response?.notification.request.content.data?.url;
    if (
      !navigationReady ||
      response?.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER ||
      typeof url !== 'string'
    ) {
      return;
    }
    Notifications.clearLastNotificationResponse();
    router.navigate(url as Href);
  }, [response, router, navigationReady]);
}
