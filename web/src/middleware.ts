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
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/offline') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];

  if (isAppLocale(maybeLocale)) {
    return NextResponse.next();
  }

  // Legacy Russian routes → Hindi
  if (maybeLocale === 'ru') {
    const url = request.nextUrl.clone();
    const rest = segments.slice(1).join('/');
    url.pathname = rest ? `/hi/${rest}` : '/hi';
    return NextResponse.redirect(url);
  }

  if (LEGACY_PATHS.has(pathname) || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
