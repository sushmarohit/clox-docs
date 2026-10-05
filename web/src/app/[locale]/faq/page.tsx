import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaqAccordion } from '@/components/faq-accordion';
import { getHomeCopy } from '@/components/home/copy';
import { PublicShell } from '@/components/public-shell';
import { getDictionary, isAppLocale, type AppLocale } from '@/locales';
import { buildFaqJsonLd, buildJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'faq');
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const t = getDictionary(locale);
  const copy = getHomeCopy(locale);
  const jsonLd = buildJsonLd(locale, 'faq');
  const faqLd = buildFaqJsonLd(locale, copy.faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PublicShell>
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${locale}`} className="hover:text-clox-orange hover:underline">
                CLOX
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-white/90">{t.faqPage.title}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.faqPage.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{t.faqPage.intro}</p>
          <p className="mt-3 text-sm leading-6 text-white/55">{t.faqPage.subtitle}</p>

          <div className="mt-10">
            <FaqAccordion items={copy.faq} headingLevel="h2" />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/registry`}
              className="clox-btn-primary px-6 py-3 text-sm sm:text-base"
            >
              {t.faqPage.ctaRegistry}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:text-base"
            >
              {t.faqPage.backHome}
            </Link>
          </div>
        </article>
      </PublicShell>
    </>
  );
}
