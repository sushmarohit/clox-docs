import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/env';

type ProxyOptions = {
  path: string;
  body: unknown;
  request: Request;
};

export async function proxyLeadSubmission({ path, body, request }: ProxyOptions) {
  const requestId =
    request.headers.get('x-request-id') ||
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`);
  const acceptLanguage = request.headers.get('accept-language') || 'en';
  const upstream = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': acceptLanguage,
        'X-Client-App': 'clox-web',
        'X-Request-Id': requestId,
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(45_000),
    });

    const text = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    return new NextResponse(text || null, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : 'Unable to reach the CLOX API';
    return NextResponse.json(
      {
        title: 'Upstream unavailable',
        detail,
        status: 502,
      },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store', 'X-Request-Id': requestId },
      },
    );
  }
}
