import { getSiteUrl } from '@/lib/env';

export const dynamic = 'force-static';
export const revalidate = 86400;

export function GET() {
  const siteUrl = getSiteUrl();
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const body = [
    `Contact: mailto:info@clox.com.au`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en, hi, pa',
    `Canonical: ${siteUrl}`,
    `Policy: ${siteUrl}/en/privacy`,
    '', 
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
