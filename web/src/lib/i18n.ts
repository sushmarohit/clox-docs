import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  defaultLocale,
  enCommon,
  LOCALE_STORAGE_KEY,
  ruCommon,
  type AppLocale,
} from '@/locales';

export function createAppI18n(locale: AppLocale) {
  const instance = i18n.createInstance();
  void instance.use(initReactI18next).init({
    lng: locale,
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
  return instance;
}

export function persistLocale(locale: AppLocale) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
