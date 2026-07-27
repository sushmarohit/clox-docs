import enCommon from './en/common.json';
import ruCommon from './ru/common.json';

export const defaultLocale = 'en' as const;
export const supportedLocales = ['en', 'ru'] as const;
export type AppLocale = (typeof supportedLocales)[number];

export { enCommon, ruCommon };

export const LOCALE_STORAGE_KEY = 'clox-admin-locale';
