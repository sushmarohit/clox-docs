import type { Metadata } from 'next';
import type { AppLocale } from '@/locales';
import { getDictionary, supportedLocales } from '@/locales';
import { getAppName, getSiteUrl } from '@/lib/env';

export const LINKEDIN_ORG_URL =
  'https://www.linkedin.com/company/clox-freight-forwarding/';

export const ORG = {
  legalName: 'Achieve Global Enterprises Pty Ltd',
  alternateName: 'CLOX Freight Forwarding',
  abn: '48 626 269 387',
  email: 'info@clox.com.au',
  streetAddress: '18 Solferino Rd',
  addressLocality: 'Clyde North',
  addressRegion: 'VIC',
  postalCode: '3978',
  addressCountry: 'AU',
  /** Clyde North, VIC approximate geo for LocalBusiness / GEO signals */
  latitude: -38.1102,
  longitude: 145.3426,
} as const;

const routeMeta: Record<
  string,
  { titleKey: string; descriptionKey: string; path: string }
> = {
  home: { titleKey: 'brand', descriptionKey: 'seo.homeDescription', path: '' },
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
  faq: {
    titleKey: 'faqPage.title',
    descriptionKey: 'faqPage.subtitle',
    path: '/faq',
  },
  howItWorks: {
    titleKey: 'howItWorksPage.title',
    descriptionKey: 'howItWorksPage.subtitle',
    path: '/how-it-works',
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

function organizationNode(siteUrl: string, appName: string, description: string) {
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: appName,
    legalName: ORG.legalName,
    alternateName: ORG.alternateName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/brand/logo-clox.webp`,
      width: 512,
      height: 512,
    },
    image: `${siteUrl}/brand/og-share.webp`,
    description,
    foundingLocation: {
      '@type': 'Place',
      name: 'Victoria, Australia',
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'ABN',
      value: ORG.abn,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.streetAddress,
      addressLocality: ORG.addressLocality,
      addressRegion: ORG.addressRegion,
      postalCode: ORG.postalCode,
      addressCountry: ORG.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ORG.latitude,
      longitude: ORG.longitude,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: ORG.email,
        availableLanguage: ['en', 'hi', 'pa', 'English', 'Hindi', 'Punjabi'],
        areaServed: 'AU',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Australia',
    },
    sameAs: [LINKEDIN_ORG_URL],
    knowsAbout: [
      'full-load freight',
      'full truckload freight marketplace',
      'Australian freight forwarding',
      'Protected Upfront Payments',
      'carrier verification',
      'vehicle load matching',
      'Melbourne Sydney freight corridor',
    ],
  };
}

function serviceNode(siteUrl: string, appName: string, description: string) {
  return {
    '@type': 'Service',
    '@id': `${siteUrl}/#service`,
    name: `${appName} Full-Load Freight Marketplace`,
    serviceType: 'Freight transportation marketplace',
    description,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: {
      '@type': 'Country',
      name: 'Australia',
    },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Corporate shippers and heavy-vehicle transport fleets',
    },
  };
}

function softwareNode(siteUrl: string, appName: string, description: string) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${siteUrl}/#software`,
    name: appName,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description,
    url: siteUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
      description:
        'Pre-launch registry and partner EOI are free expressions of interest. Live marketplace commercial terms apply at go-live.',
      availability: 'https://schema.org/PreOrder',
    },
    publisher: { '@id': `${siteUrl}/#organization` },
  };
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

  const verification: Metadata['verification'] = {};
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.BING_SITE_VERIFICATION) {
    verification.other = {
      ...(typeof verification.other === 'object' ? verification.other : {}),
      'msvalidate.01': process.env.BING_SITE_VERIFICATION,
    };
  }

  return {
    title: { absolute: title },
    description,
    applicationName: appName,
    authors: [{ name: ORG.legalName, url: siteUrl }],
    creator: appName,
    publisher: ORG.legalName,
    category: 'business',
    keywords: [
      'CLOX',
      'full-load freight',
      'freight marketplace Australia',
      'FTL freight',
      'carrier bidding',
      'Protected Upfront Payments',
      'Melbourne Sydney freight',
      'heavy vehicle operators',
    ],
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
          alt: `${appName} — Australia’s digital full-load freight marketplace`,
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
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-image-preview': 'large',
              'max-snippet': -1,
              'max-video-preview': -1,
            },
          },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

export function buildJsonLd(locale: AppLocale, route: keyof typeof routeMeta) {
  const dict = getDictionary(locale) as unknown as Record<string, unknown>;
  const meta = routeMeta[route];
  const siteUrl = getSiteUrl();
  const appName = getAppName();
  const path = `/${locale}${meta.path}`;
  const description = readNested(dict, meta.descriptionKey);
  const homeDescription = readNested(dict, 'seo.homeDescription');

  const graph: Record<string, unknown>[] = [
    organizationNode(siteUrl, appName, homeDescription),
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: appName,
      url: siteUrl,
      description: homeDescription,
      inLanguage: ['en-AU', 'hi', 'pa'],
      publisher: { '@id': `${siteUrl}/#organization` },
      about: { '@id': `${siteUrl}/#organization` },
    },
    serviceNode(siteUrl, appName, homeDescription),
    softwareNode(siteUrl, appName, homeDescription),
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}${path}#webpage`,
      name: readNested(dict, meta.titleKey),
      description,
      url: `${siteUrl}${path}`,
      inLanguage: locale === 'en' ? 'en-AU' : locale,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${siteUrl}/brand/og-share.webp`,
      },
    },
  ];

  if (meta.path) {
    graph.push(buildBreadcrumbGraph(locale, route));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/** BreadcrumbList for nested public routes (AEO + Google sitelinks). */
export function buildBreadcrumbGraph(
  locale: AppLocale,
  route: keyof typeof routeMeta,
) {
  const dict = getDictionary(locale) as unknown as Record<string, unknown>;
  const meta = routeMeta[route];
  const siteUrl = getSiteUrl();
  const appName = getAppName();
  const homeUrl = `${siteUrl}/${locale}`;
  const pageUrl = `${siteUrl}/${locale}${meta.path}`;

  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: appName,
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: readNested(dict, meta.titleKey),
        item: pageUrl,
      },
    ],
  };
}

/** FAQPage graph for homepage + /faq — locale-correct @id for GEO/AEO. */
export function buildFaqJsonLd(
  locale: AppLocale,
  faqs: readonly (readonly [string, string])[],
) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/${locale}/faq#faq`,
    url: `${siteUrl}/${locale}/faq`,
    inLanguage: locale === 'en' ? 'en-AU' : locale,
    isPartOf: { '@id': `${siteUrl}/#website` },
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

/** HowTo schema for /how-it-works citation surfaces. */
export function buildHowToJsonLd(
  locale: AppLocale,
  opts: {
    name: string;
    description: string;
    steps: readonly { name: string; text: string }[];
  },
) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${siteUrl}/${locale}/how-it-works#howto`,
    name: opts.name,
    description: opts.description,
    inLanguage: locale === 'en' ? 'en-AU' : locale,
    totalTime: 'P1D',
    step: opts.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${siteUrl}/${locale}/how-it-works#step-${index + 1}`,
    })),
  };
}
