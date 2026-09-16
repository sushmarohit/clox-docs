import type { HomeCopy } from '@/components/home/copy';
import { featureImages } from '@/components/home/types';

export function HomeFeatures({ copy }: { copy: HomeCopy }) {
  return (
    <section id="features" className="scroll-mt-28 bg-slate-950 px-5 py-14 text-white sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-4 text-center text-[1.65rem] font-extrabold uppercase leading-tight text-white sm:text-[2.8rem]">
          {copy.featuresTitle}
        </h2>
        <div className="mt-8 grid gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-3 lg:grid-rows-2">
          {copy.features.map(([title, body], index) => (
            <article
              key={title}
              className={`group relative min-h-[320px] overflow-hidden rounded-3xl border border-white/5 bg-slate-800 transition duration-500 hover:-translate-y-2 hover:border-[rgba(255,86,14,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
                index === 0 ? 'lg:col-span-2' : ''
              } ${index === 1 ? 'lg:row-span-2' : ''}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                style={{ backgroundImage: `url('${featureImages[index]}')` }}
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-8 pt-24">
                <h3 className="mb-2 text-[1.4rem] font-extrabold text-clox-orange sm:text-[1.8rem]">{title}</h3>
                <p className="text-[1.1rem] leading-7 text-slate-200">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
