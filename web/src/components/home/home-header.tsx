'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeHeader({ copy, locale }: HomeSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
      <div className="bg-clox-navy px-4 py-2 text-center text-[0.72rem] font-semibold leading-snug tracking-wide text-white sm:text-sm">
        <span className="text-clox-orange">Coming Soon</span>
        <span className="mx-2 text-white/40" aria-hidden>
          ·
        </span>
        {copy.announceBar}
      </div>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-6 xl:px-0">
        <a href="#banner" className="inline-flex shrink-0" aria-label="CLOX home">
          <img
            src="/brand/clox_updated_logo.png"
            alt="CLOX"
            className="h-[44px] w-auto object-contain sm:h-[52px] lg:h-[48px]"
          />
        </a>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-7 2xl:gap-9"
          aria-label="Main navigation"
        >
          {copy.nav.map(([label, href]) => (
            <a key={label} href={href} className="clox-nav-link whitespace-nowrap text-[0.95rem] xl:text-[1.05rem]">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="text-clox-navy" />
          <Link
            href={`/${locale}/registry`}
            className="clox-btn-primary hidden whitespace-nowrap px-4 py-2.5 text-sm shadow-[0_3px_12px_rgba(255,86,14,0.28)] lg:inline-flex lg:px-5 lg:text-[0.95rem] xl:px-6 xl:py-3 xl:text-[1.05rem]"
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
        <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-8 lg:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3">
            {copy.nav.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-lg px-3 py-2 font-medium text-clox-navy hover:bg-slate-50 hover:text-clox-orange"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              href={`/${locale}/registry`}
              className="clox-btn-primary whitespace-nowrap"
              onClick={() => setMenuOpen(false)}
            >
              {copy.preLaunch}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
