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

/** Derived from the pathname, so a page added later needs no route table. */
export function breadcrumbs(input: {
  pathname: string;
  title: string;
  site: SiteKey;
  locale: Locale;
  /** Finding C: an explicit label for the current page's own (final) crumb.
   *  Falls back to `title` when omitted. `title` is usually a `<title>` tag
   *  value dressed up with a site-name suffix
   *  ("CV — Sebastian Heitmann", "Blickwerk — ... — Portfolio") — Google
   *  renders this crumb verbatim in the SERP breadcrumb trail, so that
   *  suffix must not leak in. Pass a short crumb label ("CV", "Blickwerk")
   *  instead; do not try to strip the suffix by splitting on a separator,
   *  since titles are authored freely and that would break silently. */
  label?: string;
  /** Finding D: per-segment metadata for every intermediate path segment
   *  (all but the last), keyed by the raw URL slug (e.g. 'articles').
   *  Bundles the two things breadcrumbs() cannot infer from the URL alone
   *  and that belong together: `routed` (does this segment have its own
   *  indexed page, so the crumb may safely link to it — see the historical
   *  apps/rocks bug of emitting `item: ".../cases/"` with no
   *  cases/index.astro behind it) and `label` (what the segment is actually
   *  called in this locale — a raw slug like 'articles' title-cases to
   *  'Articles' on every locale, which is wrong on a German page whose own
   *  nav says 'Artikel'). Only the layout reliably knows its own route
   *  table and copy, so it is the one place this is declared. An
   *  undeclared segment, or one with no `label`, fails safe: a title-cased,
   *  unlocalized slug and no link. */
  segments?: Record<string, { label?: string; routed?: boolean }>;
}): Node | null {
  const origin = originFor(input.site);
  const localePrefix = input.locale === 'de-de' ? '/de-de' : '';
  const homeUrl = `${origin}${localePrefix}/`;
  const segments = input.segments ?? {};

  const rest = input.pathname
    .replace(/^\/de-de/, '')
    .split('/')
    .filter(Boolean);

  if (rest.length === 0) return null;

  const items: Node[] = [
    { '@type': 'ListItem', position: 1, name: HOME_LABEL[input.locale], item: homeUrl },
  ];

  // Every segment but the last MIGHT be a real intermediate page with its own
  // URL and its own localized label — only if the caller declared it in
  // segments. Otherwise this emits the same name-only, title-cased-slug
  // shape as before, which schema.org and Google both accept.
  rest.slice(0, -1).forEach((segment, index) => {
    const meta = segments[segment];
    items.push(compact({
      '@type': 'ListItem',
      position: index + 2,
      name: meta?.label ?? titleCase(segment),
      item: meta?.routed
        ? `${origin}${localePrefix}/${rest.slice(0, index + 1).join('/')}/`
        : undefined,
    }));
  });

  // Google asks that the final crumb omit `item`: it is the current page.
  items.push({ '@type': 'ListItem', position: items.length + 1, name: input.label ?? input.title });

  return { '@type': 'BreadcrumbList', itemListElement: items };
}

function titleCase(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
