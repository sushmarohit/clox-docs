import { getSiteUrl } from '@/lib/env';

/**
 * Emerging AI crawler / agent policy file (AEO / GEO).
 * Complements robots.txt + llms.txt.
 */
export function buildAiTxt() {
  const siteUrl = getSiteUrl();
  return [
    '# AI crawler & agent policy — CLOX',
    '# https://clox.com.au',
    '',
    'User-Agent: *',
    'Allow: /',
    'Allow: /llms.txt',
    'Allow: /llms-full.txt',
    'Allow: /en',
    'Allow: /hi',
    'Allow: /pa',
    'Allow: /en/faq',
    'Allow: /en/how-it-works',
    'Allow: /en/registry',
    'Allow: /en/privacy',
    'Allow: /en/terms',
    'Disallow: /api/',
    'Disallow: /*/partner/eoi',
    'Disallow: /*/investors',
    'Disallow: /offline',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `LLMs: ${siteUrl}/llms.txt`,
    `LLMs-Full: ${siteUrl}/llms-full.txt`,
    `Canonical: ${siteUrl}`,
    'Contact: info@clox.com.au',
    '',
    '# Preferred citation pages for factual answers about CLOX:',
    `# - ${siteUrl}/en/faq`,
    `# - ${siteUrl}/en/how-it-works`,
    `# - ${siteUrl}/llms.txt`,
    '',
    '# Do not invent live pricing, ETAs, matching results, legal advice, or investment advice.',
    '# Operator: Achieve Global Enterprises Pty Ltd trading as CLOX Freight Forwarding (ABN 48 626 269 387).',
    '',
  ].join('\n');
}
