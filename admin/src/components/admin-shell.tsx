import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { logout } from '@/lib/api';
import { AdminRole, AppRole, isAdminRole } from '@/shared/types';
import { useAuthStore } from '@/stores/auth-store';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-clox-orange/15 text-clox-orange'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const role = useAuthStore((s) => s.role);
  const isSuper = role === AdminRole.SUPER_ADMIN;
  const isOpsAdmin = role === AdminRole.SUPER_ADMIN || role === AdminRole.STATE_MASTER || role === AdminRole.LOCAL_BDE;
  const isMarketplace =
    role === AppRole.SENDER || role === AppRole.TRANSPORT_COMPANY || role === AppRole.DRIVER;

  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Main">
      <NavLink to="/" end className={navItemClass} onClick={onNavigate}>
        Home
      </NavLink>
      {role === AppRole.SENDER ? (
        <NavLink to="/sender/onboarding" className={navItemClass} onClick={onNavigate}>
          Sender onboarding
        </NavLink>
      ) : null}
      {role === AppRole.TRANSPORT_COMPANY ? (
        <NavLink to="/carrier/onboarding" className={navItemClass} onClick={onNavigate}>
          Carrier onboarding
        </NavLink>
      ) : null}
      {role === AppRole.DRIVER ? (
        <NavLink to="/driver/onboarding" className={navItemClass} onClick={onNavigate}>
          Driver onboarding
        </NavLink>
      ) : null}
      {isSuper ? (
        <>
          <NavLink to="/leads" className={navItemClass} onClick={onNavigate}>
            Leads
          </NavLink>
          <NavLink to="/audit" className={navItemClass} onClick={onNavigate}>
            Audit
          </NavLink>
        </>
      ) : null}
      {isOpsAdmin ? (
        <NavLink to="/compliance" className={navItemClass} onClick={onNavigate}>
          Compliance queue
        </NavLink>
      ) : null}
      {isMarketplace ? (
        <NavLink to="/qa/upload" className={navItemClass} onClick={onNavigate}>
          QA: upload & submit
        </NavLink>
      ) : null}
      <NavLink to="/account" className={navItemClass} onClick={onNavigate}>
        Account & sessions
      </NavLink>
    </nav>
  );
}

export function AdminShell({ children }: { children?: ReactNode }) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);
  const displayName = useAuthStore((state) => state.displayName);
  const role = useAuthStore((state) => state.role);
  const kind = useAuthStore((state) => state.kind);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    try {
      await logout({ allDevices: false });
    } catch {
      // still clear local session
    }
    clearSession();
    navigate('/login', { replace: true });
  }

  const title = displayName || email || 'User';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-slate-950 transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clox-orange/15 text-sm font-bold text-clox-orange">
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-wide text-white">{t('brand')}</p>
            <p className="truncate text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
              Verification UI
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <p className="mb-2 px-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Navigate
          </p>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </div>

        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-slate-500">Signed in</p>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-200">{title}</p>
          <p className="truncate text-xs text-slate-500">{email}</p>
          <p className="mt-1 truncate font-mono text-[0.7rem] text-clox-orange">
            {kind}/{role}
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-slate-950/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-200 hover:bg-white/5 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">Milestone verification</p>
              <p className="text-xs text-slate-500">
                {isAdminRole(role ?? '') ? 'Ops / admin surface' : 'Marketplace QA surface'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}

export const fieldClassName =
  'w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-clox-orange';

export const primaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl bg-clox-orange px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50';

export const secondaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50';
