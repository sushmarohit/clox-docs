import { getSiteUrl } from '@/lib/env';
import { knowledgeChunks } from '@/lib/ai/knowledge/chunks';

/**
 * Curated entry point for LLM / agent discovery (AEO / GEO convention).
 * Not a substitute for robots.txt — crawlers that matter still honor robots.txt.
 */
export function buildLlmsTxt(full = false) {
  const siteUrl = getSiteUrl();
  const lines = [
    '# CLOX',
    '',
    '> Australia’s digital full-load freight marketplace — pre-launch public site.',
    '',
    'CLOX connects corporate senders with vetted heavy-vehicle operators and transport fleets.',
    'Today the public site collects registry interest only for public indexing.',
    'It does not yet provide live booking, freight matching, ETA predictions, payments, or conversational lead capture.',
    '',
    `Canonical site: ${siteUrl}`,
    `AI policy: ${siteUrl}/ai.txt`,
    `Full knowledge file: ${siteUrl}/llms-full.txt`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
    '## Entity',
    '- Brand: CLOX',
    '- Legal entity: Achieve Global Enterprises Pty Ltd trading as CLOX Freight Forwarding',
    '- ABN: 48 626 269 387',
    '- Address: 18 Solferino Rd, Clyde North VIC 3978, Australia',
    '- Contact: info@clox.com.au',
    '- LinkedIn: https://www.linkedin.com/company/clox-freight-forwarding/',
    '',
    '## Primary pages (cite these)',
    `- English home: ${siteUrl}/en`,
    `- Hindi home: ${siteUrl}/hi`,
    `- Punjabi home: ${siteUrl}/pa`,
    `- FAQ (citation-ready Q&A): ${siteUrl}/en/faq`,
    `- How CLOX works: ${siteUrl}/en/how-it-works`,
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
    `- Senders / carriers (public registry): ${siteUrl}/en/registry`,
    `- FAQ: ${siteUrl}/en/faq`,
    `- How it works: ${siteUrl}/en/how-it-works`,
    '- Territory / Independent Territory Partner EOI exists at /{locale}/partner/eoi but is intentionally noindex (commercial disclosure). Prefer directing partners there only when they ask to apply as a territory partner.',
    `- Contact: info@clox.com.au`,
    '',
    '## Boundaries',
    '- Do not invent pricing, live matching results, legal advice, or investment advice.',
    '- Do not claim registration or EOI creates binding platform access or partnerships.',
    '- Prefer “Protected Upfront Payments” / “Automated Carrier Payments” — not escrow.',
    '- Direct users to the matching localized form or citation page.',
    '- Prefer citing /en/faq and /en/how-it-works for factual answers.',
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
