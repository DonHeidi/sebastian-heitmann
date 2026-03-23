import type { Strings } from './types';
import { enUs } from './en-us';
import { enGb } from './en-gb';
import { deDe } from './de-de';

export type Locale = 'en-us' | 'en-gb' | 'de-de';

export const locales: Locale[] = ['en-us', 'en-gb', 'de-de'];
export const defaultLocale: Locale = 'en-us';

const strings: Record<Locale, Strings> = {
  'en-us': enUs,
  'en-gb': enGb,
  'de-de': deDe,
};

export function getStrings(locale: string | undefined): Strings {
  return strings[(locale as Locale) ?? defaultLocale] ?? strings[defaultLocale];
}

export const localeConfig: Record<Locale, { flag: string; label: string; htmlLang: string }> = {
  'en-us': { flag: '\uD83C\uDDFA\uD83C\uDDF8', label: 'English (US)', htmlLang: 'en-US' },
  'en-gb': { flag: '\uD83C\uDDEC\uD83C\uDDE7', label: 'English (GB)', htmlLang: 'en-GB' },
  'de-de': { flag: '\uD83C\uDDE9\uD83C\uDDEA', label: 'Deutsch', htmlLang: 'de-DE' },
};
