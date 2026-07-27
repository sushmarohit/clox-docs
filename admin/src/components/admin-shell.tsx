import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAuthStore } from '@/stores/auth-store';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-white/10 text-white'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;

export function AdminShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);
  const clearSession = useAuthStore((state) => state.clearSession);

  function signOut() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clox-orange">
                {t('brand')}
              </p>
              <p className="text-sm text-slate-400">
                {t('admin.signedInAs')} {email}
              </p>
            </div>
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={navClass}>
                {t('nav.dashboard')}
              </NavLink>
              <NavLink to="/leads" className={navClass}>
                {t('nav.leads')}
              </NavLink>
              <NavLink to="/audit" className={navClass}>
                {t('nav.audit')}
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5"
            >
              {t('signOut')}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export const fieldClassName =
  'w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-clox-orange';

export const primaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl bg-clox-orange px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50';

export const secondaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50';
