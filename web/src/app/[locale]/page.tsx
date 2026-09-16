import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomePage } from '@/components/home-page';
import { getHomeCopy } from '@/components/home/copy';
import { isAppLocale, type AppLocale } from '@/locales';
import { buildFaqJsonLd, buildJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'home');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const copy = getHomeCopy(locale);
  const jsonLd = buildJsonLd(locale, 'home');
  const faqLd = buildFaqJsonLd(copy.faq);

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
      <HomePage />
    </>
  );
}
