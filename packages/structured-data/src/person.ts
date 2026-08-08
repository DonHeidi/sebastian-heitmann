import { compact } from './graph';
import type { Locale, Node } from './types';

export const DEV_ORIGIN = 'https://www.sebastian-heitmann.dev';
export const ROCKS_ORIGIN = 'https://www.sebastian-heitmann.rocks';

/** The single canonical identity, hosted on .dev and referenced verbatim from
 *  .rocks. Both sites must emit this byte-identically for a given locale, which
 *  is what scripts/check-structured-data.ts enforces. */
export const PERSON_ID = `${DEV_ORIGIN}/#person`;

const JOB_TITLE: Record<Locale, string> = {
  'en-us': 'Technology Consultant',
  'de-de': 'Technology Consultant',
};

/** Takes no page-specific data on purpose: .dev and .rocks must emit this
 *  byte-identically, which scripts/check-structured-data.ts relies on. Anything
 *  one page knows and others do not belongs in a partial node sharing this @id
 *  (see personKnowsAbout / personOccupations). */
export function person(locale: Locale): Node {
  return compact({
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Sebastian Heitmann',
    jobTitle: JOB_TITLE[locale],
    url: DEV_ORIGIN,
    email: 'me@sebastian-heitmann.dev',
    knowsLanguage: ['de', 'en'],
    sameAs: [
      DEV_ORIGIN,
      ROCKS_ORIGIN,
      'https://www.linkedin.com/in/sebastian-heitmann/',
      'https://github.com/DonHeidi',
    ],
  });
}
