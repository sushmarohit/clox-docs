import Link from 'next/link';
import { BulletList } from '@/components/home/bullet-list';
import type { HomeSectionProps } from '@/components/home/types';

export function HomeEcosystem({ copy, locale }: HomeSectionProps) {
  const cards = [
    {
      image: '/landing/hero.jpg',
      label: 'Corporate Sender',
      title: copy.senderTitle,
      sub: copy.senderSub,
      items: copy.sender,
      href: `/${locale}/registry`,
    },
    {
      image: '/landing/carrier.jpg',
      label: 'Transport Carrier',
      title: copy.carrierTitle,
      sub: copy.carrierSub,
      items: copy.carrier,
      href: `/${locale}/registry`,
    },
  ];

  return (
    <section id="ecosystem" className="scroll-mt-[9.5rem] bg-clox-surface py-12 sm:scroll-mt-28 sm:py-20">
      <div className="clox-container">
        <p className="mb-2 text-center text-sm font-bold uppercase tracking-[0.2em] text-clox-orange sm:mb-3">
          {copy.ecosystemEyebrow}
        </p>
        <h2 className="mb-8 text-center text-[1.65rem] font-extrabold uppercase leading-tight text-clox-navy sm:mb-16 sm:text-[2.8rem] 3xl:text-[3.2rem]">
          {copy.ecosystemTitle}
        </h2>
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 3xl:gap-10">
          {cards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.1)] transition duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
            >
              <div className="relative h-[280px]">
                <img src={card.image} alt={card.label} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-clox-navy to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <span className="inline-block rounded-full border border-clox-orange/60 bg-clox-navy/75 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-clox-orange shadow-lg backdrop-blur-sm">
                    {card.label}
                  </span>
                  <h3 className="mt-3 text-3xl font-extrabold">{card.title}</h3>
                  <p className="mt-2 font-semibold text-slate-200">{card.sub}</p>
                </div>
              </div>
              <div className="p-8">
                <BulletList items={card.items} />
                <Link href={card.href} className="clox-btn-primary mt-8">
                  {copy.preLaunch}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
