import type { HomeCopy } from '@/components/home/copy';

export function HomeMatching({ copy }: { copy: HomeCopy }) {
  return (
    <section
      id="matching"
      className="scroll-mt-[9.5rem] bg-white px-5 py-12 sm:scroll-mt-28 sm:px-8 sm:py-28"
    >
      <div className="clox-container">
        <p className="mb-2 text-center text-sm font-bold uppercase tracking-[0.18em] text-clox-orange">
          {copy.matchingEyebrow}
        </p>
        <h2 className="mb-3 text-center text-[1.65rem] font-extrabold uppercase leading-tight tracking-tight text-clox-navy sm:mb-4 sm:text-[2.8rem] 3xl:text-[3.2rem]">
          {copy.matchingTitle}
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-7 text-slate-600 sm:mb-12 sm:text-[1.1rem] sm:leading-8">
          {copy.matchingBody}
        </p>
        <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
          {copy.matchingSteps.map(([title, body], index) => (
            <article
              key={title}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-clox-surface px-6 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(10,31,60,0.08)]"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-clox-navy text-lg font-extrabold text-clox-orange shadow-[0_10px_20px_rgba(10,31,60,0.2)]">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-extrabold text-clox-navy">{title}</h3>
              <p className="text-base leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-clox-surface px-5 py-8 sm:mt-14 sm:px-8">
          <h3 className="mb-6 text-center text-base font-extrabold uppercase tracking-wide text-clox-navy sm:text-lg">
            {copy.matchingClassesTitle}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
            {copy.matchingClasses.map(([title, body]) => (
              <article
                key={title}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-5 text-center transition duration-500 hover:-translate-y-2 hover:shadow-[0_16px_32px_rgba(10,31,60,0.08)]"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />
                <h4 className="mb-2 text-sm font-extrabold text-clox-navy sm:text-base">{title}</h4>
                <p className="text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm italic text-slate-500 sm:mt-10">{copy.matchingNote}</p>
      </div>
    </section>
  );
}
