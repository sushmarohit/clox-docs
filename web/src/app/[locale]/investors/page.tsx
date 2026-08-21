import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InvestorsPage } from '@/components/investors-form';
import { isAppLocale, type AppLocale } from '@/locales';
import { buildJsonLd, buildPageMetadata } from '@/lib/seo';

/** Flip to true to publish the Investor Portal on the public site again. */
const INVESTORS_PUBLIC = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  if (!INVESTORS_PUBLIC) return { robots: { index: false, follow: false } };
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'investors');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!INVESTORS_PUBLIC) notFound();

  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const jsonLd = buildJsonLd(locale, 'investors');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvestorsPage />
    </>
  );
}
