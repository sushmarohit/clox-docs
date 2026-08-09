import type { AppLocale } from '@/locales';
import type { HomeCopy } from '@/components/home/copy';

export type HomeSectionProps = {
  copy: HomeCopy;
  locale: AppLocale;
};

export const heroSlides = [
  {
    image: '/landing/1582.jpg',
    titleLeadKey: 'slide1TitleLead',
    titleAccentKey: 'slide1TitleAccent',
    bodyKey: 'slide1Body',
  },
  {
    image: '/landing/12180.jpg',
    titleLeadKey: 'slide2TitleLead',
    titleAccentKey: 'slide2TitleAccent',
    bodyKey: 'slide2Body',
  },
  {
    image: '/landing/656.jpg',
    titleLeadKey: 'slide3TitleLead',
    titleAccentKey: 'slide3TitleAccent',
    bodyKey: 'slide3Body',
  },
  {
    image: '/landing/133.jpg',
    titleLeadKey: 'slide4TitleLead',
    titleAccentKey: 'slide4TitleAccent',
    bodyKey: 'slide4Body',
  },
] as const;

export const featureImages = [
  '/landing/2250.jpg',
  '/landing/41687.jpg',
  '/landing/60896.jpg',
  '/landing/609377.jpg',
] as const;
