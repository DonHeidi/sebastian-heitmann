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

export function siteOrigin(): string {
  return 'https://www.sebastian-heitmann.rocks';
}

// Absolute URL with a trailing slash — hreflang/canonical targets must match the
// canonical (trailing-slash) form exactly, or Google crawls a 301 per reference.
export function absoluteUrl(path: string): string {
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${siteOrigin()}${withSlash}`;
}

// Hreflang pair for a page. `dePath` defaults to the /de-de/-prefixed mirror of
// `enPath`. x-default points at the English page (site default).
export function getHreflangAlternates(enPath: string, dePath?: string) {
  const en = absoluteUrl(enPath);
  const de = absoluteUrl(dePath ?? `/de-de${enPath === '/' ? '/' : enPath}`);
  return [
    { hreflang: 'en', href: en },
    { hreflang: 'de-DE', href: de },
    { hreflang: 'x-default', href: en },
  ];
}
