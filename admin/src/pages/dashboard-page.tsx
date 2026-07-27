import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/components/admin-shell';
import { EmptyBlock, LoadingBlock } from '@/components/status-blocks';
import { getDashboardStats, getErrorDetail } from '@/lib/api';
import {
  formatDateTime,
  formatLeadStatus,
  formatLeadType,
} from '@/lib/leads';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation('common');
  const query = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: ({ signal }) => getDashboardStats({ signal }),
  });

  const totals = query.data?.totals;
  const recentLeads = query.data?.recentLeads ?? [];
  const byStatus = query.data?.byStatus ?? {};

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.dashboardTitle')}</h1>
          <p className="mt-2 text-sm text-slate-400">{t('admin.dashboardSubtitle')}</p>
        </div>
        <Link
          to="/leads"
          className="rounded-xl bg-clox-orange px-4 py-2.5 text-sm font-semibold text-white"
        >
          {t('admin.openQueue')}
        </Link>
      </div>

      {query.isLoading ? (
        <div className="mt-8">
          <LoadingBlock label={t('loading')} />
        </div>
      ) : null}

      {query.isError ? (
        <p className="mt-8 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorDetail(query.error)}
        </p>
      ) : null}

      {totals ? (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={t('admin.statAll')} value={totals.all} />
            <StatCard label={t('admin.statToday')} value={totals.today} />
            <StatCard label={t('admin.statWeek')} value={totals.week} />
            <StatCard label={t('admin.statInvestors')} value={totals.investors} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={t('admin.statRegistrySenders')} value={totals.registrySenders} />
            <StatCard label={t('admin.statRegistryCarriers')} value={totals.registryCarriers} />
            <StatCard label={t('admin.statEoiState')} value={totals.eoiStateMasters} />
            <StatCard label={t('admin.statEoiLocal')} value={totals.eoiLocalBdes} />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold">{t('admin.recentLeads')}</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-slate-400">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t('admin.colCompany')}</th>
                      <th className="px-3 py-2 font-medium">{t('admin.colType')}</th>
                      <th className="px-3 py-2 font-medium">{t('admin.colStatus')}</th>
                      <th className="px-3 py-2 font-medium">{t('admin.colCreated')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-0">
                          <EmptyBlock
                            title={t('admin.noLeadsYet')}
                            description={t('admin.noLeadsYetHint')}
                          />
                        </td>
                      </tr>
                    ) : (
                      recentLeads.map((lead) => (
                        <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-3 py-2.5">
                            <Link to={`/leads/${lead.id}`} className="font-medium text-white hover:text-clox-orange">
                              {lead.companyName || lead.email}
                            </Link>
                            <div className="text-xs text-slate-500">{lead.email}</div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-300">{formatLeadType(lead.type)}</td>
                          <td className="px-3 py-2.5 text-slate-300">
                            {formatLeadStatus(lead.status)}
                          </td>
                          <td className="px-3 py-2.5 text-slate-400">
                            {formatDateTime(lead.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold">{t('admin.byStatus')}</h2>
              <ul className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                {Object.keys(byStatus).length === 0 ? (
                  <li className="text-sm text-slate-500">{t('admin.noStatusData')}</li>
                ) : (
                  Object.entries(byStatus)
                    .sort((a, b) => b[1] - a[1])
                    .map(([status, count]) => (
                      <li
                        key={status}
                        className="flex items-center justify-between text-sm text-slate-300"
                      >
                        <span>{formatLeadStatus(status)}</span>
                        <span className="font-semibold text-white">{count}</span>
                      </li>
                    ))
                )}
              </ul>
            </section>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
