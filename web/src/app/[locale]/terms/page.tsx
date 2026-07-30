import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPage } from '@/components/legal-page';
import { getDictionary, isAppLocale, type AppLocale } from '@/locales';
import { buildJsonLd, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  return buildPageMetadata(locale, 'terms');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const t = getDictionary(locale);
  const jsonLd = buildJsonLd(locale, 'terms');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPage
        title={t.terms}
        sections={[
          {
            heading: t.legal.terms.submissionsHeading,
            body: t.legal.terms.submissionsBody,
          },
          {
            heading: t.legal.terms.accuracyHeading,
            body: t.legal.terms.accuracyBody,
          },
          {
            heading: t.legal.terms.confidentialityHeading,
            body: t.legal.terms.confidentialityBody,
          },
        ]}
      />
    </>
  );
}
