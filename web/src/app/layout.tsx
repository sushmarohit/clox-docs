import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { Noto_Sans_Devanagari, Noto_Sans_Gurmukhi, Poppins } from 'next/font/google';
import { isAppLocale } from '@/locales';
import { getAppName, getSiteUrl } from '@/lib/env';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

const notoGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ['gurmukhi'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-gurmukhi',
  display: 'swap',
});

const siteUrl = getSiteUrl();
const appName = getAppName();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — Australia’s digital full-load freight marketplace`,
    template: `%s | ${appName}`,
  },
  description:
    'CLOX is Australia’s digital full-load freight marketplace (pre-launch) — transparent bidding, vetted carriers, and Protected Upfront Payments. Register early for priority access.',
  applicationName: appName,
  authors: [{ name: 'Achieve Global Enterprises Pty Ltd', url: siteUrl }],
  creator: appName,
  publisher: 'Achieve Global Enterprises Pty Ltd',
  category: 'business',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: appName,
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  other: {
    'llms-txt': '/llms.txt',
    'llms-full-txt': '/llms-full.txt',
    'ai-txt': '/ai.txt',
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION || process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.GOOGLE_SITE_VERIFICATION
            ? { google: process.env.GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.BING_SITE_VERIFICATION
            ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#0A1F3C',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const rawLocale = headerList.get('x-clox-locale') || 'en';
  const lang = isAppLocale(rawLocale) ? rawLocale : 'en';

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${poppins.variable} ${notoDevanagari.variable} ${notoGurmukhi.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
