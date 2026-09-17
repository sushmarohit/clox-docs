import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorDetail, getIdentityMe, listSessions, revokeSession } from '@/lib/api';
import { LoadingBlock } from '@/components/status-blocks';
import { secondaryButtonClassName } from '@/components/admin-shell';

export function AccountPage() {
  const qc = useQueryClient();

  const me = useQuery({
    queryKey: ['identity', 'me'],
    queryFn: () => getIdentityMe(),
  });

  const sessions = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: () => listSessions(),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['auth', 'sessions'] });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Account & sessions</h1>
      <p className="mt-2 text-sm text-slate-400">M1 verification — profile + device sessions.</p>

      {me.isLoading || sessions.isLoading ? (
        <div className="mt-8">
          <LoadingBlock label="Loading…" />
        </div>
      ) : null}

      {me.isError ? (
        <p className="mt-4 text-sm text-red-300">{getErrorDetail(me.error)}</p>
      ) : null}

      {me.data ? (
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-xs text-slate-300">
          {JSON.stringify(me.data, null, 2)}
        </pre>
      ) : null}

      <h2 className="mt-10 text-lg font-semibold">Active sessions</h2>
      {sessions.isError ? (
        <p className="mt-2 text-sm text-red-300">{getErrorDetail(sessions.error)}</p>
      ) : null}

      <ul className="mt-3 space-y-2">
        {(sessions.data?.data ?? []).map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-white">
                {s.deviceLabel || 'Session'} {s.isCurrent ? '(current)' : ''}
              </p>
              <p className="text-xs text-slate-500">
                last used {new Date(s.lastUsedAt).toLocaleString()}
              </p>
            </div>
            {!s.isCurrent ? (
              <button
                type="button"
                className={secondaryButtonClassName}
                disabled={revoke.isPending}
                onClick={() => revoke.mutate(s.id)}
              >
                Revoke
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
