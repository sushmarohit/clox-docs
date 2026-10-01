'use client';

import Image from 'next/image';
import type { HomeCopy } from '@/components/home/copy';
import { matchingAppPhoneImage, matchingVehicleImages } from '@/components/home/types';

export function HomeMatching({ copy }: { copy: HomeCopy }) {
  const vehicles = copy.matchingClasses.map((name, index) => ({
    name,
    image: matchingVehicleImages[index],
  }));

  // Duplicate for seamless CSS marquee
  const track = [...vehicles, ...vehicles];

  return (
    <section
      id="matching"
      className="relative scroll-mt-[9.5rem] overflow-hidden bg-white py-12 sm:scroll-mt-28 sm:py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(77,165,232,0.12)_0%,transparent_50%)] opacity-80"
        aria-hidden
      />

      <div className="clox-container relative z-10">
        <h2 className="mb-8 text-center text-[1.65rem] font-extrabold uppercase leading-tight tracking-tight text-clox-navy sm:mb-12 sm:text-[2.6rem] lg:text-[3rem] 3xl:text-[3.2rem]">
          {copy.matchingEyebrow}
        </h2>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-8 xl:gap-12">
          <div className="relative z-20 flex w-full justify-center lg:w-[34%] lg:justify-start lg:pl-4">
            <Image
              src={matchingAppPhoneImage}
              alt="CLOX vehicle and load matching app"
              width={330}
              height={680}
              className="h-auto w-full max-w-[240px] object-contain drop-shadow-2xl sm:max-w-[280px] md:max-w-[310px] lg:max-w-[330px]"
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 310px, 330px"
              priority={false}
            />
          </div>

          <div className="w-full lg:w-[66%]">
            <div className="-ml-2 mb-6 inline-block rounded-r-full bg-clox-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md sm:mb-8 sm:-ml-4 sm:px-6 sm:text-sm md:text-base">
              {copy.matchingClassesTitle}
            </div>

            <div className="mb-8 flex items-start gap-3 sm:mb-10 sm:gap-4">
              <div className="mt-1 h-8 w-1.5 shrink-0 rounded-full bg-clox-orange sm:h-10" aria-hidden />
              <div>
                <h3 className="mb-3 text-xl font-extrabold uppercase leading-tight text-clox-navy sm:mb-5 sm:text-3xl lg:text-4xl">
                  {copy.matchingTitle}
                </h3>
                <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg md:text-xl md:leading-8">
                  {copy.matchingBody}
                </p>
              </div>
            </div>

            <div className="matching-marquee -mx-5 overflow-hidden sm:mx-0">
              <div className="matching-marquee-track flex w-max gap-3 py-4 sm:gap-4">
                {track.map((vehicle, index) => (
                  <article
                    key={`${vehicle.name}-${index}`}
                    className="flex w-[140px] shrink-0 flex-col items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-3 text-center shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] sm:w-[160px] sm:px-3 sm:py-4 lg:w-[170px]"
                  >
                    <div className="relative mb-2 h-14 w-full sm:h-16">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        className="object-contain"
                        sizes="170px"
                      />
                    </div>
                    <h4 className="text-[0.68rem] font-bold uppercase leading-snug text-clox-navy sm:text-[0.78rem]">
                      {vehicle.name}
                    </h4>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm italic text-slate-500 sm:mt-10">{copy.matchingNote}</p>
      </div>
    </section>
  );
}
