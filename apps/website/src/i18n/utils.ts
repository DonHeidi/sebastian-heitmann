import type { Strings } from './types';
import { enUs } from './en-us';
import { deDe } from './de-de';

export type Locale = 'en-us' | 'de-de';

export const locales: Locale[] = ['en-us', 'de-de'];
export const defaultLocale: Locale = 'en-us';

const strings: Record<Locale, Strings> = {
  'en-us': enUs,
  'de-de': deDe,
};

export function getStrings(locale: string | undefined): Strings {
  return strings[(locale as Locale) ?? defaultLocale] ?? strings[defaultLocale];
}

export const localeConfig: Record<Locale, { flag: string; label: string; htmlLang: string }> = {
  'en-us': { flag: '🇺🇸', label: 'EN', htmlLang: 'en' },
  'de-de': { flag: '🇩🇪', label: 'DE', htmlLang: 'de-DE' },
};

export function getHreflangAlternates() {
  const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://sebastian-heitmann.dev').replace(/\/$/, '');
  return [
    { hreflang: 'en', href: `${siteUrl}/` },
    { hreflang: 'de-DE', href: `${siteUrl}/de-de/` },
    { hreflang: 'x-default', href: `${siteUrl}/` },
  ];
}
