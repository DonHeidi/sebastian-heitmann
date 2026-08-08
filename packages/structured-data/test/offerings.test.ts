import { describe, expect, test } from 'bun:test';
import { PERSON_ID, offer, offerCatalog, service } from '../src/index';

describe('offer', () => {
  test('a "from" price becomes minPrice, never price', () => {
    const node = offer({ name: 'Kompakt', priceMin: 549, currency: 'EUR' });
    expect(node.priceSpecification).toEqual({
      '@type': 'PriceSpecification', minPrice: 549, priceCurrency: 'EUR',
    });
    expect(node.price).toBeUndefined();
  });

  test('a monthly price becomes a UnitPriceSpecification per month', () => {
    const node = offer({ name: 'Compact Support', priceMin: 39, currency: 'EUR', billing: 'monthly' });
    expect(node.priceSpecification).toEqual({
      '@type': 'UnitPriceSpecification',
      minPrice: 39,
      priceCurrency: 'EUR',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
    });
  });

  test('an hourly price uses the HUR unit code', () => {
    const node = offer({ name: 'Advise', priceMin: 180, currency: 'EUR', billing: 'hourly' });
    const spec = node.priceSpecification as Record<string, unknown>;
    expect((spec.referenceQuantity as Record<string, unknown>).unitCode).toBe('HUR');
  });

  test('a net price records that VAT is excluded', () => {
    const node = offer({ name: 'AI Prototype', priceMin: 4200, currency: 'EUR', vatIncluded: false });
    expect((node.priceSpecification as Record<string, unknown>).valueAddedTaxIncluded).toBe(false);
  });

  test('an unpriced offering still gets a node, with no price at all', () => {
    const node = offer({ name: 'Setup & Go-live', description: 'Everything needed to go online.' });
    expect(node['@type']).toBe('Offer');
    expect(node.name).toBe('Setup & Go-live');
    expect(node.description).toBe('Everything needed to go online.');
    expect(node.priceSpecification).toBeUndefined();
  });

  test('a priceMin without a currency is a programming error', () => {
    expect(() => offer({ name: 'Broken', priceMin: 100 })).toThrow(/currency/i);
  });
});

describe('service', () => {
  test('is provided by the one person, by reference', () => {
    const node = service({ id: 'https://www.sebastian-heitmann.dev/web-development/#service', name: 'Web Development' });
    expect(node.provider).toEqual({ '@id': PERSON_ID });
    expect(node['@type']).toBe('Service');
  });

  test('carries a nested catalog when one is supplied', () => {
    const node = service({
      id: 'https://www.sebastian-heitmann.dev/web-development/#service',
      name: 'Web Development',
      catalog: offerCatalog('Web Development', [
        offerCatalog('Packages', [offer({ name: 'Kompakt', priceMin: 549, currency: 'EUR' })]),
      ]),
    });
    const catalog = node.hasOfferCatalog as Record<string, unknown>;
    expect(catalog['@type']).toBe('OfferCatalog');
    expect((catalog.itemListElement as unknown[]).length).toBe(1);
  });

  test('omits hasOfferCatalog entirely when nothing is published', () => {
    const node = service({
      id: 'https://www.sebastian-heitmann.dev/technical-project-management/#service',
      name: 'Technical Project Management',
    });
    expect('hasOfferCatalog' in node).toBe(false);
  });
});
