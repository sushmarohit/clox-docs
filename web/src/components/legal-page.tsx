'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useLocaleParam } from '@/lib/use-locale-param';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export function LegalPage({
  title,
  phase,
  meta,
  intro,
  sections,
}: {
  title: string;
  phase: string;
  meta: string;
  intro: string;
  sections: LegalSection[];
}) {
  const { t } = useTranslation('common');
  const locale = useLocaleParam();

  return (
    <main className="min-h-screen bg-clox-surface px-6 py-16 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-3xl lg:max-w-4xl">
        <Link href={`/${locale}`} className="text-sm font-semibold text-clox-orange">
          {t('legal.back')}
        </Link>
        <p className="mt-4 inline-flex rounded-full bg-clox-navy/10 px-3 py-1 text-xs font-semibold text-clox-navy">
          {phase}
        </p>
        <h1 className="mt-4 text-3xl font-bold text-clox-navy sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">{meta}</p>
        <p className="mt-6 max-w-3xl leading-7 text-slate-600 sm:leading-8">{intro}</p>
        <div className="mt-10 space-y-8 text-slate-600 sm:space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-clox-navy sm:text-xl">
                {section.heading}
              </h2>
              <div className="mt-2 max-w-3xl space-y-3 leading-7 sm:text-base sm:leading-8">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
