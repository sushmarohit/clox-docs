'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocaleParam } from '@/lib/use-locale-param';

const copy = {
  en: {
    nav: [
      ['Home', '#banner'],
      ['About', '#aboutus'],
      ['Compare', '#comparison'],
      ['Features', '#features'],
      ['Journey', '#process'],
      ['Ecosystem', '#ecosystem'],
    ],
    tagline: 'The Freight Broker is Now Code',
    slide1TitleLead: 'Welcome to the Future of',
    slide1TitleAccent: 'Australian Logistics',
    slide1Body:
      "CLOX is Australia's decentralized, automated 4PL digital ecosystem connecting corporate senders directly with vetted heavy vehicle owner-operators and transport fleets while eliminating traditional brokers and hidden margins.",
    slide2TitleLead: 'Move Your Goods',
    slide2TitleAccent: 'Quickly & Securely',
    slide2Body:
      'Smart freight forwarding made simple, transparent, and efficient. No more complicated forms or endless phone calls to chase down quotes—just the essentials you need to move your goods quickly, affordably, and securely.',
    slide3TitleLead: 'Freight Without',
    slide3TitleAccent: 'the Friction',
    slide3Body:
      'A connected freight experience designed to reduce manual handoffs, improve visibility, and help Australian senders and transport operators move with confidence.',
    slide4TitleLead: 'One Connected',
    slide4TitleAccent: 'Freight Ecosystem',
    slide4Body:
      'CLOX is being built to bring corporate senders, vetted carriers, transparent bidding, tracking, and protected payments into one streamlined digital journey.',
    explore: 'Explore the Platform',
    preLaunch: 'Join Pre-Launch',
    overviewTitle: 'Company Overview',
    overviewBody:
      "Welcome to CLOX — Australia's smartest way to ship freight. We are transforming logistics by bringing simplicity, transparency, and total visibility to the modern supply chain. By replacing high-overhead manual middleware with a sovereign, high-efficiency digital ecosystem, CLOX connects corporate senders directly with vetted heavy vehicle operators while securing transactions via planned upfront escrow protection.",
    nextTitle: 'The Next Generation of Logistics',
    nextBody:
      'CLOX represents the next generation of autonomous 4PL logistics. By modernizing Australian logistics through a decentralized, automated 4PL digital ecosystem, the platform bridges the gap between shippers looking for competitive pricing and carriers looking to optimize asset utilization. Our technology removes traditional frictional costs, returning control, speed, and visibility to the businesses that drive our economy.',
    discover: 'Discover the Ecosystem',
    legacyTitle: 'Legacy Middleware',
    legacySub: 'Slow. Manual. Error-Prone.',
    legacy: [
      'Manual Data Entry',
      'Rate Errors',
      'Slow Response',
      'Limited Visibility',
      'High Operational Cost',
      'Manpower Intensive',
    ],
    legacyStats: [
      'Hours to Quote',
      'High Error Rate',
      'High Operational Cost',
      'Reactive Problem Solving',
      'Manpower Intensive',
    ],
    futureTitle: 'Autonomous 4PL Ecosystem',
    futureSub: 'Fast. Automated. Smarter.',
    future: [
      'Real-Time Visibility',
      'Automated Bidding',
      'Smart Rate Matching',
      'End-to-End Tracking',
      'Lower Costs, Higher Efficiency',
      'Data-Driven Insights',
    ],
    futureStats: [
      'Minutes to Quote',
      'High Accuracy',
      'Lower Costs',
      'Proactive Control & Insights',
      'Scalable Growth',
    ],
    futureFooter: 'The Future of Freight Is Autonomous',
    joinEcosystem: 'Join the Ecosystem',
    featuresTitle: 'How We Help You Ship Smarter',
    features: [
      [
        'Instant Comparisons',
        'Compare freight providers, delivery times, reliability ratings, and pricing as the marketplace goes live.',
      ],
      [
        'Streamlined Booking',
        'Book shipments digitally in a few seamless clicks once the platform opens.',
      ],
      [
        'Real-Time Tracking',
        'Monitor freight from dispatch to delivery with planned live tracking updates.',
      ],
      [
        'Escrow Protection',
        'Secure payments through planned automated upfront escrow infrastructure.',
      ],
    ],
    journeyTitle: 'The Autonomous 4PL Shipping Journey',
    journeySub: 'The Simple Four-Step Process',
    steps: [
      [
        'Enter Details',
        'Instant Consignment Posting',
        'Enter freight dimensions, routes, and site-access requirements.',
      ],
      [
        'Compare & Book',
        'Transparent Bidding & Escrow Secure',
        'Carriers submit bids, and customer funds are secured before dispatch.',
      ],
      [
        'Move & Track',
        'Real-Time Execution & Tracking',
        'Live GPS tracking with automated route management.',
      ],
      [
        'Deliver',
        'Digital Verification & Instant Release',
        'After proof of delivery, escrow funds are automatically released to the carrier.',
      ],
    ],
    ecosystemEyebrow: 'Dual-Sided Marketplace',
    ecosystemTitle: 'Built for the Entire Ecosystem',
    senderTitle: 'Optimized for Senders',
    senderSub: 'Skip the Middleman Margin. Ship Direct.',
    sender: [
      'Instant Price Comparisons',
      'Live GPS Tracking',
      'Vetted Carrier Compliance',
      'Zero Futile Trip Disputes',
      'Transparent pricing and terms',
      'Reliable provider evaluations',
      'Better supply chain control',
    ],
    carrierTitle: 'Optimized for Carriers',
    carrierSub: 'Unlock Your Idle Capacity. Eliminate Bad Debt.',
    carrier: [
      '100% Upfront Escrow Protection',
      'Instant Automated Payouts',
      'Direct Australian Market Access',
      'Maximize Asset Utilization',
      'More steady freight opportunities',
      'Expanded regional network',
      'Guaranteed payments every time',
    ],
    carrierSpotTitle: 'Unlock Your Idle Capacity. Eliminate Bad Debt.',
    carrierSpotQuestion: 'Tired of Waiting 30 to 60 Days to Get Paid for Your Freight?',
    carrierSpotBody:
      "Welcome to the supply side of the CLOX ecosystem—where the wheels don't turn unless the money is locked down. CLOX is being built on planned 100% Upfront Escrow Protection infrastructure powered by Stripe Connect so customer funds can be secured before loading and released after successful delivery.",
    carrierListTitle: 'Built for Vetted Australian Transport Providers:',
    carrierCards: [
      [
        '100% Upfront Payout Security',
        'Never chase an unpaid or delayed invoice again. Funds are verified in escrow before the trip starts.',
      ],
      [
        'Direct Live Job Boards',
        'Bid instantly on regional “Per KM” routes or local “Hourly” blocks (with mandatory 4-hour minimum safety guarantees).',
      ],
      [
        'Direct Marketplace Access',
        'Bid directly on corporate freight proposals matching your precise vehicle type and location.',
      ],
      [
        'Elite Carrier Status',
        'Bidding privileges are reserved for properly vetted operators with valid ABN, Public Liability, and active vehicle compliance.',
      ],
    ],
    zeroDebt: 'ZERO BAD DEBT.',
    zeroDebtNote:
      '*Our State Master Admins are manually reviewing early registrants to grant live-bidding privileges when the gates open. Have your ABN, insurance details, and RWCs ready.*',
    qrTitle: 'Scan to Secure Payout Priority & Register Free.',
    cohortEyebrow: 'Web & App Platform Coming Soon.',
    cohortTitle: 'Join the Pre-Launch Cohort Today',
    benefitsTitle: 'Early registrants receive:',
    benefits: [
      'Priority booking tiers',
      'Waived platform initiation fees for the first 90 days',
      'Fast-tracked corporate onboarding',
      'Early live-bidding access',
    ],
    iAm: 'I am a...',
    senderCta: 'Sender',
    carrierCta: 'Carrier',
    secureSpot: 'Secure Your Spot',
    partnerCta: 'Partner EOI',
    investorCta: 'Investor Portal',
    footerLine: '© 2026 CLOX Freight Forwarding. All rights reserved. | Australia Based',
    footerTag: 'The Freight Broker is Now Code.',
  },
  ru: {
    nav: [
      ['Главная', '#banner'],
      ['О нас', '#aboutus'],
      ['Сравнение', '#comparison'],
      ['Возможности', '#features'],
      ['Путь', '#process'],
      ['Экосистема', '#ecosystem'],
    ],
    tagline: 'Фрахтовый брокер теперь — это код',
    slide1TitleLead: 'Добро пожаловать в будущее',
    slide1TitleAccent: 'австралийской логистики',
    slide1Body:
      'CLOX — децентрализованная автоматизированная 4PL-экосистема Австралии, напрямую соединяющая корпоративных отправителей с проверенными перевозчиками и автопарками.',
    slide2TitleLead: 'Перевозите грузы',
    slide2TitleAccent: 'быстро и безопасно',
    slide2Body:
      'Простая, прозрачная и эффективная логистика без сложных форм и бесконечных звонков — только то, что нужно для быстрой и безопасной перевозки.',
    slide3TitleLead: 'Грузоперевозки',
    slide3TitleAccent: 'без лишних сложностей',
    slide3Body:
      'Связанная экосистема сокращает ручные операции, повышает прозрачность и помогает австралийским отправителям и перевозчикам работать увереннее.',
    slide4TitleLead: 'Единая цифровая',
    slide4TitleAccent: 'экосистема перевозок',
    slide4Body:
      'CLOX объединит корпоративных отправителей, проверенных перевозчиков, прозрачные торги, отслеживание и защищённые платежи в одном цифровом процессе.',
    explore: 'Открыть платформу',
    preLaunch: 'Присоединиться',
    overviewTitle: 'О компании',
    overviewBody:
      'CLOX — умный способ перевозить грузы в Австралии. Мы меняем логистику через простоту, прозрачность и полную видимость, соединяя отправителей с проверенными перевозчиками и планируя защиту платежей через эскроу.',
    nextTitle: 'Новое поколение логистики',
    nextBody:
      'CLOX — следующее поколение автономной 4PL-логистики. Платформа соединяет отправителей, ищущих конкурентные цены, и перевозчиков, стремящихся эффективнее использовать транспорт.',
    discover: 'Открыть экосистему',
    legacyTitle: 'Традиционные посредники',
    legacySub: 'Медленно. Вручную. С ошибками.',
    legacy: [
      'Ручной ввод',
      'Ошибки тарифов',
      'Медленный ответ',
      'Мало прозрачности',
      'Высокие расходы',
      'Много ручного труда',
    ],
    legacyStats: [
      'Часы на котировку',
      'Высокий процент ошибок',
      'Высокие расходы',
      'Реактивные решения',
      'Трудоёмкий процесс',
    ],
    futureTitle: 'Автономная 4PL-экосистема',
    futureSub: 'Быстро. Автоматизированно. Умнее.',
    future: [
      'Видимость в реальном времени',
      'Автоматические торги',
      'Умный подбор ставок',
      'Сквозное отслеживание',
      'Ниже расходы',
      'Аналитика данных',
    ],
    futureStats: [
      'Минуты на котировку',
      'Высокая точность',
      'Ниже расходы',
      'Проактивный контроль',
      'Масштабируемый рост',
    ],
    futureFooter: 'Будущее фрахта — автономное',
    joinEcosystem: 'Присоединиться',
    featuresTitle: 'Как CLOX помогает перевозить умнее',
    features: [
      ['Мгновенное сравнение', 'Сравнивайте перевозчиков, сроки, рейтинг и цены по мере запуска маркетплейса.'],
      ['Простое бронирование', 'Бронируйте перевозку онлайн за несколько шагов после открытия платформы.'],
      ['Отслеживание', 'Контролируйте груз от отправки до доставки с плановым live tracking.'],
      ['Защита эскроу', 'Безопасные платежи через планируемую эскроу-инфраструктуру.'],
    ],
    journeyTitle: 'Путь автономной 4PL-перевозки',
    journeySub: 'Четыре простых шага',
    steps: [
      ['Введите данные', 'Создание заявки', 'Укажите размеры, маршрут и требования доступа.'],
      ['Сравните и выберите', 'Торги и эскроу', 'Перевозчики делают ставки, средства резервируются.'],
      ['Перевозите', 'Исполнение в реальном времени', 'GPS поддерживает управление маршрутом.'],
      ['Доставьте', 'Цифровая проверка', 'После подтверждения доставки запускается выплата.'],
    ],
    ecosystemEyebrow: 'Двусторонний маркетплейс',
    ecosystemTitle: 'Для всей экосистемы',
    senderTitle: 'Для отправителей',
    senderSub: 'Без посреднической наценки. Напрямую.',
    sender: [
      'Сравнение цен',
      'GPS-отслеживание',
      'Проверенные перевозчики',
      'Меньше пустых рейсов',
      'Прозрачные условия',
      'Оценка поставщиков',
      'Контроль цепочки поставок',
    ],
    carrierTitle: 'Для перевозчиков',
    carrierSub: 'Загрузите свободные мощности. Защитите оплату.',
    carrier: [
      'Предоплатное эскроу',
      'Автоматические выплаты',
      'Доступ к рынку Австралии',
      'Загрузка автопарка',
      'Больше заказов',
      'Региональная сеть',
      'Гарантированные выплаты',
    ],
    carrierSpotTitle: 'Загрузите свободные мощности. Забудьте о плохих долгах.',
    carrierSpotQuestion: 'Устали ждать оплату 30–60 дней?',
    carrierSpotBody:
      'На стороне перевозчиков экосистемы CLOX рейс начинается только после резервирования средств. Мы строим эскроу-инфраструктуру на Stripe Connect, чтобы средства проверялись до загрузки и выплачивались после доставки.',
    carrierListTitle: 'Для проверенных австралийских перевозчиков:',
    carrierCards: [
      ['Защита выплаты', 'Средства проверены в эскроу до начала рейса.'],
      ['Биржа заказов', 'Ставки на региональные Per KM и почасовые блоки.'],
      ['Прямой рынок', 'Заявки по типу транспорта и локации.'],
      ['Статус перевозчика', 'Доступ только после проверки ABN, страховки и RWC.'],
    ],
    zeroDebt: 'БЕЗ ПЛОХИХ ДОЛГОВ.',
    zeroDebtNote:
      '*State Master Admins вручную проверяют ранние регистрации, чтобы открыть доступ к торгам при запуске. Подготовьте ABN, страховку и RWC.*',
    qrTitle: 'Сканируйте, чтобы зарегистрироваться бесплатно.',
    cohortEyebrow: 'Веб-платформа и приложение скоро.',
    cohortTitle: 'Присоединяйтесь к pre-launch сегодня',
    benefitsTitle: 'Ранние участники получают:',
    benefits: [
      'Приоритетные уровни бронирования',
      'Без стартовой комиссии 90 дней',
      'Ускоренный корпоративный онбординг',
      'Ранний доступ к торгам',
    ],
    iAm: 'Я...',
    senderCta: 'Отправитель',
    carrierCta: 'Перевозчик',
    secureSpot: 'Забронировать место',
    partnerCta: 'Партнёрский EOI',
    investorCta: 'Инвесторам',
    footerLine: '© 2026 CLOX Freight Forwarding. Все права защищены. | Австралия',
    footerTag: 'Фрахтовый брокер теперь — это код.',
  },
} as const;

