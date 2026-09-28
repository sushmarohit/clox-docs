'use client';

import Link from 'next/link';
import { getHomeCopy } from '@/components/home/copy';
import { HomeFooter } from '@/components/home/home-footer';
import { LanguageSwitcher } from '@/components/language-switcher';
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
  const locale = useLocaleParam();
  const copy = getHomeCopy(locale);

  return (
    <div className="min-h-screen bg-clox-surface text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
        <div className="clox-container flex items-center justify-between gap-4 py-3 sm:gap-5 sm:py-3.5">
          <Link href={`/${locale}`} className="inline-flex shrink-0 items-center" aria-label="CLOX home">
            <img
              src="/brand/logo-clox.webp"
              alt="CLOX"
              className="h-[40px] w-auto object-contain sm:h-[48px] lg:h-[44px] xl:h-[48px] 3xl:h-[52px]"
            />
          </Link>
          <LanguageSwitcher className="text-clox-navy" />
        </div>
      </header>

      <main className="clox-container py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
        <p className="inline-flex rounded-full bg-clox-navy/10 px-3 py-1 text-xs font-semibold text-clox-navy">
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

      <HomeFooter copy={copy} locale={locale} />
    </div>
  );
}
