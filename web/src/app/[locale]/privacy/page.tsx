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
  return buildPageMetadata(locale, 'privacy');
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
  const jsonLd = buildJsonLd(locale, 'privacy');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPage
        title={t.privacy}
        sections={[
          { heading: t.legal.privacy.whoHeading, body: t.legal.privacy.whoBody },
          { heading: t.legal.privacy.whatHeading, body: t.legal.privacy.whatBody },
          {
            heading: t.legal.privacy.purposeHeading,
            body: t.legal.privacy.purposeBody,
          },
          {
            heading: t.legal.privacy.contactHeading,
            body: t.legal.privacy.contactBody,
          },
        ]}
      />
    </>
  );
}
