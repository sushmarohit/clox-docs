import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/env';

/**
 * SEO + AEO/GEO crawl policy:
 * - Allow search engines and answer-engine / LLM crawlers
 * - Keep lead APIs and Partner EOI out of indexes
 * - Point agents at /llms.txt, /llms-full.txt, /ai.txt
 */
const disallowPrivate = [
  '/api/',
  '/en/partner/eoi',
  '/hi/partner/eoi',
  '/pa/partner/eoi',
  '/*/partner/eoi',
  '/offline',
  '/en/investors',
  '/hi/investors',
  '/pa/investors',
  '/*/investors',
];

const allowPublic = [
  '/',
  '/llms.txt',
  '/llms-full.txt',
  '/ai.txt',
  '/humans.txt',
  '/.well-known/security.txt',
  '/sitemap.xml',
];

/** Major search + generative / answer-engine bots (GEO / AEO). */
const aiUserAgents = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'Googlebot',
  'ClaudeBot',
  'Anthropic-AI',
  'PerplexityBot',
  'Amazonbot',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: allowPublic,
        disallow: disallowPrivate,
      },
      ...aiUserAgents.map((userAgent) => ({
        userAgent,
        allow: allowPublic,
        disallow: disallowPrivate,
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
