import { describe, expect, test } from 'bun:test';
import { PERSON_ID, person, graph, ref } from '../src/index';

describe('person', () => {
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
