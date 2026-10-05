import Link from 'next/link';
import { FaqAccordion } from '@/components/faq-accordion';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeFaq({ copy, locale }: HomeSectionProps) {
  return (
    <section id="faq" className="scroll-mt-[9.5rem] bg-clox-navy py-12 text-white sm:scroll-mt-28 sm:py-24">
      <div className="clox-container">
        <div className="clox-measure">
          <h2 className="mb-8 text-center text-[1.55rem] font-extrabold uppercase leading-tight text-white sm:mb-12 sm:text-[2.4rem] 3xl:text-[2.8rem]">
            {copy.faqTitle}
          </h2>
          <FaqAccordion items={copy.faq} />
          <p className="mt-8 text-center text-sm text-white/70 sm:text-base">
            <Link
              href={`/${locale}/faq`}
              className="font-semibold text-clox-orange underline-offset-4 hover:underline"
            >
              {copy.faqTitle}
            </Link>
            {' · '}
            <Link
              href={`/${locale}/how-it-works`}
              className="font-semibold text-white underline-offset-4 hover:text-clox-orange hover:underline"
            >
              {copy.journeyTitle}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
