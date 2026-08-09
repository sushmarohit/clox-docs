'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeHeader({ copy, locale }: HomeSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-8 sm:py-3.5 lg:px-0">
        <a href="#banner" className="inline-flex shrink-0" aria-label="CLOX home">
          <img
            src="/brand/clox_updated_logo.png"
            alt="CLOX"
            className="h-[48px] w-auto object-contain sm:h-[56px] lg:h-[52px]"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex xl:gap-10" aria-label="Main navigation">
          {copy.nav.map(([label, href]) => (
            <a key={label} href={href} className="clox-nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher className="text-clox-navy" />
          <Link href={`/${locale}/registry`} className="clox-btn-primary hidden sm:inline-flex">
            {copy.preLaunch}
          </Link>
          <button
            type="button"
            className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-clox-navy lg:hidden"
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
              className="clox-btn-primary"
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
