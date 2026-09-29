import { permanentRedirect } from 'next/navigation';
import { defaultLocale } from '@/locales';

export default function RootPage() {
  permanentRedirect(`/${defaultLocale}`);
}
