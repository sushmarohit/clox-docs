import { NextResponse } from 'next/server';
import { chatRequestSchema, prepareChat, throttleIp } from '@/lib/ai/chat';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  if (!throttleIp(ip)) {
    return NextResponse.json(
      { title: 'Too Many Requests', detail: 'Please wait before asking again.', status: 429 },
      { status: 429, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { title: 'Bad Request', detail: 'Invalid JSON body', status: 400 },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        title: 'Validation failed',
        detail: parsed.error.issues.map((issue) => issue.message).join('; '),
        status: 400,
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const prepared = prepareChat(parsed.data);

  if (prepared.fallback) {
    return new Response(prepared.fallback, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-CLOX-Retrieval': 'weak',
      },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of prepared.provider.stream({
          model: prepared.model,
          messages: prepared.messages,
          signal: request.signal,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Assistant unavailable';
        controller.enqueue(encoder.encode(`\n[error] ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-CLOX-Provider': prepared.provider.id,
      'X-CLOX-Retrieval': prepared.retrieval.weak ? 'weak' : 'ok',
    },
  });
}
