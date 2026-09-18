import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  confirmDocument,
  confirmSenderPayment,
  createUploadIntent,
  getErrorDetail,
  getSenderOnboarding,
  setupSenderPayment,
  submitSenderVerification,
  updateSenderProfile,
  uploadDocumentContent,
  type SenderOnboarding,
} from '@/lib/api';
import {
  fieldClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from '@/components/admin-shell';
import { LoadingBlock } from '@/components/status-blocks';
import { AppRole } from '@/shared/types';
import { useAuthStore } from '@/stores/auth-store';

const STEPS = ['account_type', 'invoice', 'documents', 'waiting_ops', 'payment', 'complete'] as const;

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

export function SenderOnboardingPage() {
  const role = useAuthStore((s) => s.role);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['sender', 'onboarding'],
    queryFn: () => getSenderOnboarding(),
    enabled: role === AppRole.SENDER,
  });

  if (role !== AppRole.SENDER) {
    return <Navigate to="/" replace />;
  }

  if (query.isLoading) {
    return <LoadingBlock label="Loading onboarding…" />;
  }

  if (query.isError || !query.data) {
    return (
      <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {getErrorDetail(query.error)}
      </p>
    );
  }

  const data = query.data;
  const step = data.step;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Sender onboarding</h1>
      <p className="mt-2 text-sm text-slate-400">
        M3 wizard — Ops approve required before payment / active.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <StepPill current={step} id="account_type" label="1 Account" />
        <StepPill current={step} id="invoice" label="2 Invoice" />
        <StepPill current={step} id="documents" label="3 Docs" />
        <StepPill current={step} id="waiting_ops" label="4 Ops" />
        <StepPill current={step} id="payment" label="5 Pay" />
        <StepPill current={step} id="complete" label="Done" />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
        company <span className="font-mono text-slate-200">{data.company.status}</span> · canBook=
        <span className="text-slate-200">{String(data.goNoGo.canBook)}</span>
        {data.stripeMock ? ' · Stripe MOCK' : ''}
      </div>

      {(step === 'account_type' || step === 'invoice') && (
        <ProfileStep
          data={data}
          onSaved={async () => {
            await qc.invalidateQueries({ queryKey: ['sender', 'onboarding'] });
          }}
        />
      )}

      {step === 'documents' && (
        <DocumentsStep
          companyId={data.company.id}
          accountType={data.company.senderAccountType}
          onSubmitted={async () => {
            await qc.invalidateQueries({ queryKey: ['sender', 'onboarding'] });
          }}
        />
      )}

      {step === 'waiting_ops' && (
        <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
          <h2 className="text-lg font-semibold text-amber-100">Waiting for Ops</h2>
          <p className="mt-2 text-sm text-amber-100/80">
            Case {data.latestCase?.status ?? 'OPEN'} — Super/State must Approve in Compliance queue.
            {data.latestCase?.decisionNote
              ? ` Note: ${data.latestCase.decisionNote}`
              : ''}
          </p>
          <button
            type="button"
            className={`${secondaryButtonClassName} mt-4`}
            onClick={() => void query.refetch()}
          >
            Refresh status
          </button>
        </div>
      )}

      {data.company.status === 'INFO_REQUESTED' &&
      (step === 'account_type' || step === 'invoice' || step === 'documents') ? (
        <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
          Ops requested more info
          {data.latestCase?.decisionNote ? `: ${data.latestCase.decisionNote}` : ''}. Update
          profile/docs and resubmit.
        </p>
      ) : null}

      {step === 'rejected' && (
        <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-200">
          Application rejected. {data.latestCase?.decisionNote}
        </div>
      )}

      {step === 'payment' && (
        <PaymentStep
          mock={data.stripeMock}
          onDone={async () => {
            await qc.invalidateQueries({ queryKey: ['sender', 'onboarding'] });
          }}
        />
      )}

      {step === 'complete' && (
        <div className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
          <h2 className="text-lg font-semibold text-emerald-200">Sender active</h2>
          <p className="mt-2 text-sm text-emerald-100/80">
            Go/no-go passed — booking enabled (job create full flow is M6).
          </p>
          <ul className="mt-3 space-y-1 text-xs text-emerald-100/70">
            <li>Ops approved: {String(data.goNoGo.opsApproved)}</li>
            <li>Invoice: {String(data.goNoGo.invoiceComplete)}</li>
            <li>Payment: {String(data.goNoGo.paymentReady)}</li>
            <li>canBook: {String(data.goNoGo.canBook)}</li>
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

function ProfileStep({
  data,
  onSaved,
}: {
  data: SenderOnboarding;
  onSaved: () => Promise<void>;
}) {
  const [accountType, setAccountType] = useState<'BUSINESS' | 'INDIVIDUAL'>(
    data.company.senderAccountType ?? 'BUSINESS',
  );
  const [legalName, setLegalName] = useState(data.company.legalName || '');
  const [abn, setAbn] = useState(data.company.abn || '');
  const [invoiceLegalName, setInvoiceLegalName] = useState(
    data.company.invoiceLegalName || data.company.legalName || '',
  );
  const [line1, setLine1] = useState(data.company.invoiceAddressLine1 || '');
  const [suburb, setSuburb] = useState(data.company.invoiceSuburb || '');
  const [state, setState] = useState(data.company.invoiceState || 'VIC');
  const [postcode, setPostcode] = useState(data.company.invoicePostcode || '');
  const [gst, setGst] = useState(data.company.gstRegistered);

  const mutation = useMutation({
    mutationFn: () =>
      updateSenderProfile({
        accountType,
        legalName,
        abn: accountType === 'BUSINESS' ? abn : undefined,
        homeRegionCode: 'VIC',
        invoiceLegalName,
        invoiceAddressLine1: line1,
        invoiceSuburb: suburb,
        invoiceState: state,
        invoicePostcode: postcode,
        gstRegistered: gst,
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
      <h2 className="text-lg font-semibold">Account & invoice</h2>
      <div className="flex gap-3">
        <button
          type="button"
          className={accountType === 'BUSINESS' ? primaryButtonClassName : secondaryButtonClassName}
          onClick={() => setAccountType('BUSINESS')}
        >
          Business
        </button>
        <button
          type="button"
          className={
            accountType === 'INDIVIDUAL' ? primaryButtonClassName : secondaryButtonClassName
          }
          onClick={() => setAccountType('INDIVIDUAL')}
        >
          Individual
        </button>
      </div>
      <input
        className={fieldClassName}
        placeholder="Legal name"
        value={legalName}
        onChange={(e) => setLegalName(e.target.value)}
        required
      />
      {accountType === 'BUSINESS' ? (
        <input
          className={fieldClassName}
          placeholder="ABN (11 digits)"
          value={abn}
          onChange={(e) => setAbn(e.target.value)}
          required
        />
      ) : null}
      <input
        className={fieldClassName}
        placeholder="Invoice legal name"
        value={invoiceLegalName}
        onChange={(e) => setInvoiceLegalName(e.target.value)}
        required
      />
      <input
        className={fieldClassName}
        placeholder="Address line 1"
        value={line1}
        onChange={(e) => setLine1(e.target.value)}
        required
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          className={fieldClassName}
          placeholder="Suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          required
        />
        <input
          className={fieldClassName}
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value.toUpperCase())}
          required
        />
        <input
          className={fieldClassName}
          placeholder="Postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={gst} onChange={(e) => setGst(e.target.checked)} />
        GST registered
      </label>
      {mutation.isError ? (
        <p className="text-sm text-red-300">{getErrorDetail(mutation.error)}</p>
      ) : null}
      <button type="submit" className={primaryButtonClassName} disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Save & continue'}
      </button>
    </form>
  );
}

function DocumentsStep({
  companyId,
  accountType,
  onSubmitted,
}: {
  companyId: string;
  accountType: 'BUSINESS' | 'INDIVIDUAL' | null;
  onSubmitted: () => Promise<void>;
}) {
  const docType = accountType === 'INDIVIDUAL' ? 'GOVERNMENT_ID' : 'ABN_EXTRACT';
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Choose a file');
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
    },
    onSuccess: (id) => {
      setDocId(id);
      setMessage('Document uploaded');
    },
  });

  const submit = useMutation({
    mutationFn: () => {
      if (!docId) throw new Error('Upload a document first');
      return submitSenderVerification([docId]);
    },
    onSuccess: () => onSubmitted(),
  });

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Verification documents</h2>
      <p className="text-sm text-slate-400">
        Required: <span className="font-mono text-clox-orange">{docType}</span> (manual Ops review —
        no easyAML)
      </p>
      <input
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      {(upload.isError || submit.isError) && (
        <p className="text-sm text-red-300">
          {getErrorDetail(upload.error ?? submit.error)}
        </p>
      )}
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={secondaryButtonClassName}
          disabled={!file || upload.isPending}
          onClick={() => upload.mutate()}
        >
          Upload
        </button>
        <button
          type="button"
          className={primaryButtonClassName}
          disabled={!docId || submit.isPending}
          onClick={() => submit.mutate()}
        >
          Submit to Ops
        </button>
      </div>
    </div>
  );
}

