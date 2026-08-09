import type { HomeCopy } from '@/components/home/copy';

export function HomeAbout({ copy }: { copy: HomeCopy }) {
  return (
    <section id="aboutus" className="scroll-mt-28 px-5 py-28 sm:px-8">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div>
          <h2 className="mb-4 text-left text-[2.2rem] font-extrabold uppercase tracking-tight text-clox-navy sm:text-[2.8rem] lg:text-[3.1rem] xl:mb-5 xl:text-[3.35rem]">
            {copy.overviewTitle}
          </h2>
          <p className="text-[1.1rem] leading-8 text-slate-600 lg:text-[1.2rem] lg:leading-9 xl:text-[1.3rem] xl:leading-10">
            {copy.overviewBody}
          </p>
        </div>
        <div className="mx-auto w-full max-w-[480px] lg:max-w-none">
          <img
            src="/landing/overview.jpg"
            alt="Modern logistics"
            className="aspect-[4/3] max-h-[420px] w-full rounded-2xl object-cover shadow-clox-card xl:max-h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}
