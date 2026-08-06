'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { registryLeadSchema } from '@/shared/types';
import {
  FieldError,
  FieldLabel,
  PublicShell,
  StepIndicator,
  inputClassName,
} from '@/components/public-shell';
import { SuccessModal } from '@/components/success-modal';
import { getErrorDetail, submitRegistryLead } from '@/lib/api';
import { useRegistryWizardStore } from '@/stores/registry-wizard-store';

const OPS = [
  { value: 'Local Couriers & P2P On-Demand', labelKey: 'registry.ops.localCouriers' },
  { value: 'Heavy Vehicle / Multi-Stop Distribution', labelKey: 'registry.ops.heavyVehicle' },
  { value: 'Interstate Linehaul Lanes', labelKey: 'registry.ops.interstate' },
] as const;

const BIDDING = [
  { value: 'Per-KM Dynamic Spot Market Bidding', labelKey: 'registry.bidding.perKm' },
  {
    value: 'Standardized Hourly Block Booking (4-hr min)',
    labelKey: 'registry.bidding.hourlyBlock',
  },
] as const;

const VOLUME = [
  { value: 'Under $10k', labelKey: 'registry.volume.under10k' },
  { value: '$10k - $50k', labelKey: 'registry.volume.mid' },
  { value: '$50k+', labelKey: 'registry.volume.plus' },
] as const;

const FLEET = [
  { value: 'Light Commercial / Courier Vans', labelKey: 'registry.fleet.light' },
  { value: 'Medium Rigid Trucks (3T - 8T MR)', labelKey: 'registry.fleet.medium' },
  { value: 'Heavy Rigid (HR / 3-Axle Tray)', labelKey: 'registry.fleet.heavy' },
  { value: 'Prime Movers / Semi-Trailers / B-Doubles', labelKey: 'registry.fleet.prime' },
] as const;

const CAPABILITY = [
  { value: 'Dangerous Goods (DG) Licensed', labelKey: 'registry.capability.dg' },
  { value: 'Over-Size / Over-Mass (OSOM) Permits', labelKey: 'registry.capability.osom' },
  { value: 'Refrigerated / Cold Chain Infrastructure', labelKey: 'registry.capability.cold' },
] as const;

const INFRA = [
  { value: 'easyAML Portal', labelKey: 'registry.infra.easyAml' },
  { value: 'Stripe Connect Escrow', labelKey: 'registry.infra.stripe' },
  { value: 'Monoova NPP PayTo', labelKey: 'registry.infra.monoova' },
] as const;

const cities = ['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide'] as const;
const states = ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS'] as const;

type FormValues = {
  companyLegalName: string;
  fleetEntityName: string;
  abn: string;
  shippingOrigin: string;
  depotState: string;
  operationalModels: string[];
  biddingType: string;
  monthlyVolume: string;
  fleetComposition: string[];
  capabilities: string[];
  complianceAuthorized: boolean;
  infraAcknowledged: string[];
  email: string;
  phone: string;
  honeypot: string;
};

type FieldErrors = Partial<Record<keyof FormValues | 'userType', string>>;

