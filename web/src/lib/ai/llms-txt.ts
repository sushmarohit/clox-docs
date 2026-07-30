import { getSiteUrl } from '@/lib/env';
import { knowledgeChunks } from '@/lib/ai/knowledge/chunks';

export function buildLlmsTxt(full = false) {
  const siteUrl = getSiteUrl();
  const lines = [
    '# CLOX',
    '',
    '> Australia-first full-load freight marketplace — pre-launch public site.',
    '',
    'CLOX currently collects registry, partner EOI, and investor pre-qualification interest only.',
    'It does not provide live booking, freight matching, ETA predictions, payments, or conversational lead submission.',
    '',
    `Canonical site: ${siteUrl}`,
    '',
    '## Primary pages',
    `- English home: ${siteUrl}/en`,
    `- Russian home: ${siteUrl}/ru`,
    `- Registry: ${siteUrl}/en/registry`,
    `- Partner EOI: ${siteUrl}/en/partner/eoi`,
    `- Investors: ${siteUrl}/en/investors`,
    `- Privacy: ${siteUrl}/en/privacy`,
    `- Terms: ${siteUrl}/en/terms`,
    '',
    '## Boundaries',
    '- Do not invent pricing, matching results, legal advice, or investment advice.',
    '- Do not claim forms create binding access, partnerships, or investments.',
    '- Direct users to the matching localized form page.',
  ];

  if (full) {
    lines.push('', '## Approved knowledge passages');
    for (const chunk of knowledgeChunks) {
      lines.push('', `### ${chunk.title} (${chunk.path})`, chunk.text);
    }
  }

  return `${lines.join('\n')}\n`;
}
