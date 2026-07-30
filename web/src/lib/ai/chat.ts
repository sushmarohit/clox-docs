import { z } from 'zod';
import type { AppLocale } from '@/locales';
import { formatRetrievedContext, retrieveKnowledge } from '@/lib/ai/retrieve';
import {
  resolveModel,
  resolveProvider,
  type ChatMessage,
} from '@/lib/ai/providers';

export const chatRequestSchema = z.object({
  locale: z.enum(['en', 'ru']).default('en'),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(12),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

const bucket = new Map<string, { count: number; resetAt: number }>();

export function throttleIp(ip: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const current = bucket.get(ip);
  if (!current || current.resetAt < now) {
    bucket.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function buildSystemPrompt(locale: AppLocale, context: string, weak: boolean) {
  return [
    'You are the CLOX pre-launch site guide.',
    'Answer only from the approved retrieved passages below.',
    'Guide users to the correct page: Registry, Partner EOI, Investors, Privacy, or Terms.',
    'Never collect or ask for personal lead details (email, phone, ABN, capital amounts).',
    'Never invent pricing, ETAs, matching, legal advice, or investment advice.',
    'If the passages are weak or insufficient, say you are unsure and link the most likely funnel.',
    `Respond in ${locale === 'ru' ? 'Russian' : 'English'}.`,
    `Retrieval confidence: ${weak ? 'weak' : 'ok'}.`,
    'Approved passages:',
    context,
  ].join('\n');
}

export function prepareChat(request: ChatRequest) {
  const latestUser = [...request.messages].reverse().find((message) => message.role === 'user');
  const query = latestUser?.content ?? '';
  const retrieval = retrieveKnowledge(query, request.locale);
  const context = formatRetrievedContext(retrieval.chunks);
  const system = buildSystemPrompt(request.locale, context, retrieval.weak);
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    ...request.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  const provider = resolveProvider();
  const model = resolveModel(provider.id);

  return {
    provider,
    model,
    messages,
    retrieval,
    fallback:
      retrieval.weak && retrieval.chunks.length === 0
        ? request.locale === 'ru'
          ? 'Я могу опираться только на материалы сайта CLOX. Откройте /ru/registry для отправителей/перевозчиков, /ru/partner/eoi для партнёров или /ru/investors для инвесторов.'
          : 'I can only use approved CLOX site content. Open /en/registry for senders/carriers, /en/partner/eoi for partners, or /en/investors for investors.'
        : null,
  };
}
