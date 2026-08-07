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

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/-]+/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
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
