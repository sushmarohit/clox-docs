import { buildAiTxt } from '@/lib/ai/ai-txt';

export const dynamic = 'force-static';
export const revalidate = 3600;

export function GET() {
  return new Response(buildAiTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
