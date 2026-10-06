import * as AppleAuthentication from 'expo-apple-authentication';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { appJournal } from '@/domains/journal/app-journal';

import type { UserData } from './api.gen';
import { ApiClient } from './client';
import { syncJournal, type CursorStore } from './sync';

const tokenKey = 'api-token';
const cursorKey = 'sync-cursor';

/** Base URL of the API, or null in builds without an account backend. */
export const apiUrl: string | null = process.env.EXPO_PUBLIC_API_URL ?? null;

export const api =
  apiUrl === null ? null : new ApiClient({ baseUrl: apiUrl, token: () => SecureStore.getItemAsync(tokenKey) });

const cursors: CursorStore = {
  get: () => Storage.getItem(cursorKey),
  set: (cursor) => Storage.setItem(cursorKey, cursor),
};

type AccountState = {
  user: UserData | null;
  lastSyncedAt: string | null;
  syncError: boolean;
  syncing: boolean;
  setUser: (user: UserData | null) => void;
};

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      lastSyncedAt: null,
      syncError: false,
      syncing: false,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'account',
      storage: createJSONStorage(() => Storage),
      partialize: ({ user, lastSyncedAt }) => ({ user, lastSyncedAt }),
    },
  ),
);

let running: Promise<void> | null = null;

/** Syncs the journal when signed in; concurrent calls share one run. Never throws. */
export function syncNow(): Promise<void> {
  if (api === null || useAccount.getState().user === null) {
    return Promise.resolve();
  }
  running ??= (async () => {
    useAccount.setState({ syncing: true });
    try {
      await syncJournal(api, await appJournal(), cursors);
      useAccount.setState({ lastSyncedAt: new Date().toISOString(), syncError: false });
    } catch {
      useAccount.setState({ syncError: true });
    } finally {
      useAccount.setState({ syncing: false });
      running = null;
    }
  })();
  return running;
}

export async function signInWithApple(): Promise<void> {
  if (api === null) {
    return;
  }
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  if (credential.identityToken === null) {
    throw new Error('Apple did not return an identity token');
  }
  const name = [credential.fullName?.givenName, credential.fullName?.familyName].filter(Boolean).join(' ');
  const result = await api.signIn(
    'apple',
    credential.identityToken,
    Device.deviceName ?? Device.modelName ?? 'device',
    name === '' ? undefined : name,
  );
  await SecureStore.setItemAsync(tokenKey, result.token);
  await Storage.removeItem(cursorKey);
  useAccount.getState().setUser(result.user);
  await syncNow();
}

async function forget(): Promise<void> {
  await SecureStore.deleteItemAsync(tokenKey);
  await Storage.removeItem(cursorKey);
  useAccount.setState({ user: null, lastSyncedAt: null, syncError: false });
}

export async function signOut(): Promise<void> {
  try {
    await api?.signOut();
  } finally {
    await forget();
  }
}

export async function deleteAccount(): Promise<void> {
  await api?.deleteAccount();
  await forget();
}
