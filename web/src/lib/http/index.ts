import { createHttpClient, type AxiosInstance } from '@/lib/http/client';

const LOCALE_KEY = 'clox-public-locale';

export const http: AxiosInstance = createHttpClient();

http.interceptors.request.use((config) => {
  const locale =
    (typeof localStorage !== 'undefined' && localStorage.getItem(LOCALE_KEY)) ||
    import.meta.env.VITE_DEFAULT_LOCALE ||
    'en';

  config.headers.set('Accept-Language', locale);
  config.headers.set('X-Client-App', 'clox-web');
  config.headers.set('X-Request-Id', crypto.randomUUID());

  // Public forms: never cache POST responses.
  if ((config.method ?? 'get').toLowerCase() !== 'get') {
    config.headers.set('Cache-Control', 'no-store');
  }

  return config;
});
