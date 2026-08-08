import { compact, ref } from './graph';
import { PERSON_ID } from './person';
import { siteId, type SiteKey } from './site';
import type { Locale, Node, Ref } from './types';

const BCP47: Record<Locale, string> = { 'en-us': 'en-US', 'de-de': 'de-DE' };

/** Finding B: the id format for a site's Blog node, lives in exactly this one
 *  place. Locale-scoped, not just site-scoped — `blog('dev', 'en-us', ...)`
 *  and `blog('dev', 'de-de', ...)` describe two distinct entities (different
 *  `name`, different `inLanguage`), so they must not collide on one @id.
 *  Call sites that used to hand-derive `` `${siteId(site)}-blog` `` (the
 *  article pages' `blogId` argument to blogPosting()) should call this
 *  instead. */
export function blogId(site: SiteKey, locale: Locale): string {
  return `${siteId(site)}-blog-${locale}`;
}

export function blog(input: { site: SiteKey; locale: Locale; name: string; url: string }): Node {
  return compact({
    '@type': 'Blog',
    '@id': blogId(input.site, input.locale),
    name: input.name,
    url: input.url,
    inLanguage: BCP47[input.locale],
    publisher: ref(PERSON_ID),
    isPartOf: ref(siteId(input.site)),
  });
}

export function blogPosting(input: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
  locale: Locale;
  blogId?: string;
  /** The article's author, by @id reference. Defaults to the canonical
   *  Person (Finding F) so every call site that never sees a guest byline
   *  keeps working unchanged. Pass an explicit `ref(...)` when the resolved
   *  author entry is not Sebastian, so the JSON-LD credits the same person
   *  the rendered byline names. `publisher` always stays the canonical
   *  Person regardless — this package has no notion of a guest's publisher
   *  identity, and the site is still published by Sebastian. */
  author?: Ref;
}): Node {
  return compact({
    '@type': 'BlogPosting',
    '@id': `${input.url}#article`,
    url: input.url,
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    image: input.image ? [input.image] : undefined,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
    inLanguage: BCP47[input.locale],
    author: input.author ?? ref(PERSON_ID),
    publisher: ref(PERSON_ID),
    isPartOf: input.blogId ? ref(input.blogId) : undefined,
    mainEntityOfPage: ref(input.url),
  });
}

export function creativeWork(input: {
  url: string;
  name: string;
  description: string;
  dateCreated?: string;
  keywords?: string[];
  genre?: string;
  sameAs?: string[];
  image?: string;
  locale: Locale;
}): Node {
  return compact({
    '@type': 'CreativeWork',
    '@id': `${input.url}#work`,
    url: input.url,
    name: input.name,
    description: input.description,
    dateCreated: input.dateCreated,
    genre: input.genre,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
    image: input.image,
    sameAs: input.sameAs,
    inLanguage: BCP47[input.locale],
    creator: ref(PERSON_ID),
  });
}

/** `url` is optional: an entry with no resolvable link (e.g. an unlinked
 *  apps/rocks portfolio project) still gets a name-only ListItem, the same
 *  fail-safe shape breadcrumbs() uses for its final crumb, rather than being
 *  dropped from the list entirely or advertising a URL that 404s. */
export function itemList(items: Array<{ url?: string; name: string }>): Node {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) =>
      compact({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })
    ),
  };
}

/** A partial node sharing the page's own @id — the WebPage/ProfilePage the
 *  layout already emits via webPage({ pageType: 'ProfilePage', ... }). Adds
 *  only what the layout cannot know: which Person this page is about. No
 *  @type, name, description or isPartOf here — the layout's node already
 *  carries those, and duplicating them would just be two nodes fighting over
 *  one @id after graph consumers merge them. */
export function profileMainEntity(url: string): Node {
  return { '@id': url, mainEntity: ref(PERSON_ID) };
}

/** A partial node sharing the Person's @id. Consumers merge nodes by @id, so
 *  this enriches the canonical Person on the home page alone without making that
 *  page's Person node differ from every other page's. */
export function personKnowsAbout(items: string[]): Node {
  return { '@id': PERSON_ID, knowsAbout: items };
}

/** Same mechanism, for the CV page's employment history.
 *
 *  Finding E: this used to accept a `company` and write it into
 *  `namedPosition`, but schema.org defines `Role.namedPosition` as the name
 *  of the position held, not the employer — so it was telling consumers the
 *  employer's name was a job title, while never actually associating the
 *  employer with the Person at all. The faithful fix would be an
 *  `Organization` node for the employer, which this package forbids outright
 *  (`FORBIDDEN_TYPES` in validate.ts, "no Organization node anywhere") to
 *  keep a second entity from competing with the Person. So the employer is
 *  dropped from structured data entirely and stays only on the rendered CV
 *  page, which is where it is actually presented to readers; each entry
 *  becomes a plain `Occupation` carrying just the role name. `company` is no
 *  longer a parameter — nothing in this builder can use it. */
export function personOccupations(entries: Array<{ role: string }>): Node {
  return {
    '@id': PERSON_ID,
    hasOccupation: entries.map((entry) => ({ '@type': 'Occupation', name: entry.role })),
  };
}
