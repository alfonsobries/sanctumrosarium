import type { FormId, Language, Locale, PrayerId } from '@rosario/content';
import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { setLanguage } from '@/i18n';
import type { KvDriver } from '@/storage/kv';

import { effectiveForm, optionalPrayersOf } from '@/features/rosary/forms';
import { forms } from '@rosario/content';

import {
  languageForLocale,
  resolveInterfaceLanguage,
  resolvePrayerLocale,
  type DeviceLocale,
} from './resolve-locale';
import {
  saveSettings,
  type AppearanceSetting,
  type InterfaceLanguageSetting,
  type PrayerFormSetting,
  type PrayerLocaleSetting,
  type Settings,
} from './store';

type SettingsContextValue = {
  readonly settings: Settings;
  readonly interfaceLanguage: 'es' | 'en';
  readonly prayerLocale: Locale;
  readonly prayerLanguage: Language;
  readonly prayerForm: FormId;
  readonly setAppearance: (value: AppearanceSetting) => void;
  readonly setInterfaceLanguage: (value: InterfaceLanguageSetting) => void;
  readonly setPrayerLocale: (value: PrayerLocaleSetting) => void;
  readonly setPrayerForm: (value: PrayerFormSetting) => void;
  readonly toggleIncludedPrayer: (prayer: PrayerId) => void;
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
      prayerForm: effectiveForm(settings.prayerForm, prayerLocale),
      setAppearance: (appearance) => update({ appearance }),
      setInterfaceLanguage: (interfaceLanguage) => update({ interfaceLanguage }),
      setPrayerLocale: (value) => update({ prayerLocale: value }),
      // Choosing a form arranges every optional switch at once (its regional custom);
      // each one can still be toggled afterwards.
      setPrayerForm: (value) =>
        update({
          prayerForm: value,
          includedPrayers: value === 'auto' ? [] : optionalPrayersOf(forms[value]),
        }),
      toggleIncludedPrayer: (prayer) =>
        update({
          includedPrayers: settings.includedPrayers.includes(prayer)
            ? settings.includedPrayers.filter((id) => id !== prayer)
            : [...settings.includedPrayers, prayer],
        }),
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
