import Link from 'next/link';
import type { HomeSectionProps } from '@/components/home/types';

const LINKEDIN_URL = 'https://www.linkedin.com/company/clox-freight-forwarding/';

export function HomeFooter({ copy, locale }: HomeSectionProps) {
  return (
    <footer className="border-t-[5px] border-clox-orange bg-white pb-28 pt-12 text-center text-slate-600 sm:pb-24">
      <div className="clox-container">
        <Link href={`/${locale}`} className="mx-auto mb-6 inline-flex" aria-label="CLOX home">
          <img
            src="/brand/logo-clox.webp"
            alt="CLOX"
            className="h-[64px] w-auto object-contain sm:h-[68px] 3xl:h-[76px]"
          />
        </Link>
        <p className="px-1 text-[0.7rem] leading-6 sm:text-sm sm:leading-7">
          <span>{copy.footerCopyright}</span>{' '}
          <span className="whitespace-nowrap">{copy.footerAbn}</span>
        </p>
        <p className="mt-1 whitespace-nowrap text-[0.7rem] sm:text-sm">{copy.footerRightsLine}</p>
        <p className="mx-auto mt-3 max-w-xl text-[0.75rem] text-slate-500">{copy.footerContactHint}</p>
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-5 pb-2 text-sm text-clox-navy">
          <Link href={`/${locale}/how-it-works`} className="hover:text-clox-orange">
            {copy.journeyTitle}
          </Link>
          <Link href={`/${locale}/faq`} className="hover:text-clox-orange">
            {copy.faqTitle}
          </Link>
          <Link href={`/${locale}/privacy`} className="hover:text-clox-orange">
            {copy.privacyShort}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-clox-orange">
            {copy.termsShort}
          </Link>
          <a href={copy.contactHref} className="hover:text-clox-orange">
            {copy.contactShort}
          </a>
          <Link href={`/${locale}/partner/eoi`} className="hover:text-clox-orange">
            {copy.partnerCta}
          </Link>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-clox-orange"
            aria-label={copy.linkedinLabel}
          >
            <LinkedInIcon />
            <span>{copy.linkedinLabel}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}
