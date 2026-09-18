import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DashboardPage } from '@/pages/dashboard-page';
import { getErrorDetail, getIdentityMe } from '@/lib/api';
import { AdminRole, AppRole } from '@/shared/types';
import { useAuthStore } from '@/stores/auth-store';

export function HomePage() {
  const role = useAuthStore((s) => s.role);

  if (role === AdminRole.SUPER_ADMIN) {
    return <DashboardPage />;
  }

  return <RoleHomePage />;
}

function RoleHomePage() {
  const role = useAuthStore((s) => s.role);
  const email = useAuthStore((s) => s.email);
  const kind = useAuthStore((s) => s.kind);

  const me = useQuery({
    queryKey: ['identity', 'me'],
    queryFn: () => getIdentityMe(),
  });

  const isOps =
    role === AdminRole.STATE_MASTER || role === AdminRole.LOCAL_BDE;
  const isMarketplace =
    role === AppRole.SENDER ||
    role === AppRole.TRANSPORT_COMPANY ||
    role === AppRole.DRIVER;

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Verification home</h1>
      <p className="mt-2 text-sm text-slate-400">
        Signed in as <span className="text-white">{email}</span> ({kind}/{role})
      </p>

      {me.isError ? (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorDetail(me.error)}
        </p>
      ) : null}

      {me.data ? (
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-xs text-slate-300">
          {JSON.stringify(me.data, null, 2)}
        </pre>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {isOps ? (
          <Link
            to="/compliance"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-clox-orange/40"
          >
            <p className="text-lg font-semibold">Compliance queue</p>
            <p className="mt-1 text-sm text-slate-400">
              List / decide cases (Local = escalate only)
            </p>
          </Link>
        ) : null}
        {isMarketplace ? (
          <Link
            to="/qa/upload"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-clox-orange/40"
          >
            <p className="text-lg font-semibold">QA: upload & submit</p>
            <p className="mt-1 text-sm text-slate-400">
              Document upload → compliance submit (M2 demo)
            </p>
          </Link>
        ) : null}
        {role === AppRole.SENDER ? (
          <Link
            to="/sender/onboarding"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-clox-orange/40"
          >
            <p className="text-lg font-semibold">Sender onboarding</p>
            <p className="mt-1 text-sm text-slate-400">M3 wizard → Ops → payment → active</p>
          </Link>
        ) : null}
        <Link
          to="/account"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-clox-orange/40"
        >
          <p className="text-lg font-semibold">Account & sessions</p>
          <p className="mt-1 text-sm text-slate-400">Sessions list / revoke (M1)</p>
        </Link>
      </div>
    </div>
  );
}
