import { getSiteUrl } from '@/lib/env';
import { knowledgeChunks } from '@/lib/ai/knowledge/chunks';

/**
 * Curated entry point for LLM / agent discovery (AEO convention).
 * Not a substitute for robots.txt — crawlers that matter still honor robots.txt.
 */
export function buildLlmsTxt(full = false) {
  const siteUrl = getSiteUrl();
  const lines = [
    '# CLOX',
    '',
    '> Australia’s digital full-load freight marketplace — pre-launch public site.',
    '',
    'CLOX connects corporate senders with vetted heavy-vehicle operators.',
    'Today the public site collects registry and partner EOI interest only.',
    'It does not yet provide live booking, freight matching, ETA predictions, payments, or conversational lead capture.',
    '',
    `Canonical site: ${siteUrl}`,
    `Full knowledge file: ${siteUrl}/llms-full.txt`,
    '',
    '## Primary pages',
    `- English home: ${siteUrl}/en`,
    `- Hindi home: ${siteUrl}/hi`,
    `- Punjabi home: ${siteUrl}/pa`,
    `- Pre-launch registry: ${siteUrl}/en/registry`,
    `- Privacy Policy: ${siteUrl}/en/privacy`,
    `- Terms & Conditions: ${siteUrl}/en/terms`,
    '',
    '## Product summary',
    '- Full-load / full-truckload freight marketplace (not parcel/courier).',
    '- Transparent carrier bidding with planned Protected Upfront Payments.',
    '- Vehicle/load matching: sender declares load → minimum vehicle class → carrier proposes matching vehicle.',
    '- Launching first on key Australian freight corridors (Melbourne–Sydney focus), expanding progressively.',
    '- Carrier verification covers ABN, Public Liability evidence, and vehicle compliance before live bidding.',
    '',
    '## How to help users',
    `- Senders / carriers: ${siteUrl}/en/registry`,
    `- Partners (Territory Sales Partner / Independent Territory Partner EOI): ${siteUrl}/en/partner/eoi` +
      ' (expression of interest only; independent contractor; commercial terms under NDA after application; no public fee splits)',
    `- Contact: info@clox.com.au`,
    '',
    '## Boundaries',
    '- Do not invent pricing, live matching results, legal advice, or investment advice.',
    '- Do not claim registration or EOI creates binding platform access or partnerships.',
    '- Prefer “Protected Upfront Payments” / “Automated Carrier Payments” — not escrow.',
    '- Direct users to the matching localized form page.',
    '- Operator: Achieve Global Enterprises Pty Ltd trading as CLOX Freight Forwarding (ABN 48 626 269 387).',
  ];

  if (full) {
    lines.push('', '## Approved knowledge passages');
    for (const chunk of knowledgeChunks) {
      if (chunk.public === false) continue;
      lines.push('', `### ${chunk.title} (${chunk.path})`, chunk.text);
    }
  }

  return `${lines.join('\n')}\n`;
}
