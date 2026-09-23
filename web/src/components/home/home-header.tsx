'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeHeader({ copy, locale }: HomeSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
      <div className="bg-clox-navy py-2.5">
        <p className="clox-container text-center text-[0.7rem] font-semibold leading-relaxed tracking-wide text-white sm:text-[0.8rem] 3xl:text-[0.9rem]">
          <span className="text-clox-orange">{copy.announceSoon}</span>
          <span className="mx-2 text-white/40" aria-hidden>
            ·
          </span>
          {copy.announceBar}
        </p>
      </div>

      <div className="clox-container flex items-center gap-4 py-3 sm:gap-5 sm:py-3.5 lg:gap-6 3xl:gap-8">
        <a href="#banner" className="inline-flex shrink-0" aria-label="CLOX home">
          <img
            src="/brand/logo-clox.webp"
            alt="CLOX"
            className="h-[40px] w-auto object-contain sm:h-[48px] lg:h-[44px] xl:h-[48px] 3xl:h-[52px]"
          />
        </a>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-x-2.5 lg:flex xl:gap-x-4 2xl:gap-x-5 3xl:gap-x-7"
          aria-label="Main navigation"
        >
          {copy.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="clox-nav-link whitespace-nowrap text-[0.8rem] xl:text-[0.9rem] 2xl:text-[0.98rem] 3xl:text-[1.05rem]"
            >
              {item.label}
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
        <div className="border-t border-slate-200 bg-white py-3 lg:hidden">
          <div className="clox-container flex flex-col gap-0.5">
            {copy.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2.5 font-medium text-clox-navy hover:bg-slate-50 hover:text-clox-orange"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href={`/${locale}/registry`}
              className="clox-btn-primary mt-2 whitespace-nowrap"
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
