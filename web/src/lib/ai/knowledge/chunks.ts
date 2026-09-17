import type { AppLocale } from '@/locales';

export type KnowledgeChunk = {
  id: string;
  locale: AppLocale | 'both';
  title: string;
  path: string;
  text: string;
  tags: string[];
  /** When false, chunk is kept for re-enable but not used by the public site guide. */
  public?: boolean;
};

export const knowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'about-en',
    locale: 'en',
    title: 'About CLOX',
    path: '/en',
    tags: ['about', 'product', 'freight', 'australia'],
    text: 'CLOX is an Australia-first full-load freight marketplace in pre-launch. The public site collects registry and partner expression of interest leads. It does not yet offer live freight booking, matching, payments, or chat-based lead submission.',
  },
  {
    id: 'about-hi',
    locale: 'hi',
    title: 'CLOX के बारे में',
    path: '/hi',
    tags: ['about', 'product', 'freight', 'australia'],
    text: 'CLOX ऑस्ट्रेलिया-फर्स्ट फुल-लोड फ्रेट मार्केटप्लेस है जो प्री-लॉन्च चरण में है। सार्वजनिक साइट रजिस्ट्री और पार्टनर EOI लीड एकत्र करती है। अभी लाइव बुकिंग, मैचिंग, भुगतान या चैट के माध्यम से लीड जमा उपलब्ध नहीं है।',
  },
  {
    id: 'about-pa',
    locale: 'pa',
    title: 'CLOX ਬਾਰੇ',
    path: '/pa',
    tags: ['about', 'product', 'freight', 'australia'],
    text: 'CLOX ਆਸਟ੍ਰੇਲੀਆ-ਪਹਿਲਾਂ ਫੁੱਲ-ਲੋਡ ਫਰੇਟ ਮਾਰਕੀਟਪਲੇਸ ਹੈ ਜੋ ਪ੍ਰੀ-ਲਾਂਚ ਪੜਾਅ ਵਿੱਚ ਹੈ। ਜਨਤਕ ਸਾਈਟ ਰਜਿਸਟਰੀ ਅਤੇ ਪਾਰਟਨਰ EOI ਲੀਡ ਇਕੱਠੀਆਂ ਕਰਦੀ ਹੈ। ਅਜੇ ਲਾਈਵ ਬੁਕਿੰਗ, ਮੈਚਿੰਗ, ਭੁਗਤਾਨ ਜਾਂ ਚੈਟ ਰਾਹੀਂ ਲੀਡ ਜਮ੍ਹਾਂ ਉਪਲਬਧ ਨਹੀਂ।',
  },
  {
    id: 'registry-en',
    locale: 'en',
    title: 'Pre-launch registry',
    path: '/en/registry',
    tags: ['registry', 'sender', 'carrier', 'shipper', 'transport'],
    text: 'Use the Pre-launch registry if you are a sender/corporate shipper or a carrier/transport company. The wizard captures company or fleet details, ABN, contact email/phone, operational preferences, and infrastructure acknowledgements (easyAML, Protected Upfront Payments via Stripe Connect, Monoova NPP PayTo). Submitting does not grant platform access yet.',
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
    id: 'registry-pa',
    locale: 'pa',
    title: 'ਪ੍ਰੀ-ਲਾਂਚ ਰਜਿਸਟਰੀ',
    path: '/pa/registry',
    tags: ['registry', 'sender', 'carrier'],
    text: 'ਜੇ ਤੁਸੀਂ ਸੈਂਡਰ/ਕਾਰਪੋਰੇਟ ਸ਼ਿਪਰ ਜਾਂ ਕੈਰੀਅਰ/ਟਰਾਂਸਪੋਰਟ ਕੰਪਨੀ ਹੋ ਤਾਂ ਪ੍ਰੀ-ਲਾਂਚ ਰਜਿਸਟਰੀ ਵਰਤੋ। ਇਹ ਕੰਪਨੀ/ਫਲੀਟ ਵੇਰਵੇ, ABN, ਸੰਪਰਕ ਅਤੇ ਇੰਫਰਾਸਟਰਕਚਰ ਸਵੀਕ੍ਰਿਤੀਆਂ ਇਕੱਠੀਆਂ ਕਰਦੀ ਹੈ। ਫਾਰਮ ਜਮ੍ਹਾਂ ਕਰਨ ਨਾਲ ਪਲੇਟਫਾਰਮ ਐਕਸੈਸ ਨਹੀਂ ਮਿਲਦਾ।',
  },
  {
    id: 'eoi-en',
    locale: 'en',
    title: 'Partner expression of interest',
    path: '/en/partner/eoi',
    tags: ['partner', 'eoi', 'territory partner'],
    text: 'Partner EOI is for Territory Sales Partners / Independent Territory Partners. Applicants provide territory targets, company identity, network experience, and a declaration. Partners operate with complete operational autonomy — setting their own hours and strategies as independent commercial contractors, not employees. Commercial terms are discussed after application under NDA. No fee splits or commission percentages are published on the public form. Selection requires KYB and executive review; the EOI itself is not admission.',
  },
  {
    id: 'eoi-hi',
    locale: 'hi',
    title: 'पार्टनर EOI',
    path: '/hi/partner/eoi',
    tags: ['partner', 'eoi', 'territory partner'],
    text: 'पार्टनर EOI Territory Sales Partner / Independent Territory Partner के लिए है। क्षेत्र, कंपनी डेटा, नेटवर्क अनुभव और घोषणा आवश्यक हैं। पार्टनर पूर्ण परिचालन स्वायत्तता के साथ स्वतंत्र वाणिज्यिक ठेकेदार के रूप में काम करते हैं — कर्मचारी नहीं। वाणिज्यिक शर्तें आवेदन के बाद NDA के अंतर्गत साझा की जाती हैं। सार्वजनिक फ़ॉर्म पर कोई शुल्क-विभाजन प्रतिशत नहीं है। EOI प्रवेश की गारंटी नहीं है — KYB और कार्यकारी समीक्षा आवश्यक है।',
  },
  {
    id: 'eoi-pa',
    locale: 'pa',
    title: 'ਪਾਰਟਨਰ EOI',
    path: '/pa/partner/eoi',
    tags: ['partner', 'eoi', 'territory partner'],
    text: 'ਪਾਰਟਨਰ EOI Territory Sales Partner / Independent Territory Partner ਲਈ ਹੈ। ਖੇਤਰ, ਕੰਪਨੀ ਡੇਟਾ, ਨੈਟਵਰਕ ਤਜਰਬਾ ਅਤੇ ਘੋਸ਼ਣਾ ਲੋੜੀਂਦੀ ਹੈ। ਪਾਰਟਨਰ ਪੂਰੀ ਓਪਰੇਸ਼ਨਲ ਖੁਦਮੁਖਤਾਰੀ ਨਾਲ ਆਜ਼ਾਦ ਵਪਾਰਕ ਠੇਕੇਦਾਰ ਵਜੋਂ ਕੰਮ ਕਰਦੇ ਹਨ — ਕਰਮਚਾਰੀ ਨਹੀਂ। ਵਪਾਰਕ ਸ਼ਰਤਾਂ ਅਰਜ਼ੀ ਤੋਂ ਬਾਅਦ NDA ਅਧੀਨ ਸਾਂਝੀਆਂ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜਨਤਕ ਫਾਰਮ ਉੱਤੇ ਕੋਈ ਫੀਸ-ਵੰਡ ਪ੍ਰਤੀਸ਼ਤ ਨਹੀਂ। EOI ਦਾਖਲੇ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ — KYB ਅਤੇ ਐਗਜ਼ੀਕਿਊਟਿਵ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।',
  },
  {
    id: 'investors-en',
    locale: 'en',
    title: 'Investor portal',
    path: '/en/investors',
    tags: ['investor', 'equity', 'capital', 'accreditation'],
    public: false,
    text: 'The Investor portal is an early-access equity round registration and pre-qualification form. Classifications include sophisticated investor, professional investor, and strategic industry partner. Capital bands start at AUD 25,000. Information is protected under NDA-style acknowledgements and used only for accreditation review. Questions: info@clox.com.au.',
  },
  {
    id: 'investors-hi',
    locale: 'hi',
    title: 'इन्वेस्टर पोर्टल',
    path: '/hi/investors',
    tags: ['investor', 'equity', 'capital'],
    public: false,
    text: 'इन्वेस्टर पोर्टल अर्ली-एक्सेस इक्विटी राउंड के लिए प्री-क्वालीफ़िकेशन फ़ॉर्म है। वर्ग: परिष्कृत, पेशेवर और रणनीतिक उद्योग पार्टनर। पूंजी बैंड AUD 25,000 से शुरू होते हैं। प्रश्न: info@clox.com.au।',
  },
  {
    id: 'investors-pa',
    locale: 'pa',
    title: 'ਨਿਵੇਸ਼ਕ ਪੋਰਟਲ',
    path: '/pa/investors',
    tags: ['investor', 'equity', 'capital'],
    public: false,
    text: 'ਨਿਵੇਸ਼ਕ ਪੋਰਟਲ ਅਰਲੀ-ਐਕਸੈਸ ਇਕਵਿਟੀ ਰਾਊਂਡ ਲਈ ਪ੍ਰੀ-ਕੁਆਲੀਫਿਕੇਸ਼ਨ ਫਾਰਮ ਹੈ। ਵਰਗ: ਸੋਫਿਸਟੀਕੇਟਡ, ਪੇਸ਼ੇਵਰ ਅਤੇ ਰਣਨੀਤਕ ਉਦਯੋਗ ਪਾਰਟਨਰ। ਪੂੰਜੀ ਬੈਂਡ AUD 25,000 ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ। ਸਵਾਲ: info@clox.com.au।',
  },
  {
    id: 'privacy-en',
    locale: 'en',
    title: 'Privacy',
    path: '/en/privacy',
    tags: ['privacy', 'legal', 'data'],
    text: 'Achieve Global Enterprises Pty Ltd (ABN 48 626 269 387) trading as CLOX Freight Forwarding collects pre-launch personal and corporate data under the Australian Privacy Principles / Privacy Act 1988 (Cth). Data may include identity/contact details, ABN/ACN and fleet info, technical usage data, and communications. Uses: early-access waitlist, ABN pre-validation, consented marketing, Shipper/Carrier segmentation, Territory Sales Partner / Independent Territory Partner applications, and site improvement. Data is stored on AU-jurisdiction servers with encryption in transit and at rest. Not sold; may be shared with hosting/CRM providers, ABR checks, or as required by law. Full KYC/KYB (easyAML/Trulioo) only at official onboarding. Rights: access, correction, opt-out. Contact: info@clox.com.au · 18 Solferino Rd, Clyde North, VIC 3978.',
  },
  {
    id: 'privacy-hi',
    locale: 'hi',
    title: 'गोपनीयता',
    path: '/hi/privacy',
    tags: ['privacy', 'legal', 'data'],
    text: 'Achieve Global Enterprises Pty Ltd (ABN 48 626 269 387) ट्रेडिंग नाम CLOX Freight Forwarding Privacy Act 1988 (Cth) / APPs के अंतर्गत प्री-लॉन्च व्यक्तिगत और कॉर्पोरेट डेटा एकत्र करता है। उपयोग: वेटलिस्ट, ABN पूर्व-सत्यापन, सहमति के साथ मार्केटिंग, शिपर/कैरियर विभाजन, Territory Sales Partner / Independent Territory Partner आवेदन। डेटा ऑस्ट्रेलियाई अधिकार क्षेत्र के सर्वरों पर एन्क्रिप्शन के साथ संग्रहीत। नहीं बेचा जाता। अधिकार: पहुँच, सुधार, ऑप्ट-आउट। संपर्क: info@clox.com.au · 18 Solferino Rd, Clyde North, VIC 3978.',
  },
  {
    id: 'privacy-pa',
    locale: 'pa',
    title: 'ਪਰਾਈਵੇਸੀ',
    path: '/pa/privacy',
    tags: ['privacy', 'legal', 'data'],
    text: 'Achieve Global Enterprises Pty Ltd (ABN 48 626 269 387) ਟ੍ਰੇਡਿੰਗ ਨਾਮ CLOX Freight Forwarding Privacy Act 1988 (Cth) / APPs ਅਧੀਨ ਪ੍ਰੀ-ਲਾਂਚ ਨਿੱਜੀ ਅਤੇ ਕਾਰਪੋਰੇਟ ਡੇਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ। ਵਰਤੋਂ: ਵੇਟਲਿਸਟ, ABN ਪੂਰਵ-ਤਸਦੀਕ, ਸਹਿਮਤੀ ਨਾਲ ਮਾਰਕੀਟਿੰਗ, ਸ਼ਿਪਰ/ਕੈਰੀਅਰ ਵੰਡ, Territory Sales Partner / Independent Territory Partner ਅਰਜ਼ੀਆਂ। ਡੇਟਾ ਆਸਟ੍ਰੇਲੀਆਈ ਅਧਿਕਾਰ ਖੇਤਰ ਦੇ ਸਰਵਰਾਂ ਉੱਤੇ ਇਨਕ੍ਰਿਪਸ਼ਨ ਨਾਲ ਸੰਭਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਨਹੀਂ ਵੇਚਿਆ ਜਾਂਦਾ। ਅਧਿਕਾਰ: ਪਹੁੰਚ, ਸੁਧਾਰ, ਆਪਟ-ਆਉਟ। ਸੰਪਰਕ: info@clox.com.au · 18 Solferino Rd, Clyde North, VIC 3978.',
  },
  {
    id: 'terms-en',
    locale: 'en',
    title: 'Terms',
    path: '/en/terms',
    tags: ['terms', 'legal'],
    text: 'CLOX pre-launch website Terms & Conditions are operated by Achieve Global Enterprises Pty Ltd trading as CLOX Freight Forwarding (ABN 48 626 269 387), Victoria, Australia. Registration/EOI/mailing list signup is not a binding service contract. Early-access incentives are promotional and subject to formal Shipper/Carrier agreements at launch. Provide accurate ABN/ACN information. Site IP belongs to Achieve Global Enterprises. No scraping, false submissions, or unauthorized access. Third-party links (Stripe, Monoova, easyAML) are informational only. Content is as-is; roadmap features may change. Liability limited under ACL. Indemnity for misuse. Victorian law and exclusive jurisdiction. Pre-launch Terms will be superseded by Master Terms, Carrier Agreement, and Shipper Agreement at go-live. Contact: info@clox.com.au.',
  },
  {
    id: 'terms-hi',
    locale: 'hi',
    title: 'शर्तें',
    path: '/hi/terms',
    tags: ['terms', 'legal'],
    text: 'CLOX प्री-लॉन्च वेबसाइट नियम Achieve Global Enterprises Pty Ltd (ट्रेडिंग नाम CLOX Freight Forwarding, ABN 48 626 269 387), विक्टोरिया द्वारा संचालित हैं। पंजीकरण/EOI बाध्यकारी सेवा अनुबंध नहीं है। प्रोत्साहन प्रचारक हैं और लॉन्च पर औपचारिक समझौतों के अधीन। सटीक ABN/ACN दें। IP Achieve Global की है। स्क्रैपिंग/गलत जानकारी/अनधिकृत पहुँच निषिद्ध। सामग्री जैसा-है; रोडमैप बदल सकता है। ACL के अंतर्गत दायित्व सीमित। विक्टोरिया कानून। संपर्क: info@clox.com.au।',
  },
  {
    id: 'terms-pa',
    locale: 'pa',
    title: 'ਸ਼ਰਤਾਂ',
    path: '/pa/terms',
    tags: ['terms', 'legal'],
    text: 'CLOX ਪ੍ਰੀ-ਲਾਂਚ ਵੈੱਬਸਾਈਟ ਨਿਯਮ Achieve Global Enterprises Pty Ltd (ਟ੍ਰੇਡਿੰਗ ਨਾਮ CLOX Freight Forwarding, ABN 48 626 269 387), ਵਿਕਟੋਰੀਆ ਵੱਲੋਂ ਸੰਚਾਲਿਤ ਹਨ। ਰਜਿਸਟਰੇਸ਼ਨ/EOI ਬਾਧਿਆਕਾਰੀ ਸੇਵਾ ਇਕਰਾਰਨਾਮਾ ਨਹੀਂ। ਪ੍ਰੋਤਸਾਹਨ ਪ੍ਰਚਾਰਕ ਹਨ ਅਤੇ ਲਾਂਚ ਉੱਤੇ ਰਸਮੀ ਇਕਰਾਰਨਾਮਿਆਂ ਅਧੀਨ। ਸਹੀ ABN/ACN ਦਿਓ। IP Achieve Global ਦੀ ਹੈ। ਸਕ੍ਰੈਪਿੰਗ/ਗਲਤ ਜਾਣਕਾਰੀ/ਅਣਅਧਿਕਾਰਤ ਪਹੁੰਚ ਮਨਾਹੀ। ਸਮੱਗਰੀ ਜਿਵੇਂ-ਹੈ; ਰੋਡਮੈਪ ਬਦਲ ਸਕਦਾ ਹੈ। ACL ਅਧੀਨ ਦਾਇਤਵ ਸੀਮਿਤ। ਵਿਕਟੋਰੀਆ ਕਾਨੂੰਨ। ਸੰਪਰਕ: info@clox.com.au।',
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
