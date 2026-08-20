import i18next, { changeLanguage, use as addPlugin } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './messages/en';
import { es } from './messages/es';

export const resources = {
  es: { translation: es },
  en: { translation: en },
} as const;

export function initI18n(language: 'es' | 'en'): void {
  if (i18next.isInitialized) {
    return;
  }
  void addPlugin(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export function setLanguage(language: 'es' | 'en'): void {
  if (i18next.language !== language) {
    void changeLanguage(language);
  }
}
