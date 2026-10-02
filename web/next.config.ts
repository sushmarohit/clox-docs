import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  // Hide Next.js runtime badges during local review so they don't sit on the banner.
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
      {
        source: '/llms-full.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
      {
        source: '/ai.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
  async redirects() {
    // Canonical host: apex https://clox.com.au (www → non-www).
    // HTTPS termination is expected at the CDN/host; this consolidates www duplicates for SEO.
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.clox.com.au' }],
        destination: 'https://clox.com.au/:path*',
        permanent: true,
      },
    ];
  },
};

export default withSerwist(nextConfig);
