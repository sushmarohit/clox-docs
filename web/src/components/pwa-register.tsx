'use client';

import { useEffect, useState } from 'react';

export function PwaRegister() {
  const [updateReady, setUpdateReady] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<{
    prompt: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    void navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => {
        /* ignore registration failures in unsupported contexts */
      });

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as unknown as { prompt: () => Promise<void> });
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (!updateReady && !deferredPrompt) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex max-w-sm flex-col gap-2">
      {deferredPrompt ? (
        <button
          type="button"
          className="pointer-events-auto rounded-full bg-clox-orange px-4 py-2 text-sm font-semibold text-white shadow-lg"
          onClick={async () => {
            await deferredPrompt.prompt();
            setDeferredPrompt(null);
          }}
        >
          Install CLOX
        </button>
      ) : null}
      {updateReady ? (
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-white/30 bg-clox-navy px-4 py-2 text-sm font-semibold text-white shadow-lg"
          onClick={() => window.location.reload()}
        >
          Update available — reload
        </button>
      ) : null}
    </div>
  );
}
