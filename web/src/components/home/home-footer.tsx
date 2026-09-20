import Link from 'next/link';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeFooter({ copy, locale }: HomeSectionProps) {
  return (
    <footer className="border-t-[5px] border-clox-orange bg-clox-navy pb-28 pt-12 text-center text-slate-400 sm:pb-24">
      <div className="clox-container">
        <a href="#banner" className="mx-auto mb-6 inline-flex" aria-label="CLOX home">
          <img
            src="/brand/clox_updated_logo_light.png"
            alt="CLOX"
            className="h-[64px] w-auto object-contain sm:h-[68px] 3xl:h-[76px]"
          />
        </a>
        <p>{copy.footerLine}</p>
        <p className="mx-auto mt-3 max-w-xl text-[0.75rem] text-slate-500">{copy.footerContactHint}</p>
        <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-5 pb-2 text-sm">
          <Link href={`/${locale}/privacy`} className="hover:text-white">
            {copy.privacyShort}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-white">
            {copy.termsShort}
          </Link>
          <a href={copy.contactHref} className="hover:text-white">
            {copy.contactShort}
          </a>
          <Link href={`/${locale}/partner/eoi`} className="hover:text-white">
            {copy.partnerCta}
          </Link>
        </div>
      </div>
    </footer>
  );
}
