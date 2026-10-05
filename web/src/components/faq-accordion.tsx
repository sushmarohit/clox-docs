'use client';

import { useId, useState } from 'react';

type FaqAccordionProps = {
  items: readonly (readonly [string, string])[];
  /** Heading level for each question. Default h3 (landing); use h2 on the FAQ page. */
  headingLevel?: 'h2' | 'h3';
};

export function FaqAccordion({ items, headingLevel = 'h3' }: FaqAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const Heading = headingLevel;

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={question}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm"
          >
            <Heading className="m-0 text-inherit">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-base font-bold text-white sm:text-xl">{question}</span>
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/25 text-lg leading-none text-white transition duration-300 ${
                    isOpen ? 'rotate-45 border-clox-orange bg-clox-orange text-white' : ''
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="px-4 pb-4 text-base leading-7 text-slate-300 sm:px-5 sm:pb-5 sm:text-lg sm:leading-8">
                  {answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
