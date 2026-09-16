'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeHeader({ copy, locale }: HomeSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 lg:flex xl:gap-x-5 2xl:gap-x-6"
          aria-label="Main navigation"
        >
          {copy.nav.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="clox-nav-link whitespace-nowrap text-[0.85rem] xl:text-[0.95rem] 2xl:text-[1.02rem]"
            >
              {label}
            </a>
          ))}
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
