'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createAppI18n } from '@/lib/i18n';
import type { AppLocale } from '@/locales';

export function AppProviders({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLocale;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [i18n] = useState(() => createAppI18n(locale));

  // Next soft-nav keeps this provider mounted across /en ↔ /hi; sync i18n to the URL locale.
  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  );
}
