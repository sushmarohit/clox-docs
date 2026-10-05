export const PRODUCTION_SITE_URL = 'https://clox.com.au';
const DEV_SITE_URL = 'http://localhost:5173';

function normalizeUrl(url: string) {
  return url.replace(/\/$/, '');
}

function isLocalhostUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

/**
 * Canonical public site origin for SEO, sitemap, Open Graph, and JSON-LD.
 * Production never returns localhost — even if SITE_URL was mis-set at build/deploy.
 */
export function getSiteUrl() {
  const configured = process.env.SITE_URL?.trim();
  const isProd = process.env.NODE_ENV === 'production';

  if (configured) {
    const normalized = normalizeUrl(configured);
    if (isProd && isLocalhostUrl(normalized)) {
      return PRODUCTION_SITE_URL;
    }
    return normalized;
  }

  return isProd ? PRODUCTION_SITE_URL : DEV_SITE_URL;
}

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:3001/v1'
  ).replace(/\/$/, '');
}

export function getAppName() {
  // Public brand is always CLOX — ignore staging/env values like "CLOX WEB".
  return 'CLOX';
}
