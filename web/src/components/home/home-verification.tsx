import { BulletList } from '@/components/home/bullet-list';
import type { HomeCopy } from '@/components/home/copy';

export function HomeVerification({ copy }: { copy: HomeCopy }) {
  return (
    <section id="verification" className="scroll-mt-28 bg-white px-5 py-12 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[800px] text-center">
        <h2 className="mb-3 text-[1.55rem] font-extrabold uppercase leading-tight text-clox-navy sm:mb-4 sm:text-[2.4rem]">
          {copy.verificationTitle}
        </h2>
        <p className="mb-8 text-base leading-7 text-slate-600 sm:mb-10 sm:text-lg sm:leading-8">
          {copy.verificationBody}
        </p>
        <div className="text-left">
          <BulletList items={copy.verificationItems} />
        </div>
      </div>
    </section>
  );
}
