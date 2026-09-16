import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/env';

/**
 * AEO/GEO crawl policy:
 * - Allow major search + answer-engine crawlers via User-agent: *
 * - Keep lead APIs private
 * - Keep Partner EOI out of indexes (commercial disclosure)
 * Source of truth for /robots.txt (do not also ship public/robots.txt).
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: [
          '/api/',
          '/en/partner/eoi',
          '/hi/partner/eoi',
          '/pa/partner/eoi',
          '/*/partner/eoi',
          '/offline',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
