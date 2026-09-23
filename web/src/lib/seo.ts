import type { Metadata } from 'next';
import type { AppLocale } from '@/locales';
import { getDictionary, supportedLocales } from '@/locales';
import { getAppName, getSiteUrl } from '@/lib/env';

const routeMeta: Record<
  string,
  { titleKey: string; descriptionKey: string; path: string }
> = {
  home: { titleKey: 'brand', descriptionKey: 'tagline', path: '' },
  registry: {
    titleKey: 'registry.title',
    descriptionKey: 'registry.subtitle',
    path: '/registry',
  },
  eoi: {
    titleKey: 'eoi.title',
    descriptionKey: 'eoi.subtitle',
    path: '/partner/eoi',
  },
  investors: {
    titleKey: 'investors.title',
    descriptionKey: 'investors.subtitle',
    path: '/investors',
  },
  privacy: {
    titleKey: 'privacy',
    descriptionKey: 'legal.privacy.description',
    path: '/privacy',
  },
  terms: {
    titleKey: 'terms',
    descriptionKey: 'legal.terms.description',
    path: '/terms',
  },
};

const ogLocaleMap: Record<AppLocale, string> = {
  en: 'en_AU',
  hi: 'hi_IN',
  pa: 'pa_IN',
};

function readNested(dict: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : path;
}

function languageAlternates(siteUrl: string, path: string) {
  const languages: Record<string, string> = {
    'x-default': `${siteUrl}/en${path}`,
  };
  for (const locale of supportedLocales) {
    languages[locale] = `${siteUrl}/${locale}${path}`;
  }
  return languages;
}

export function buildPageMetadata(
  locale: AppLocale,
  route: keyof typeof routeMeta,
): Metadata {
  const dict = getDictionary(locale) as unknown as Record<string, unknown>;
  const meta = routeMeta[route];
  const appName = getAppName();
  const title =
    route === 'home'
      ? `${appName} — ${readNested(dict, 'tagline')}`
      : `${readNested(dict, meta.titleKey)} | ${appName}`;
  const description = readNested(dict, meta.descriptionKey);
  const siteUrl = getSiteUrl();
  const canonicalPath = `/${locale}${meta.path}`;
  const url = `${siteUrl}${canonicalPath}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(siteUrl, meta.path),
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[locale],
      alternateLocale: supportedLocales
        .filter((item) => item !== locale)
        .map((item) => ogLocaleMap[item]),
      url,
      siteName: appName,
      title,
      description,
      images: [
        {
          url: `${siteUrl}/brand/og-share.webp`,
          width: 1200,
          height: 630,
          alt: appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/brand/og-share.webp`],
    },
    robots:
      route === 'eoi'
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}

export function buildJsonLd(locale: AppLocale, route: keyof typeof routeMeta) {
  const dict = getDictionary(locale) as unknown as Record<string, unknown>;
  const meta = routeMeta[route];
  const siteUrl = getSiteUrl();
  const appName = getAppName();
  const path = `/${locale}${meta.path}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: appName,
        legalName: 'Achieve Global Enterprises Pty Ltd',
        alternateName: 'CLOX Freight Forwarding',
        url: siteUrl,
        logo: `${siteUrl}/brand/logo-clox.webp`,
        description: readNested(dict, 'tagline'),
        foundingLocation: {
          '@type': 'Place',
          name: 'Victoria, Australia',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '18 Solferino Rd',
          addressLocality: 'Clyde North',
          addressRegion: 'VIC',
          postalCode: '3978',
          addressCountry: 'AU',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@clox.com.au',
            availableLanguage: ['en', 'hi', 'pa'],
          },
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
        },
        knowsAbout: [
          'full-load freight',
          'freight marketplace',
          'Protected Upfront Payments',
          'carrier verification',
          'vehicle load matching',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: appName,
        url: siteUrl,
        inLanguage: ['en', 'hi', 'pa'],
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}${path}#webpage`,
        name: readNested(dict, meta.titleKey),
        description: readNested(dict, meta.descriptionKey),
        url: `${siteUrl}${path}`,
        inLanguage: locale,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };
}

/** FAQPage graph for homepage GEO/AEO answer engines. */
export function buildFaqJsonLd(faqs: readonly (readonly [string, string])[]) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/en#faq`,
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}
