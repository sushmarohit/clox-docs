import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { AppProviders } from '@/app/providers';
import { ErrorBoundary } from '@/components/error-boundary';
import { LocaleHtmlLang } from '@/components/locale-html-lang';
import { SiteAssistant } from '@/components/site-assistant';
import { PwaRegister } from '@/components/pwa-register';
import { isAppLocale, type AppLocale, supportedLocales } from '@/locales';

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;

  return (
    <AppProviders locale={locale}>
      <LocaleHtmlLang locale={locale} />
      <ErrorBoundary homeHref={`/${locale}`}>
        {children}
        <SiteAssistant locale={locale} />
        <PwaRegister />
      </ErrorBoundary>
    </AppProviders>
  );
}
