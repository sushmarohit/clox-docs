import { BulletList } from '@/components/home/bullet-list';
import type { HomeCopy } from '@/components/home/copy';

export function HomeComparison({ copy }: { copy: HomeCopy }) {
  return (
    <section id="comparison" className="relative flex scroll-mt-[9.5rem] flex-wrap bg-black p-0 text-white sm:scroll-mt-28">
      <ComparisonPanel
        image="/landing/comparison-legacy.jpg"
        imageAlt={copy.legacyTitle}
        overlayClassName="bg-gradient-to-b from-black/40 to-black/65"
        mobileScrim="from-transparent via-black/40 to-black"
        contentAlign="sm:ml-auto sm:mr-12"
        panelBg="bg-black"
        title={copy.legacyTitle}
        subtitle={copy.legacySub}
        subtitleClassName="text-slate-100"
        items={copy.legacy}
        tone="danger"
        stats={copy.legacyStats}
        statClassName="text-red-200"
      />

      <div className="absolute left-1/2 top-1/2 z-20 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-clox-navy bg-clox-orange text-3xl font-black italic shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:mx-auto max-lg:my-[-40px] max-lg:translate-x-0 max-lg:translate-y-0">
        {copy.comparisonVs}
      </div>

      <ComparisonPanel
        image="/landing/comparison-future.jpg"
        imageAlt={copy.futureTitle}
        overlayClassName="bg-gradient-to-b from-[rgba(10,31,60,0.35)] to-[rgba(10,31,60,0.6)]"
        mobileScrim="from-transparent via-clox-navy/45 to-[#061427]"
        contentAlign="sm:ml-12 sm:mr-auto"
        panelBg="bg-[#061427]"
        title={copy.futureTitle}
        subtitle={copy.futureSub}
        subtitleClassName="text-clox-orange"
        items={copy.future}
        tone="success"
        stats={copy.futureStats}
        statClassName="text-sky-200"
      />

      <div className="relative z-10 w-full bg-clox-navy py-8 text-center sm:py-10">
        <div className="clox-container flex flex-col items-center gap-4 sm:gap-6">
          <p className="text-[1.25rem] font-black uppercase tracking-wide sm:text-[2.2rem] 3xl:text-[2.6rem]">
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

function ComparisonPanel({
  image,
  imageAlt,
  overlayClassName,
  mobileScrim,
  contentAlign,
  panelBg,
  title,
  subtitle,
  subtitleClassName,
  items,
  tone,
  stats,
  statClassName,
}: {
  image: string;
  imageAlt: string;
  overlayClassName: string;
  mobileScrim: string;
  contentAlign: string;
  panelBg: string;
  title: string;
  subtitle: string;
  subtitleClassName: string;
  items: readonly string[];
  tone: 'danger' | 'success';
  stats: readonly string[];
  statClassName: string;
}) {
  return (
    <article className="relative flex min-w-full flex-1 flex-col sm:min-w-[50%] sm:justify-center sm:px-12 sm:py-32 2xl:px-16 2xl:py-40 3xl:px-20 3xl:py-48">
      {/* Mobile: dedicated clear photo band */}
      <div className="relative h-[210px] overflow-hidden sm:hidden">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${mobileScrim}`} aria-hidden />
      </div>

      {/* Desktop: full-bleed background with lighter overlay */}
      <div className="absolute inset-0 hidden sm:block" aria-hidden>
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className={`absolute inset-0 ${overlayClassName}`} />
      </div>

      <div className={`relative z-10 px-6 pb-12 pt-6 sm:bg-transparent sm:px-0 sm:py-0 ${panelBg} sm:bg-transparent`}>
        <div
          className={`mx-auto w-full max-w-[500px] sm:[text-shadow:0_2px_14px_rgba(0,0,0,0.85)] 2xl:max-w-[560px] 3xl:max-w-[620px] ${contentAlign}`}
        >
          <h2 className="mb-2 text-[1.65rem] font-extrabold uppercase leading-none sm:text-[2.8rem] 3xl:text-[3.2rem]">
            {title}
          </h2>
          <p
            className={`mb-6 text-[1.15rem] font-bold uppercase tracking-wide sm:mb-8 sm:text-[1.3rem] 3xl:text-[1.4rem] ${subtitleClassName}`}
          >
            {subtitle}
          </p>
          <BulletList items={items} tone={tone} />
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-6 sm:mt-8 sm:pt-8">
            {stats.map((stat) => (
              <span
                key={stat}
                className={`rounded-md bg-black/65 px-3 py-1.5 text-sm font-semibold ${statClassName}`}
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
