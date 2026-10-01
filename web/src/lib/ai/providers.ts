export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ProviderStreamArgs = {
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
};

export interface LlmProvider {
  id: string;
  stream(args: ProviderStreamArgs): AsyncIterable<string>;
}

function getEnv(name: string) {
  return process.env[name]?.trim() || '';
}

/** Pull approved passages from the system prompt built in prepareChat. */
function extractPassages(system: string): { title: string; path: string; text: string }[] {
  const marker = 'Approved passages:';
  const idx = system.indexOf(marker);
  if (idx < 0) return [];
  const body = system.slice(idx + marker.length).trim();
  if (!body || body.startsWith('No approved')) return [];

  const blocks = body.split(/\n\n+/);
  const passages: { title: string; path: string; text: string }[] = [];
  for (const block of blocks) {
    const match = block.match(/^\[\d+\]\s+(.+?)\s+\((\/[^\)]+)\)\n([\s\S]+)$/);
    if (!match) continue;
    passages.push({ title: match[1].trim(), path: match[2].trim(), text: match[3].trim() });
  }
  return passages;
}

function pickLocalePrefix(system: string): string {
  if (/Respond in Hindi/i.test(system)) return '/hi';
  if (/Respond in Punjabi/i.test(system)) return '/pa';
  return '/en';
}

async function* mockStream(messages: ChatMessage[]): AsyncIterable<string> {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  const system = messages.find((message) => message.role === 'system')?.content ?? '';
  const passages = extractPassages(system);
  const localePrefix = pickLocalePrefix(system);
  const query = (lastUser?.content ?? '').trim();

  let answer: string;
  if (passages.length > 0) {
    const top = passages[0];
    const extras = passages
      .slice(1, 3)
      .map((passage) => `• ${passage.title}: ${passage.path}`)
      .join('\n');
    answer = [
      top.text,
      '',
      `Helpful page: ${top.path}`,
      extras ? `Also related:\n${extras}` : '',
      '',
      'I only use approved CLOX site content and will not collect personal details. Use the form on that page to register.',
    ]
      .filter(Boolean)
      .join('\n');
  } else {
    answer = [
      `I could not match “${query || 'your question'}” to a specific approved passage.`,
      `Try the Pre-launch registry (${localePrefix}/registry) for senders/carriers, or Partner EOI (${localePrefix}/partner/eoi) for territory partners.`,
      'Privacy and Terms are linked in the site footer.',
    ].join(' ');
  }

  for (const word of answer.split(/(\s+)/)) {
    if (!word) continue;
    yield word;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

export const mockProvider: LlmProvider = {
  id: 'mock',
  async *stream({ messages }) {
    yield* mockStream(messages);
  },
};

/** Shared OpenAI-compatible SSE chat stream (OpenAI, Groq, etc.). */
async function* openAiCompatibleStream(params: {
  label: string;
  url: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}): AsyncIterable<string> {
  const response = await fetch(params.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model,
      stream: true,
      temperature: 0.2,
      messages: params.messages,
    }),
    signal: params.signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text();
    throw new Error(detail || `${params.label} error ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const content = json.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        /* ignore partial JSON */
      }
    }
  }
}

export const openaiProvider: LlmProvider = {
  id: 'openai',
  async *stream({ model, messages, signal }) {
    const apiKey = getEnv('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
    yield* openAiCompatibleStream({
      label: 'OpenAI',
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey,
      model,
      messages,
      signal,
    });
  },
};

/** Groq — OpenAI-compatible; GROQ_API_KEY is required. Optional GROQ_BASE_URL. */
export const groqProvider: LlmProvider = {
  id: 'groq',
  async *stream({ model, messages, signal }) {
    const apiKey = getEnv('GROQ_API_KEY');
    if (!apiKey) throw new Error('GROQ_API_KEY is not configured');
    const base = (
      getEnv('GROQ_BASE_URL') || 'https://api.groq.com/openai/v1'
    ).replace(/\/$/, '');
    yield* openAiCompatibleStream({
      label: 'Groq',
      url: `${base}/chat/completions`,
      apiKey,
      model,
      messages,
      signal,
    });
  },
};

export const anthropicProvider: LlmProvider = {
  id: 'anthropic',
  async *stream({ model, messages, signal }) {
    const apiKey = getEnv('ANTHROPIC_API_KEY');
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

    const system = messages
      .filter((message) => message.role === 'system')
      .map((message) => message.content)
      .join('\n\n');
    const nonSystem = messages
      .filter((message) => message.role !== 'system')
      .map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 800,
        temperature: 0.2,
        system,
        stream: true,
        messages: nonSystem,
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      const detail = await response.text();
      throw new Error(detail || `Anthropic error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (!data) continue;
        try {
          const json = JSON.parse(data) as {
            type?: string;
            delta?: { text?: string };
          };
          if (json.type === 'content_block_delta' && json.delta?.text) {
            yield json.delta.text;
          }
        } catch {
          /* ignore */
        }
      }
    }
  },
};

export function resolveProvider(): LlmProvider {
  const provider = (getEnv('AI_PROVIDER') || 'mock').toLowerCase();

  if (provider === 'groq') {
    if (!getEnv('GROQ_API_KEY')) {
      console.warn('[Ask CLOX] GROQ_API_KEY missing — falling back to mock provider');
      return mockProvider;
    }
    return groqProvider;
  }

  if (provider === 'openai') {
    if (!getEnv('OPENAI_API_KEY')) {
      console.warn('[Ask CLOX] OPENAI_API_KEY missing — falling back to mock provider');
      return mockProvider;
    }
    return openaiProvider;
  }

  if (provider === 'anthropic') {
    if (!getEnv('ANTHROPIC_API_KEY')) {
      console.warn('[Ask CLOX] ANTHROPIC_API_KEY missing — falling back to mock provider');
      return mockProvider;
    }
    return anthropicProvider;
  }

  // If a Groq key is present but AI_PROVIDER was left as mock, prefer Groq.
  if (provider === 'mock' && getEnv('GROQ_API_KEY')) {
    return groqProvider;
  }

  return mockProvider;
}

export function resolveModel(providerId: string) {
  const configured = getEnv('AI_MODEL');
  if (configured && providerId !== 'mock') return configured;
  // Groq-hosted OpenAI open-weight GPT model (also: openai/gpt-oss-120b)
  if (providerId === 'groq') return 'openai/gpt-oss-20b';
  if (providerId === 'anthropic') return 'claude-3-5-haiku-latest';
  if (providerId === 'openai') return 'gpt-4o-mini';
  return 'mock';
}
