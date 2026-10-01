import type { AppLocale } from '@/locales';
import { knowledgeChunks, type KnowledgeChunk } from '@/lib/ai/knowledge/chunks';

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'to',
  'of',
  'in',
  'for',
  'on',
  'is',
  'are',
  'with',
  'how',
  'what',
  'where',
  'who',
  'do',
  'i',
  'my',
  'me',
  'can',
  'you',
  'please',
]);

/** Expand common user phrasing so retrieval still hits the right funnel. */
const SYNONYMS: Record<string, string[]> = {
  register: ['registry', 'sender', 'carrier', 'apply'],
  registration: ['registry', 'sender', 'carrier', 'apply'],
  signup: ['registry', 'sender', 'carrier', 'apply'],
  'sign-up': ['registry', 'sender', 'carrier', 'apply'],
  join: ['apply', 'registry', 'partner'],
  apply: ['apply', 'registry', 'partner', 'eoi'],
  application: ['apply', 'registry', 'eoi'],
  shipper: ['sender', 'registry', 'business'],
  corporate: ['sender', 'business'],
  business: ['sender', 'carrier', 'partner', 'benefit'],
  help: ['benefit', 'works', 'about'],
  benefit: ['benefit', 'sender', 'carrier', 'partner'],
  works: ['works', 'journey', 'features'],
  working: ['works', 'journey'],
  process: ['works', 'journey'],
  feature: ['features', 'works'],
  features: ['features', 'works'],
  fleet: ['carrier', 'registry'],
  truck: ['carrier', 'registry'],
  transport: ['carrier', 'registry'],
  freight: ['registry', 'about', 'works'],
  marketplace: ['about', 'works'],
  partner: ['partner', 'eoi'],
  partnership: ['partner', 'eoi'],
  territory: ['partner', 'eoi'],
  bde: ['partner', 'eoi'],
  commission: ['partner', 'eoi'],
  investor: ['about'],
  invest: ['about'],
  privacy: ['privacy', 'legal'],
  terms: ['terms', 'legal'],
  abn: ['registry', 'privacy', 'apply'],
  bidding: ['works', 'sender', 'carrier'],
  payment: ['works', 'carrier', 'payment'],
  payments: ['works', 'carrier', 'payment'],
  tracking: ['works', 'features'],
  matching: ['works', 'features'],
};

function tokenize(input: string): string[] {
  const base = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/-]+/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));

  const expanded = new Set<string>(base);
  for (const token of base) {
    for (const syn of SYNONYMS[token] ?? []) expanded.add(syn);
  }
  return [...expanded];
}

function scoreChunk(queryTokens: string[], chunk: KnowledgeChunk): number {
  if (queryTokens.length === 0) return 0;
  const haystack = tokenize(`${chunk.title} ${chunk.text} ${chunk.tags.join(' ')} ${chunk.path}`);
  const counts = new Map<string, number>();
  for (const token of haystack) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  let score = 0;
  for (const token of queryTokens) {
    const tf = counts.get(token) ?? 0;
    if (tf > 0) score += 1 + Math.log(1 + tf);
    if (chunk.tags.some((tag) => tag.includes(token))) score += 1.5;
    if (chunk.path.includes(token)) score += 0.5;
  }
  return score;
}

export type RetrievalResult = {
  chunks: KnowledgeChunk[];
  weak: boolean;
};

export function retrieveKnowledge(
  query: string,
  locale: AppLocale,
  topK = 4,
): RetrievalResult {
  const queryTokens = tokenize(query);
  const scored = knowledgeChunks
    .filter((chunk) => chunk.public !== false)
    .filter((chunk) => chunk.locale === locale || chunk.locale === 'both')
    .map((chunk) => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const weak = scored.length === 0 || (scored[0]?.score ?? 0) < 1.5;
  return {
    chunks: scored.map((item) => item.chunk),
    weak,
  };
}

export function formatRetrievedContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return 'No approved passages retrieved.';
  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.title} (${chunk.path})\n${chunk.text}`,
    )
    .join('\n\n');
}
