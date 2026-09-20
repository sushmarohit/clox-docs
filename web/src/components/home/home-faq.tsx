'use client';

import { useId, useState } from 'react';
import type { HomeCopy } from '@/components/home/copy';

export function HomeFaq({ copy }: { copy: HomeCopy }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-[9.5rem] bg-clox-surface py-12 sm:scroll-mt-28 sm:py-24">
      <div className="clox-container">
        <div className="clox-measure">
        <h2 className="mb-8 text-center text-[1.55rem] font-extrabold uppercase leading-tight text-clox-navy sm:mb-12 sm:text-[2.4rem] 3xl:text-[2.8rem]">
          {copy.faqTitle}
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {copy.faq.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="text-base font-bold text-clox-navy sm:text-xl">{question}</span>
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg leading-none text-clox-navy transition duration-300 ${
                        isOpen ? 'rotate-45 bg-clox-orange text-white border-clox-orange' : ''
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-4 pb-4 text-base leading-7 text-slate-600 sm:px-5 sm:pb-5 sm:text-lg sm:leading-8">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