function mapZodErrors(issues: { path: PropertyKey[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? 'userType') as keyof FieldErrors;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function RegistryPage() {
  const { t, i18n } = useTranslation('common');
  const { step, userType, setStep, setUserType, reset } = useRegistryWizardStore();
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const defaultValues = useMemo<FormValues>(
    () => ({
      companyLegalName: '',
      fleetEntityName: '',
      abn: '',
      shippingOrigin: '',
      depotState: '',
      operationalModels: [],
      biddingType: '',
      monthlyVolume: '',
      fleetComposition: [],
      capabilities: [],
      complianceAuthorized: false,
      infraAcknowledged: [],
      email: '',
      phone: '',
      honeypot: '',
    }),
    [],
  );

  const form = useForm<FormValues>({ defaultValues, mode: 'onSubmit' });
  const values = form.watch();

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof submitRegistryLead>[0]) =>
      submitRegistryLead(payload),
    onSuccess: () => {
      setSuccess(true);
      setFieldErrors({});
      reset();
      form.reset(defaultValues);
    },
  });

  const canSubmit = values.infraAcknowledged.length === INFRA.length;

  function buildPayload() {
    if (userType === 'sender') {
      return {
        userType: 'sender' as const,
        companyLegalName: values.companyLegalName,
        abn: values.abn,
        shippingOrigin: values.shippingOrigin,
        operationalModels: values.operationalModels,
        biddingType: values.biddingType,
        monthlyVolume: values.monthlyVolume,
        infraAcknowledged: values.infraAcknowledged,
        email: values.email,
        phone: values.phone,
        locale: i18n.language?.startsWith('hi') ? ('hi' as const) : ('en' as const),
        honeypot: values.honeypot,
      };
    }

    return {
      userType: 'carrier' as const,
      fleetEntityName: values.fleetEntityName,
      abn: values.abn,
      depotState: values.depotState,
      fleetComposition: values.fleetComposition,
      capabilities: values.capabilities,
      complianceAuthorized: values.complianceAuthorized,
      infraAcknowledged: values.infraAcknowledged,
      email: values.email,
      phone: values.phone,
      locale: i18n.language?.startsWith('hi') ? ('hi' as const) : ('en' as const),
      honeypot: values.honeypot,
    };
  }

  function validateCurrentStep(forSubmit = false) {
    if (!userType) {
      setFieldErrors({ userType: t('registry.selectRoleError') });
      return false;
    }

    const parsed = registryLeadSchema.safeParse(buildPayload());
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }

    const errors = mapZodErrors(parsed.error.issues);
    if (!forSubmit) {
      // Step 2 doesn't require infra yet.
      delete errors.infraAcknowledged;
      const step2Keys = Object.keys(errors);
      if (step2Keys.length === 0) {
        setFieldErrors({});
        return true;
      }
    }

    setFieldErrors(errors);
    return false;
  }

  function goToStep3() {
    if (validateCurrentStep(false)) setStep(3);
  }

  function onSubmit() {
    if (!validateCurrentStep(true)) return;
    const parsed = registryLeadSchema.safeParse(buildPayload());
    if (!parsed.success) return;
    mutation.mutate(parsed.data);
  }

  return (
    <PublicShell>
      <div className="mb-6 text-center sm:mb-8">
        <span className="inline-flex rounded-full bg-clox-orange px-3 py-1 text-xs font-semibold text-white">
          {t('preLaunch')}
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {t('registry.heroTitleLine1')} <br className="sm:hidden" />
          <span className="sm:ml-2">{t('registry.heroTitleLine2')}</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
          {t('registry.heroWelcome')}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
        <StepIndicator activeStep={step} />

        <form
          className="p-4 sm:p-6 md:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
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

          {step === 1 ? (
            <div>
              <h2 className="text-lg font-bold text-clox-navy">{t('registry.joinTitle')}</h2>
              <p className="mb-3 text-sm text-slate-500">{t('registry.joinPrompt')}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <RoleButton
                  title={t('registry.senderRoleTitle')}
                  subtitle={t('registry.senderRoleSubtitle')}
                  selected={userType === 'sender'}
                  onClick={() => setUserType('sender')}
                />
                <RoleButton
                  title={t('registry.carrierRoleTitle')}
                  subtitle={t('registry.carrierRoleSubtitle')}
                  selected={userType === 'carrier'}
                  onClick={() => setUserType('carrier')}
                />
              </div>
              <FieldError message={fieldErrors.userType} />
            </div>
          ) : null}

          {step === 2 && userType ? (
            <div>
              <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <button type="button" className="text-slate-500" onClick={() => setStep(1)}>
                  ←
                </button>
                <h2 className="text-lg font-bold text-clox-navy">
                  {userType === 'sender' ? t('registry.senderDetails') : t('registry.carrierDetails')}
                </h2>
              </div>

              {userType === 'sender' ? (
                <SenderFields form={form} values={values} errors={fieldErrors} />
              ) : (
                <CarrierFields form={form} values={values} errors={fieldErrors} />
              )}

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel required>{t('email')}</FieldLabel>
                  <input className={inputClassName} type="email" {...form.register('email')} />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div>
                  <FieldLabel required>{t('phone')}</FieldLabel>
                  <input className={inputClassName} type="tel" {...form.register('phone')} />
                  <FieldError message={fieldErrors.phone} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button type="button" className="text-sm text-slate-500" onClick={() => setStep(1)}>
                  {t('registry.backArrow')}
                </button>
                <button
                  type="button"
                  onClick={goToStep3}
                  className="rounded-full bg-clox-orange px-5 py-2 text-sm font-bold text-white shadow"
                >
                  {t('registry.continueArrow')}
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="mb-4 text-center text-lg font-bold text-clox-navy">
                {t('registry.verifyTitle')}
              </h2>
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                {INFRA.map((option) => {
                  const selected = values.infraAcknowledged.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? values.infraAcknowledged.filter((item) => item !== option.value)
                          : [...values.infraAcknowledged, option.value];
                        form.setValue('infraAcknowledged', next);
                      }}
                      className={`relative flex items-start gap-3 rounded-xl border p-3 text-left shadow-sm sm:flex-col sm:items-center sm:p-4 sm:text-center ${
                        selected ? 'border-clox-orange bg-orange-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clox-navy text-white">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-clox-navy">{t(option.labelKey)}</div>
                        <p className="text-xs text-slate-500">{t('registry.infraAckHint')}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {mutation.isError ? (
                <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {getErrorDetail(mutation.error)}
                </p>
              ) : null}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit || mutation.isPending}
                  className="w-full rounded-full bg-clox-navy py-3 text-base font-bold text-white shadow disabled:cursor-not-allowed disabled:opacity-50 sm:mx-auto sm:block sm:max-w-md sm:py-3.5"
                >
                  {mutation.isPending ? t('submitting') : t('registry.finalize')}
                </button>
                <button
                  type="button"
                  className="mx-auto text-sm text-slate-500"
                  onClick={() => setStep(2)}
                >
                  {t('registry.backToDetails')}
                </button>
              </div>
            </div>
          ) : null}
        </form>
      </div>

      <SuccessModal
        open={success}
        title={t('registry.successTitle')}
        body={t('registry.successBody')}
        onClose={() => setSuccess(false)}
      />
    </PublicShell>
  );
}

function RoleButton({
  title,
  subtitle,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-left ${
        selected ? 'border-clox-orange bg-orange-50' : 'border-clox-navy/20 bg-white'
      }`}
    >
      <span className="block font-bold text-clox-navy">{title}</span>
      <span className="text-xs text-slate-500">{subtitle}</span>
    </button>
  );
}

function SenderFields({
  form,
  values,
  errors,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  values: FormValues;
  errors: FieldErrors;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FieldLabel required>{t('registry.companyLegalName')}</FieldLabel>
        <input
          className={inputClassName}
          placeholder={t('registry.companyPlaceholder')}
          {...form.register('companyLegalName')}
        />
        <FieldError message={errors.companyLegalName} />
      </div>
      <div>
        <FieldLabel required>{t('registry.abn')}</FieldLabel>
        <input
          className={inputClassName}
          placeholder={t('registry.abnPlaceholderSender')}
          {...form.register('abn')}
        />
        <FieldError message={errors.abn} />
      </div>
      <div>
        <FieldLabel required>{t('registry.shippingOrigin')}</FieldLabel>
        <select className={inputClassName} {...form.register('shippingOrigin')}>
          <option value="">{t('registry.selectCity')}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <FieldError message={errors.shippingOrigin} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 sm:p-4">
        <FieldLabel required>{t('registry.operationalModel')}</FieldLabel>
        <div className="mt-1 grid gap-1 sm:grid-cols-2">
          {OPS.map((option) => (
            <label key={option.value} className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={values.operationalModels.includes(option.value)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...values.operationalModels, option.value]
                    : values.operationalModels.filter((item) => item !== option.value);
                  form.setValue('operationalModels', next);
                }}
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.operationalModels} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 sm:p-4">
        <FieldLabel required>{t('registry.biddingStructure')}</FieldLabel>
        <div className="mt-1 grid gap-1 sm:grid-cols-2">
          {BIDDING.map((option) => (
            <label key={option.value} className="flex items-start gap-2 text-sm text-slate-600">
              <input type="radio" value={option.value} {...form.register('biddingType')} />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.biddingType} />
      </div>

      <div className="sm:col-span-2">
        <FieldLabel required>{t('registry.monthlyVolume')}</FieldLabel>
        <select className={inputClassName} {...form.register('monthlyVolume')}>
          <option value="">{t('registry.selectVolume')}</option>
          {VOLUME.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
        <FieldError message={errors.monthlyVolume} />
      </div>
    </div>
  );
}

function CarrierFields({
  form,
  values,
  errors,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  values: FormValues;
  errors: FieldErrors;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FieldLabel required>{t('registry.fleetEntityName')}</FieldLabel>
        <input
          className={inputClassName}
          placeholder={t('registry.fleetPlaceholder')}
          {...form.register('fleetEntityName')}
        />
        <FieldError message={errors.fleetEntityName} />
      </div>
      <div>
        <FieldLabel required>{t('registry.abn')}</FieldLabel>
        <input
          className={inputClassName}
          placeholder={t('registry.abnPlaceholderCarrier')}
          {...form.register('abn')}
        />
        <FieldError message={errors.abn} />
      </div>
      <div>
        <FieldLabel required>{t('registry.depotState')}</FieldLabel>
        <select className={inputClassName} {...form.register('depotState')}>
          <option value="">{t('registry.selectState')}</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <FieldError message={errors.depotState} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 sm:p-4">
        <FieldLabel required>{t('registry.fleetComposition')}</FieldLabel>
        <div className="mt-1 grid gap-1 sm:grid-cols-2">
          {FLEET.map((option) => (
            <label key={option.value} className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={values.fleetComposition.includes(option.value)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...values.fleetComposition, option.value]
                    : values.fleetComposition.filter((item) => item !== option.value);
                  form.setValue('fleetComposition', next);
                }}
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.fleetComposition} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 sm:p-4">
        <FieldLabel>{t('registry.capabilities')}</FieldLabel>
        <div className="mt-1 grid gap-1 sm:grid-cols-2">
          {CAPABILITY.map((option) => (
            <label key={option.value} className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={values.capabilities.includes(option.value)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...values.capabilities, option.value]
                    : values.capabilities.filter((item) => item !== option.value);
                  form.setValue('capabilities', next);
                }}
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2 sm:p-4">
        <FieldLabel required>{t('registry.complianceAuth')}</FieldLabel>
        <label className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
          <input type="checkbox" {...form.register('complianceAuthorized')} />
          <span>{t('registry.complianceAuthBody')}</span>
        </label>
        <FieldError message={errors.complianceAuthorized} />
      </div>
    </div>
  );
}
