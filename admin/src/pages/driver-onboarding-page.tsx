import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  getDriverAssignability,
  getDriverOnboarding,
  getErrorDetail,
  submitDriverProfile,
  type DriverOnboarding,
} from '@/lib/api';
import {
  fieldClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from '@/components/admin-shell';
import { LoadingBlock } from '@/components/status-blocks';
import { AppRole } from '@/shared/types';
import { useAuthStore } from '@/stores/auth-store';

const LICENCE_CLASSES = ['C', 'LR', 'MR', 'HR', 'HC', 'MC'] as const;

export function DriverOnboardingPage() {
  const role = useAuthStore((s) => s.role);
  const queryClient = useQueryClient();

  const onboarding = useQuery({
    queryKey: ['driver', 'onboarding'],
    queryFn: () => getDriverOnboarding(),
    enabled: role === AppRole.DRIVER,
  });

  const assignability = useQuery({
    queryKey: ['driver', 'assignability'],
    queryFn: () => getDriverAssignability(),
    enabled: role === AppRole.DRIVER && onboarding.data?.step === 'complete',
  });

  if (role !== AppRole.DRIVER) {
    return <Navigate to="/" replace />;
  }

  if (onboarding.isLoading) return <LoadingBlock label="Loading driver onboarding…" />;
  if (onboarding.isError) {
    return <p className="text-red-300">{getErrorDetail(onboarding.error)}</p>;
  }

  const data = onboarding.data!;
  const step = data.step;

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ['driver'] });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Driver onboarding</h1>
      <p className="mt-2 text-sm text-slate-400">
        {data.company ? (
          <>
            Company <span className="text-slate-200">{data.company.legalName}</span> · status{' '}
            <span className="font-mono text-slate-200">{data.driver.status}</span>
          </>
        ) : (
          <span className="text-amber-300">No company linked (orphan)</span>
        )}
      </p>

      {step === 'accept' ? (
        <div className="mt-8 space-y-3">
          <p className="text-sm text-amber-200">
            Invite not accepted yet. Open the invite link from your email, or ask the carrier to
            resend.
          </p>
          <Link to="/login" className={secondaryButtonClassName}>
            Back to login
          </Link>
        </div>
      ) : null}

      {step === 'licence' ? <LicenceStep onSaved={refresh} /> : null}

      {step === 'complete' ? (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-300">Driver active</h2>
          <ul className="text-sm text-slate-400">
            <li>
              Licence: {data.driver.licenceClass} · {data.driver.licenceNo} · exp{' '}
              {data.driver.licenceExpiry?.slice(0, 10)}
            </li>
            <li>NHVR acknowledged: {data.driver.nhvrAcknowledgedAt ? 'yes' : 'no'}</li>
            <li>canBeAssigned: {String(data.goNoGo.canBeAssigned)}</li>
            {assignability.data ? (
              <li>assignability reason: {assignability.data.reason ?? 'ok'}</li>
            ) : null}
            <li className="text-slate-500">{data.goNoGo.tripApisNote}</li>
          </ul>
        </div>
      ) : null}

      {step === 'suspended' ? (
        <p className="mt-8 text-sm text-red-300">
          Licence suspended (likely expired). Contact your carrier / Ops.
        </p>
      ) : null}
    </div>
  );
}

function LicenceStep({ onSaved }: { onSaved: () => Promise<void> }) {
  const [licenceNo, setLicenceNo] = useState('');
  const [licenceClass, setLicenceClass] = useState<(typeof LICENCE_CLASSES)[number]>('C');
  const [licenceExpiry, setLicenceExpiry] = useState('2030-12-31');
  const [nhvr, setNhvr] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      if (!nhvr) throw new Error('NHVR acknowledgement required');
      return submitDriverProfile({
        licenceNo: licenceNo.trim(),
        licenceClass,
        licenceExpiry,
        nhvrAcknowledged: true,
      });
    },
    onSuccess: () => onSaved(),
  });

  return (
    <form
      className="mt-8 max-w-lg space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <h2 className="text-lg font-semibold">Licence + NHVR (DRV-WEB-03/04)</h2>
      <p className="text-sm text-slate-400">
        Phase 1 auto-activates after submit (no Ops queue). Optional licence photo can use QA upload.
      </p>
      <input
        className={fieldClassName}
        placeholder="Licence number"
        value={licenceNo}
        onChange={(e) => setLicenceNo(e.target.value)}
        required
      />
      <select
        className={fieldClassName}
        value={licenceClass}
        onChange={(e) => setLicenceClass(e.target.value as (typeof LICENCE_CLASSES)[number])}
      >
        {LICENCE_CLASSES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        className={fieldClassName}
        type="date"
        value={licenceExpiry}
        onChange={(e) => setLicenceExpiry(e.target.value)}
        required
      />
      <label className="flex items-start gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1"
          checked={nhvr}
          onChange={(e) => setNhvr(e.target.checked)}
        />
        <span>
          I acknowledge NHVR / fatigue / safety obligations applicable to my work as a CLOX driver
          (Phase 1 policy stub).
        </span>
      </label>
      {mutation.isError ? (
        <p className="text-sm text-red-300">{getErrorDetail(mutation.error)}</p>
      ) : null}
      <button
        type="submit"
        className={primaryButtonClassName}
        disabled={!nhvr || mutation.isPending}
      >
        Submit &amp; activate
      </button>
    </form>
  );
}

/** Keep type import used for future steps */
export type { DriverOnboarding };
