import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  confirmDocument,
  createUploadIntent,
  getErrorDetail,
  getIdentityMe,
  submitCompliance,
  uploadDocumentContent,
} from '@/lib/api';
import { fieldClassName, primaryButtonClassName, secondaryButtonClassName } from '@/components/admin-shell';
import { AppRole } from '@/shared/types';
import { useAuthStore } from '@/stores/auth-store';

type UploadedDoc = { id: string; docType: string; contentHash: string };

const SENDER_COMPANY = '00000000-0000-4000-8000-000000000001';
const CARRIER_COMPANY = '00000000-0000-4000-8000-000000000002';

export function QaUploadPage() {
  const role = useAuthStore((s) => s.role);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('PUBLIC_LIABILITY');
  const [uploaded, setUploaded] = useState<UploadedDoc[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const me = useQuery({
    queryKey: ['identity', 'me'],
    queryFn: () => getIdentityMe(),
  });

  const companyId = useMemo(() => {
    const company = me.data?.company as { id?: string } | null | undefined;
    if (company?.id) return company.id;
    if (role === AppRole.SENDER) return SENDER_COMPANY;
    return CARRIER_COMPANY;
  }, [me.data, role]);

  const caseType =
    role === AppRole.SENDER
      ? ('SENDER_KYB' as const)
      : ('CARRIER_KYB' as const);

  const uploadMutation = useMutation({
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
      const uploadedRes = await uploadDocumentContent(intent.id, file);
      await confirmDocument(intent.id, uploadedRes.contentHash);
      return {
        id: intent.id,
        docType,
        contentHash: uploadedRes.contentHash,
      };
    },
    onSuccess: (doc) => {
      setUploaded((prev) => [...prev.filter((d) => d.docType !== doc.docType), doc]);
      setMessage(`Uploaded ${doc.docType} (${doc.id.slice(0, 8)}…)`);
      setFile(null);
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      submitCompliance({
        companyId,
        caseType,
        documentIds: uploaded.map((d) => d.id),
      }),
    onSuccess: (res) => {
      setMessage(
        `Submitted case ${res.id.slice(0, 8)}… → company ${res.companyStatus}. Open Compliance queue as Super/State.`,
      );
    },
  });

  const docOptions =
    role === AppRole.SENDER
      ? ['ABN_EXTRACT', 'GOVERNMENT_ID', 'OTHER']
      : ['PUBLIC_LIABILITY', 'CARGO_INSURANCE', 'RWC', 'ABN_EXTRACT', 'OTHER'];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">QA: upload & submit</h1>
      <p className="mt-2 text-sm text-slate-400">
        M2 browser path — carrier needs PUBLIC_LIABILITY + CARGO_INSURANCE; sender needs ABN_EXTRACT
        (or company ABN).
      </p>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
        companyId: <span className="font-mono text-slate-200">{companyId}</span> · caseType:{' '}
        <span className="font-mono text-slate-200">{caseType}</span>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Document type</label>
          <select
            className={fieldClassName}
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            {docOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">File (PDF/JPEG/PNG/WebP ≤10MB)</label>
          <input
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-300"
          />
        </div>

        {(uploadMutation.isError || submitMutation.isError) && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorDetail(uploadMutation.error ?? submitMutation.error)}
          </p>
        )}
        {message ? (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={primaryButtonClassName}
            disabled={!file || uploadMutation.isPending}
            onClick={() => uploadMutation.mutate()}
          >
            {uploadMutation.isPending ? 'Uploading…' : 'Upload & confirm'}
          </button>
          <button
            type="button"
            className={secondaryButtonClassName}
            disabled={uploaded.length === 0 || submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            {submitMutation.isPending ? 'Submitting…' : 'Submit compliance case'}
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Ready documents</h2>
        {uploaded.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">None yet.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {uploaded.map((d) => (
              <li key={d.id} className="rounded-lg border border-white/10 px-3 py-2 font-mono text-xs">
                {d.docType} · {d.id}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
