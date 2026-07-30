import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EoiPage } from '@/components/eoi-form';
import { isAppLocale, type AppLocale } from '@/locales';
import { buildJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'eoi');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const jsonLd = buildJsonLd(locale, 'eoi');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EoiPage />
    </>
  );
}
