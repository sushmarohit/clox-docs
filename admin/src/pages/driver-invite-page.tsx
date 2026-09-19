import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { acceptDriverInvite, getErrorDetail, peekDriverInvite } from '@/lib/api';
import { primaryButtonClassName, secondaryButtonClassName } from '@/components/admin-shell';
import { LoadingBlock } from '@/components/status-blocks';

export function DriverInvitePage() {
  const { token = '' } = useParams();
  const navigate = useNavigate();

  const peek = useQuery({
    queryKey: ['driver', 'invite', token],
    queryFn: () => peekDriverInvite(token),
    enabled: Boolean(token),
  });

  const accept = useMutation({
    mutationFn: () => acceptDriverInvite(token),
    onSuccess: (data) => {
      navigate('/login', { replace: true, state: { email: data.email } });
    },
  });

  if (!token) {
    return <p className="p-8 text-red-300">Missing invite token</p>;
  }

  if (peek.isLoading) return <LoadingBlock label="Loading invite…" />;

  if (peek.isError) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-2xl font-bold">Invite unavailable</h1>
        <p className="mt-2 text-sm text-red-300">{getErrorDetail(peek.error)}</p>
        <Link to="/login" className={`${secondaryButtonClassName} mt-6 inline-flex`}>
          Back to login
        </Link>
      </div>
    );
  }

  const data = peek.data!;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">DRV-WEB-01</p>
      <h1 className="mt-2 text-3xl font-bold">Driver invite</h1>
      <p className="mt-3 text-slate-400">
        <span className="text-white">{data.companyName}</span> invited{' '}
        <span className="text-white">{data.name ?? data.email}</span> to drive on CLOX.
      </p>
      <ul className="mt-6 space-y-1 text-sm text-slate-400">
        <li>Email: {data.email}</li>
        <li>
          Status: {data.status}
          {data.expired ? ' · expired' : ''}
          {data.consumed ? ' · already accepted' : ''}
        </li>
      </ul>
      <p className="mt-4 text-sm text-slate-500">
        Auth is OTP-based (no password). After accept, request a login code on the next screen.
      </p>
      {accept.isError ? (
        <p className="mt-4 text-sm text-red-300">{getErrorDetail(accept.error)}</p>
      ) : null}
      <button
        type="button"
        className={`${primaryButtonClassName} mt-6`}
        disabled={!data.canAccept || accept.isPending}
        onClick={() => accept.mutate()}
      >
        Accept invite
      </button>
      {!data.canAccept ? (
        <Link to="/login" className={`${secondaryButtonClassName} mt-3 inline-flex`}>
          Go to login
        </Link>
      ) : null}
    </div>
  );
}
