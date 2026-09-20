import { BulletList } from '@/components/home/bullet-list';
import type { HomeCopy } from '@/components/home/copy';

export function HomeVerification({ copy }: { copy: HomeCopy }) {
  return (
    <section
      id="verification"
      className="scroll-mt-[9.5rem] bg-clox-navy px-5 py-14 text-white sm:scroll-mt-28 sm:px-8 sm:py-28"
    >
      <div className="mx-auto flex min-h-[280px] max-w-4xl flex-col justify-center text-center sm:min-h-[320px] 2xl:max-w-5xl 3xl:min-h-[380px] 3xl:max-w-6xl">
        <h2 className="mb-4 text-[1.65rem] font-extrabold uppercase leading-tight sm:mb-6 sm:text-[2.8rem] 3xl:text-[3.2rem]">
          {copy.verificationTitle}
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-base leading-7 text-slate-200 sm:mb-10 sm:text-lg sm:leading-8 3xl:max-w-4xl 3xl:text-xl 3xl:leading-9">
          {copy.verificationBody}
        </p>
        <div className="mx-auto w-full max-w-2xl text-left 3xl:max-w-3xl">
          <BulletList items={copy.verificationItems} tone="light" />
        </div>
      </div>
    </section>
  );
}
