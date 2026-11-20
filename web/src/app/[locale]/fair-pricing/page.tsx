import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { getDictionary, isAppLocale, type AppLocale } from '@/locales';
import { buildJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'fairPricing');
}

/**
 * IT §7.3 — public pricing principles only.
 * Exact engine floors stay private; Commercial “typical range” bands TBD.
 */
export default async function FairPricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const t = getDictionary(locale);
  const page = t.fairPricingPage;
  const jsonLd = buildJsonLd(locale, 'fairPricing');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <li className="text-white/90">{page.title}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clox-orange">
            CLOX
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {page.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{page.intro}</p>

          <ul className="mt-10 space-y-6">
            {page.principles.map((item) => (
              <li key={item.title}>
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/70 sm:text-base">{item.body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 rounded-lg border border-white/15 bg-white/5 p-4 text-sm leading-6 text-white/65">
            {page.commercialNote}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/registry`}
              className="clox-btn-primary px-6 py-3 text-sm sm:text-base"
            >
              {page.ctaRegistry}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:text-base"
            >
              {page.ctaFaq}
            </Link>
          </div>
        </article>
      </PublicShell>
    </>
  );
}
