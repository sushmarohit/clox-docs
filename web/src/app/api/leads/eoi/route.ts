import { NextResponse } from 'next/server';
import { eoiLeadSchema } from '@/shared/types';
import { proxyLeadSubmission } from '@/lib/server/proxy-lead';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { title: 'Bad Request', detail: 'Invalid JSON body', status: 400 },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const parsed = eoiLeadSchema.safeParse(body);
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

  return proxyLeadSubmission({
    path: '/leads/eoi',
    body: parsed.data,
    request,
  });
}
