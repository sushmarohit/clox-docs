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
    <div className="relative min-h-screen overflow-x-hidden bg-clox-navy text-white">
      <div className="pointer-events-none absolute inset-0 clox-hero-backdrop opacity-95" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url('/brand/back.jpeg')" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-clox-navy/55 via-clox-navy/82 to-clox-navy" />

      <header className="relative z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-3xl items-center justify-between px-4 sm:h-[84px] sm:px-6 lg:max-w-4xl lg:px-0">
          <Link href={`/${locale}`} className="inline-flex shrink-0">
            <img
              src="/brand/clox_updated_logo.png"
              alt="CLOX"
              className="h-[52px] w-auto object-contain sm:h-[64px]"
            />
          </Link>
          <LanguageSwitcher className="text-clox-navy" />
        </div>
      </header>

      <main className="relative z-0 mx-auto w-full max-w-3xl px-4 py-6 pb-12 sm:px-6 sm:py-10 lg:max-w-4xl">
        {children}
      </main>

      <footer className="relative z-10 mx-auto max-w-3xl px-4 pb-8 text-center text-[0.7rem] text-white/50 sm:px-6 lg:max-w-4xl">
        {t('footerRights')} ·{' '}
        <Link href={`/${locale}/privacy`} className="underline-offset-2 hover:underline">
          {t('shell.privacyShort')}
        </Link>{' '}
        ·{' '}
        <Link href={`/${locale}/terms`} className="underline-offset-2 hover:underline">
          {t('shell.termsShort')}
        </Link>
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
    <div className="flex justify-between bg-clox-navy px-2 py-3 text-center text-white sm:px-6 sm:py-4">
      {steps.map((step) => {
        const active = step.id <= activeStep;
        return (
          <div key={step.id} className="flex-1">
            <div
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${
                active ? 'bg-clox-orange text-white' : 'bg-white/15 text-white/70'
              }`}
            >
              {step.id}
            </div>
            <div
              className={`mt-1 text-[0.7rem] sm:text-xs ${active ? 'text-white' : 'text-white/60'}`}
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
    <label className="mb-1 block text-sm font-semibold text-clox-navy">
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
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-clox-orange focus:ring-2 sm:py-3';
