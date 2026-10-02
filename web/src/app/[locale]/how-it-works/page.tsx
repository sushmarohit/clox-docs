import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHomeCopy } from '@/components/home/copy';
import { PublicShell } from '@/components/public-shell';
import { getDictionary, isAppLocale, type AppLocale } from '@/locales';
import { buildHowToJsonLd, buildJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'howItWorks');
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const t = getDictionary(locale);
  const copy = getHomeCopy(locale);
  const jsonLd = buildJsonLd(locale, 'howItWorks');
  const howToLd = buildHowToJsonLd(locale, {
    name: copy.journeyTitle,
    description: t.howItWorksPage.intro,
    steps: copy.steps.map(([name, subtitle, text]) => ({
      name: `${name} — ${subtitle}`,
      text,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
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
            <li className="text-white/90">{t.howItWorksPage.title}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.howItWorksPage.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
            {t.howItWorksPage.intro}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/55">{t.howItWorksPage.subtitle}</p>

          <h2 className="mt-10 text-xl font-bold text-clox-orange sm:text-2xl">
            {copy.journeyTitle}
          </h2>
          <p className="mt-2 text-sm font-medium text-white/70">{copy.journeySub}</p>

          <ol className="mt-8 space-y-8">
            {copy.steps.map(([name, subtitle, text], index) => (
              <li
                key={name}
                id={`step-${index + 1}`}
                className="scroll-mt-28 border-l-2 border-clox-orange/70 pl-5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-clox-orange">
                  {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">{name}</h3>
                <p className="mt-1 text-sm font-medium text-white/70">{subtitle}</p>
                <p className="mt-2 text-base leading-7 text-white/75">{text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/registry`}
              className="clox-btn-primary px-6 py-3 text-sm sm:text-base"
            >
              {t.howItWorksPage.ctaRegistry}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:text-base"
            >
              {t.faqPage.title}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:text-base"
            >
              {t.howItWorksPage.backHome}
            </Link>
          </div>
        </article>
      </PublicShell>
    </>
  );
}
