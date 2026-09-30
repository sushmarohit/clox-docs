'use client';

import Image from 'next/image';
import { useId } from 'react';
import type { HomeCopy } from '@/components/home/copy';
import { journeyStepImages } from '@/components/home/types';

function JourneyRing() {
  return (
    <svg
      className="journey-ring pointer-events-none absolute inset-0 z-[2] h-full w-full origin-center motion-reduce:animate-none"
      viewBox="0 0 180 180"
      aria-hidden
    >
      <circle
        cx="90"
        cy="90"
        r="82"
        fill="none"
        stroke="currentColor"
        className="text-clox-orange"
        strokeWidth="2.5"
        strokeDasharray="8 6"
      />
      <g transform="translate(90, 8)">
        <rect x="-13" y="-6.5" width="14" height="9" rx="1.5" fill="#ff560e" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="-9" y1="-6.5" x2="-9" y2="2.5" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
        <line x1="-5" y1="-6.5" x2="-5" y2="2.5" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
        <line x1="-1" y1="-6.5" x2="-1" y2="2.5" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" />
        <rect x="1" y="-2" width="2" height="3" fill="#0a1f3c" />
        <path
          d="M 3 -6 L 8 -6 Q 10 -6 11 -3 L 13 0 Q 13.5 1 13.5 3.5 L 3 3.5 Z"
          fill="#0a1f3c"
          stroke="#ffffff"
          strokeWidth="0.6"
        />
        <path d="M 5 -5 L 8 -5 L 10.5 0 L 5 0 Z" fill="#38bdf8" />
        <circle cx="13.5" cy="1.5" r="1" fill="#fef08a" />
        <polygon points="14,1.5 19,-0.5 19,3.5" fill="rgba(254, 240, 138, 0.5)" />
        <circle cx="-9" cy="3.5" r="2.2" fill="#1e293b" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="-3" cy="3.5" r="2.2" fill="#1e293b" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="8" cy="3.5" r="2.2" fill="#1e293b" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="-9" cy="3.5" r="0.9" fill="#ff560e" />
        <circle cx="-3" cy="3.5" r="0.9" fill="#ff560e" />
        <circle cx="8" cy="3.5" r="0.9" fill="#ff560e" />
        <path
          d="M -18 -2.5 L -15 0 L -18 2.5"
          fill="none"
          stroke="#ff560e"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M -22 -2.5 L -19 0 L -22 2.5"
          fill="none"
          stroke="#ff560e"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

function FlowArrow({ className, markerId }: { className: string; markerId: string }) {
  return (
    <svg
      className={`pointer-events-none absolute top-[90px] z-[5] hidden h-10 w-[90px] xl:block ${className}`}
      viewBox="0 0 100 40"
      aria-hidden
    >
      <defs>
        <marker id={markerId} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="#ff560e" />
        </marker>
      </defs>
      <path
        d="M 5 20 Q 50 0 92 20"
        fill="none"
        stroke="#ff560e"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        markerEnd={`url(#${markerId})`}
        className="animate-journey-dash motion-reduce:animate-none"
      />
    </svg>
  );
}

export function HomeJourney({ copy }: { copy: HomeCopy }) {
  const uid = useId().replace(/:/g, '');

  return (
    <section id="process" className="scroll-mt-[9.5rem] overflow-x-hidden bg-white py-14 sm:scroll-mt-28 sm:py-28">
      <div className="clox-container">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-14">
          <h2 className="mb-3 text-[1.65rem] font-extrabold uppercase leading-tight text-clox-navy sm:text-[2.8rem] 3xl:text-[3.2rem]">
            {copy.journeyTitle}
          </h2>
          <p className="text-base leading-7 text-slate-500 sm:text-[1.15rem] sm:leading-8">{copy.journeySub}</p>
        </div>

        <div className="relative mb-2 grid grid-cols-2 gap-1 sm:mb-4 sm:gap-4 xl:grid-cols-4 xl:gap-8">
          <FlowArrow className="left-[21%]" markerId={`${uid}-a1`} />
          <FlowArrow className="left-[47%]" markerId={`${uid}-a2`} />
          <FlowArrow className="left-[73%]" markerId={`${uid}-a3`} />

          {copy.steps.map(([title, sub, body], index) => {
            const step = String(index + 1).padStart(2, '0');

            return (
              <article
                key={title}
                className="journey-card group relative flex h-full min-w-0 flex-col items-center rounded-[14px] border-2 border-clox-orange/45 bg-white px-1.5 py-3 text-center shadow-[0_10px_30px_rgba(10,31,60,0.05)] transition duration-500 hover:-translate-y-2.5 hover:border-clox-orange hover:bg-[#fffcf9] hover:shadow-[0_20px_45px_rgba(255,86,14,0.2)] focus-within:-translate-y-2.5 focus-within:border-clox-orange focus-within:bg-[#fffcf9] focus-within:shadow-[0_20px_45px_rgba(255,86,14,0.2)] sm:rounded-3xl sm:px-4 sm:py-8 xl:px-5 max-md:hover:translate-y-0"
              >
                <div className="relative mx-auto mb-2 flex h-[82px] w-[82px] items-center justify-center sm:mb-5 sm:h-[140px] sm:w-[140px] xl:mb-7 xl:h-[180px] xl:w-[180px]">
                  <JourneyRing />

                  <div className="relative z-[1] h-[66px] w-[66px] overflow-hidden rounded-full bg-slate-100 shadow-[0_10px_25px_rgba(10,31,60,0.14)] animate-journey-float motion-reduce:animate-none sm:h-[115px] sm:w-[115px] xl:h-[150px] xl:w-[150px]">
                    <Image
                      src={journeyStepImages[index]}
                      alt={title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110 group-focus-within:scale-110"
                      sizes="(max-width: 640px) 66px, (max-width: 1280px) 115px, 150px"
                    />
                  </div>

                  <div className="absolute right-0 top-0 z-[4] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-clox-orange to-[#e65c00] text-[0.65rem] font-extrabold text-white shadow-[0_6px_18px_rgba(255,86,14,0.35)] transition duration-300 group-hover:scale-110 group-hover:rotate-[5deg] group-focus-within:scale-110 group-focus-within:rotate-[5deg] sm:right-0.5 sm:h-9 sm:w-9 sm:border-[3px] sm:text-[0.85rem] xl:h-11 xl:w-11 xl:text-[0.95rem]">
                    {step}
                  </div>
                </div>

                <h3 className="mb-1 break-words text-[0.85rem] font-bold leading-snug text-clox-navy transition-colors duration-300 group-hover:text-clox-orange group-focus-within:text-clox-orange sm:mb-2 sm:text-[1.15rem] xl:text-[1.3rem]">
                  {title}
                </h3>
                <p className="mb-1 min-h-[1.9rem] break-words text-[0.58rem] font-bold uppercase leading-tight tracking-wide text-clox-orange sm:mb-3 sm:min-h-[2.3rem] sm:text-[0.72rem] sm:tracking-[0.06em] xl:text-[0.8rem]">
                  {sub}
                </p>
                <p className="break-words text-[0.69rem] leading-snug text-slate-600 sm:text-[0.9rem] sm:leading-6 xl:text-[0.95rem] xl:leading-7">
                  {body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
