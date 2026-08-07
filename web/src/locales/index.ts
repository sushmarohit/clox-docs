import enCommon from './en/common.json';
import hiCommon from './hi/common.json';
import paCommon from './pa/common.json';

export const defaultLocale = 'en' as const;
export const supportedLocales = ['en', 'hi', 'pa'] as const;
export type AppLocale = (typeof supportedLocales)[number];

export { enCommon, hiCommon, paCommon };

export const LOCALE_STORAGE_KEY = 'clox-public-locale';

const dictionaries = {
  en: enCommon,
  hi: hiCommon,
  pa: paCommon,
} as const;

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (supportedLocales as readonly string[]).includes(value);
}

export function getDictionary(locale: AppLocale) {
  return dictionaries[locale];
}

/** Map i18n language tag (e.g. pa-IN) to a lead-submission locale. */
export function resolveLeadLocale(language: string | undefined | null): AppLocale {
  if (language?.startsWith('hi')) return 'hi';
  if (language?.startsWith('pa')) return 'pa';
  return 'en';
}

export type Dictionary = typeof enCommon;
