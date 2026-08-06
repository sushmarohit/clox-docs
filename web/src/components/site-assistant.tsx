'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppLocale } from '@/locales';

type Message = { role: 'user' | 'assistant'; content: string };

const copy = {
  en: {
    open: 'Ask CLOX',
    title: 'CLOX site guide',
    disclaimer: 'AI-generated answers from approved site content. No personal lead details.',
    placeholder: 'Ask about registry, partners, or investors…',
    send: 'Send',
    close: 'Close assistant',
    empty: 'I can point you to the right pre-launch form.',
    error: 'Something went wrong. Please try again.',
  },
  hi: {
    open: 'CLOX से पूछें',
    title: 'CLOX साइट गाइड',
    disclaimer: 'स्वीकृत साइट सामग्री से AI उत्तर। कोई व्यक्तिगत लीड विवरण नहीं।',
    placeholder: 'रजिस्ट्री, पार्टनर या इन्वेस्टर के बारे में पूछें…',
    send: 'भेजें',
    close: 'सहायक बंद करें',
    empty: 'मैं आपको सही प्री-लॉन्च फ़ॉर्म दिखा सकता हूँ।',
    error: 'कुछ गलत हो गया। कृपया फिर से कोशिश करें।',
  },
} as const;

export function SiteAssistant({ locale }: { locale: AppLocale }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function onSend() {
    const content = input.trim();
    if (!content || pending) return;

    const nextMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ locale, messages: nextMessages.slice(-8) }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(t.error);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistant = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        const snapshot = assistant;
        setMessages((prev) => {
          const copyMessages = [...prev];
          copyMessages[copyMessages.length - 1] = {
            role: 'assistant',
            content: snapshot,
          };
          return copyMessages;
        });
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t.error },
      ]);
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open ? (
        <section
          className="flex h-[28rem] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-clox-navy text-white shadow-2xl"
          aria-label={t.title}
        >
          <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold">{t.title}</h2>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-white/60">{t.disclaimer}</p>
            </div>
            <button
              type="button"
              className="rounded-full px-2 py-1 text-xs text-white/70 hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label={t.close}
            >
              ✕
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.length === 0 ? (
              <p className="text-white/60">{t.empty}</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-xl px-3 py-2 ${
                    message.role === 'user'
                      ? 'ml-6 bg-clox-orange text-white'
                      : 'mr-6 bg-white/10 text-white/90'
                  }`}
                >
                  {message.content || '…'}
                </div>
              ))
            )}
          </div>

          <form
            className="border-t border-white/10 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void onSend();
            }}
          >
            <label className="sr-only" htmlFor="clox-assistant-input">
              {t.placeholder}
            </label>
            <div className="flex gap-2">
              <input
                id="clox-assistant-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t.placeholder}
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-clox-orange"
                maxLength={2000}
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="rounded-full bg-clox-orange px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {t.send}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="rounded-full bg-clox-orange px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? t.close : t.open}
      </button>
    </div>
  );
}
