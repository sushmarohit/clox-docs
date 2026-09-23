import Image from 'next/image';
import type { HomeCopy } from '@/components/home/copy';
import { journeyStepImages } from '@/components/home/types';

export function HomeJourney({ copy }: { copy: HomeCopy }) {
  return (
    <section id="process" className="scroll-mt-[9.5rem] py-14 sm:scroll-mt-28 sm:py-28">
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
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition duration-500 hover:-translate-y-4 hover:border-clox-orange/40 hover:shadow-[0_20px_40px_rgba(10,31,60,0.1)]"
            >
              <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />

              <div className="relative h-40 overflow-hidden sm:h-44">
                <Image
                  src={journeyStepImages[index]}
                  alt={title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-clox-navy text-base font-extrabold text-clox-orange shadow-[0_10px_20px_rgba(10,31,60,0.35)]">
                  {index + 1}
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-8 pt-4 text-center sm:px-6">
                <h3 className="mb-2 text-[1.25rem] font-extrabold tracking-wide text-clox-navy transition-colors duration-300 group-hover:text-clox-orange sm:text-[1.4rem]">
                  {title}
                </h3>
                <p className="mb-3 text-[0.85rem] font-semibold uppercase leading-snug text-clox-orange sm:mb-4 sm:text-[0.95rem]">
                  {sub}
                </p>
                <p className="text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
