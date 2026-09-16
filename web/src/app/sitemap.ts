import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/env';
import { supportedLocales } from '@/locales';

/** Public indexable paths only — Partner EOI is noindex / robots-disallowed. */
const paths = ['', '/registry', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  for (const locale of supportedLocales) {
    for (const path of paths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            supportedLocales.map((item) => [item, `${siteUrl}/${item}${path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
