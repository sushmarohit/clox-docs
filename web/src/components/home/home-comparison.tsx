import { BulletList } from '@/components/home/bullet-list';
import type { HomeCopy } from '@/components/home/copy';

export function HomeComparison({ copy }: { copy: HomeCopy }) {
  return (
    <section id="comparison" className="relative flex scroll-mt-28 flex-wrap bg-black p-0 text-white">
      <article className="relative flex min-w-full flex-1 flex-col justify-center px-6 py-12 sm:min-w-[50%] sm:px-12 sm:py-32">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.55),rgba(15,15,15,0.72)),url('/landing/comparison-legacy.jpg')] bg-cover bg-center"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-[500px] [text-shadow:0_2px_14px_rgba(0,0,0,0.9)] sm:ml-auto sm:mr-12">
          <h2 className="mb-2 text-[1.65rem] font-extrabold uppercase leading-none sm:text-[2.8rem]">
            {copy.legacyTitle}
          </h2>
          <p className="mb-8 text-[1.3rem] font-bold uppercase tracking-wide text-slate-100">
            {copy.legacySub}
          </p>
          <BulletList items={copy.legacy} tone="danger" />
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-8">
            {copy.legacyStats.map((stat) => (
              <span
                key={stat}
                className="rounded-md bg-black/65 px-3 py-1.5 text-sm font-semibold text-red-200"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </article>

      <div className="absolute left-1/2 top-1/2 z-20 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-clox-navy bg-clox-orange text-3xl font-black italic shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:mx-auto max-lg:my-[-40px] max-lg:translate-x-0 max-lg:translate-y-0">
        {copy.comparisonVs}
      </div>

      <article className="relative flex min-w-full flex-1 flex-col justify-center px-6 py-12 sm:min-w-[50%] sm:px-12 sm:py-32">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(10,31,60,0.52),rgba(10,31,60,0.7)),url('/landing/comparison-future.jpg')] bg-cover bg-center"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-[500px] [text-shadow:0_2px_14px_rgba(0,0,0,0.85)] sm:ml-12 sm:mr-auto">
          <h2 className="mb-2 text-[1.65rem] font-extrabold uppercase leading-none sm:text-[2.8rem]">
            {copy.futureTitle}
          </h2>
          <p className="mb-8 text-[1.3rem] font-bold uppercase tracking-wide text-clox-orange">
            {copy.futureSub}
          </p>
          <BulletList items={copy.future} tone="success" />
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-8">
            {copy.futureStats.map((stat) => (
              <span
                key={stat}
                className="rounded-md bg-black/65 px-3 py-1.5 text-sm font-semibold text-sky-200"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </article>

      <div className="relative z-10 w-full bg-clox-navy px-6 py-8 text-center sm:py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 sm:gap-6">
          <p className="text-[1.25rem] font-black uppercase tracking-wide sm:text-[2.2rem]">
            {copy.futureFooter.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-clox-orange">
              {copy.futureFooter.split(' ').slice(-2).join(' ')}
            </span>
          </p>
          <a href="#ecosystem" className="clox-btn-primary px-12 py-4 text-[1.2rem]">
            {copy.joinEcosystem}
          </a>
        </div>
      </div>
    </section>
  );
}
