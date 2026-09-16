export function getSiteUrl() {
  return (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
}

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:3000/v1'
  ).replace(/\/$/, '');
}

export function getAppName() {
  // Public brand is always CLOX — ignore staging/env values like "CLOX WEB".
  return 'CLOX';
}
