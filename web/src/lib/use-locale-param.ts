'use client';

import { useParams } from 'next/navigation';
import { isAppLocale, type AppLocale } from '@/locales';

export function useLocaleParam(): AppLocale {
  const params = useParams();
  const raw = params?.locale;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isAppLocale(value) ? value : 'en';
}
