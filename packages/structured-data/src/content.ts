import { compact, ref } from './graph';
import { PERSON_ID } from './person';
import { siteId, type SiteKey } from './site';
import type { Locale, Node } from './types';

const BCP47: Record<Locale, string> = { 'en-us': 'en-US', 'de-de': 'de-DE' };

export function blog(site: SiteKey, name: string): Node {
  return compact({
    '@type': 'Blog',
    '@id': `${siteId(site)}-blog`,
    name,
    publisher: ref(PERSON_ID),
    isPartOf: ref(siteId(site)),
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
    author: ref(PERSON_ID),
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

export function itemList(items: Array<{ url: string; name: string }>): Node {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
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

/** Same mechanism, for the CV page's employment history. */
export function personOccupations(entries: Array<{ role: string; company?: string }>): Node {
  return {
    '@id': PERSON_ID,
    hasOccupation: entries.map((entry) =>
      compact({
        '@type': entry.company ? 'OrganizationRole' : 'Role',
        roleName: entry.role,
        namedPosition: entry.company,
      })
    ),
  };
}
