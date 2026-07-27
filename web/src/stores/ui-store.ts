import { create } from 'zustand';
import type { AppLocale } from '@/locales';
import { setAppLocale } from '@/lib/i18n';

type UiState = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

function readLocale(): AppLocale {
  if (typeof localStorage === 'undefined') return 'en';
  const stored = localStorage.getItem('clox-public-locale');
  return stored === 'ru' || stored === 'en' ? stored : 'en';
}

export const useUiStore = create<UiState>((set) => ({
  locale: readLocale(),
  setLocale: (locale) => {
    setAppLocale(locale);
    set({ locale });
  },
}));
