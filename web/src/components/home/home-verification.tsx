import { BulletList } from '@/components/home/bullet-list';
import type { HomeCopy } from '@/components/home/copy';

export function HomeVerification({ copy }: { copy: HomeCopy }) {
  return (
    <section id="verification" className="scroll-mt-28 bg-white px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[800px] text-center">
        <h2 className="mb-4 text-[2rem] font-extrabold uppercase text-clox-navy sm:text-[2.4rem]">
          {copy.verificationTitle}
        </h2>
        <p className="mb-10 text-lg leading-8 text-slate-600">{copy.verificationBody}</p>
        <div className="text-left">
          <BulletList items={copy.verificationItems} />
        </div>
      </div>
    </section>
  );
}
