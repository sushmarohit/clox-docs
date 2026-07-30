import type { AppLocale } from '@/locales';

export type KnowledgeChunk = {
  id: string;
  locale: AppLocale | 'both';
  title: string;
  path: string;
  text: string;
  tags: string[];
};

export const knowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'about-en',
    locale: 'en',
    title: 'About CLOX',
    path: '/en',
    tags: ['about', 'product', 'freight', 'australia'],
    text: 'CLOX is an Australia-first full-load freight marketplace in pre-launch. The public site collects registry, partner expression of interest, and investor pre-qualification leads. It does not yet offer live freight booking, matching, payments, or chat-based lead submission.',
  },
  {
    id: 'about-ru',
    locale: 'ru',
    title: 'О CLOX',
    path: '/ru',
    tags: ['about', 'product', 'freight', 'australia'],
    text: 'CLOX — австралийский маркетплейс полногрузных перевозок на стадии pre-launch. Публичный сайт собирает заявки registry, партнёрский EOI и инвесторов. Живого бронирования, матчинга, платежей и отправки лидов через чат пока нет.',
  },
  {
    id: 'registry-en',
    locale: 'en',
    title: 'Pre-launch registry',
    path: '/en/registry',
    tags: ['registry', 'sender', 'carrier', 'shipper', 'transport'],
    text: 'Use the Pre-launch registry if you are a sender/corporate shipper or a carrier/transport company. The wizard captures company or fleet details, ABN, contact email/phone, operational preferences, and infrastructure acknowledgements (easyAML, Stripe Connect Escrow, Monoova NPP PayTo). Submitting does not grant platform access yet.',
  },
  {
    id: 'registry-ru',
    locale: 'ru',
    title: 'Pre-launch registry',
    path: '/ru/registry',
    tags: ['registry', 'sender', 'carrier'],
    text: 'Используйте Pre-launch registry, если вы отправитель/корпоративный грузоотправитель или перевозчик. Мастер собирает данные компании/парка, ABN, контакты и подтверждения инфраструктуры. Подача формы не даёт доступ к платформе.',
  },
  {
    id: 'eoi-en',
    locale: 'en',
    title: 'Partner expression of interest',
    path: '/en/partner/eoi',
    tags: ['partner', 'eoi', 'state master', 'bde', 'admin'],
    text: 'Partner EOI is for State Master Admin (regional tier, 10% gross platform fee split) or Local BDE Admin / BDM (local tier, 5% gross fee split). Applicants provide territory targets, company identity, network experience, and a declaration. Selection requires KYB and executive review; the EOI itself is not admission.',
  },
  {
    id: 'eoi-ru',
    locale: 'ru',
    title: 'Партнёрский EOI',
    path: '/ru/partner/eoi',
    tags: ['partner', 'eoi', 'state master', 'bde'],
    text: 'Партнёрский EOI предназначен для State Master Admin (региональный уровень, 10%) или Local BDE Admin (локальный уровень, 5%). Нужны территория, данные компании, опыт сети и декларация. EOI не гарантирует приём — требуется KYB и executive review.',
  },
  {
    id: 'investors-en',
    locale: 'en',
    title: 'Investor portal',
    path: '/en/investors',
    tags: ['investor', 'equity', 'capital', 'accreditation'],
    text: 'The Investor portal is an early-access equity round registration and pre-qualification form. Classifications include sophisticated investor, professional investor, and strategic industry partner. Capital bands start at AUD 25,000. Information is protected under NDA-style acknowledgements and used only for accreditation review. Questions: invest@clox.com.au.',
  },
  {
    id: 'investors-ru',
    locale: 'ru',
    title: 'Инвесторский портал',
    path: '/ru/investors',
    tags: ['investor', 'equity', 'capital'],
    text: 'Инвесторский портал — форма pre-qualification для early-access equity round. Классы: sophisticated, professional и strategic industry partner. Диапазоны капитала начинаются с AUD 25,000. Вопросы: invest@clox.com.au.',
  },
  {
    id: 'privacy-en',
    locale: 'en',
    title: 'Privacy',
    path: '/en/privacy',
    tags: ['privacy', 'legal', 'data'],
    text: 'CLOX Logistics (Displace Global Enterprises Pty Ltd) collects pre-launch interest data via clox.com.au: name/company, email, phone, ABN/ACN, location, role preferences, and notes. Data is used only to evaluate interest and contact applicants. Privacy requests: support@clox.com.au. Personal information is not sold.',
  },
  {
    id: 'privacy-ru',
    locale: 'ru',
    title: 'Конфиденциальность',
    path: '/ru/privacy',
    tags: ['privacy', 'legal', 'data'],
    text: 'CLOX Logistics собирает pre-launch данные через clox.com.au и использует их только для оценки интереса и связи с заявителями. Запросы: support@clox.com.au. Персональные данные не продаются.',
  },
  {
    id: 'terms-en',
    locale: 'en',
    title: 'Terms',
    path: '/en/terms',
    tags: ['terms', 'legal'],
    text: 'Submitting a registry, EOI, or investor form does not create a binding partnership, investment, or platform access right. Applicants must provide accurate information. Proprietary CLOX operational disclosures remain confidential under applicable NDA / form acknowledgements.',
  },
  {
    id: 'terms-ru',
    locale: 'ru',
    title: 'Условия',
    path: '/ru/terms',
    tags: ['terms', 'legal'],
    text: 'Отправка registry, EOI или investor формы не создаёт обязывающего партнёрства, инвестиции или права доступа. Информация должна быть точной. Конфиденциальные сведения CLOX остаются под NDA / подтверждениями форм.',
  },
  {
    id: 'boundaries-both',
    locale: 'both',
    title: 'Assistant boundaries',
    path: '/en',
    tags: ['assistant', 'limits', 'safety'],
    text: 'The CLOX site guide answers only from approved site content. It must not invent live pricing, ETAs, matching results, legal advice, or investment advice. It must not collect or submit personal lead details. When unsure, direct the user to the correct form page.',
  },
];
