import { useTranslation } from 'react-i18next';
import { setAppLocale } from '@/lib/i18n';
import type { AppLocale } from '@/locales';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n, t } = useTranslation('common');
  const current = (i18n.language?.startsWith('ru') ? 'ru' : 'en') as AppLocale;

  function switchTo(locale: AppLocale) {
    if (locale === current) return;
    setAppLocale(locale);
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 p-0.5 text-xs ${className}`}
      role="group"
      aria-label={t('language')}
    >
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={`rounded-md px-2.5 py-1 font-semibold ${
          current === 'en' ? 'bg-clox-orange text-white' : 'text-slate-300 hover:text-white'
        }`}
      >
        {t('langEn')}
      </button>
      <button
        type="button"
        onClick={() => switchTo('ru')}
        className={`rounded-md px-2.5 py-1 font-semibold ${
          current === 'ru' ? 'bg-clox-orange text-white' : 'text-slate-300 hover:text-white'
        }`}
      >
        {t('langRu')}
      </button>
    </div>
  );
}
