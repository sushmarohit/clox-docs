import type { AppLocale } from '@/locales';
import type { HomeCopy } from '@/components/home/copy';

export type HomeSectionProps = {
  copy: HomeCopy;
  locale: AppLocale;
};

export const heroSlides = [
  {
    image: '/landing/hero-freight-marketplace.webp',
    titleLeadKey: 'slide1TitleLead',
    titleAccentKey: 'slide1TitleAccent',
    bodyKey: 'slide1Body',
  },
  {
    image: '/landing/hero-highway-transport.webp',
    titleLeadKey: 'slide2TitleLead',
    titleAccentKey: 'slide2TitleAccent',
    bodyKey: 'slide2Body',
  },
  {
    image: '/landing/hero-fleet-operations.webp',
    titleLeadKey: 'slide3TitleLead',
    titleAccentKey: 'slide3TitleAccent',
    bodyKey: 'slide3Body',
  },
  {
    image: '/landing/hero-urban-freight-ecosystem.webp',
    titleLeadKey: 'slide4TitleLead',
    titleAccentKey: 'slide4TitleAccent',
    bodyKey: 'slide4Body',
  },
] as const;

export const featureImages = [
  '/landing/feature-clear-comparisons.webp',
  '/landing/feature-streamlined-booking.webp',
  '/landing/feature-carrier-verification.webp',
  '/landing/feature-realtime-tracking.webp',
  '/landing/feature-protected-payments.webp',
] as const;

export const journeyStepImages = [
  '/landing/journey-enter-details.webp',
  '/landing/journey-compare-book.webp',
  '/landing/journey-move-track.webp',
  '/landing/journey-deliver.webp',
] as const;

export const matchingVehicleImages = [
  '/landing/matching-vehicle-ute.webp',
  '/landing/matching-vehicle-van.webp',
  '/landing/matching-vehicle-rigid.webp',
  '/landing/matching-vehicle-4x2-6x2.webp',
  '/landing/matching-vehicle-articulated.webp',
  '/landing/matching-vehicle-tipper.webp',
  '/landing/matching-vehicle-flatbed.webp',
  '/landing/matching-vehicle-refrigerated.webp',
  '/landing/matching-vehicle-oversize.webp',
  '/landing/matching-vehicle-b-double.webp',
] as const;

export const matchingAppPhoneImage = '/landing/matching-app-phone.webp';
