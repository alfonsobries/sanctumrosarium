import type { Language, Locale } from '@rosario/content';
import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { setLanguage } from '@/i18n';
import type { KvDriver } from '@/storage/kv';

import {
  formForPrayerLocale,
  languageForLocale,
  resolveInterfaceLanguage,
  resolvePrayerLocale,
  type DeviceLocale,
} from './resolve-locale';
import {
  saveSettings,
  type AppearanceSetting,
  type InterfaceLanguageSetting,
  type PrayerLocaleSetting,
  type Settings,
} from './store';

type SettingsContextValue = {
  readonly settings: Settings;
  readonly interfaceLanguage: 'es' | 'en';
  readonly prayerLocale: Locale;
  readonly prayerLanguage: Language;
  readonly prayerForm: 'roman' | 'es-MX' | 'es-ES';
  readonly setAppearance: (value: AppearanceSetting) => void;
  readonly setInterfaceLanguage: (value: InterfaceLanguageSetting) => void;
  readonly setPrayerLocale: (value: PrayerLocaleSetting) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function deviceLocales(): readonly DeviceLocale[] {
  return getLocales().map((locale) => ({
    languageCode: locale.languageCode,
    regionCode: locale.regionCode,
  }));
}

type SettingsProviderProperties = {
  readonly driver: KvDriver;
  readonly initialSettings: Settings;
  readonly children: React.ReactNode;
};

export function SettingsProvider({
  driver,
  initialSettings,
  children,
}: SettingsProviderProperties) {
  const [settings, setSettings] = useState(initialSettings);

  const update = useCallback(
    (partial: Partial<Settings>) => {
      setSettings((current) => {
        const next = { ...current, ...partial };
        saveSettings(driver, next);
        setLanguage(resolveInterfaceLanguage(next.interfaceLanguage, deviceLocales()));
        return next;
      });
    },
    [driver],
  );

  const value = useMemo<SettingsContextValue>(() => {
    const prayerLocale = resolvePrayerLocale(settings.prayerLocale, deviceLocales());
    return {
      settings,
      interfaceLanguage: resolveInterfaceLanguage(
        settings.interfaceLanguage,
        deviceLocales(),
      ),
      prayerLocale,
      prayerLanguage: languageForLocale(prayerLocale),
      prayerForm: formForPrayerLocale(prayerLocale),
      setAppearance: (appearance) => update({ appearance }),
      setInterfaceLanguage: (interfaceLanguage) => update({ interfaceLanguage }),
      setPrayerLocale: (prayerLocale) => update({ prayerLocale }),
    };
  }, [settings, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return context;
}
