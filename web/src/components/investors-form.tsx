'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { resolveLeadLocale } from '@/locales';
import {
  capitalAllocationSchema,
  ecosystemFocusSchema,
  investorClassificationSchema,
  investorLeadSchema,
} from '@/shared/types';
import {
  FieldError,
  FieldLabel,
  PublicShell,
  inputClassName,
} from '@/components/public-shell';
import {
  ChoiceCard,
  ChoiceCheckbox,
  ChoiceOption,
  ChoiceRadio,
} from '@/components/form-controls';
import { SuccessModal } from '@/components/success-modal';
import { getErrorDetail, submitInvestorLead } from '@/lib/api';
import { focusFirstFormError } from '@/lib/form-errors';

type Classification = (typeof investorClassificationSchema.options)[number];
type CapitalBand = (typeof capitalAllocationSchema.options)[number];
type EcosystemFocus = (typeof ecosystemFocusSchema.options)[number];

type FormValues = {
  fullNameOrEntity: string;
  contactPersonName: string;
  email: string;
  phone: string;
  abn: string;
  acn: string;
  residence: string;
  investorClassifications: Classification[];
  capitalAllocation: CapitalBand | '';
  ecosystemFocus: EcosystemFocus | '';
  strategicNotes: string;
  authorizedName: string;
  declarationAccepted: boolean;
  honeypot: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const classifications: {
  value: Classification;
  titleKey: 'investors.class.sophisticatedTitle' | 'investors.class.professionalTitle' | 'investors.class.strategicTitle';
  descKey: 'investors.class.sophisticatedDesc' | 'investors.class.professionalDesc' | 'investors.class.strategicDesc';
}[] = [
  {
    value: 'sophisticated_investor',
    titleKey: 'investors.class.sophisticatedTitle',
    descKey: 'investors.class.sophisticatedDesc',
  },
  {
    value: 'professional_investor',
    titleKey: 'investors.class.professionalTitle',
    descKey: 'investors.class.professionalDesc',
  },
  {
    value: 'strategic_industry_partner',
    titleKey: 'investors.class.strategicTitle',
    descKey: 'investors.class.strategicDesc',
  },
];

const capitalBands: {
  value: CapitalBand;
  labelKey: 'investors.capital.band1' | 'investors.capital.band2' | 'investors.capital.band3' | 'investors.capital.band4';
}[] = [
  { value: '25000_99999', labelKey: 'investors.capital.band1' },
  { value: '100000_249999', labelKey: 'investors.capital.band2' },
  { value: '250000_499999', labelKey: 'investors.capital.band3' },
  { value: '500000_plus', labelKey: 'investors.capital.band4' },
];

const focusAreas: {
  value: EcosystemFocus;
  labelKey: 'investors.focus.financial' | 'investors.focus.carrier' | 'investors.focus.sender' | 'investors.focus.admin';
}[] = [
  { value: 'pure_financial_growth', labelKey: 'investors.focus.financial' },
  { value: 'strategic_carrier_fleet', labelKey: 'investors.focus.carrier' },
  { value: 'enterprise_sender_pipeline', labelKey: 'investors.focus.sender' },
  { value: 'regional_admin_network', labelKey: 'investors.focus.admin' },
];

export function InvestorsPage() {
  const { t, i18n } = useTranslation('common');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const form = useForm<FormValues>({
    defaultValues: {
      fullNameOrEntity: '',
      contactPersonName: '',
      email: '',
      phone: '',
      abn: '',
      acn: '',
      residence: '',
      investorClassifications: [],
      capitalAllocation: '',
      ecosystemFocus: '',
      strategicNotes: '',
      authorizedName: '',
      declarationAccepted: false,
      honeypot: '',
    },
  });

  const selectedClassifications = form.watch('investorClassifications');

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof submitInvestorLead>[0]) =>
      submitInvestorLead(payload),
    onSuccess: () => {
      setSuccess(true);
      setFieldErrors({});
      form.reset();
    },
  });

  function toggleClassification(value: Classification) {
    const current = form.getValues('investorClassifications');
    form.setValue(
      'investorClassifications',
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
      { shouldDirty: true },
    );
  }

  function onSubmit(values: FormValues) {
    const parsed = investorLeadSchema.safeParse({
      ...values,
      capitalAllocation: values.capitalAllocation || undefined,
      ecosystemFocus: values.ecosystemFocus || undefined,
      abn: values.abn || undefined,
      acn: values.acn || undefined,
      contactPersonName: values.contactPersonName || undefined,
      locale: resolveLeadLocale(i18n.language),
      source: 'web:/investors',
    });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'fullNameOrEntity') as keyof FormValues;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      focusFirstFormError(errors, [
        'fullNameOrEntity',
        'contactPersonName',
        'email',
        'phone',
        'abn',
        'acn',
        'residence',
        'investorClassifications',
        'capitalAllocation',
        'ecosystemFocus',
        'strategicNotes',
        'declarationAccepted',
        'authorizedName',
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
          {t('investors.pageTitle')}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
          {t('investors.pageSubtitle')}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
        <div className="bg-clox-navy px-4 py-3 text-center text-white sm:px-6 sm:py-4">
          <h2 className="text-lg font-bold sm:text-xl">{t('investors.cardTitle')}</h2>
        </div>

        <form
          className="space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
            {...form.register('honeypot')}
          />

          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
            {t('investors.confidentiality')}
          </p>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy">
              {t('investors.section1')}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel required>{t('investors.fullNameOrEntity')}</FieldLabel>
                <input className={inputClassName} {...form.register('fullNameOrEntity')} />
                <FieldError message={fieldErrors.fullNameOrEntity} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{t('investors.contactPersonName')}</FieldLabel>
                <input className={inputClassName} {...form.register('contactPersonName')} />
                <FieldError message={fieldErrors.contactPersonName} />
              </div>
              <div>
                <FieldLabel required>{t('investors.emailAddress')}</FieldLabel>
                <input className={inputClassName} type="email" {...form.register('email')} />
                <FieldError message={fieldErrors.email} />
              </div>
              <div>
                <FieldLabel required>{t('investors.phoneNumber')}</FieldLabel>
                <input className={inputClassName} type="tel" {...form.register('phone')} />
                <FieldError message={fieldErrors.phone} />
              </div>
              <div>
                <FieldLabel>{t('investors.abn')}</FieldLabel>
                <input className={inputClassName} {...form.register('abn')} />
                <FieldError message={fieldErrors.abn} />
              </div>
              <div>
                <FieldLabel>{t('investors.acn')}</FieldLabel>
                <input className={inputClassName} {...form.register('acn')} />
                <FieldError message={fieldErrors.acn} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel required>{t('investors.residence')}</FieldLabel>
                <input className={inputClassName} {...form.register('residence')} />
                <FieldError message={fieldErrors.residence} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy sm:text-base">
              {t('investors.section2')}
            </h3>
            <p className="mb-2 text-xs text-slate-500">{t('selectAllThatApply')}</p>
            <div className="grid gap-3 sm:grid-cols-3" data-error-field="investorClassifications">
              {classifications.map((item) => (
                <ChoiceCard key={item.value}>
                  <ChoiceCheckbox
                    checked={selectedClassifications.includes(item.value)}
                    onChange={() => toggleClassification(item.value)}
                  />
                  <div className="min-w-0">
                    <strong className="block text-clox-navy">{t(item.titleKey)}</strong>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {t(item.descKey)}
                    </p>
                  </div>
                </ChoiceCard>
              ))}
            </div>
            <FieldError message={fieldErrors.investorClassifications} />
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy sm:text-base">
              {t('investors.section3')}
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel required>{t('investors.capitalAllocation')}</FieldLabel>
                <div className="flex flex-col gap-2">
                  {capitalBands.map((band) => (
                    <ChoiceOption key={band.value}>
                      <ChoiceRadio
                        value={band.value}
                        {...form.register('capitalAllocation')}
                      />
                      <span>{t(band.labelKey)}</span>
                    </ChoiceOption>
                  ))}
                </div>
                <FieldError message={fieldErrors.capitalAllocation} />
              </div>
              <div>
                <FieldLabel required>{t('investors.ecosystemFocus')}</FieldLabel>
                <div className="flex flex-col gap-2">
                  {focusAreas.map((area) => (
                    <ChoiceOption key={area.value}>
                      <ChoiceRadio
                        value={area.value}
                        {...form.register('ecosystemFocus')}
                      />
                      <span>{t(area.labelKey)}</span>
                    </ChoiceOption>
                  ))}
                </div>
                <FieldError message={fieldErrors.ecosystemFocus} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy">
              {t('investors.section4')}
            </h3>
            <FieldLabel required>{t('investors.strategicNotes')}</FieldLabel>
            <textarea
              className={inputClassName}
              rows={4}
              {...form.register('strategicNotes')}
            />
            <FieldError message={fieldErrors.strategicNotes} />
          </section>

          <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-clox-navy">
              {t('investors.section5')}
            </h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3" data-error-field="declarationAccepted">
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-600">
                <ChoiceCheckbox {...form.register('declarationAccepted')} />
                <span>{t('investors.declaration')}</span>
              </label>
              <FieldError message={fieldErrors.declarationAccepted} />
              <div className="mt-3">
                <FieldLabel required>{t('investors.authorizedName')}</FieldLabel>
                <input className={inputClassName} {...form.register('authorizedName')} />
                <FieldError message={fieldErrors.authorizedName} />
              </div>
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
            {mutation.isPending ? t('submitting') : t('investors.submit')}
          </button>

          <p className="text-center text-[0.7rem] text-slate-400">{t('investors.footerContact')}</p>
        </form>
      </div>

      <SuccessModal
        open={success}
        title={t('investors.successTitle')}
        body={t('investors.successBody')}
        onClose={() => setSuccess(false)}
      />
    </PublicShell>
  );
}
