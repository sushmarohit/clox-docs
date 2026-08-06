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
    id: 'about-hi',
    locale: 'hi',
    title: 'CLOX के बारे में',
    path: '/hi',
    tags: ['about', 'product', 'freight', 'australia'],
    text: 'CLOX ऑस्ट्रेलिया-फर्स्ट फुल-लोड फ्रेट मार्केटप्लेस है जो प्री-लॉन्च चरण में है। सार्वजनिक साइट रजिस्ट्री, पार्टनर EOI और इन्वेस्टर प्री-क्वालीफ़िकेशन लीड एकत्र करती है। अभी लाइव बुकिंग, मैचिंग, भुगतान या चैट के माध्यम से लीड जमा उपलब्ध नहीं है।',
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
    id: 'registry-hi',
    locale: 'hi',
    title: 'प्री-लॉन्च रजिस्ट्री',
    path: '/hi/registry',
    tags: ['registry', 'sender', 'carrier'],
    text: 'यदि आप सेंडर/कॉर्पोरेट शिपर या कैरियर/ट्रांसपोर्ट कंपनी हैं तो प्री-लॉन्च रजिस्ट्री का उपयोग करें। यह कंपनी/फ़्लीट विवरण, ABN, संपर्क और इन्फ़्रास्ट्रक्चर स्वीकृतियाँ एकत्र करता है। फ़ॉर्म जमा करने से प्लेटफ़ॉर्म एक्सेस नहीं मिलता।',
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
    id: 'eoi-hi',
    locale: 'hi',
    title: 'पार्टनर EOI',
    path: '/hi/partner/eoi',
    tags: ['partner', 'eoi', 'state master', 'bde'],
    text: 'पार्टनर EOI स्टेट मास्टर एडमिन (क्षेत्रीय स्तर, 10%) या लोकल BDE एडमिन (स्थानीय स्तर, 5%) के लिए है। क्षेत्र, कंपनी डेटा, नेटवर्क अनुभव और घोषणा आवश्यक हैं। EOI प्रवेश की गारंटी नहीं है — KYB और कार्यकारी समीक्षा आवश्यक है।',
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
    id: 'investors-hi',
    locale: 'hi',
    title: 'इन्वेस्टर पोर्टल',
    path: '/hi/investors',
    tags: ['investor', 'equity', 'capital'],
    text: 'इन्वेस्टर पोर्टल अर्ली-एक्सेस इक्विटी राउंड के लिए प्री-क्वालीफ़िकेशन फ़ॉर्म है। वर्ग: परिष्कृत, पेशेवर और रणनीतिक उद्योग पार्टनर। पूंजी बैंड AUD 25,000 से शुरू होते हैं। प्रश्न: invest@clox.com.au।',
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
    id: 'privacy-hi',
    locale: 'hi',
    title: 'गोपनीयता',
    path: '/hi/privacy',
    tags: ['privacy', 'legal', 'data'],
    text: 'CLOX Logistics clox.com.au के माध्यम से प्री-लॉन्च डेटा एकत्र करता है और केवल रुचि मूल्यांकन तथा आवेदकों से संपर्क के लिए उपयोग करता है। अनुरोध: support@clox.com.au। व्यक्तिगत डेटा नहीं बेचा जाता।',
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
    id: 'terms-hi',
    locale: 'hi',
    title: 'शर्तें',
    path: '/hi/terms',
    tags: ['terms', 'legal'],
    text: 'रजिस्ट्री, EOI या इन्वेस्टर फ़ॉर्म जमा करने से बाध्यकारी पार्टनरशिप, निवेश या एक्सेस अधिकार नहीं बनता। जानकारी सटीक होनी चाहिए। CLOX की गोपनीय जानकारी NDA / फ़ॉर्म स्वीकृतियों के अधीन रहती है।',
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
