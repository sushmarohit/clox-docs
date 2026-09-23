import Image from 'next/image';
import type { HomeCopy } from '@/components/home/copy';
import { matchingStepImages, vehicleClassImages } from '@/components/home/types';

export function HomeMatching({ copy }: { copy: HomeCopy }) {
  return (
    <section
      id="matching"
      className="scroll-mt-[9.5rem] bg-white py-12 sm:scroll-mt-28 sm:py-28"
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
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-clox-surface shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition duration-500 hover:-translate-y-4 hover:border-clox-orange/40 hover:shadow-[0_20px_40px_rgba(10,31,60,0.1)]"
            >
              <div className="absolute inset-x-0 bottom-0 z-10 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />

              <div className="relative h-44 overflow-hidden sm:h-48">
                <Image
                  src={matchingStepImages[index]}
                  alt={title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clox-surface via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-clox-navy text-base font-extrabold text-clox-orange shadow-[0_10px_20px_rgba(10,31,60,0.35)]">
                  {index + 1}
                </div>
              </div>

              <div className="flex flex-1 flex-col px-6 pb-8 pt-5 text-center">
                <h3 className="mb-2 text-xl font-extrabold text-clox-navy transition-colors duration-300 group-hover:text-clox-orange">
                  {title}
                </h3>
                <p className="text-base leading-7 text-slate-600">{body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 sm:mt-14">
          <h3 className="mb-6 text-center text-base font-extrabold uppercase tracking-wide text-clox-navy sm:text-lg">
            {copy.matchingClassesTitle}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
            {copy.matchingClasses.map(([title, body, payload, capacity], index) => (
              <article
                key={title}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_8px_24px_rgba(10,31,60,0.04)] transition duration-500 hover:-translate-y-3 hover:border-clox-orange/50 hover:shadow-[0_20px_40px_rgba(10,31,60,0.12)] sm:p-5"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />

                <div className="relative mb-4 h-28 w-full overflow-hidden sm:h-32">
                  <Image
                    src={vehicleClassImages[index]}
                    alt={title}
                    fill
                    className="object-contain transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <h4 className="mb-1 text-base font-extrabold leading-snug text-clox-navy transition-colors duration-300 group-hover:text-clox-orange sm:text-lg">
                  {title}
                </h4>
                <p className="mb-5 text-sm leading-6 text-slate-500">{body}</p>

                <div className="mt-auto grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 transition-colors duration-300 group-hover:border-clox-orange/20">
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-clox-navy transition duration-300 group-hover:bg-[#FFF4EE] group-hover:text-clox-orange"
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 7h10v10H7z" />
                        <path d="M9 4h6v3H9zM9 17h6v3H9z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-clox-navy">{payload}</p>
                      <p className="text-xs text-slate-500">{copy.matchingPayloadLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-clox-navy transition duration-300 group-hover:bg-[#FFF4EE] group-hover:text-clox-orange"
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" />
                        <path d="M12 12v8M4 8l8 4 8-4" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-clox-navy">{capacity}</p>
                      <p className="text-xs text-slate-500">{copy.matchingCapacityLabel}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm italic text-slate-500 sm:mt-10">{copy.matchingNote}</p>
      </div>
    </section>
  );
}
