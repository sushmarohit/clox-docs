import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/language-switcher';
import { EoiPage } from '@/pages/eoi-page';
import { InvestorsPage } from '@/pages/investors-page';
import { RegistryPage } from '@/pages/registry-page';

function HomePage() {
  const { t } = useTranslation('common');

  return (
    <main className="relative min-h-screen overflow-hidden bg-clox-navy text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: "url('/brand/back.jpeg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-clox-navy/50 via-clox-navy/80 to-clox-navy" />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <img src="/brand/logo.png" alt="CLOX" className="h-12 w-auto" />
          <LanguageSwitcher />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clox-orange">
          {t('home.eyebrow')}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{t('brand')}</h1>
        <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{t('tagline')}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/registry"
            className="rounded-full bg-clox-orange px-5 py-3 text-center text-sm font-semibold text-white"
          >
            {t('registry.title')}
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/partner/eoi"
              className="flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white backdrop-blur"
            >
              {t('eoi.title')}
            </Link>
            <Link
              to="/investors"
              className="flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white backdrop-blur"
            >
              {t('investors.title')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: { heading: string; body: string }[];
}) {
  const { t } = useTranslation('common');

  return (
    <main className="min-h-screen bg-clox-surface px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm font-semibold text-clox-orange">
          {t('legal.back')}
        </Link>
        <p className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {t('draftLegal')}
        </p>
        <h1 className="mt-4 text-3xl font-bold text-clox-navy">{title}</h1>
        <div className="mt-6 space-y-6 text-slate-600">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-clox-navy">{section.heading}</h2>
              <p className="mt-2 leading-7">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export function AppRouter() {
  const { t } = useTranslation('common');

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/registry" element={<RegistryPage />} />
      <Route path="/partner/eoi" element={<EoiPage />} />
      <Route path="/investors" element={<InvestorsPage />} />
      <Route
        path="/privacy"
        element={
          <LegalPage
            title={t('privacy')}
            sections={[
              {
                heading: t('legal.privacy.whoHeading'),
                body: t('legal.privacy.whoBody'),
              },
              {
                heading: t('legal.privacy.whatHeading'),
                body: t('legal.privacy.whatBody'),
              },
              {
                heading: t('legal.privacy.purposeHeading'),
                body: t('legal.privacy.purposeBody'),
              },
              {
                heading: t('legal.privacy.contactHeading'),
                body: t('legal.privacy.contactBody'),
              },
            ]}
          />
        }
      />
      <Route
        path="/terms"
        element={
          <LegalPage
            title={t('terms')}
            sections={[
              {
                heading: t('legal.terms.submissionsHeading'),
                body: t('legal.terms.submissionsBody'),
              },
              {
                heading: t('legal.terms.accuracyHeading'),
                body: t('legal.terms.accuracyBody'),
              },
              {
                heading: t('legal.terms.confidentialityHeading'),
                body: t('legal.terms.confidentialityBody'),
              },
            ]}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
