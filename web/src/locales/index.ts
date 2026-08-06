import enCommon from './en/common.json';
import hiCommon from './hi/common.json';

export const defaultLocale = 'en' as const;
export const supportedLocales = ['en', 'hi'] as const;
export type AppLocale = (typeof supportedLocales)[number];

export { enCommon, hiCommon };

export const LOCALE_STORAGE_KEY = 'clox-public-locale';

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === 'en' || value === 'hi';
}

export function getDictionary(locale: AppLocale) {
  return locale === 'hi' ? hiCommon : enCommon;
}

export type Dictionary = typeof enCommon;
