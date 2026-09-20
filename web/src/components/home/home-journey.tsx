import type { HomeCopy } from '@/components/home/copy';

export function HomeJourney({ copy }: { copy: HomeCopy }) {
  return (
    <section id="process" className="scroll-mt-[9.5rem] px-5 py-14 sm:scroll-mt-28 sm:px-8 sm:py-28">
      <div className="clox-container">
        <h2 className="mb-2 text-center text-[1.65rem] font-extrabold uppercase leading-tight text-clox-navy sm:mb-3 sm:text-[2.8rem] 3xl:text-[3.2rem]">
          {copy.journeyTitle}
        </h2>
        <p className="mb-8 text-center text-base text-slate-500 sm:mb-16 sm:text-[1.2rem] 3xl:text-[1.3rem]">
          {copy.journeySub}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4 3xl:gap-10">
          {copy.steps.map(([title, sub, body], index) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(10,31,60,0.08)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-clox-navy text-[1.8rem] font-extrabold text-white shadow-[0_10px_20px_rgba(10,31,60,0.2)]">
                {index + 1}
              </div>
              <h3 className="mb-2 text-[1.4rem] font-extrabold tracking-wide text-clox-navy">
                {title}
              </h3>
              <p className="mb-4 text-[0.95rem] font-semibold uppercase text-clox-orange">{sub}</p>
              <p className="text-slate-500">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
