import type { MetadataRoute } from 'next';
import { getAppName, getSiteUrl } from '@/lib/env';

export default function manifest(): MetadataRoute.Manifest {
  const appName = getAppName();
  return {
    name: `${appName} Pre-Launch`,
    short_name: appName,
    description: 'Australia-first full-load freight marketplace — pre-launch registry',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#1A2F4C',
    theme_color: '#1A2F4C',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'en',
    id: getSiteUrl(),
  };
}
