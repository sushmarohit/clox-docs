import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  defaultLocale,
  enCommon,
  LOCALE_STORAGE_KEY,
  ruCommon,
  type AppLocale,
} from '@/locales';

function readStoredLocale(): AppLocale {
  if (typeof localStorage === 'undefined') return defaultLocale;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'ru' || stored === 'en' ? stored : defaultLocale;
}

const initialLocale =
  (import.meta.env.VITE_DEFAULT_LOCALE as AppLocale | undefined) || readStoredLocale();

void i18n.use(initReactI18next).init({
  lng: initialLocale,
  fallbackLng: defaultLocale,
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    en: { common: enCommon },
    ru: { common: ruCommon },
  },
  interpolation: {
    escapeValue: false,
  },
});

export function setAppLocale(locale: AppLocale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  void i18n.changeLanguage(locale);
}

export { i18n };
