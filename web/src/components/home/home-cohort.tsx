import Link from 'next/link';
import { BulletList } from '@/components/home/bullet-list';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeCohort({ copy, locale }: HomeSectionProps) {
  return (
    <section id="cohort" className="scroll-mt-[9.5rem] py-12 sm:scroll-mt-28 sm:py-28">
      <div className="clox-container flex flex-col items-center gap-10 rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-8 lg:flex-row lg:gap-20 lg:p-16 3xl:gap-24 3xl:p-20">
        <div className="flex-1">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-clox-orange">
            {copy.cohortEyebrow}
          </p>
          <h2 className="mb-4 text-[1.65rem] font-extrabold uppercase leading-tight text-clox-navy sm:mb-6 sm:text-[2.8rem]">
            {copy.cohortTitle}
          </h2>
          <h3 className="mb-4 text-xl font-bold text-clox-navy">{copy.benefitsTitle}</h3>
          <BulletList items={copy.benefits} />
        </div>
        <div className="flex-1 rounded-2xl border border-slate-200 bg-clox-surface p-8 sm:p-10">
          <img
            src="/brand/clox_updated_logo.png"
            alt="CLOX"
            className="mx-auto h-20 w-auto object-contain sm:h-24"
          />
          <p className="mt-6 text-center text-lg font-semibold text-clox-navy">{copy.tagline}</p>
          <div className="mx-auto mt-8 max-w-md border-t border-slate-200 pt-8">
            <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
              {copy.iAm}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/registry`} className="clox-btn-primary">
                {copy.senderCta}
              </Link>
              <Link
                href={`/${locale}/registry`}
                className="inline-flex items-center justify-center rounded-full border-2 border-clox-navy px-8 py-3.5 text-[1.05rem] font-semibold text-clox-navy transition hover:bg-clox-navy hover:text-white"
              >
                {copy.carrierCta}
              </Link>
              <Link
                href={`/${locale}/partner/eoi`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-clox-navy"
              >
                {copy.partnerCta}
              </Link>
            </div>
            <div className="mt-7 text-center">
              <Link href={`/${locale}/registry`} className="clox-btn-primary">
                {copy.secureSpot}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
