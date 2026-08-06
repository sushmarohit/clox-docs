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
  hi: {
    nav: [
      ['होम', '#banner'],
      ['हमारे बारे में', '#aboutus'],
      ['तुलना', '#comparison'],
      ['विशेषताएँ', '#features'],
      ['यात्रा', '#process'],
      ['इकोसिस्टम', '#ecosystem'],
    ],
    tagline: 'फ्रेट ब्रोकर अब कोड है',
    slide1TitleLead: 'भविष्य में आपका स्वागत है',
    slide1TitleAccent: 'ऑस्ट्रेलियन लॉजिस्टिक्स',
    slide1Body:
      'CLOX ऑस्ट्रेलिया का विकेंद्रीकृत, स्वचालित 4PL डिजिटल इकोसिस्टम है जो कॉर्पोरेट सेंडरों को सीधे जाँचे हुए हेवी व्हीकल ऑपरेटरों और ट्रांसपोर्ट फ़्लीट से जोड़ता है — पारंपरिक ब्रोकर और छिपे मार्जिन के बिना।',
    slide2TitleLead: 'अपना माल भेजें',
    slide2TitleAccent: 'तेज़ और सुरक्षित',
    slide2Body:
      'स्मार्ट फ्रेट फ़ॉरवर्डिंग — सरल, पारदर्शी और कुशल। जटिल फ़ॉर्म या अनगिनत कॉल की ज़रूरत नहीं — सिर्फ़ वह ज़रूरी चीज़ें जो माल को तेज़, सस्ता और सुरक्षित भेजने के लिए चाहिए।',
    slide3TitleLead: 'बिना रुकावट का',
    slide3TitleAccent: 'फ्रेट अनुभव',
    slide3Body:
      'एक जुड़ा हुआ फ्रेट अनुभव जो मैन्युअल हैंडऑफ़ घटाता है, दृश्यता बढ़ाता है, और ऑस्ट्रेलियन सेंडर व ट्रांसपोर्ट ऑपरेटरों को आत्मविश्वास से आगे बढ़ाता है।',
    slide4TitleLead: 'एक जुड़ा हुआ',
    slide4TitleAccent: 'फ्रेट इकोसिस्टम',
    slide4Body:
      'CLOX कॉर्पोरेट सेंडर, जाँचे हुए कैरियर, पारदर्शी बिडिंग, ट्रैकिंग और सुरक्षित भुगतान को एक सुव्यवस्थित डिजिटल यात्रा में लाने के लिए बनाया जा रहा है।',
    explore: 'प्लेटफ़ॉर्म देखें',
    preLaunch: 'प्री-लॉन्च में शामिल हों',
    overviewTitle: 'कंपनी अवलोकन',
    overviewBody:
      'CLOX में आपका स्वागत है — ऑस्ट्रेलिया में फ्रेट भेजने का स्मार्ट तरीका। हम सरलता, पारदर्शिता और पूर्ण दृश्यता के साथ लॉजिस्टिक्स बदल रहे हैं। उच्च-लागत मैन्युअल मिडलवेयर की जगह एक कुशल डिजिटल इकोसिस्टम लाकर CLOX कॉर्पोरेट सेंडरों को सीधे जाँचे हुए ऑपरेटरों से जोड़ता है और नियोजित अपफ़्रंट एस्क्रो से लेन-देन सुरक्षित करता है।',
    nextTitle: 'लॉजिस्टिक्स की अगली पीढ़ी',
    nextBody:
      'CLOX स्वायत्त 4PL लॉजिस्टिक्स की अगली पीढ़ी है। विकेंद्रीकृत, स्वचालित डिजिटल इकोसिस्टम के ज़रिए यह प्रतिस्पर्धी मूल्य चाहने वाले शिपरों और एसेट उपयोग बढ़ाना चाहने वाले कैरियरों के बीच पुल बनाता है। हमारी तकनीक पारंपरिक घर्षण लागत हटाती है और नियंत्रण, गति व दृश्यता वापस व्यवसायों को देती है।',
    discover: 'इकोसिस्टम जानें',
    legacyTitle: 'पारंपरिक मिडलवेयर',
    legacySub: 'धीमा। मैन्युअल। त्रुटि-प्रवण।',
    legacy: [
      'मैन्युअल डेटा एंट्री',
      'रेट त्रुटियाँ',
      'धीमा जवाब',
      'सीमित दृश्यता',
      'उच्च परिचालन लागत',
      'श्रम-गहन',
    ],
    legacyStats: [
      'कोट में घंटे',
      'उच्च त्रुटि दर',
      'उच्च परिचालन लागत',
      'प्रतिक्रियाशील समस्या समाधान',
      'श्रम-गहन',
    ],
    futureTitle: 'स्वायत्त 4PL इकोसिस्टम',
    futureSub: 'तेज़। स्वचालित। स्मार्ट।',
    future: [
      'रियल-टाइम दृश्यता',
      'स्वचालित बिडिंग',
      'स्मार्ट रेट मैचिंग',
      'एंड-टू-एंड ट्रैकिंग',
      'कम लागत, अधिक दक्षता',
      'डेटा-आधारित अंतर्दृष्टि',
    ],
    futureStats: [
      'कोट में मिनट',
      'उच्च सटीकता',
      'कम लागत',
      'सक्रिय नियंत्रण और अंतर्दृष्टि',
      'स्केलेबल वृद्धि',
    ],
    futureFooter: 'फ्रेट का भविष्य स्वायत्त है',
    joinEcosystem: 'इकोसिस्टम से जुड़ें',
    featuresTitle: 'हम कैसे स्मार्ट शिपिंग में मदद करते हैं',
    features: [
      [
        'तुरंत तुलना',
        'मार्केटप्लेस लाइव होने पर फ्रेट प्रदाता, डिलीवरी समय, विश्वसनीयता और कीमत की तुलना करें।',
      ],
      [
        'सरल बुकिंग',
        'प्लेटफ़ॉर्म खुलने पर कुछ क्लिक में डिजिटल शिपमेंट बुक करें।',
      ],
      [
        'रियल-टाइम ट्रैकिंग',
        'नियोजित लाइव ट्रैकिंग अपडेट के साथ डिस्पैच से डिलीवरी तक फ्रेट मॉनिटर करें।',
      ],
      [
        'एस्क्रो सुरक्षा',
        'नियोजित स्वचालित अपफ़्रंट एस्क्रो इन्फ़्रास्ट्रक्चर के माध्यम से सुरक्षित भुगतान।',
      ],
    ],
    journeyTitle: 'स्वायत्त 4PL शिपिंग यात्रा',
    journeySub: 'सरल चार-चरण प्रक्रिया',
    steps: [
      [
        'विवरण दर्ज करें',
        'तुरंत कंसाइनमेंट पोस्टिंग',
        'फ्रेट आयाम, रूट और साइट-एक्सेस आवश्यकताएँ दर्ज करें।',
      ],
      [
        'तुलना करें और बुक करें',
        'पारदर्शी बिडिंग और एस्क्रो सुरक्षा',
        'कैरियर बोली लगाते हैं, और डिस्पैच से पहले ग्राहक फंड सुरक्षित होते हैं।',
      ],
      [
        'मूव और ट्रैक',
        'रियल-टाइम निष्पादन और ट्रैकिंग',
        'स्वचालित रूट प्रबंधन के साथ लाइव GPS ट्रैकिंग।',
      ],
      [
        'डिलीवर',
        'डिजिटल सत्यापन और तुरंत रिलीज़',
        'प्रूफ़ ऑफ़ डिलीवरी के बाद एस्क्रो फंड स्वचालित रूप से कैरियर को जारी होते हैं।',
      ],
    ],
    ecosystemEyebrow: 'द्विपक्षीय मार्केटप्लेस',
    ecosystemTitle: 'पूरे इकोसिस्टम के लिए',
    senderTitle: 'सेंडरों के लिए अनुकूलित',
    senderSub: 'मिडलमैन मार्जिन छोड़ें। सीधे भेजें।',
    sender: [
      'तुरंत मूल्य तुलना',
      'लाइव GPS ट्रैकिंग',
      'जाँचे हुए कैरियर अनुपालन',
      'व्यर्थ ट्रिप विवाद शून्य',
      'पारदर्शी मूल्य और शर्तें',
      'विश्वसनीय प्रदाता मूल्यांकन',
      'बेहतर सप्लाई चेन नियंत्रण',
    ],
    carrierTitle: 'कैरियरों के लिए अनुकूलित',
    carrierSub: 'खाली क्षमता खोलें। खराब कर्ज खत्म करें।',
    carrier: [
      '100% अपफ़्रंट एस्क्रो सुरक्षा',
      'तुरंत स्वचालित पेआउट',
      'सीधा ऑस्ट्रेलियन बाज़ार एक्सेस',
      'एसेट उपयोग अधिकतम करें',
      'अधिक स्थिर फ्रेट अवसर',
      'विस्तारित क्षेत्रीय नेटवर्क',
      'हर बार गारंटीकृत भुगतान',
    ],
    carrierSpotTitle: 'खाली क्षमता खोलें। खराब कर्ज खत्म करें।',
    carrierSpotQuestion: 'अपने फ्रेट का भुगतान पाने के लिए 30 से 60 दिन इंतज़ार से थक गए?',
    carrierSpotBody:
      'CLOX इकोसिस्टम के सप्लाई साइड में आपका स्वागत है — जहाँ पैसे लॉक होने तक पहिए नहीं चलते। CLOX Stripe Connect पर आधारित 100% अपफ़्रंट एस्क्रो सुरक्षा इन्फ़्रास्ट्रक्चर पर बनाया जा रहा है ताकि लोडिंग से पहले फंड सुरक्षित हों और सफल डिलीवरी के बाद जारी हों।',
    carrierListTitle: 'जाँचे हुए ऑस्ट्रेलियन ट्रांसपोर्ट प्रदाताओं के लिए:',
    carrierCards: [
      [
        '100% अपफ़्रंट पेआउट सुरक्षा',
        'अवैतनिक या विलंबित इनवॉइस का पीछा न करें। ट्रिप शुरू होने से पहले फंड एस्क्रो में सत्यापित होते हैं।',
      ],
      [
        'सीधे लाइव जॉब बोर्ड',
        'क्षेत्रीय “Per KM” रूट या स्थानीय “Hourly” ब्लॉक पर तुरंत बोली लगाएँ (अनिवार्य 4-घंटे न्यूनतम सुरक्षा गारंटी के साथ)।',
      ],
      [
        'सीधा मार्केटप्लेस एक्सेस',
        'अपने सटीक वाहन प्रकार और स्थान से मेल खाते कॉर्पोरेट फ्रेट प्रस्तावों पर सीधे बोली लगाएँ।',
      ],
      [
        'एलीट कैरियर स्टेटस',
        'बिडिंग विशेषाधिकार वैध ABN, पब्लिक लायबिलिटी और सक्रिय वाहन अनुपालन वाले जाँचे हुए ऑपरेटरों के लिए आरक्षित हैं।',
      ],
    ],
    zeroDebt: 'खराब कर्ज शून्य।',
    zeroDebtNote:
      '*हमारे स्टेट मास्टर एडमिन गेट खुलने पर लाइव-बिडिंग विशेषाधिकार देने के लिए शुरुआती रजिस्ट्रेंट्स की मैन्युअल समीक्षा कर रहे हैं। अपना ABN, बीमा विवरण और RWC तैयार रखें।*',
    qrTitle: 'स्कैन करें — पेआउट प्राथमिकता सुरक्षित करें और मुफ़्त रजिस्टर करें।',
    cohortEyebrow: 'वेब और ऐप प्लेटफ़ॉर्म जल्द आ रहा है।',
    cohortTitle: 'आज ही प्री-लॉन्च कोहॉर्ट से जुड़ें',
    benefitsTitle: 'शुरुआती रजिस्ट्रेंट्स को मिलता है:',
    benefits: [
      'प्राथमिकता बुकिंग स्तर',
      'पहले 90 दिनों के लिए प्लेटफ़ॉर्म आरंभ शुल्क माफ़',
      'तेज़ कॉर्पोरेट ऑनबोर्डिंग',
      'अर्ली लाइव-बिडिंग एक्सेस',
    ],
    iAm: 'मैं हूँ...',
    senderCta: 'सेंडर',
    carrierCta: 'कैरियर',
    secureSpot: 'अपनी जगह सुरक्षित करें',
    partnerCta: 'पार्टनर EOI',
    investorCta: 'इन्वेस्टर पोर्टल',
    footerLine: '© 2026 CLOX Freight Forwarding. सर्वाधिकार सुरक्षित। | ऑस्ट्रेलिया आधारित',
    footerTag: 'फ्रेट ब्रोकर अब कोड है।',
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
      <header className="fixed inset-x-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(10,31,60,0.08)] backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-8 sm:py-3.5 lg:px-0">
          <a href="#banner" className="inline-flex shrink-0" aria-label="CLOX home">
            <img
              src="/brand/clox_updated_logo.png"
              alt="CLOX"
              className="h-[48px] w-auto object-contain sm:h-[56px] lg:h-[52px]"
            />
          </a>

          <nav className="hidden items-center gap-8 xl:gap-10 lg:flex" aria-label="Main navigation">
            {c.nav.map(([label, href]) => (
              <a key={label} href={href} className="clox-nav-link">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher className="text-clox-navy" />
            <Link href={`/${locale}/registry`} className="clox-btn-primary hidden sm:inline-flex">
              {c.preLaunch}
            </Link>
            <button
              type="button"
              className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-clox-navy lg:hidden"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-8 lg:hidden">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-3">
              {c.nav.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-lg px-3 py-2 font-medium text-clox-navy hover:bg-slate-50 hover:text-clox-orange"
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
        className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-clox-navy pt-[160px] text-center text-white sm:min-h-screen sm:pt-[200px] xl:min-h-[850px] xl:max-h-[920px] xl:items-start xl:pt-[180px] 2xl:min-h-[900px] 2xl:max-h-[980px]"
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
              className={`absolute -inset-2 scale-[1.02] bg-cover bg-center blur-[2px] transition-opacity duration-[1500ms] ease-in-out xl:blur-[1px] ${
                index === slide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${item.image}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[rgba(5,20,40,0.55)] to-[rgba(0,7,17,0.5)] xl:from-black/80 xl:via-[rgba(5,20,40,0.65)] xl:to-[rgba(0,7,17,0.6)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[900px] animate-hero-fade-up px-5 pb-20 pt-8 sm:px-8 xl:max-w-[1040px] xl:pb-24 xl:pt-10 2xl:max-w-[1120px]">
          <span className="mb-8 inline-block rounded-full border border-clox-orange/60 bg-clox-navy/75 px-6 py-2 text-[0.9rem] font-bold uppercase tracking-[2px] text-clox-orange shadow-lg backdrop-blur-sm xl:mb-10 xl:text-base">
            {c.tagline}
          </span>

          <div className="relative mx-auto mb-8 flex min-h-[250px] w-full items-center justify-center xl:mb-10 xl:min-h-[280px]">
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
                  <h1 className="mb-6 text-[2rem] font-extrabold leading-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] sm:text-[2.2rem] lg:text-[3.2rem] xl:mb-7 xl:text-[3.6rem] 2xl:text-[4rem]">
                    {c[item.titleLeadKey]}
                    <br />
                    <span className="text-clox-orange">{c[item.titleAccentKey]}</span>
                  </h1>
                  <p className="mx-auto mb-0 max-w-[800px] text-[1.15rem] font-light leading-8 text-[#e2e8f0] sm:text-[1.25rem] xl:max-w-[920px] xl:text-[1.35rem] xl:leading-9 2xl:text-[1.45rem]">
                    {c[item.bodyKey]}
                  </p>
                </div>
              );
            })}
          </div>

          <a href="#comparison" className="clox-btn-primary px-12 py-4 text-[1.15rem] xl:px-14 xl:py-4.5 xl:text-[1.2rem]">
            {c.explore}
          </a>

          <div className="mt-8 flex justify-center gap-2 xl:mt-10" aria-label="Hero slides">
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
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <h2 className="mb-4 text-left text-[2.2rem] font-extrabold uppercase tracking-tight text-clox-navy sm:text-[2.8rem] lg:text-[3.1rem] xl:mb-5 xl:text-[3.35rem]">
              {c.overviewTitle}
            </h2>
            <p className="text-[1.1rem] leading-8 text-slate-600 lg:text-[1.2rem] lg:leading-9 xl:text-[1.3rem] xl:leading-10">
              {c.overviewBody}
            </p>
          </div>
          <div className="mx-auto w-full max-w-[480px] lg:max-w-none">
            <img
              src="/landing/overview.jpg"
              alt="Modern logistics"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-clox-card max-h-[420px] xl:max-h-[480px]"
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
          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="max-w-[450px] rounded-xl bg-white p-6 text-clox-ink shadow-[0_15px_40px_rgba(0,0,0,0.3)] sm:p-8 xl:max-w-[480px]">
              <h4 className="mb-1 text-[1.3rem] font-extrabold text-clox-navy">{c.zeroDebt}</h4>
              <p className="text-[1rem] italic text-slate-500">{c.zeroDebtNote}</p>
            </div>
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
            <img
              src="/brand/clox_updated_logo.png"
              alt="CLOX"
              className="mx-auto h-20 w-auto object-contain sm:h-24"
            />
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
          <a href="#banner" className="mx-auto mb-6 inline-flex" aria-label="CLOX home">
            <img
              src="/brand/clox_updated_logo_light.png"
              alt="CLOX"
              className="h-[64px] w-auto object-contain sm:h-[68px]"
            />
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
