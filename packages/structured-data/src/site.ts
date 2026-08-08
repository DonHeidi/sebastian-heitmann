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

/** Returns the site's WebSite node on the domain root, and null everywhere else,
 *  so callers can pass the result straight to graph(), which drops nulls.
 *
 *  Google requires this node on the home page and defines home page as "the
 *  domain or subdomain level root URI"; copies on other pages are ignored, so
 *  emitting it site-wide is redundant payload.
 *  https://developers.google.com/search/docs/appearance/site-names
 *
 *  Note /de-de/ is a path on the same domain, not a root of its own, so a site
 *  publishes this node exactly once per domain rather than once per locale.
 *  Other pages link to it by @id via webPage()'s isPartOf.
 *
 *  It carries nothing that varies by page, for the same reason the Person node
 *  doesn't: one @id must never have two bodies. Per-page descriptions and
 *  languages live on the WebPage node, which is where Google reads them.
 *  Google documents only name, url and alternateName here; `about` and
 *  `publisher` are undocumented but valid schema.org, and they are what tie the
 *  two domains to one person. */
export function website(site: SiteKey, pathname: string): Node | null {
  if (pathname !== '/') return null;

  return compact({
    '@type': 'WebSite',
    '@id': siteId(site),
    name: SITE_NAME[site],
    url: `${originFor(site)}/`,
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
   *  table and copy, so it is the one place this is declared. A segment not
   *  declared `routed: true` here (whether entirely undeclared, or declared
   *  with only a `label`) is OMITTED from the trail entirely — see the
   *  fails-safe comment at its call site below for why a name-only crumb is
   *  not a safe fallback. */
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
  // URL and its own localized label — only if the caller declared it
  // `routed` in segments. An undeclared or unrouted segment is OMITTED FROM
  // THE TRAIL ENTIRELY rather than emitted name-only. Google's breadcrumb
  // docs make `item` required on every ListItem except the trail's last
  // ("If the breadcrumb is the last item in the breadcrumb trail, `item` is
  // not required"), so a name-only intermediate ListItem invalidates the
  // whole BreadcrumbList — worse than the 404-linking bug this shape was
  // originally built to avoid.
  // https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
  // Positions are assigned from the running `items.length`, so they stay
  // contiguous and 1-based no matter how many segments get dropped (e.g. an
  // apps/rocks case page: Home, then the case, at positions 1 and 2 — the
  // unrouted `cases` segment never appears).
  rest.slice(0, -1).forEach((segment, index) => {
    const meta = segments[segment];
    if (!meta?.routed) return;
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: meta.label ?? titleCase(segment),
      item: `${origin}${localePrefix}/${rest.slice(0, index + 1).join('/')}/`,
    });
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
