import enCommon from './en/common.json';
import ruCommon from './ru/common.json';

export const defaultLocale = 'en' as const;
export const supportedLocales = ['en', 'ru'] as const;
export type AppLocale = (typeof supportedLocales)[number];

export { enCommon, ruCommon };

export const LOCALE_STORAGE_KEY = 'clox-public-locale';

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === 'en' || value === 'ru';
}

export function getDictionary(locale: AppLocale) {
  return locale === 'ru' ? ruCommon : enCommon;
}

export type Dictionary = typeof enCommon;