const heroSlides = [
  { image: '/landing/1582.jpg', titleLeadKey: 'slide1TitleLead', titleAccentKey: 'slide1TitleAccent', bodyKey: 'slide1Body' },
  { image: '/landing/12180.jpg', titleLeadKey: 'slide2TitleLead', titleAccentKey: 'slide2TitleAccent', bodyKey: 'slide2Body' },
  { image: '/landing/656.jpg', titleLeadKey: 'slide3TitleLead', titleAccentKey: 'slide3TitleAccent', bodyKey: 'slide3Body' },
  { image: '/landing/133.jpg', titleLeadKey: 'slide4TitleLead', titleAccentKey: 'slide4TitleAccent', bodyKey: 'slide4Body' },
] as const;

const featureImages = [
  '/landing/2250.jpg',
  '/landing/41687.jpg',
  '/landing/60896.jpg',
  '/landing/609377.jpg',
] as const;

function BulletList({
  items,
  tone = 'dark',
}: {
  items: readonly string[];
  tone?: 'dark' | 'danger' | 'success' | 'light';
}) {
  const mark =
    tone === 'danger' ? '✕' : tone === 'success' || tone === 'light' ? '✓' : '✓';
  const markClass =
    tone === 'danger'
      ? 'text-red-500'
      : tone === 'success'
        ? 'text-emerald-400'
        : tone === 'light'
          ? 'text-clox-orange'
          : 'text-clox-orange';

  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-[1.05rem] font-medium ${
            tone === 'dark'
              ? 'border-transparent bg-transparent text-slate-600'
              : 'border-white/10 bg-white/5 text-white'
          }`}
        >
          <span className={`mt-0.5 font-black ${markClass}`}>{mark}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function HomePage() {
  const locale = useLocaleParam();
  const c = copy[locale];
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <main className="overflow-x-hidden bg-clox-surface text-clox-ink">
      <header className="fixed inset-x-0 top-0 z-[1000] bg-[rgba(10,31,60,0.95)] shadow-[0_4px_30px_rgba(0,0,0,0.15)] backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#banner" className="inline-flex rounded-lg bg-white px-3.5 py-1.5" aria-label="CLOX home">
            <img src="/landing/logo.jpeg" alt="CLOX" className="h-[45px] w-auto object-contain" />
          </a>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Main navigation">
            {c.nav.map(([label, href]) => (
              <a key={label} href={href} className="clox-nav-link">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher />
            <Link href={`/${locale}/registry`} className="clox-btn-primary hidden sm:inline-flex">
              {c.preLaunch}
            </Link>
            <button
              type="button"
              className="inline-flex rounded-lg border border-white/20 px-3 py-2 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 bg-clox-navy px-5 py-4 lg:hidden">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-3">
              {c.nav.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-lg px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              <Link
                href={`/${locale}/registry`}
                className="clox-btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                {c.preLaunch}
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <section
        id="banner"
        className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-clox-navy pt-[140px] text-center text-white sm:min-h-screen sm:pt-[180px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
      >
        <div className="absolute inset-0 z-0" aria-hidden>
          {heroSlides.map((item, index) => (
            <div
              key={item.image}
              className={`absolute -inset-2 scale-[1.02] bg-cover bg-center blur-[2px] transition-opacity duration-[1500ms] ease-in-out ${
                index === slide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${item.image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[rgba(5,20,40,0.55)] to-[rgba(0,7,17,0.5)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[900px] animate-hero-fade-up px-5 pb-20 pt-8 sm:px-8">
          <span className="mb-8 inline-block rounded-full border border-clox-orange/60 bg-clox-navy/75 px-6 py-2 text-[0.9rem] font-bold uppercase tracking-[2px] text-clox-orange shadow-lg backdrop-blur-sm">
            {c.tagline}
          </span>

          <div className="relative mx-auto mb-8 flex min-h-[250px] w-full items-center justify-center">
            {heroSlides.map((item, index) => {
              const active = index === slide;
              return (
                <div
                  key={item.image}
                  className={`w-full transition-all duration-1000 ease-in-out ${
                    active
                      ? 'relative translate-y-0 opacity-100'
                      : 'pointer-events-none absolute inset-x-0 top-0 translate-y-5 opacity-0'
                  }`}
                  aria-hidden={!active}
                >
                  <h1 className="mb-6 text-[2rem] font-extrabold leading-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] sm:text-[2.2rem] lg:text-[3.2rem]">
                    {c[item.titleLeadKey]}
                    <br />
                    <span className="text-clox-orange">{c[item.titleAccentKey]}</span>
                  </h1>
                  <p className="mx-auto mb-0 max-w-[800px] text-[1.15rem] font-light leading-8 text-[#e2e8f0] sm:text-[1.25rem]">
                    {c[item.bodyKey]}
                  </p>
                </div>
              );
            })}
          </div>

          <a href="#comparison" className="clox-btn-primary px-12 py-4 text-[1.15rem]">
            {c.explore}
          </a>

          <div className="mt-8 flex justify-center gap-2" aria-label="Hero slides">
            {heroSlides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === slide}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === slide ? 'bg-clox-orange' : 'bg-white/40 hover:bg-white/70'
                }`}
                onClick={() => setSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="aboutus" className="scroll-mt-28 px-5 py-28 sm:px-8">
        <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-left text-[2.2rem] font-extrabold uppercase tracking-tight text-clox-navy sm:text-[2.8rem]">
              {c.overviewTitle}
            </h2>
            <p className="text-[1.1rem] leading-8 text-slate-600">{c.overviewBody}</p>
          </div>
          <div>
            <img
              src="/landing/overview.jpg"
              alt="Modern logistics"
              className="h-full w-full rounded-2xl object-cover shadow-clox-card"
            />
          </div>
        </div>
      </section>

      <section
        id="next-gen"
        className="relative scroll-mt-28 overflow-hidden px-5 py-32 text-center text-white sm:px-8"
        style={{ backgroundImage: "url('/landing/73979.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(10,31,60,0.85),rgba(10,31,60,0.95))]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 text-[2.2rem] font-extrabold uppercase sm:text-[2.8rem]">{c.nextTitle}</h2>
          <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-slate-200">{c.nextBody}</p>
          <a href="#ecosystem" className="clox-btn-primary">
            {c.discover}
          </a>
        </div>
      </section>

      <section id="comparison" className="relative scroll-mt-28 flex flex-wrap bg-black p-0 text-white">
        <article className="relative flex min-w-full flex-1 flex-col justify-center px-6 py-20 sm:min-w-[50%] sm:px-12 sm:py-32">
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(15,15,15,0.85),rgba(15,15,15,0.95)),url('https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-[500px] sm:ml-auto sm:mr-12">
            <h2 className="mb-2 text-[2.2rem] font-extrabold uppercase leading-none sm:text-[2.8rem]">
              {c.legacyTitle}
            </h2>
            <p className="mb-8 text-[1.3rem] font-bold uppercase tracking-wide text-slate-400">
              {c.legacySub}
            </p>
            <BulletList items={c.legacy} tone="danger" />
            <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-8">
              {c.legacyStats.map((stat) => (
                <span key={stat} className="text-sm font-semibold text-red-300">
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </article>

        <div className="absolute left-1/2 top-1/2 z-20 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-clox-navy bg-clox-orange text-3xl font-black italic shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:mx-auto max-lg:my-[-40px] max-lg:translate-x-0 max-lg:translate-y-0">
          Vs
        </div>

        <article className="relative flex min-w-full flex-1 flex-col justify-center px-6 py-20 sm:min-w-[50%] sm:px-12 sm:py-32">
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(10,31,60,0.75),rgba(10,31,60,0.95)),url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-[500px] sm:ml-12 sm:mr-auto">
            <h2 className="mb-2 text-[2.2rem] font-extrabold uppercase leading-none sm:text-[2.8rem]">
              {c.futureTitle}
            </h2>
            <p className="mb-8 text-[1.3rem] font-bold uppercase tracking-wide text-clox-orange">
              {c.futureSub}
            </p>
            <BulletList items={c.future} tone="success" />
            <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-8">
              {c.futureStats.map((stat) => (
                <span key={stat} className="text-sm font-semibold text-sky-300">
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </article>

        <div className="relative z-10 w-full bg-clox-navy px-6 py-10 text-center">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6">
            <p className="text-[1.6rem] font-black uppercase tracking-wide sm:text-[2.2rem]">
              {c.futureFooter.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="text-clox-orange">{c.futureFooter.split(' ').slice(-2).join(' ')}</span>
            </p>
            <a href="#ecosystem" className="clox-btn-primary px-12 py-4 text-[1.2rem] shadow-clox-orange">
              {c.joinEcosystem}
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 bg-slate-950 px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-4 text-center text-[2.2rem] font-extrabold uppercase text-white sm:text-[2.8rem]">
            {c.featuresTitle}
          </h2>
          <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:grid-rows-2">
            {c.features.map(([title, body], index) => (
              <article
                key={title}
                className={`group relative min-h-[320px] overflow-hidden rounded-3xl border border-white/5 bg-slate-800 transition duration-500 hover:-translate-y-2 hover:border-[rgba(255,114,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
                  index === 0 ? 'lg:col-span-2' : ''
                } ${index === 1 ? 'lg:row-span-2' : ''}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                  style={{ backgroundImage: `url('${featureImages[index]}')` }}
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-8 pt-24">
                  <h3 className="mb-2 text-[1.8rem] font-extrabold text-clox-orange">{title}</h3>
                  <p className="text-[1.1rem] leading-7 text-slate-200">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-28 px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-[2.2rem] font-extrabold uppercase text-clox-navy sm:text-[2.8rem]">
            {c.journeyTitle}
          </h2>
          <p className="mb-16 text-center text-[1.2rem] text-slate-500">{c.journeySub}</p>
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {c.steps.map(([title, sub, body], index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(10,31,60,0.08)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-clox-orange transition duration-500 group-hover:scale-x-100" />
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-clox-navy text-[1.8rem] font-extrabold text-white shadow-[0_10px_20px_rgba(10,31,60,0.2)]">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-[1.4rem] font-extrabold tracking-wide text-clox-navy">
                  {title}
                </h3>
                <p className="mb-4 text-[0.95rem] font-semibold uppercase text-clox-orange">{sub}</p>
                <p className="text-slate-500">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="scroll-mt-28 bg-clox-surface px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-clox-orange">
            {c.ecosystemEyebrow}
          </p>
          <h2 className="mb-16 text-center text-[2.2rem] font-extrabold uppercase text-clox-navy sm:text-[2.8rem]">
            {c.ecosystemTitle}
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                image: '/landing/hero.jpg',
                label: 'Corporate Sender',
                title: c.senderTitle,
                sub: c.senderSub,
                items: c.sender,
                href: `/${locale}/registry`,
                cta: c.senderCta,
              },
              {
                image: '/landing/carrier.jpg',
                label: 'Transport Carrier',
                title: c.carrierTitle,
                sub: c.carrierSub,
                items: c.carrier,
                href: `/${locale}/registry`,
                cta: c.carrierCta,
              },
            ].map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.1)] transition duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
              >
                <div className="relative h-[280px]">
                  <img src={card.image} alt={card.label} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-clox-navy to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <p className="text-sm font-bold uppercase tracking-wide text-clox-orange">
                      {card.label}
                    </p>
                    <h3 className="mt-2 text-3xl font-extrabold">{card.title}</h3>
                    <p className="mt-2 font-semibold text-slate-200">{card.sub}</p>
                  </div>
                </div>
                <div className="p-8">
                  <BulletList items={card.items} />
                  <Link href={card.href} className="clox-btn-primary mt-8">
                    {c.preLaunch}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="carrier-promo" className="scroll-mt-28 overflow-hidden bg-[#1a1a1a] text-white">
        <div
          className="relative flex h-[400px] items-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
          <div className="relative z-10 ml-[6%] max-w-[450px] rounded-xl bg-white p-6 text-clox-ink shadow-[0_15px_40px_rgba(0,0,0,0.3)] sm:ml-[10%] sm:p-8">
            <h4 className="mb-1 text-[1.3rem] font-extrabold text-clox-navy">{c.zeroDebt}</h4>
            <p className="text-[1rem] italic text-slate-500">{c.zeroDebtNote}</p>
          </div>
        </div>

        <div className="mx-auto max-w-[1000px] px-5 py-20 sm:px-8">
          <h2 className="mb-6 text-[2.4rem] font-extrabold uppercase leading-none text-clox-orange sm:text-[3.5rem]">
            {c.carrierSpotTitle}
          </h2>
          <p className="mb-8 text-[1.4rem] font-semibold sm:text-[1.8rem]">{c.carrierSpotQuestion}</p>
          <p className="mb-6 max-w-4xl text-[1.15rem] leading-8 text-slate-300">{c.carrierSpotBody}</p>
          <h3 className="mb-6 mt-12 text-[1.8rem] font-extrabold text-white">{c.carrierListTitle}</h3>
          <ul className="space-y-4">
            {c.carrierCards.map(([title, body], index) => (
              <li
                key={title}
                className="flex gap-5 rounded-xl border border-white/5 bg-white/[0.03] p-6"
              >
                <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,114,0,0.1)] text-2xl">
                  {['🔒', '📱', '🚀', '✔'][index]}
                </span>
                <div>
                  <h4 className="mb-2 text-[1.3rem] font-extrabold text-clox-orange">{title}</h4>
                  <p className="text-slate-300">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-12 bg-clox-orange px-5 py-12 text-clox-ink sm:px-8">
          <div className="max-w-[600px]">
            <h2 className="mb-4 text-[2.2rem] font-black sm:text-[3rem]">{c.zeroDebt}</h2>
            <p className="text-[1.1rem] font-medium">{c.qrTitle}</p>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-white p-6">
            <img src="/landing/qr.png" alt="CLOX registration QR code" className="h-[100px] w-[100px]" />
            <div className="max-w-[200px] text-left">
              <h4 className="mb-2 text-[1.2rem] font-extrabold">{c.qrTitle}</h4>
              <Link href={`/${locale}/registry`} className="text-sm font-bold text-clox-navy">
                {c.secureSpot}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="cohort" className="scroll-mt-28 px-5 py-28 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-20 rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:flex-row lg:p-16">
          <div className="flex-1">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-clox-orange">
              {c.cohortEyebrow}
            </p>
            <h2 className="mb-6 text-[2.2rem] font-extrabold uppercase text-clox-navy sm:text-[2.8rem]">
              {c.cohortTitle}
            </h2>
            <h3 className="mb-4 text-xl font-bold text-clox-navy">{c.benefitsTitle}</h3>
            <BulletList items={c.benefits} />
          </div>
          <div className="flex-1 rounded-2xl border border-slate-200 bg-clox-surface p-8 sm:p-10">
            <img src="/landing/logo.jpeg" alt="CLOX" className="mx-auto h-20 w-auto rounded bg-white p-2" />
            <p className="mt-6 text-center text-lg font-semibold text-clox-navy">{c.tagline}</p>
            <div className="mx-auto mt-8 max-w-md border-t border-slate-200 pt-8">
              <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
              {c.iAm}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/registry`} className="clox-btn-primary">
                {c.senderCta}
              </Link>
              <Link
                href={`/${locale}/registry`}
                className="inline-flex items-center justify-center rounded-full border-2 border-clox-navy px-8 py-3.5 text-[1.05rem] font-semibold text-clox-navy transition hover:bg-clox-navy hover:text-white"
              >
                {c.carrierCta}
              </Link>
              <Link
                href={`/${locale}/partner/eoi`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-clox-navy"
              >
                {c.partnerCta}
              </Link>
              <Link
                href={`/${locale}/investors`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-clox-navy"
              >
                {c.investorCta}
              </Link>
              </div>
              <div className="mt-7 text-center">
                <Link href={`/${locale}/registry`} className="clox-btn-primary">
                  {c.secureSpot}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-[5px] border-clox-orange bg-clox-navy px-5 py-12 text-center text-slate-400 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <a href="#banner" className="mx-auto mb-6 inline-flex rounded-lg bg-white px-4 py-2">
            <img src="/landing/logo.jpeg" alt="CLOX" className="h-[45px] w-auto object-contain" />
          </a>
          <p>{c.footerLine}</p>
          <p className="mt-2.5 text-[0.9rem]">{c.footerTag}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm">
            <Link href={`/${locale}/privacy`} className="hover:text-white">
              Privacy
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">
              Terms
            </Link>
            <Link href={`/${locale}/partner/eoi`} className="hover:text-white">
              {c.partnerCta}
            </Link>
            <Link href={`/${locale}/investors`} className="hover:text-white">
              {c.investorCta}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
