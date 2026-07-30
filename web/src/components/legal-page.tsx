'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useLocaleParam } from '@/lib/use-locale-param';

export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; body: string }[];
}) {
  const { t } = useTranslation('common');
  const locale = useLocaleParam();

  return (
    <main className="min-h-screen bg-clox-surface px-6 py-16 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-3xl lg:max-w-4xl">
        <Link href={`/${locale}`} className="text-sm font-semibold text-clox-orange">
          {t('legal.back')}
        </Link>
        <p className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {t('draftLegal')}
        </p>
        <h1 className="mt-4 text-3xl font-bold text-clox-navy sm:text-4xl">{title}</h1>
        <div className="mt-8 space-y-8 text-slate-600 sm:space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-clox-navy sm:text-xl">{section.heading}</h2>
              <p className="mt-2 max-w-3xl leading-7 sm:text-base sm:leading-8">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
