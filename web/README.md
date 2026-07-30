# CLOX public web (Next.js)

Pre-launch public site: localized App Router pages, PWA, SEO/LLM discovery, and a lightweight-RAG site guide.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Dev server: http://localhost:5173

## Scripts

- `npm run dev` — Next.js on port 5173
- `npm run build` — production build (+ Serwist service worker)
- `npm run start` — serve production build on 5173
- `npm run lint` — TypeScript check

## Environment

See `.env.example` for `SITE_URL`, `API_BASE_URL`, and AI provider settings (`AI_PROVIDER=mock|openai|anthropic`).
