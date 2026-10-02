import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isAppLocale } from '@/locales';

const PUBLIC_FILE = /\.[^/]+$/;
const LEGACY_PATHS = new Set([
  '/',
  '/registry',
  '/partner/eoi',
  '/investors',
  '/privacy',
  '/terms',
  '/faq',
  '/how-it-works',
]);

const PASSTHROUGH = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
  '/llms.txt',
  '/llms-full.txt',
  '/ai.txt',
  '/humans.txt',
]);

function withLocaleHeader(response: NextResponse, locale: string) {
  response.headers.set('x-clox-locale', locale);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/offline') ||
    pathname.startsWith('/.well-known') ||
    PASSTHROUGH.has(pathname) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];

  if (isAppLocale(maybeLocale)) {
    return withLocaleHeader(NextResponse.next(), maybeLocale);
  }

  // Legacy Russian routes → Hindi (308 so Back skips the intermediate URL)
  if (maybeLocale === 'ru') {
    const url = request.nextUrl.clone();
    const rest = segments.slice(1).join('/');
    url.pathname = rest ? `/hi/${rest}` : '/hi';
    return withLocaleHeader(NextResponse.redirect(url, 308), 'hi');
  }

  // Locale-less canonical paths (/privacy, /terms, …) → /{locale}/…
  // 308 Permanent Redirect: browsers skip the bare path when going Back,
  // avoiding the /privacy ↔ /en/privacy loop from temporary (307) redirects.
  if (LEGACY_PATHS.has(pathname) || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return withLocaleHeader(NextResponse.redirect(url, 308), defaultLocale);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}`;
  return withLocaleHeader(NextResponse.redirect(url, 307), defaultLocale);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
