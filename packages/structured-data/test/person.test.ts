import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { PERSON_ID, person, graph, ref } from '../src/index';

// Finding 5 (mitigation, not a full fix): the deploy gate can only compare a
// page's Person node against `person()` evaluated at check time, in the same
// build. It cannot see what is already live on the *other* domain from a
// previous deploy — edit person(), deploy only .rocks, and the .dev objects
// already in Object Storage keep the old body while this check still passes,
// so the two domains end up serving conflicting bodies for one @id. A
// per-tree check cannot close that: it would need to compare live bytes on
// both origins, which is an operational step, not a build-time assertion.
// What this snapshot closes instead: an accidental or unreviewed edit to
// person() showing up as nothing but a passing test suite. Pinning the
// canonical shape to a file committed to git means any change to person()
// must also touch snapshot/person.json, so the diff is visible in code
// review as "the canonical Person node is changing" rather than hiding
// inside an ordinary-looking edit to person.ts. It does not, by itself,
// guarantee both sites get redeployed after that diff lands — see AGENTS.md
// for the operational rule.
const snapshot = JSON.parse(
  readFileSync(new URL('../snapshot/person.json', import.meta.url), 'utf8')
) as Record<'en-us' | 'de-de', unknown>;

describe('person', () => {
  test('matches the committed snapshot exactly — a deliberate diff is required to change it', () => {
    expect(person('en-us')).toEqual(snapshot['en-us']);
    expect(person('de-de')).toEqual(snapshot['de-de']);
  });

  test('carries the canonical dev-hosted @id regardless of locale', () => {
    expect(person('en-us')['@id']).toBe('https://www.sebastian-heitmann.dev/#person');
    expect(person('de-de')['@id']).toBe(person('en-us')['@id']);
  });

  test('is a Person, never an Organization or ProfessionalService', () => {
    expect(person('en-us')['@type']).toBe('Person');
  });

  test('never carries an address or a price range', () => {
    const node = person('en-us');
    expect(node.address).toBeUndefined();
    expect(node.priceRange).toBeUndefined();
  });

  test('sameAs links both domains and both profiles', () => {
    expect(person('en-us').sameAs).toEqual([
      'https://www.sebastian-heitmann.dev',
      'https://www.sebastian-heitmann.rocks',
      'https://www.linkedin.com/in/sebastian-heitmann/',
      'https://github.com/DonHeidi',
    ]);
  });

  test('carries no page-specific data, so both sites can emit it identically', () => {
    const node = person('en-us');
    expect('knowsAbout' in node).toBe(false);
    expect('hasOccupation' in node).toBe(false);
  });

  test('en and de differ only in jobTitle', () => {
    const en = { ...person('en-us') };
    const de = { ...person('de-de') };
    delete en.jobTitle;
    delete de.jobTitle;
    expect(en).toEqual(de);
  });
});

describe('graph', () => {
  test('wraps nodes in a single @context/@graph envelope', () => {
    expect(graph({ '@type': 'WebPage' })).toEqual({
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebPage' }],
    });
  });

  test('drops null and undefined nodes so callers can inline conditionals', () => {
    expect((graph({ '@type': 'WebPage' }, null, undefined)['@graph'] as unknown[]).length).toBe(1);
  });

  test('ref produces a bare @id reference', () => {
    expect(ref(PERSON_ID)).toEqual({ '@id': PERSON_ID });
  });
});
