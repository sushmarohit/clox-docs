import { createHttpClient, type AxiosInstance } from '@/lib/http/client';
import { LOCALE_STORAGE_KEY } from '@/locales';

export const http: AxiosInstance = createHttpClient({ baseURL: '/api' });

http.interceptors.request.use((config) => {
  const locale =
    (typeof localStorage !== 'undefined' && localStorage.getItem(LOCALE_STORAGE_KEY)) ||
    process.env.NEXT_PUBLIC_DEFAULT_LOCALE ||
    'en';

  config.headers.set('Accept-Language', locale);
  config.headers.set('X-Client-App', 'clox-web');
  config.headers.set(
    'X-Request-Id',
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`,
  );

  if ((config.method ?? 'get').toLowerCase() !== 'get') {
    config.headers.set('Cache-Control', 'no-store');
  }

  return config;
});
