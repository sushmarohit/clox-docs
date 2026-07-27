import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';

export function PublicShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common');

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-clox-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/brand/back.jpeg')" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-clox-navy/70 via-clox-navy/85 to-clox-navy" />

      <header className="relative z-10 border-b border-white/10 bg-clox-navy/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link to="/">
            <img src="/brand/logo.png" alt="CLOX" className="h-9 w-auto" />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg px-4 py-6 pb-10">{children}</main>

      <footer className="relative z-10 pb-6 text-center text-[0.7rem] text-white/50">
        {t('footerRights')} ·{' '}
        <Link to="/privacy" className="underline-offset-2 hover:underline">
          {t('shell.privacyShort')}
        </Link>{' '}
        ·{' '}
        <Link to="/terms" className="underline-offset-2 hover:underline">
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
    <div className="flex justify-between bg-clox-navy px-2 py-3 text-center text-white">
      {steps.map((step) => {
        const active = step.id <= activeStep;
        return (
          <div key={step.id} className="flex-1">
            <div
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                active ? 'bg-clox-orange text-white' : 'bg-white/15 text-white/70'
              }`}
            >
              {step.id}
            </div>
            <div className={`mt-1 text-[0.7rem] ${active ? 'text-white' : 'text-white/60'}`}>
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
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-clox-orange focus:ring-2';
