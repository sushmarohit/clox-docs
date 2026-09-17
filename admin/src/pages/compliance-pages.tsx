import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyBlock, LoadingBlock } from '@/components/status-blocks';
import {
  decideCompliance,
  getComplianceCase,
  getErrorDetail,
  listComplianceCases,
} from '@/lib/api';
import { fieldClassName } from '@/components/admin-shell';
import { useAuthStore } from '@/stores/auth-store';
import { AdminRole } from '@/shared/types';

export function ComplianceQueuePage() {
  const role = useAuthStore((s) => s.role);
  const [status, setStatus] = useState('OPEN');
  const [regionCode, setRegionCode] = useState(
    role === AdminRole.SUPER_ADMIN ? '' : 'VIC',
  );

  const query = useQuery({
    queryKey: ['compliance', 'cases', status, regionCode],
    queryFn: ({ signal }) =>
      listComplianceCases({
        status: status || undefined,
        regionCode: regionCode || undefined,
        signal,
      }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Compliance queue</h1>
      <p className="mt-2 text-sm text-slate-400">
        M2 verification UI — scoped by AdminScope. Local BDE: view + escalate only.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          className={`${fieldClassName} w-auto`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="ESCALATED">ESCALATED</option>
          <option value="INFO_REQUESTED">INFO_REQUESTED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <input
          className={`${fieldClassName} w-28`}
          placeholder="Region"
          value={regionCode}
          onChange={(e) => setRegionCode(e.target.value.toUpperCase())}
        />
      </div>

      {query.isLoading ? (
        <div className="mt-8">
          <LoadingBlock label="Loading cases…" />
        </div>
      ) : null}

      {query.isError ? (
        <p className="mt-8 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorDetail(query.error)}
        </p>
      ) : null}

      {query.data?.data.length === 0 ? (
        <div className="mt-8">
          <EmptyBlock title="No cases" description="Submit a carrier/sender package from QA upload." />
        </div>
      ) : null}

      {query.data && query.data.data.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {query.data.data.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{row.company.legalName}</p>
                    <p className="text-xs text-slate-500">{row.company.status}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.caseType}</td>
                  <td className="px-4 py-3">
                    <span className="clox-status clox-status-info">{row.status}</span>
                  </td>
                  <td className="px-4 py-3">{row.region?.code ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/compliance/${row.id}`} className="text-clox-orange hover:underline">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export function ComplianceCasePage({ caseId }: { caseId: string }) {
  const role = useAuthStore((s) => s.role);
  const qc = useQueryClient();
  const [note, setNote] = useState('');

  const query = useQuery({
    queryKey: ['compliance', 'case', caseId],
    queryFn: ({ signal }) => getComplianceCase(caseId, { signal }),
  });

  const decide = useMutation({
    mutationFn: (action: 'approve' | 'reject' | 'request-info' | 'escalate') =>
      decideCompliance(caseId, action, note || undefined),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['compliance'] });
    },
  });

  const canDecide = role === AdminRole.SUPER_ADMIN || role === AdminRole.STATE_MASTER;
  const canEscalate = role === AdminRole.LOCAL_BDE;

  if (query.isLoading) {
    return <LoadingBlock label="Loading case…" />;
  }

  if (query.isError || !query.data) {
    return (
      <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {getErrorDetail(query.error)}
      </p>
    );
  }

  const c = query.data;

  return (
    <div>
      <Link to="/compliance" className="text-sm text-slate-400 hover:text-white">
        ← Queue
      </Link>
      <h1 className="mt-3 text-2xl font-bold">{c.company.legalName}</h1>
      <p className="mt-1 font-mono text-sm text-slate-400">
        {c.caseType} · {c.status} · company {c.company.status}
      </p>

      {c.abrAssist ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
          <p className="font-semibold">ABR assist (not auto-approve)</p>
          <p className="mt-1 text-slate-300">{c.abrAssist.message}</p>
          <p className="mt-1 text-xs text-slate-500">
            active={String(c.abrAssist.active)} · {c.abrAssist.entityName ?? '—'}
          </p>
        </div>
      ) : null}

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Documents</h2>
        <ul className="mt-2 space-y-2">
          {c.documents.map((d) => (
            <li key={d.id} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
              <span className="font-mono text-xs text-clox-orange">{d.docType}</span>{' '}
              <span className="text-slate-400">{d.status}</span>
              <span className="ml-2 text-slate-500">{d.originalFilename}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 max-w-xl">
        <label className="mb-1.5 block text-sm font-medium">Decision note</label>
        <textarea
          className={`${fieldClassName} min-h-24`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note for audit"
        />

        {decide.isError ? (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorDetail(decide.error)}
          </p>
        ) : null}
        {decide.isSuccess ? (
          <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            Decision applied. Refresh shows new status.
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {canDecide ? (
            <>
              <button
                type="button"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={decide.isPending}
                onClick={() => decide.mutate('approve')}
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={decide.isPending}
                onClick={() => decide.mutate('request-info')}
              >
                Request info
              </button>
              <button
                type="button"
                className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={decide.isPending}
                onClick={() => decide.mutate('reject')}
              >
                Reject
              </button>
            </>
          ) : null}
          {canEscalate ? (
            <button
              type="button"
              className="rounded-xl bg-clox-orange px-4 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={decide.isPending}
              onClick={() => decide.mutate('escalate')}
            >
              Escalate (Local only)
            </button>
          ) : null}
          {!canDecide && !canEscalate ? (
            <p className="text-sm text-slate-400">No decision actions for this role.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
