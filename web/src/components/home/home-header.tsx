'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { HomeCopy } from '@/components/home/copy';
import type { HomeSectionProps } from '@/components/home/types';

type NavItem = HomeCopy['nav'][number];
type NavLinkItem = Extract<NavItem, { href: string }>;
type NavGroupItem = Extract<NavItem, { children: readonly unknown[] }>;

function isNavGroup(item: NavItem): item is NavGroupItem {
  return 'children' in item;
}

function isNavLink(item: NavItem): item is NavLinkItem {
  return 'href' in item;
}

function NavDropdown({
  item,
  linkClassName,
  onNavigate,
}: {
  item: NavGroupItem;
  linkClassName: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setOpen(true);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearCloseTimer();
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`${linkClassName} inline-flex items-center gap-1`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onFocus={openMenu}
      >
        {item.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
          className={`transition duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-[1001] min-w-[10.5rem] -translate-x-1/2 pt-2"
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_32px_rgba(10,31,60,0.12)]">
            {item.children.map((child) => (
              <a
                key={child.href}
                href={child.href}
                role="menuitem"
                className="block px-4 py-2.5 text-sm font-medium text-clox-navy transition hover:bg-clox-surface hover:text-clox-orange"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {child.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HomeHeader({ copy, locale }: HomeSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileKnowUsOpen, setMobileKnowUsOpen] = useState(false);

  function closeMobile() {
    setMenuOpen(false);
    setMobileKnowUsOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
      <div className="bg-clox-navy px-4 py-2.5 sm:px-6">
        <p className="mx-auto max-w-[1100px] text-center text-[0.7rem] font-semibold leading-relaxed tracking-wide text-white sm:text-[0.8rem]">
          <span className="text-clox-orange">{copy.announceSoon}</span>
          <span className="mx-2 text-white/40" aria-hidden>
            ·
          </span>
          {copy.announceBar}
        </p>
      </div>

      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 sm:gap-5 sm:px-6 sm:py-3.5 lg:gap-6 xl:px-8">
        <a href="#banner" className="inline-flex shrink-0" aria-label="CLOX home">
          <img
            src="/brand/clox_updated_logo.png"
            alt="CLOX"
            className="h-[40px] w-auto object-contain sm:h-[48px] lg:h-[44px] xl:h-[48px]"
          />
        </a>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-x-2.5 lg:flex xl:gap-x-4 2xl:gap-x-5"
          aria-label="Main navigation"
        >
          {copy.nav.map((item) => {
            if (isNavGroup(item)) {
              return (
                <NavDropdown
                  key={item.label}
                  item={item}
                  linkClassName="clox-nav-link whitespace-nowrap text-[0.8rem] xl:text-[0.9rem] 2xl:text-[0.98rem]"
                />
              );
            }
            if (!isNavLink(item)) return null;
            return (
              <a
                key={item.label}
                href={item.href}
                className="clox-nav-link whitespace-nowrap text-[0.8rem] xl:text-[0.9rem] 2xl:text-[0.98rem]"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-0">
          <LanguageSwitcher className="text-clox-navy" />
          <Link
            href={`/${locale}/registry`}
            className="clox-btn-primary hidden whitespace-nowrap px-4 py-2.5 text-sm shadow-[0_3px_12px_rgba(255,86,14,0.28)] lg:inline-flex xl:px-5 xl:text-[0.95rem]"
          >
            {copy.preLaunchShort}
          </Link>
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-clox-navy lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-5 py-3 sm:px-8 lg:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-0.5">
            {copy.nav.map((item) => {
              if (isNavGroup(item)) {
                return (
                  <div key={item.label} className="rounded-lg">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-medium text-clox-navy hover:bg-slate-50 hover:text-clox-orange"
                      aria-expanded={mobileKnowUsOpen}
                      onClick={() => setMobileKnowUsOpen((value) => !value)}
                    >
                      {item.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden
                        className={`transition duration-200 ${mobileKnowUsOpen ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {mobileKnowUsOpen ? (
                      <div className="mb-1 ml-3 space-y-0.5 border-l border-slate-200 pl-3">
                        {item.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-clox-navy hover:bg-slate-50 hover:text-clox-orange"
                            onClick={closeMobile}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }
              if (!isNavLink(item)) return null;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 font-medium text-clox-navy hover:bg-slate-50 hover:text-clox-orange"
                  onClick={closeMobile}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              href={`/${locale}/registry`}
              className="clox-btn-primary mt-2 whitespace-nowrap"
              onClick={closeMobile}
            >
              {copy.preLaunch}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
