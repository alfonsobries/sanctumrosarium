import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { defaultSettings, normalizeSettings, type Settings } from './settings';

type SettingsStore = Settings & {
  update: (changes: Partial<Settings>) => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      update: (changes) => set(changes),
    }),
    {
      name: 'settings',
      version: 1,
      storage: createJSONStorage(() => Storage),
      merge: (persisted, current) => ({ ...current, ...normalizeSettings(persisted) }),
      partialize: ({ update: _update, ...settings }) => settings,
    },
  ),
);
