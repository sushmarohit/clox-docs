import { z } from 'zod';
import type { AppLocale } from '@/locales';
import { formatRetrievedContext, retrieveKnowledge } from '@/lib/ai/retrieve';
import {
  resolveModel,
  resolveProvider,
  type ChatMessage,
} from '@/lib/ai/providers';

export const chatRequestSchema = z.object({
  locale: z.enum(['en', 'hi', 'pa']).default('en'),
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

const respondLanguage: Record<AppLocale, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

const offTopicFallback: Record<AppLocale, string> = {
  en: 'That question is outside my scope. I only help with CLOX — the Australia freight marketplace pre-launch, its features, and how to join via Registry or Partner EOI.',
  hi: 'यह प्रश्न मेरे दायरे से बाहर है। मैं केवल CLOX — ऑस्ट्रेलिया फ्रेट मार्केटप्लेस प्री-लॉन्च, इसकी सुविधाएँ, और रजिस्ट्री या पार्टनर EOI से जुड़ने में मदद करता हूँ।',
  pa: 'ਇਹ ਸਵਾਲ ਮੇਰੇ ਦਾਇਰੇ ਤੋਂ ਬਾਹਰ ਹੈ। ਮੈਂ ਸਿਰਫ਼ CLOX — ਆਸਟ੍ਰੇਲੀਆ ਫਰੇਟ ਮਾਰਕੀਟਪਲੇਸ ਪ੍ਰੀ-ਲਾਂਚ, ਇਸ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ, ਅਤੇ ਰਜਿਸਟਰੀ ਜਾਂ ਪਾਰਟਨਰ EOI ਰਾਹੀਂ ਜੁੜਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹਾਂ।',
};

export function buildSystemPrompt(locale: AppLocale, context: string, weak: boolean) {
  return [
    'You are the CLOX pre-launch site guide for Achieve Global Enterprises Pty Ltd trading as CLOX Freight Forwarding.',
    'Your job is to HELP users understand CLOX and how to join — warmly, clearly, and briefly.',
    'Actively explain when asked (or when helpful):',
    '- What CLOX is and how the marketplace will work (bidding, matching, tracking, Protected Upfront Payments)',
    '- How CLOX helps a sender/shipper business, a carrier/fleet business, or a territory partner (EOI)',
    '- Exactly how to apply: which form, what they will need, and the correct page link',
    'SCOPE — You may ONLY discuss CLOX and this website:',
    '- What CLOX is (Australia-first full-load freight marketplace, pre-launch)',
    '- Product features and the planned shipping journey from approved passages',
    '- Business benefits for senders, carriers, and partners from approved passages',
    '- How to join: Pre-launch Registry (senders/carriers) or Partner EOI',
    '- Privacy and Terms content from the approved passages',
    'Always end practical answers with the right next step link when relevant:',
    `- Sender registry: /${locale}/registry?role=sender`,
    `- Carrier registry: /${locale}/registry?role=carrier`,
    `- Partner EOI: /${locale}/partner/eoi`,
    'Remind users this is pre-launch: registration/EOI is interest only — not live booking and not a binding service contract yet.',
    'OUT OF SCOPE — Refuse clearly and briefly if the user asks about anything else, including:',
    '- General knowledge, coding, homework, news, politics, other companies, jokes, or personal advice',
    '- Live booking, quotes, ETAs, matching results, pricing not in the passages, legal or investment advice',
    'When refusing, say you only answer CLOX-related questions and suggest Registry or Partner EOI if relevant.',
    'Answer only from the approved retrieved passages below. Do not invent features or facts.',
    'Never collect or ask for personal lead details (email, phone, ABN, capital amounts) — tell them to enter those on the form.',
    'Do not mention or direct users to an investor portal.',
    'If the passages are weak or insufficient for a CLOX question, say you are unsure and link the most likely funnel.',
    `Respond in ${respondLanguage[locale]}.`,
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

  // No CLOX passages matched → do not call Groq; return a CLOX-only refusal.
  // Weak match → still call Groq, but the system prompt forces CLOX-only answers.
  const fallback =
    retrieval.chunks.length === 0
      ? offTopicFallback[request.locale]
      : null;

  return {
    provider,
    model,
    messages,
    retrieval,
    fallback,
  };
}
