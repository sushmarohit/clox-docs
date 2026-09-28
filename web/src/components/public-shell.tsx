'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocaleParam } from '@/lib/use-locale-param';

export function PublicShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common');
  const locale = useLocaleParam();

  return (
    <div className="relative min-h-screen bg-clox-navy text-white">
      <div className="pointer-events-none absolute inset-0 clox-hero-backdrop opacity-95" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url('/brand/shell-background.webp')" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-clox-navy/55 via-clox-navy/82 to-clox-navy" />

      <header className="fixed inset-x-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
        <div className="clox-container flex items-center justify-between gap-4 py-3 sm:gap-5 sm:py-3.5">
          <Link href={`/${locale}`} className="inline-flex shrink-0 items-center" aria-label="CLOX home">
            <img
              src="/brand/logo-clox.webp"
              alt="CLOX"
              className="h-[40px] w-auto object-contain sm:h-[48px] lg:h-[44px] xl:h-[48px] 3xl:h-[52px]"
            />
          </Link>
          <LanguageSwitcher className="text-clox-navy" />
        </div>
      </header>

      <main className="relative z-0 pt-[4.5rem] sm:pt-[5.25rem]">
        <div className="clox-container py-8 sm:py-12 lg:py-14">{children}</div>
      </main>

      <footer className="relative z-10 pb-28 pt-4 text-center text-[0.75rem] text-white/50 sm:pb-24">
        <div className="clox-container">
          <p className="px-1 text-[0.7rem] leading-5 sm:text-[0.75rem]">
            <span>{t('footerCopyright')}</span>{' '}
            <span className="whitespace-nowrap">{t('footerAbn')}</span>
          </p>
          <p className="mt-1 whitespace-nowrap text-[0.7rem] sm:text-[0.75rem]">{t('footerRightsLine')}</p>
          <p className="mt-1 text-white/35">{t('shell.footerContactHint')}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
            <Link href={`/${locale}/privacy`} className="relative z-10 underline-offset-2 hover:underline">
              {t('shell.privacyShort')}
            </Link>
            <span aria-hidden>·</span>
            <Link href={`/${locale}/terms`} className="relative z-10 underline-offset-2 hover:underline">
              {t('shell.termsShort')}
            </Link>
            <span aria-hidden>·</span>
            <a href="mailto:info@clox.com.au" className="relative z-10 underline-offset-2 hover:underline">
              {t('shell.contactShort')}
            </a>
            <span aria-hidden>·</span>
            <a
              href="https://www.linkedin.com/company/clox-freight-forwarding/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
              aria-label={t('linkedinLabel')}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
              </svg>
              {t('linkedinLabel')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function StepIndicator({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  const { t } = useTranslation('common');
  const steps = [
    { id: 1 as const, label: t('shell.stepRole') },
    { id: 2 as const, label: t('shell.stepDetails') },
    { id: 3 as const, label: t('shell.stepVerify') },
  ];

  return (
    <div className="flex justify-between bg-clox-navy px-4 py-4 text-center text-white sm:px-8 sm:py-5">
      {steps.map((step) => {
        const active = step.id <= activeStep;
        return (
          <div key={step.id} className="flex-1">
            <div
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold sm:h-9 sm:w-9 ${
                active ? 'bg-clox-orange text-white' : 'bg-white/15 text-white/70'
              }`}
            >
              {step.id}
            </div>
            <div
              className={`mt-1.5 text-xs sm:text-sm ${active ? 'text-white' : 'text-white/60'}`}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-clox-navy">
      {children}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-clox-orange focus:ring-2 sm:px-4 sm:py-3 sm:text-base';
