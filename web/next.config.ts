import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  // Hide Next.js runtime badges during local review so they don't sit on the banner.
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withSerwist(nextConfig);
