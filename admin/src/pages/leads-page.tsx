import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AdminShell,
  fieldClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from '@/components/admin-shell';
import { EmptyBlock, LoadingBlock } from '@/components/status-blocks';
import { exportLeadsCsv, getErrorDetail, listLeads } from '@/lib/api';
import {
  LEAD_STATUS_LABELS,
  LEAD_TYPE_LABELS,
  formatDateTime,
  formatLeadStatus,
  formatLeadType,
} from '@/lib/leads';
import { LeadStatus, LeadType } from '@/shared/types';

export function LeadsPage() {
  const { t } = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();
  const [exporting, setExporting] = useState(false);

  const page = Number(searchParams.get('page') || '1') || 1;
  const q = searchParams.get('q') || '';
  const type = (searchParams.get('type') || '') as LeadType | '';
  const status = (searchParams.get('status') || '') as LeadStatus | '';

  const [searchDraft, setSearchDraft] = useState(q);

  const query = useMemo(
    () => ({
      page,
      pageSize: 20,
      q: q || undefined,
      type: type || undefined,
      status: status || undefined,
    }),
    [page, q, type, status],
  );

  const leadsQuery = useQuery({
    queryKey: ['admin', 'leads', query],
    queryFn: ({ signal }) => listLeads(query, { signal }),
  });

  const items = leadsQuery.data?.items ?? [];
  const totalPages = leadsQuery.data?.totalPages ?? 1;
  const total = leadsQuery.data?.total ?? 0;

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  function applySearch() {
    updateFilter('q', searchDraft.trim());
  }

  async function onExport() {
    setExporting(true);
    try {
      await exportLeadsCsv({
        q: q || undefined,
        type: type || undefined,
        status: status || undefined,
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.leadsTitle')}</h1>
          <p className="mt-2 text-sm text-slate-400">{total} total</p>
        </div>
        <button
          type="button"
          onClick={() => void onExport()}
          disabled={exporting}
          className={secondaryButtonClassName}
        >
          {exporting ? t('loading') : t('admin.exportCsv')}
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className={fieldClassName}
          placeholder={t('admin.searchPlaceholder')}
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') applySearch();
          }}
        />
        <select
          className={fieldClassName}
          value={type}
          onChange={(event) => updateFilter('type', event.target.value)}
        >
          <option value="">{t('admin.allTypes')}</option>
          {Object.entries(LEAD_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className={fieldClassName}
          value={status}
          onChange={(event) => updateFilter('status', event.target.value)}
        >
          <option value="">{t('admin.allStatuses')}</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="button" className={primaryButtonClassName} onClick={applySearch}>
          Search
        </button>
      </div>

      {leadsQuery.isLoading ? (
        <div className="mt-8">
          <LoadingBlock label={t('loading')} />
        </div>
      ) : null}

      {leadsQuery.isError ? (
        <p className="mt-8 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorDetail(leadsQuery.error)}
        </p>
      ) : null}

      {!leadsQuery.isLoading && !leadsQuery.isError ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Lead</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <EmptyBlock
                      title={t('admin.noLeads')}
                      description="Try clearing filters or wait for new submissions."
                    />
                  </td>
                </tr>
              ) : (
                items.map((lead) => (
                  <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-3 py-3">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="font-medium text-white hover:text-clox-orange"
                      >
                        {lead.companyName || lead.email}
                        {lead.priority ? (
                          <span className="ml-2 text-xs text-clox-orange">★</span>
                        ) : null}
                      </Link>
                      <div className="text-xs text-slate-500">{lead.email}</div>
                      {lead.phone ? (
                        <div className="text-xs text-slate-500">{lead.phone}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-slate-300">{formatLeadType(lead.type)}</td>
                    <td className="px-3 py-3 text-slate-300">{formatLeadStatus(lead.status)}</td>
                    <td className="px-3 py-3 text-slate-400">
                      {[lead.state, lead.territory].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="px-3 py-3 text-slate-400">{formatDateTime(lead.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <button
            type="button"
            className={secondaryButtonClassName}
            disabled={page <= 1}
            onClick={() => updateFilter('page', String(page - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className={secondaryButtonClassName}
            disabled={page >= totalPages}
            onClick={() => updateFilter('page', String(page + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </AdminShell>
  );
}
