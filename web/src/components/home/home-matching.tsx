import type { HomeCopy } from '@/components/home/copy';

export function HomeMatching({ copy }: { copy: HomeCopy }) {
  return (
    <section id="matching" className="scroll-mt-28 bg-white px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-4 text-center text-[2.2rem] font-extrabold uppercase tracking-tight text-clox-navy sm:text-[2.8rem]">
          {copy.matchingTitle}
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-[1.1rem] leading-8 text-slate-600">
          {copy.matchingBody}
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {copy.matchingSteps.map(([title, body], index) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-clox-surface px-6 py-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-clox-navy text-lg font-extrabold text-clox-orange">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-extrabold text-clox-navy">{title}</h3>
              <p className="text-base leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm italic text-slate-500">{copy.matchingNote}</p>
      </div>
    </section>
  );
}
