import { getSiteUrl } from '@/lib/env';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function GET() {
  const siteUrl = getSiteUrl();
  const body = [
    '/* TEAM */',
    'Site: CLOX — Australia’s digital full-load freight marketplace',
    'Operator: Achieve Global Enterprises Pty Ltd trading as CLOX Freight Forwarding',
    'ABN: 48 626 269 387',
    'Contact: info@clox.com.au',
    'Location: Clyde North, Victoria, Australia',
    '',
    '/* SITE */',
    `Canonical: ${siteUrl}`,
    `Standards: ${siteUrl}/llms.txt`,
    `AI policy: ${siteUrl}/ai.txt`,
    `Security: ${siteUrl}/.well-known/security.txt`,
    '',
    '/* THANKS */',
    'Built for Australian shippers and heavy-vehicle operators.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
