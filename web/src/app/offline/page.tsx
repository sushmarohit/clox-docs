import Link from 'next/link';

export const metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-clox-navy px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clox-orange">CLOX</p>
        <h1 className="mt-4 text-2xl font-bold">You are offline</h1>
        <p className="mt-3 text-sm text-white/70">
          The pre-launch site shell is available offline. Lead forms and the assistant need a
          connection — reconnect and try again.
        </p>
        <Link
          href="/en"
          className="mt-6 inline-flex rounded-full bg-clox-orange px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
