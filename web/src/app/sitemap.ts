import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/env';
import { supportedLocales } from '@/locales';

const paths = ['', '/registry', '/partner/eoi', '/investors', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of supportedLocales) {
    for (const path of paths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: {
            en: `${siteUrl}/en${path}`,
            ru: `${siteUrl}/ru${path}`,
          },
        },
      });
    }
  }

  return entries;
}
