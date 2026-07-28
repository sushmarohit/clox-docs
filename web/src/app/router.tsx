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
      <div className="absolute inset-0 bg-gradient-to-b from-clox-navy/40 via-clox-navy/75 to-clox-navy" />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="mb-10 flex items-center justify-between gap-4 sm:mb-14">
          <img src="/brand/logo.png" alt="CLOX" className="h-12 w-auto sm:h-14" />
          <LanguageSwitcher />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clox-orange">
          {t('home.eyebrow')}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {t('brand')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:mt-6 sm:text-xl sm:leading-8">
          {t('tagline')}
        </p>
        <div className="mt-10 flex max-w-3xl flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-4">
          <Link
            to="/registry"
            className="rounded-full bg-clox-orange px-6 py-3.5 text-center text-sm font-semibold text-white sm:min-w-[12rem] sm:text-base"
          >
            {t('registry.title')}
          </Link>
          <Link
            to="/partner/eoi"
            className="rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-center text-sm font-semibold text-white backdrop-blur sm:min-w-[12rem] sm:text-base"
          >
            {t('eoi.title')}
          </Link>
          <Link
            to="/investors"
            className="rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-center text-sm font-semibold text-white backdrop-blur sm:min-w-[12rem] sm:text-base"
          >
            {t('investors.title')}
          </Link>
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
    <main className="min-h-screen bg-clox-surface px-6 py-16 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-3xl lg:max-w-4xl">
        <Link to="/" className="text-sm font-semibold text-clox-orange">
          {t('legal.back')}
        </Link>
        <p className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {t('draftLegal')}
        </p>
        <h1 className="mt-4 text-3xl font-bold text-clox-navy sm:text-4xl">{title}</h1>
        <div className="mt-8 space-y-8 text-slate-600 sm:space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-clox-navy sm:text-xl">{section.heading}</h2>
              <p className="mt-2 max-w-3xl leading-7 sm:text-base sm:leading-8">{section.body}</p>
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
