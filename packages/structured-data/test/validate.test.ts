import { describe, expect, test } from 'bun:test';
import { PERSON_ID, person, validateGraph } from '../src/index';

// The real person() output, not a hand-rolled stand-in: validateGraph now
// checks the Person node against the canonical shape (Finding 5), so a fixture
// missing jobTitle/url/email/knowsLanguage/sameAs would fail that check.
const valid = {
  '@context': 'https://schema.org',
  '@graph': [
    person('en-us'),
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

  test('rejects a bare "price" key anywhere, not just inside an Offer priceSpecification', () => {
    const onOffer = { ...valid, '@graph': [...valid['@graph'], { '@type': 'Offer', name: 'X', price: 549 }] };
    const errors = validateGraph(onOffer, { path: 'x' }).join(' ');
    expect(errors).toMatch(/"price"/);

    const elsewhere = { ...valid, '@graph': [...valid['@graph'], { '@type': 'Service', name: 'X', price: 549 }] };
    expect(validateGraph(elsewhere, { path: 'x' }).join(' ')).toMatch(/"price"/);
  });

  test('rejects a duplicate @id carrying two different @type values', () => {
    const url = 'https://www.sebastian-heitmann.dev/cv';
    const bad = {
      ...valid,
      '@graph': [
        ...valid['@graph'],
        { '@type': 'WebPage', '@id': url, name: 'CV' },
        { '@type': 'ProfilePage', '@id': url, name: 'CV' },
      ],
    };
    const errors = validateGraph(bad, { path: 'x' }).join(' ');
    expect(errors).toMatch(/multiple @type/);
    expect(errors).toMatch(/WebPage/);
    expect(errors).toMatch(/ProfilePage/);
  });

  test('does not flag a partial merge node (no @type) sharing an @id with a typed node', () => {
    const url = 'https://www.sebastian-heitmann.dev/cv';
    const ok = {
      ...valid,
      '@graph': [
        ...valid['@graph'],
        { '@type': 'ProfilePage', '@id': url, name: 'CV' },
        { '@id': url, mainEntity: { '@id': PERSON_ID } }, // profileMainEntity — no @type
      ],
    };
    expect(validateGraph(ok, { path: 'x' })).toEqual([]);
  });

  test('rejects Organization, but not OrganizationRole', () => {
    const bad = { ...valid, '@graph': [...valid['@graph'], { '@type': 'Organization', name: 'X' }] };
    expect(validateGraph(bad, { path: 'x' }).join(' ')).toMatch(/forbidden @type "Organization"/);

    const ok = {
      ...valid,
      '@graph': [
        ...valid['@graph'],
        { '@id': PERSON_ID, hasOccupation: [{ '@type': 'OrganizationRole', roleName: 'CTO' }] },
      ],
    };
    expect(validateGraph(ok, { path: 'x' })).toEqual([]);
  });

  test('rejects a typo\'d blog cross-page reference instead of silently accepting it', () => {
    const bad = {
      ...valid,
      '@graph': [
        ...valid['@graph'],
        { '@type': 'BlogPosting', isPartOf: { '@id': 'https://www.sebastian-heitmann.dev/#wbsite-blog' } },
      ],
    };
    expect(validateGraph(bad, { path: 'x' })[0]).toMatch(/dangling reference to .*#wbsite-blog/);
  });

  test('accepts the real blog cross-page reference', () => {
    const ok = {
      ...valid,
      '@graph': [
        ...valid['@graph'],
        { '@type': 'BlogPosting', isPartOf: { '@id': 'https://www.sebastian-heitmann.dev/#website-blog' } },
      ],
    };
    expect(validateGraph(ok, { path: 'x' })).toEqual([]);
  });

  test('rejects a Person node whose @id/@type match but whose content diverges from person()', () => {
    const bad = {
      ...valid,
      '@graph': [
        { ...person('en-us'), name: 'Someone Else' },
        valid['@graph'][1],
      ],
    };
    expect(validateGraph(bad, { path: 'x' })[0]).toMatch(/canonical person\(\) output/);
  });

  test('accepts either locale variant of the canonical Person node', () => {
    const deVariant = { ...valid, '@graph': [person('de-de'), valid['@graph'][1]] };
    expect(validateGraph(deVariant, { path: 'x' })).toEqual([]);
  });
});
