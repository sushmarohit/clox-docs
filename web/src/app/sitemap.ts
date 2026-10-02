import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/env';
import { supportedLocales } from '@/locales';

/** Public indexable paths — Partner EOI / investors are noindex / robots-disallowed. */
const paths = ['', '/registry', '/faq', '/how-it-works', '/privacy', '/terms'] as const;

const pathPriority: Record<(typeof paths)[number], number> = {
  '': 1,
  '/registry': 0.9,
  '/faq': 0.85,
  '/how-it-works': 0.85,
  '/privacy': 0.5,
  '/terms': 0.5,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/llms.txt`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.45,
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.35,
    },
    {
      url: `${siteUrl}/ai.txt`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  for (const locale of supportedLocales) {
    for (const path of paths) {
      const languages: Record<string, string> = {
        'x-default': `${siteUrl}/en${path}`,
      };
      for (const item of supportedLocales) {
        languages[item] = `${siteUrl}/${item}${path}`;
      }

      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: path === '' || path === '/faq' || path === '/how-it-works' ? 'weekly' : 'monthly',
        priority: pathPriority[path],
        alternates: { languages },
      });
    }
  }

  return entries;
}
