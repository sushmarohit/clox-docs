import type { AppLocale } from '@/locales';
import { homeCopyEn } from './en';
import { homeCopyHi } from './hi';
import { homeCopyPa } from './pa';

export const homeCopy = {
  en: homeCopyEn,
  hi: homeCopyHi,
  pa: homeCopyPa,
} as const;

export type HomeCopy = (typeof homeCopy)[AppLocale];

export function getHomeCopy(locale: AppLocale): HomeCopy {
  return homeCopy[locale];
}
