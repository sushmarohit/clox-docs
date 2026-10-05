'use client';

import { getHomeCopy } from '@/components/home/copy';
import { HomeAbout } from '@/components/home/home-about';
import { HomeCohort } from '@/components/home/home-cohort';
import { HomeComparison } from '@/components/home/home-comparison';
import { HomeEcosystem } from '@/components/home/home-ecosystem';
import { HomeFaq } from '@/components/home/home-faq';
import { HomeFeatures } from '@/components/home/home-features';
import { HomeFooter } from '@/components/home/home-footer';
import { HomeHeader } from '@/components/home/home-header';
import { HomeHero } from '@/components/home/home-hero';
import { HomeJourney } from '@/components/home/home-journey';
import { HomeMatching } from '@/components/home/home-matching';
import { useLocaleParam } from '@/lib/use-locale-param';

/**
 * Page band rhythm (blue ↔ white):
 * Hero(B) → About(W) → Compare(B) → Matching(W) → Features(B)
 * → Journey(W) → Ecosystem(B) → Cohort(W) → FAQ(B) → Footer(W)
 *
 * Rule: navy bands use dark/glass cards; light bands use white/surface cards.
 */
export function HomePage() {
  const locale = useLocaleParam();
  const copy = getHomeCopy(locale);

  return (
    <main className="overflow-x-hidden bg-white text-clox-ink">
      <HomeHeader copy={copy} locale={locale} />
      <HomeHero copy={copy} locale={locale} />
      <HomeAbout copy={copy} />
      <HomeComparison />
      <HomeMatching copy={copy} />
      <HomeFeatures copy={copy} />
      <HomeJourney copy={copy} />
      <HomeEcosystem copy={copy} locale={locale} />
      <HomeCohort copy={copy} locale={locale} />
      <HomeFaq copy={copy} locale={locale} />
      <HomeFooter copy={copy} locale={locale} />
    </main>
  );
}
