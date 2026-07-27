import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AdminShell,
  fieldClassName,
  secondaryButtonClassName,
} from '@/components/admin-shell';
import { EmptyBlock, LoadingBlock } from '@/components/status-blocks';
import { getErrorDetail, listAudit } from '@/lib/api';
import type { AuditListItem } from '@/lib/api/admin';
import { formatDateTime, formatLeadType } from '@/lib/leads';
import { AuditAction } from '@/shared/types';

const ACTION_OPTIONS = Object.values(AuditAction);

export function AuditPage() {
  const { t } = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();
  const [leadIdDraft, setLeadIdDraft] = useState(searchParams.get('leadId') || '');

  const page = Number(searchParams.get('page') || '1') || 1;
  const action = searchParams.get('action') || '';
  const leadId = searchParams.get('leadId') || '';

  const query = useMemo(
    () => ({
      page,
      pageSize: 25,
      action: action || undefined,
      leadId: leadId || undefined,
    }),
    [page, action, leadId],
  );

  const auditQuery = useQuery({
    queryKey: ['admin', 'audit', query],
    queryFn: ({ signal }) => listAudit(query, { signal }),
  });

  const items: AuditListItem[] = auditQuery.data?.items ?? [];
  const totalPages = auditQuery.data?.totalPages ?? 1;
  const total = auditQuery.data?.total ?? 0;

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-3xl font-bold">{t('admin.auditTitle')}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {t('admin.auditSubtitle', { count: total })}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <select
          className={fieldClassName}
          value={action}
          onChange={(event) => updateFilter('action', event.target.value)}
        >
          <option value="">{t('admin.allActions')}</option>
          {ACTION_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <input
          className={fieldClassName}
          placeholder={t('admin.leadIdPlaceholder')}
          value={leadIdDraft}
          onChange={(event) => setLeadIdDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') updateFilter('leadId', leadIdDraft.trim());
          }}
        />
        <button
          type="button"
          className={secondaryButtonClassName}
          onClick={() => updateFilter('leadId', leadIdDraft.trim())}
        >
          {t('filter')}
        </button>
      </div>

      {auditQuery.isLoading ? (
        <div className="mt-8">
          <LoadingBlock label={t('loading')} />
        </div>
      ) : null}

      {auditQuery.isError ? (
        <p className="mt-8 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorDetail(auditQuery.error)}
        </p>
      ) : null}

      {!auditQuery.isLoading && !auditQuery.isError ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">{t('admin.colWhen')}</th>
                <th className="px-3 py-2 font-medium">{t('admin.colAction')}</th>
                <th className="px-3 py-2 font-medium">{t('admin.colActor')}</th>
                <th className="px-3 py-2 font-medium">{t('admin.colLead')}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-0">
                    <EmptyBlock title={t('admin.noAudit')} />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-white">{item.action}</span>
                      {item.metadata ? (
                        <pre className="mt-1 max-w-xs overflow-auto text-[0.65rem] text-slate-500">
                          {JSON.stringify(item.metadata)}
                        </pre>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-slate-300">
                      {item.actor?.email || t('system')}
                    </td>
                    <td className="px-3 py-3">
                      {item.lead ? (
                        <>
                          <Link
                            to={`/leads/${item.lead.id}`}
                            className="font-medium text-white hover:text-clox-orange"
                          >
                            {item.lead.companyName || item.lead.email}
                          </Link>
                          <div className="text-xs text-slate-500">
                            {formatLeadType(item.lead.type)}
                          </div>
                        </>
                      ) : item.leadId ? (
                        <Link
                          to={`/leads/${item.leadId}`}
                          className="text-clox-orange hover:underline"
                        >
                          {t('viewLead')}
                        </Link>
                      ) : (
                        <span className="text-slate-500">{t('dash')}</span>
                      )}
                    </td>
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
            {t('previous')}
          </button>
          <span>{t('pageOf', { page, totalPages })}</span>
          <button
            type="button"
            className={secondaryButtonClassName}
            disabled={page >= totalPages}
            onClick={() => updateFilter('page', String(page + 1))}
          >
            {t('next')}
          </button>
        </div>
      ) : null}
    </AdminShell>
  );
}
