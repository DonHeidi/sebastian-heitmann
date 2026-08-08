import { compact, ref } from './graph';
import { DEV_ORIGIN, PERSON_ID, ROCKS_ORIGIN } from './person';
import type { Locale, Node } from './types';

export type SiteKey = 'dev' | 'rocks';

const BCP47: Record<Locale, string> = { 'en-us': 'en-US', 'de-de': 'de-DE' };

/** Site-level display names. Not localized: both are proper nouns. */
const SITE_NAME: Record<SiteKey, string> = {
  dev: 'Sebastian Heitmann',
  rocks: 'Sebastian Heitmann — Work',
};

/** Label for the first breadcrumb. The only string this module localizes. */
const HOME_LABEL: Record<Locale, string> = { 'en-us': 'Home', 'de-de': 'Start' };

export function originFor(site: SiteKey): string {
  return site === 'dev' ? DEV_ORIGIN : ROCKS_ORIGIN;
}

export function siteId(site: SiteKey): string {
  return `${originFor(site)}/#website`;
}

export function website(site: SiteKey, locale: Locale, description: string): Node {
  return compact({
    '@type': 'WebSite',
    '@id': siteId(site),
    name: SITE_NAME[site],
    description,
    url: `${originFor(site)}/`,
    inLanguage: BCP47[locale],
    about: ref(PERSON_ID),
    publisher: ref(PERSON_ID),
  });
}

export function webPage(input: {
  url: string;
  title: string;
  description: string;
  site: SiteKey;
  locale: Locale;
  type?: string;
}): Node {
  return compact({
    '@type': input.type ?? 'WebPage',
    '@id': input.url,
    url: input.url,
    name: input.title,
    description: input.description,
    inLanguage: BCP47[input.locale],
    isPartOf: ref(siteId(input.site)),
  });
}

/** Derived from the pathname, so a page added later needs no route table.
 *  Intermediate segments are title-cased from the slug; only /articles/ and
 *  /cases/ are ever nested today, and both title-case cleanly. */
export function breadcrumbs(input: {
  pathname: string;
  title: string;
  site: SiteKey;
  locale: Locale;
}): Node | null {
  const origin = originFor(input.site);
  const localePrefix = input.locale === 'de-de' ? '/de-de' : '';
  const homeUrl = `${origin}${localePrefix}/`;

  const rest = input.pathname
    .replace(/^\/de-de/, '')
    .split('/')
    .filter(Boolean);

  if (rest.length === 0) return null;

  const items: Node[] = [
    { '@type': 'ListItem', position: 1, name: HOME_LABEL[input.locale], item: homeUrl },
  ];

  // Every segment but the last is a real intermediate page with its own URL.
  rest.slice(0, -1).forEach((segment, index) => {
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: titleCase(segment),
      item: `${origin}${localePrefix}/${rest.slice(0, index + 1).join('/')}/`,
    });
  });

  // Google asks that the final crumb omit `item`: it is the current page.
  items.push({ '@type': 'ListItem', position: items.length + 1, name: input.title });

  return { '@type': 'BreadcrumbList', itemListElement: items };
}

function titleCase(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
