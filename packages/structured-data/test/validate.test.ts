import { describe, expect, test } from 'bun:test';
import { PERSON_ID, validateGraph } from '../src/index';

const valid = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': PERSON_ID, name: 'Sebastian Heitmann' },
    { '@type': 'WebSite', '@id': 'https://www.sebastian-heitmann.dev/#website', about: { '@id': PERSON_ID } },
  ],
};

describe('validateGraph', () => {
  test('accepts a well-formed graph', () => {
    expect(validateGraph(valid, { path: 'index.html' })).toEqual([]);
  });

  test('rejects a missing @context or @graph', () => {
    expect(validateGraph({ '@graph': [] }, { path: 'x' })[0]).toMatch(/@context/);
    expect(validateGraph({ '@context': 'https://schema.org' }, { path: 'x' })[0]).toMatch(/@graph/);
  });

  test('rejects zero or duplicate person nodes', () => {
    expect(validateGraph({ ...valid, '@graph': [valid['@graph'][1]] }, { path: 'x' })[0])
      .toMatch(/exactly one/);
    expect(validateGraph({ ...valid, '@graph': [...valid['@graph'], valid['@graph'][0]] }, { path: 'x' })[0])
      .toMatch(/exactly one/);
  });

  test('rejects the deleted vocabulary', () => {
    const bad = { ...valid, '@graph': [...valid['@graph'], { '@type': 'ProfessionalService', priceRange: '$$' }] };
    const errors = validateGraph(bad, { path: 'x' }).join(' ');
    expect(errors).toMatch(/ProfessionalService/);
    expect(errors).toMatch(/priceRange/);
  });

  test('rejects a dangling internal reference', () => {
    const bad = {
      ...valid,
      '@graph': [...valid['@graph'], { '@type': 'Service', provider: { '@id': 'https://www.sebastian-heitmann.dev/#nope' } }],
    };
    expect(validateGraph(bad, { path: 'x' })[0]).toMatch(/#nope/);
  });

  test('rejects an offer with no name, or a price with no currency', () => {
    const noName = { ...valid, '@graph': [...valid['@graph'], { '@type': 'Offer' }] };
    expect(validateGraph(noName, { path: 'x' })[0]).toMatch(/name/);

    const noCurrency = {
      ...valid,
      '@graph': [...valid['@graph'], {
        '@type': 'Offer', name: 'X',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: 549 },
      }],
    };
    expect(validateGraph(noCurrency, { path: 'x' })[0]).toMatch(/priceCurrency/);
  });

  test('rejects an empty string field', () => {
    const bad = { ...valid, '@graph': [...valid['@graph'], { '@type': 'WebPage', name: '' }] };
    expect(validateGraph(bad, { path: 'x' })[0]).toMatch(/empty/);
  });
});
