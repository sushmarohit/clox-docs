import type { HomeCopy } from '@/components/home/copy';

export function HomeNextGen({ copy }: { copy: HomeCopy }) {
  return (
    <section
      id="next-gen"
      className="relative scroll-mt-[9.5rem] overflow-hidden px-5 py-14 text-center text-white sm:scroll-mt-28 sm:px-8 sm:py-28"
      style={{
        backgroundImage: "url('/landing/73979.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,31,60,0.85),rgba(10,31,60,0.95))]" />
      <div className="relative z-10 mx-auto flex min-h-[280px] max-w-4xl flex-col items-center justify-center sm:min-h-[320px]">
        <h2 className="mb-4 text-[1.65rem] font-extrabold uppercase leading-tight sm:mb-6 sm:text-[2.8rem]">
          {copy.nextTitle}
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
          {copy.nextBody}
        </p>
        <a href="#ecosystem" className="clox-btn-primary">
          {copy.discover}
        </a>
      </div>
    </section>
  );
}
