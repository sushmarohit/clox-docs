import { buildLlmsTxt } from '@/lib/ai/llms-txt';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsTxt(true), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
