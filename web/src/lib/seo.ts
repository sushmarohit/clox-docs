import type { Metadata } from 'next';
import type { AppLocale } from '@/locales';
import { getDictionary } from '@/locales';
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
    descriptionKey: 'legal.privacy.purposeBody',
    path: '/privacy',
  },
  terms: {
    titleKey: 'terms',
    descriptionKey: 'legal.terms.submissionsBody',
    path: '/terms',
  },
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
  const alternateLocale = locale === 'en' ? 'hi' : 'en';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${meta.path}`,
        hi: `${siteUrl}/hi${meta.path}`,
        'x-default': `${siteUrl}/en${meta.path}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'hi' ? 'hi_IN' : 'en_AU',
      alternateLocale: [alternateLocale === 'hi' ? 'hi_IN' : 'en_AU'],
      url,
      siteName: appName,
      title,
      description,
      images: [
        {
          url: `${siteUrl}/icons/icon-512.png`,
          width: 512,
          height: 512,
          alt: appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/icons/icon-512.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
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
        name: appName,
        url: siteUrl,
        logo: `${siteUrl}/brand/clox_updated_logo.png`,
        description: readNested(dict, 'tagline'),
      },
      {
        '@type': 'WebSite',
        name: appName,
        url: siteUrl,
        inLanguage: locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/${locale}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        name: readNested(dict, meta.titleKey),
        description: readNested(dict, meta.descriptionKey),
        url: `${siteUrl}${path}`,
        inLanguage: locale,
        isPartOf: { '@type': 'WebSite', url: siteUrl },
      },
    ],
  };
}
