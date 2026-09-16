import type { HomeCopy } from '@/components/home/copy';

export function HomeFaq({ copy }: { copy: HomeCopy }) {
  return (
    <section id="faq" className="scroll-mt-28 bg-clox-surface px-5 py-12 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[800px]">
        <h2 className="mb-8 text-center text-[1.55rem] font-extrabold uppercase leading-tight text-clox-navy sm:mb-12 sm:text-[2.4rem]">
          {copy.faqTitle}
        </h2>
        <dl className="space-y-6 sm:space-y-8">
          {copy.faq.map(([question, answer]) => (
            <div key={question} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0 sm:pb-8">
              <dt className="text-base font-bold text-clox-navy sm:text-xl">{question}</dt>
              <dd className="mt-3 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
