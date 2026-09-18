'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { resolveLeadLocale } from '@/locales';
import { eoiLeadSchema } from '@/shared/types';
import {
  FieldError,
  FieldLabel,
  PublicShell,
  inputClassName,
} from '@/components/public-shell';
import { SuccessModal } from '@/components/success-modal';
import { getErrorDetail, submitEoiLead } from '@/lib/api';
import { focusFirstFormError } from '@/lib/form-errors';

type FormValues = {
  role: 'local_bde';
  targetState: string;
  targetTerritory: string;
  fullLegalName: string;
  companyName: string;
  abn: string;
  acn: string;
  email: string;
  phone: string;
  corporateAddress: string;
  networkExperience: string;
  executionStrategy: string;
  declarationAccepted: boolean;
  honeypot: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

export function EoiPage() {
  const { t, i18n } = useTranslation('common');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const form = useForm<FormValues>({
    defaultValues: {
      role: 'local_bde',
      targetState: '',
      targetTerritory: '',
      fullLegalName: '',
      companyName: '',
      abn: '',
      acn: '',
      email: '',
      phone: '',
      corporateAddress: '',
      networkExperience: '',
      executionStrategy: '',
      declarationAccepted: false,
      honeypot: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof submitEoiLead>[0]) => submitEoiLead(payload),
    onSuccess: () => {
      setSuccess(true);
      setFieldErrors({});
      form.reset({
        role: 'local_bde',
        targetState: '',
        targetTerritory: '',
        fullLegalName: '',
        companyName: '',
        abn: '',
        acn: '',
        email: '',
        phone: '',
        corporateAddress: '',
        networkExperience: '',
        executionStrategy: '',
        declarationAccepted: false,
        honeypot: '',
      });
    },
  });

  function onSubmit(values: FormValues) {
    const parsed = eoiLeadSchema.safeParse({
      ...values,
      role: 'local_bde',
      locale: resolveLeadLocale(i18n.language),
      acn: values.acn || undefined,
    });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'role') as keyof FormValues;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      focusFirstFormError(errors, [
        'role',
        'targetState',
        'targetTerritory',
        'fullLegalName',
        'companyName',
        'abn',
        'email',
        'phone',
        'corporateAddress',
        'networkExperience',
        'executionStrategy',
        'declarationAccepted',
      ]);
      return;
    }

    setFieldErrors({});
    mutation.mutate(parsed.data);
  }

  return (
    <PublicShell>
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {t('eoi.pageTitle')}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
          {t('eoi.pageSubtitle')}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
        <div className="bg-clox-navy px-4 py-3 text-center text-white sm:px-6 sm:py-4">
          <h2 className="text-lg font-bold sm:text-xl">{t('eoi.cardTitle')}</h2>
        </div>

        <form
          className="space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <input type="hidden" {...form.register('role')} value="local_bde" />
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
            {...form.register('honeypot')}
          />

          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
            <strong className="text-clox-navy">{t('eoi.introStrong')}</strong> {t('eoi.introBody')}
          </p>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy">
              {t('eoi.section1')}
            </h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <strong className="block text-clox-navy">{t('eoi.localBdeTitle')}</strong>
              <span className="mb-2 mt-1 inline-flex rounded-full bg-clox-orange px-2 py-0.5 text-[0.7rem] font-semibold text-white">
                {t('eoi.localBdeBadge')}
              </span>
              <p className="text-xs leading-relaxed text-slate-500">{t('eoi.localBdeDesc')}</p>
            </div>
            <FieldError message={fieldErrors.role} />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel required>{t('eoi.targetState')}</FieldLabel>
                <input className={inputClassName} {...form.register('targetState')} />
                <FieldError message={fieldErrors.targetState} />
              </div>
              <div>
                <FieldLabel required>{t('eoi.targetTerritory')}</FieldLabel>
                <input className={inputClassName} {...form.register('targetTerritory')} />
                <FieldError message={fieldErrors.targetTerritory} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy sm:text-base">
              {t('eoi.section2')}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel required>{t('eoi.fullLegalName')}</FieldLabel>
                <input className={inputClassName} {...form.register('fullLegalName')} />
                <FieldError message={fieldErrors.fullLegalName} />
              </div>
              <div>
                <FieldLabel required>{t('eoi.companyName')}</FieldLabel>
                <input className={inputClassName} {...form.register('companyName')} />
                <FieldError message={fieldErrors.companyName} />
              </div>
              <div>
                <FieldLabel required>{t('eoi.abn')}</FieldLabel>
                <input className={inputClassName} {...form.register('abn')} />
                <FieldError message={fieldErrors.abn} />
              </div>
              <div>
                <FieldLabel>{t('eoi.acn')}</FieldLabel>
                <input className={inputClassName} {...form.register('acn')} />
              </div>
              <div>
                <FieldLabel required>{t('eoi.primaryEmail')}</FieldLabel>
                <input className={inputClassName} type="email" {...form.register('email')} />
                <FieldError message={fieldErrors.email} />
              </div>
              <div>
                <FieldLabel required>{t('eoi.contactPhone')}</FieldLabel>
                <input className={inputClassName} type="tel" {...form.register('phone')} />
                <FieldError message={fieldErrors.phone} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel required>{t('eoi.corporateAddress')}</FieldLabel>
                <input className={inputClassName} {...form.register('corporateAddress')} />
                <FieldError message={fieldErrors.corporateAddress} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy sm:text-base">
              {t('eoi.section3')}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 sm:items-stretch">
              <div className="flex h-full flex-col">
                <FieldLabel required>{t('eoi.networkExperience')}</FieldLabel>
                <textarea
                  className={`${inputClassName} mt-auto`}
                  rows={4}
                  {...form.register('networkExperience')}
                />
                <FieldError message={fieldErrors.networkExperience} />
              </div>
              <div className="flex h-full flex-col">
                <FieldLabel required>{t('eoi.executionStrategy')}</FieldLabel>
                <textarea
                  className={`${inputClassName} mt-auto`}
                  rows={4}
                  {...form.register('executionStrategy')}
                />
                <FieldError message={fieldErrors.executionStrategy} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy">
              {t('eoi.section4')}
            </h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
              <p>{t('eoi.commercialOverview')}</p>
              <p className="mt-2 text-[0.75rem] italic text-slate-500">{t('eoi.settlementNote')}</p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy">
              {t('eoi.section5')}
            </h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3" data-error-field="declarationAccepted">
              <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                <input type="checkbox" {...form.register('declarationAccepted')} />
                <span>{t('eoi.declaration')}</span>
              </label>
              <FieldError message={fieldErrors.declarationAccepted} />
            </div>
          </section>

          {mutation.isError ? (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {getErrorDetail(mutation.error)}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-full bg-clox-navy py-3 text-base font-bold text-white shadow disabled:opacity-50 sm:mx-auto sm:block sm:max-w-md sm:py-3.5"
          >
            {mutation.isPending ? t('submitting') : t('eoi.submit')}
          </button>
        </form>
      </div>

      <SuccessModal
        open={success}
        title={t('eoi.successTitle')}
        body={t('eoi.successBody')}
        onClose={() => setSuccess(false)}
      />
    </PublicShell>
  );
}
