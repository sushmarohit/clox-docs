import type { HomeCopy } from '@/components/home/copy';

export function HomeNextGen({ copy }: { copy: HomeCopy }) {
  return (
    <section
      id="next-gen"
      className="relative scroll-mt-28 overflow-hidden px-5 py-32 text-center text-white sm:px-8"
      style={{
        backgroundImage: "url('/landing/73979.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,31,60,0.85),rgba(10,31,60,0.95))]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-6 text-[2.2rem] font-extrabold uppercase sm:text-[2.8rem]">
          {copy.nextTitle}
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-slate-200">
          {copy.nextBody}
        </p>
        <a href="#ecosystem" className="clox-btn-primary">
          {copy.discover}
        </a>
      </div>
    </section>
  );
}
