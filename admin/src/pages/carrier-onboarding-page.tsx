import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  addCarrierVehicle,
  confirmCarrierConnect,
  confirmDocument,
  createUploadIntent,
  getCarrierOnboarding,
  getErrorDetail,
  inviteCarrierDriver,
  resendCarrierDriverInvite,
  setupCarrierConnect,
  submitCarrierVerification,
  updateCarrierCapabilities,
  updateCarrierProfile,
  uploadDocumentContent,
  type CarrierOnboarding,
} from '@/lib/api';
import {
  fieldClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from '@/components/admin-shell';
import { LoadingBlock } from '@/components/status-blocks';
import { AppRole } from '@/shared/types';
import { useAuthStore } from '@/stores/auth-store';

const STEPS = [
  'profile',
  'documents',
  'connect',
  'vehicles',
  'drivers',
  'capabilities',
  'submit',
  'waiting_ops',
  'complete',
] as const;

function StepPill({ current, id, label }: { current: string; id: (typeof STEPS)[number]; label: string }) {
  const active = current === id;
  const currentIdx = STEPS.indexOf(current as (typeof STEPS)[number]);
  const idIdx = STEPS.indexOf(id);
  const done = currentIdx >= 0 && idIdx >= 0 && currentIdx > idIdx;
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? 'bg-clox-orange text-white'
          : done
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'bg-white/5 text-slate-500'
      }`}
    >
      {label}
    </span>
  );
}

export function CarrierOnboardingPage() {
  const role = useAuthStore((s) => s.role);
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['carrier', 'onboarding'],
    queryFn: () => getCarrierOnboarding(),
    enabled: role === AppRole.TRANSPORT_COMPANY,
  });

  if (role !== AppRole.TRANSPORT_COMPANY) {
    return <Navigate to="/" replace />;
  }
  if (query.isLoading) return <LoadingBlock label="Loading carrier onboarding…" />;
  if (query.isError || !query.data) {
    return (
      <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {getErrorDetail(query.error)}
      </p>
    );
  }

  const data = query.data;
  const step = data.step;
  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ['carrier', 'onboarding'] });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Carrier onboarding</h1>
      <p className="mt-2 text-sm text-slate-400">
        M4 wizard — Connect + fleet + Ops unlock → bid-eligible.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <StepPill current={step} id="profile" label="1 Legal" />
        <StepPill current={step} id="documents" label="2 Docs" />
        <StepPill current={step} id="connect" label="3 Connect" />
        <StepPill current={step} id="vehicles" label="4 Fleet" />
        <StepPill current={step} id="drivers" label="5 Drivers" />
        <StepPill current={step} id="capabilities" label="6 Caps" />
        <StepPill current={step} id="submit" label="7 Submit" />
        <StepPill current={step} id="waiting_ops" label="8 Ops" />
        <StepPill current={step} id="complete" label="Done" />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
        company <span className="font-mono text-slate-200">{data.company.status}</span> · canBid=
        <span className="text-slate-200">{String(data.goNoGo.canBid)}</span>
        {data.stripeMock ? ' · Stripe MOCK' : ''}
      </div>

      {step === 'profile' && <ProfileStep data={data} onSaved={refresh} />}
      {step === 'documents' && (
        <DocumentsStep companyId={data.company.id} onSubmitted={refresh} />
      )}
      {step === 'connect' && <ConnectStep mock={data.stripeMock} onDone={refresh} />}
      {step === 'vehicles' && <VehiclesStep data={data} onSaved={refresh} />}
      {step === 'drivers' && <DriversStep data={data} onSaved={refresh} />}
      {step === 'capabilities' && <CapabilitiesStep data={data} onSaved={refresh} />}
      {step === 'submit' && <SubmitStep data={data} onSubmitted={refresh} />}
      {step === 'waiting_ops' && (
        <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
          <h2 className="text-lg font-semibold text-amber-100">Waiting for Ops</h2>
          <p className="mt-2 text-sm text-amber-100/80">
            Case {data.latestCase?.status ?? 'OPEN'} — Super/State must Approve → BID_ELIGIBLE.
          </p>
          <button type="button" className={`${secondaryButtonClassName} mt-4`} onClick={() => void query.refetch()}>
            Refresh status
          </button>
        </div>
      )}
      {step === 'rejected' && (
        <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-200">
          Application rejected. {data.latestCase?.decisionNote}
        </div>
      )}
      {step === 'complete' && (
        <div className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
          <h2 className="text-lg font-semibold text-emerald-200">Bid eligible</h2>
          <p className="mt-2 text-sm text-emerald-100/80">{data.goNoGo.netPayoutHint}</p>
          <ul className="mt-3 space-y-1 text-xs text-emerald-100/70">
            <li>Ops: {String(data.goNoGo.opsApproved)}</li>
            <li>Connect: {String(data.goNoGo.connectReady)}</li>
            <li>Fleet: {String(data.goNoGo.fleetReady)}</li>
            <li>canBid: {String(data.goNoGo.canBid)}</li>
          </ul>
        </div>
      )}

      <p className="mt-8 text-sm text-slate-500">
        <Link to="/" className="text-clox-orange hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}

function ProfileStep({ data, onSaved }: { data: CarrierOnboarding; onSaved: () => Promise<void> }) {
  const [legalName, setLegalName] = useState(data.company.legalName || '');
  const [abn, setAbn] = useState(data.company.abn || '');
  const mutation = useMutation({
    mutationFn: () =>
      updateCarrierProfile({
        legalName,
        abn,
        homeRegionCode: 'VIC',
      }),
    onSuccess: () => onSaved(),
  });
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <h2 className="text-lg font-semibold">Legal entity</h2>
      <input className={fieldClassName} placeholder="Legal name" value={legalName} onChange={(e) => setLegalName(e.target.value)} required />
      <input className={fieldClassName} placeholder="ABN (11 digits)" value={abn} onChange={(e) => setAbn(e.target.value)} required />
      {mutation.isError ? <p className="text-sm text-red-300">{getErrorDetail(mutation.error)}</p> : null}
      <button type="submit" className={primaryButtonClassName} disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Save & continue'}
      </button>
    </form>
  );
}

function DocumentsStep({ companyId, onSubmitted }: { companyId: string; onSubmitted: () => Promise<void> }) {
  const [plId, setPlId] = useState<string | null>(null);
  const [cargoId, setCargoId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function upload(docType: 'PUBLIC_LIABILITY' | 'CARGO_INSURANCE', file: File) {
    const mime = (file.type || 'application/pdf') as
      | 'application/pdf'
      | 'image/jpeg'
      | 'image/png'
      | 'image/webp';
    const intent = await createUploadIntent({
      companyId,
      docType,
      originalFilename: file.name,
      mimeType: mime,
      sizeBytes: file.size,
    });
    const up = await uploadDocumentContent(intent.id, file);
    await confirmDocument(intent.id, up.contentHash);
    return intent.id;
  }

  const uploadPl = useMutation({
    mutationFn: async (file: File) => upload('PUBLIC_LIABILITY', file),
    onSuccess: (id) => {
      setPlId(id);
      setMessage('Public liability uploaded');
    },
  });
  const uploadCargo = useMutation({
    mutationFn: async (file: File) => upload('CARGO_INSURANCE', file),
    onSuccess: (id) => {
      setCargoId(id);
      setMessage('Cargo insurance uploaded');
    },
  });

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Compliance documents</h2>
      <p className="text-sm text-slate-400">Required: PUBLIC_LIABILITY + CARGO_INSURANCE (manual Ops review)</p>
      <div>
        <p className="mb-1 text-xs text-slate-500">Public liability</p>
        <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadPl.mutate(f);
        }} />
      </div>
      <div>
        <p className="mb-1 text-xs text-slate-500">Cargo insurance</p>
        <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadCargo.mutate(f);
        }} />
      </div>
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {(uploadPl.isError || uploadCargo.isError) && (
        <p className="text-sm text-red-300">{getErrorDetail(uploadPl.error ?? uploadCargo.error)}</p>
      )}
      <button
        type="button"
        className={primaryButtonClassName}
        disabled={!plId || !cargoId}
        onClick={() => void onSubmitted()}
      >
        Continue (docs saved — submit later)
      </button>
      <p className="text-xs text-slate-500">
        After Connect + fleet, use Submit step to open the Ops case with these uploads.
      </p>
    </div>
  );
}

function ConnectStep({ mock, onDone }: { mock: boolean; onDone: () => Promise<void> }) {
  const [info, setInfo] = useState<string | null>(null);
  const setup = useMutation({
    mutationFn: () => setupCarrierConnect(),
    onSuccess: (data) => {
      setInfo(data.mock ? `Mock Connect ${data.accountId}` : `Open onboarding: ${data.url}`);
      if (!data.mock && data.url) window.open(data.url, '_blank');
    },
  });
  const confirm = useMutation({
    mutationFn: () => confirmCarrierConnect(),
    onSuccess: () => onDone(),
  });
  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Stripe Connect</h2>
      <p className="text-sm text-slate-400">
        {mock
          ? 'Mock mode — create account then confirm payouts (no real Connect).'
          : 'Create Express account, complete Stripe Account Link, then confirm.'}
      </p>
      {(setup.isError || confirm.isError) && (
        <p className="text-sm text-red-300">{getErrorDetail(setup.error ?? confirm.error)}</p>
      )}
      {info ? <p className="text-sm text-emerald-300">{info}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={secondaryButtonClassName} disabled={setup.isPending} onClick={() => setup.mutate()}>
          Create Connect account
        </button>
        <button type="button" className={primaryButtonClassName} disabled={confirm.isPending} onClick={() => confirm.mutate()}>
          Confirm payouts ready
        </button>
      </div>
    </div>
  );
}

function VehiclesStep({ data, onSaved }: { data: CarrierOnboarding; onSaved: () => Promise<void> }) {
  const [label, setLabel] = useState('Primary truck');
  const [registration, setRegistration] = useState('');
  const [vehicleClass, setVehicleClass] = useState('RIGID_1_2T');
  const mutation = useMutation({
    mutationFn: () =>
      addCarrierVehicle({
        label,
        registration,
        vehicleClass,
        tareKg: 3500,
        gvmKg: 8000,
      }),
    onSuccess: () => onSaved(),
  });
  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Fleet (≥1 vehicle)</h2>
      {data.vehicles.length > 0 ? (
        <ul className="text-sm text-slate-300">
          {data.vehicles.map((v) => (
            <li key={v.id} className="font-mono text-xs">
              {v.registration} · {v.vehicleClass} · {v.label}
            </li>
          ))}
        </ul>
      ) : null}
      <input className={fieldClassName} placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input className={fieldClassName} placeholder="Registration" value={registration} onChange={(e) => setRegistration(e.target.value)} />
      <input className={fieldClassName} placeholder="Class e.g. RIGID_1_2T" value={vehicleClass} onChange={(e) => setVehicleClass(e.target.value)} />
      {mutation.isError ? <p className="text-sm text-red-300">{getErrorDetail(mutation.error)}</p> : null}
      <button type="button" className={primaryButtonClassName} disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        Add vehicle
      </button>
      {data.vehicles.length >= 1 ? (
        <button type="button" className={secondaryButtonClassName} onClick={() => void onSaved()}>
          Continue
        </button>
      ) : null}
    </div>
  );
}

function DriversStep({ data, onSaved }: { data: CarrierOnboarding; onSaved: () => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastInvite, setLastInvite] = useState<{
    inviteUrl: string;
    debugToken?: string;
    mailSkipped: boolean;
  } | null>(null);
  const mutation = useMutation({
    mutationFn: () => inviteCarrierDriver({ email, name }),
    onSuccess: async (res) => {
      if (res.invite) {
        setLastInvite({
          inviteUrl: res.invite.inviteUrl,
          debugToken: res.invite.debugToken,
          mailSkipped: res.invite.mailSkipped,
        });
      }
      await onSaved();
    },
  });
  const resend = useMutation({
    mutationFn: (driverId: string) => resendCarrierDriverInvite(driverId),
    onSuccess: (res) => {
      setLastInvite({
        inviteUrl: res.inviteUrl,
        debugToken: res.debugToken,
        mailSkipped: res.mailSkipped,
      });
    },
  });
  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Drivers (≥1 invite)</h2>
      <p className="text-sm text-slate-400">
        Sends invite link (M5). Driver accepts → OTP login → licence + NHVR.
      </p>
      {data.drivers.length > 0 ? (
        <ul className="space-y-2 text-sm text-slate-300">
          {data.drivers.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span>
                {d.email} · {d.status}
              </span>
              {d.status === 'INVITED' ? (
                <button
                  type="button"
                  className={secondaryButtonClassName}
                  disabled={resend.isPending}
                  onClick={() => resend.mutate(d.id)}
                >
                  Resend
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      <input className={fieldClassName} placeholder="Driver name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={fieldClassName} type="email" placeholder="Driver email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {mutation.isError ? <p className="text-sm text-red-300">{getErrorDetail(mutation.error)}</p> : null}
      {resend.isError ? <p className="text-sm text-red-300">{getErrorDetail(resend.error)}</p> : null}
      {lastInvite ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-300">
          <p>Invite URL:</p>
          <a className="break-all text-clox-orange underline" href={lastInvite.inviteUrl}>
            {lastInvite.inviteUrl}
          </a>
          {lastInvite.mailSkipped && lastInvite.debugToken ? (
            <p className="mt-2 text-amber-200">SMTP skipped — debug token: {lastInvite.debugToken}</p>
          ) : null}
        </div>
      ) : null}
      <button type="button" className={primaryButtonClassName} disabled={mutation.isPending} onClick={() => mutation.mutate()}>
        Invite driver
      </button>
      {data.drivers.length >= 1 ? (
        <button type="button" className={secondaryButtonClassName} onClick={() => void onSaved()}>
          Continue
        </button>
      ) : null}
    </div>
  );
}

function CapabilitiesStep({ data, onSaved }: { data: CarrierOnboarding; onSaved: () => Promise<void> }) {
  const [dg, setDg] = useState(data.company.capabilities.includes('DG'));
  const [reefer, setReefer] = useState(data.company.capabilities.includes('REEFER'));
  const [tailLift, setTailLift] = useState(
    data.company.capabilities.length === 0 || data.company.capabilities.includes('TAIL_LIFT'),
  );
  const mutation = useMutation({
    mutationFn: () => {
      const capabilities = [
        ...(dg ? (['DG'] as const) : []),
        ...(reefer ? (['REEFER'] as const) : []),
        ...(tailLift ? (['TAIL_LIFT'] as const) : []),
      ];
      return updateCarrierCapabilities({
        capabilities,
        serviceRegionCodes: ['VIC'],
      });
    },
    onSuccess: () => onSaved(),
  });
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <h2 className="text-lg font-semibold">Capabilities & regions</h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={tailLift} onChange={(e) => setTailLift(e.target.checked)} /> Tail lift
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={reefer} onChange={(e) => setReefer(e.target.checked)} /> Reefer
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={dg} onChange={(e) => setDg(e.target.checked)} /> Dangerous goods
      </label>
      <p className="text-xs text-slate-500">Service region: VIC (Gate 0)</p>
      {mutation.isError ? <p className="text-sm text-red-300">{getErrorDetail(mutation.error)}</p> : null}
      <button type="submit" className={primaryButtonClassName} disabled={mutation.isPending}>
        Save & continue
      </button>
    </form>
  );
}

function SubmitStep({
  data,
  onSubmitted,
}: {
  data: CarrierOnboarding;
  onSubmitted: () => Promise<void>;
}) {
  const existing = data.uploadedDocs ?? [];
  const pl = existing.find((d) => d.docType === 'PUBLIC_LIABILITY');
  const cargo = existing.find((d) => d.docType === 'CARGO_INSURANCE');
  const [plId, setPlId] = useState<string | null>(pl?.id ?? null);
  const [cargoId, setCargoId] = useState<string | null>(cargo?.id ?? null);
  const [msg, setMsg] = useState<string | null>(
    pl && cargo ? 'Using previously uploaded PL + cargo' : null,
  );

  async function upload(docType: 'PUBLIC_LIABILITY' | 'CARGO_INSURANCE', file: File) {
    const mime = (file.type || 'application/pdf') as
      | 'application/pdf'
      | 'image/jpeg'
      | 'image/png'
      | 'image/webp';
    const intent = await createUploadIntent({
      companyId: data.company.id,
      docType,
      originalFilename: file.name,
      mimeType: mime,
      sizeBytes: file.size,
    });
    const up = await uploadDocumentContent(intent.id, file);
    await confirmDocument(intent.id, up.contentHash);
    return intent.id;
  }

  const submit = useMutation({
    mutationFn: () => {
      if (!plId || !cargoId) throw new Error('Upload PL + cargo first');
      return submitCarrierVerification([plId, cargoId]);
    },
    onSuccess: () => onSubmitted(),
  });

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Submit to Ops</h2>
      <p className="text-sm text-slate-400">
        PL + cargo required. Re-upload only if missing.
      </p>
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            setPlId(await upload('PUBLIC_LIABILITY', f));
            setMsg('PL uploaded');
          } catch (err) {
            setMsg(getErrorDetail(err));
          }
        }}
      />
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            setCargoId(await upload('CARGO_INSURANCE', f));
            setMsg('Cargo uploaded');
          } catch (err) {
            setMsg(getErrorDetail(err));
          }
        }}
      />
      {msg ? <p className="text-sm text-emerald-300">{msg}</p> : null}
      {submit.isError ? <p className="text-sm text-red-300">{getErrorDetail(submit.error)}</p> : null}
      <button
        type="button"
        className={primaryButtonClassName}
        disabled={!plId || !cargoId || submit.isPending}
        onClick={() => submit.mutate()}
      >
        Submit compliance case
      </button>
    </div>
  );
}
