'use client';

import { useEffect, useState } from 'react';
import type { HomeCopy } from '@/components/home/copy';
import { heroSlides } from '@/components/home/types';

export function HomeHero({ copy }: { copy: HomeCopy }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="banner"
      className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-clox-navy pt-[160px] text-center text-white sm:min-h-screen sm:pt-[200px] xl:min-h-[850px] xl:max-h-[920px] xl:items-start xl:pt-[180px] 2xl:min-h-[900px] 2xl:max-h-[980px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        {heroSlides.map((item, index) => (
          <div
            key={item.image}
            className={`absolute -inset-2 scale-[1.02] bg-cover bg-center blur-[2px] transition-opacity duration-[1500ms] ease-in-out xl:blur-[1px] ${
              index === slide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${item.image}')` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[rgba(5,20,40,0.55)] to-[rgba(0,7,17,0.5)] xl:from-black/80 xl:via-[rgba(5,20,40,0.65)] xl:to-[rgba(0,7,17,0.6)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[900px] animate-hero-fade-up px-5 pb-20 pt-8 sm:px-8 xl:max-w-[1040px] xl:pb-24 xl:pt-10 2xl:max-w-[1120px]">
        <span className="mb-8 inline-block rounded-full border border-clox-orange/60 bg-clox-navy/75 px-6 py-2 text-[0.9rem] font-bold uppercase tracking-[2px] text-clox-orange shadow-lg backdrop-blur-sm xl:mb-10 xl:text-base">
          {copy.tagline}
        </span>

        <div className="relative mx-auto mb-8 flex min-h-[250px] w-full items-center justify-center xl:mb-10 xl:min-h-[280px]">
          {heroSlides.map((item, index) => {
            const active = index === slide;
            return (
              <div
                key={item.image}
                className={`w-full transition-all duration-1000 ease-in-out ${
                  active
                    ? 'relative translate-y-0 opacity-100'
                    : 'pointer-events-none absolute inset-x-0 top-0 translate-y-5 opacity-0'
                }`}
                aria-hidden={!active}
              >
                <h1 className="mb-6 text-[2rem] font-extrabold leading-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] sm:text-[2.2rem] lg:text-[3.2rem] xl:mb-7 xl:text-[3.6rem] 2xl:text-[4rem]">
                  {copy[item.titleLeadKey]}
                  <br />
                  <span className="text-clox-orange">{copy[item.titleAccentKey]}</span>
                </h1>
                <p className="mx-auto mb-0 max-w-[800px] text-[1.15rem] font-light leading-8 text-[#e2e8f0] sm:text-[1.25rem] xl:max-w-[920px] xl:text-[1.35rem] xl:leading-9 2xl:text-[1.45rem]">
                  {copy[item.bodyKey]}
                </p>
              </div>
            );
          })}
        </div>

        <a
          href="#comparison"
          className="clox-btn-primary px-12 py-4 text-[1.15rem] xl:px-14 xl:py-4.5 xl:text-[1.2rem]"
        >
          {copy.explore}
        </a>

        <div className="mt-8 flex justify-center gap-2 xl:mt-10" aria-label="Hero slides">
          {heroSlides.map((item, index) => (
            <button
              key={item.image}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === slide}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === slide ? 'bg-clox-orange' : 'bg-white/40 hover:bg-white/70'
              }`}
              onClick={() => setSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
