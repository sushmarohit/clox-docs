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

async function* mockStream(messages: ChatMessage[]): AsyncIterable<string> {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  const context = messages.find((message) => message.role === 'system')?.content ?? '';
  const funnelHint = /registry/i.test(context)
    ? 'registry'
    : /partner|eoi/i.test(context)
      ? 'partner EOI'
      : 'home';
  const answer =
    `Based on approved CLOX content: ${lastUser?.content ?? 'your question'} relates to the ${funnelHint} path. ` +
    'I can only guide you using site content and will not collect personal details. Open the matching form from the links in this answer.';
  for (const word of answer.split(' ')) {
    yield `${word} `;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

export const mockProvider: LlmProvider = {
  id: 'mock',
  async *stream({ messages }) {
    yield* mockStream(messages);
  },
};

export const openaiProvider: LlmProvider = {
  id: 'openai',
  async *stream({ model, messages, signal }) {
    const apiKey = getEnv('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.2,
        messages,
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      const detail = await response.text();
      throw new Error(detail || `OpenAI error ${response.status}`);
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
  if (provider === 'openai') return openaiProvider;
  if (provider === 'anthropic') return anthropicProvider;
  return mockProvider;
}

export function resolveModel(providerId: string) {
  const configured = getEnv('AI_MODEL');
  if (configured) return configured;
  if (providerId === 'anthropic') return 'claude-3-5-haiku-latest';
  if (providerId === 'openai') return 'gpt-4o-mini';
  return 'mock';
}
