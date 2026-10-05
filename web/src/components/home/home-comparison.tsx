'use client';

import { useEffect, useState } from 'react';
const COMPARISON_VIDEO_DESKTOP = '/video/comparison-desktop.webm';
const COMPARISON_VIDEO_MOBILE = '/video/comparison-mobile.webm';

export function HomeComparison() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <section
      id="comparison"
      className="relative scroll-mt-[9.5rem] overflow-hidden bg-black sm:scroll-mt-28"
      aria-label="CLOX comparison"
    >
      {isDesktop === false ? (
        <video
          className="block h-auto w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={COMPARISON_VIDEO_MOBILE} type="video/webm" />
        </video>
      ) : null}

      {isDesktop ? (
        <video
          className="block aspect-video h-auto w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={COMPARISON_VIDEO_DESKTOP} type="video/webm" />
        </video>
      ) : null}
    </section>
  );
}
