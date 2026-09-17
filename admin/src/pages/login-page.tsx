import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { applyAuthTokensToStore, getErrorDetail, requestOtp, verifyOtp } from '@/lib/api';
import { fieldClassName, primaryButtonClassName } from '@/components/admin-shell';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAuthStore } from '@/stores/auth-store';

type EmailForm = { email: string };
type OtpForm = { code: string };

const QA_HINTS = [
  'cloxadmin@yopmail.com — Super',
  'state.vic@clox.test — State VIC',
  'local.mel@clox.test — Local MEL',
  'sender.qa@clox.test — Sender',
  'carrier.qa@clox.test — Carrier',
  'driver.qa@clox.test — Driver',
];

export function LoginPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [debugCode, setDebugCode] = useState<string | null>(null);

  const emailForm = useForm<EmailForm>({ defaultValues: { email: '' } });
  const otpForm = useForm<OtpForm>({ defaultValues: { code: '' } });

  const requestMutation = useMutation({
    mutationFn: (payload: EmailForm) => requestOtp({ email: payload.email.trim() }),
    onSuccess: (data, variables) => {
      setEmail(variables.email.trim().toLowerCase());
      setStep('otp');
      const code = data.debugCode?.trim() || null;
      setDebugCode(code);
      otpForm.reset({ code: code || '' });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (payload: OtpForm) => verifyOtp({ email, code: payload.code.trim() }),
    onSuccess: (tokens) => {
      applyAuthTokensToStore(tokens);
      navigate('/', { replace: true });
    },
  });

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  const pending = requestMutation.isPending || verifyMutation.isPending;
  const error =
    requestMutation.error || verifyMutation.error
      ? getErrorDetail(requestMutation.error ?? verifyMutation.error)
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clox-orange">
            {t('brand')}
          </p>
          <LanguageSwitcher />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Sign in</h1>
        <p className="mt-3 text-sm text-slate-300">
          {step === 'email'
            ? 'All Phase 1 roles use email OTP (verification UI).'
            : 'Enter the login code.'}
        </p>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">QA seed emails</p>
          <ul className="mt-1 space-y-0.5">
            {QA_HINTS.map((hint) => (
              <li key={hint} className="font-mono">
                {hint}
              </li>
            ))}
          </ul>
        </div>

        {step === 'email' ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={emailForm.handleSubmit((values) => requestMutation.mutate(values))}
            noValidate
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                autoComplete="email"
                className={fieldClassName}
                placeholder="role@clox.test"
                {...emailForm.register('email', { required: true })}
              />
            </div>
            {error ? (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
            ) : null}
            <button type="submit" disabled={pending} className={`${primaryButtonClassName} w-full`}>
              {pending ? t('loading') : 'Send code'}
            </button>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={otpForm.handleSubmit((values) => verifyMutation.mutate(values))}
            noValidate
          >
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
              Code sent to <span className="font-medium text-white">{email}</span>
            </p>
            {debugCode ? (
              <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-3 text-sm text-amber-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-300/90">
                  Dev OTP
                </p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-[0.35em] text-white">
                  {debugCode}
                </p>
              </div>
            ) : null}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Login code</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className={`${fieldClassName} tracking-[0.3em]`}
                placeholder="••••••"
                maxLength={8}
                {...otpForm.register('code', { required: true })}
              />
            </div>
            {error ? (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
            ) : null}
            <button type="submit" disabled={pending} className={`${primaryButtonClassName} w-full`}>
              {pending ? t('loading') : 'Verify'}
            </button>
            <button
              type="button"
              className="w-full text-sm text-slate-400 hover:text-white"
              onClick={() => {
                setStep('email');
                setDebugCode(null);
                requestMutation.reset();
                verifyMutation.reset();
              }}
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