function PaymentStep({ mock, onDone }: { mock: boolean; onDone: () => Promise<void> }) {
  const [setupInfo, setSetupInfo] = useState<string | null>(null);

  const setup = useMutation({
    mutationFn: () => setupSenderPayment(),
    onSuccess: (data) => {
      setSetupInfo(
        data.mock
          ? `Mock SetupIntent ${data.setupIntentId} — click Confirm to activate`
          : `SetupIntent ready (use Stripe.js with client secret in production)`,
      );
    },
  });

  const confirm = useMutation({
    mutationFn: () => confirmSenderPayment(mock ? undefined : undefined),
    onSuccess: () => onDone(),
  });

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Payment method</h2>
      <p className="text-sm text-slate-400">
        {mock
          ? 'Stripe mock mode (no card PAN stored). Confirm to reach sender_active.'
          : 'Create SetupIntent, collect card via Stripe Payment Element, then confirm.'}
      </p>
      {(setup.isError || confirm.isError) && (
        <p className="text-sm text-red-300">{getErrorDetail(setup.error ?? confirm.error)}</p>
      )}
      {setupInfo ? <p className="text-sm text-emerald-300">{setupInfo}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={secondaryButtonClassName}
          disabled={setup.isPending}
          onClick={() => setup.mutate()}
        >
          Create SetupIntent
        </button>
        <button
          type="button"
          className={primaryButtonClassName}
          disabled={confirm.isPending}
          onClick={() => confirm.mutate()}
        >
          Confirm payment ready
        </button>
      </div>
    </div>
  );
}
