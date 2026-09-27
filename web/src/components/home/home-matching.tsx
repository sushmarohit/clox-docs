import Image from 'next/image';
import type { HomeCopy } from '@/components/home/copy';

export function HomeMatching({ copy }: { copy: HomeCopy }) {
  return (
    <section
      id="matching"
      className="scroll-mt-[9.5rem] bg-white py-12 sm:scroll-mt-28 sm:py-28"
    >
      <div className="clox-container">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-clox-surface shadow-[0_16px_40px_rgba(10,31,60,0.08)]">
          <Image
            src="/landing/matching-vehicle-load-banner.webp"
            alt={`${copy.matchingEyebrow} — ${copy.matchingTitle}. ${copy.matchingClassesTitle}.`}
            width={1280}
            height={720}
            className="h-auto w-full"
            sizes="(max-width: 1920px) 100vw, 1600px"
            priority={false}
          />
        </div>
        <p className="mt-6 text-center text-sm italic text-slate-500 sm:mt-8">{copy.matchingNote}</p>
      </div>
    </section>
  );
}
