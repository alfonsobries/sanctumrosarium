import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/es';

import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './messages/en';
import { es } from './messages/es';

export type InterfaceLanguage = 'es' | 'en';

export function deviceLanguage(): InterfaceLanguage {
  return getLocales()[0]?.languageCode === 'en' ? 'en' : 'es';
}

void i18next.use(initReactI18next).init({
  lng: deviceLanguage(),
  fallbackLng: false,
  resources: { es: { translation: es }, en: { translation: en } },
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18next };
