import { describe, expect, test } from 'bun:test';
import { enUs } from '../src/i18n/en-us';
import { deDe } from '../src/i18n/de-de';
import { serviceNode, serviceListItems, SERVICE_PATHS } from '../src/data/services';

describe('serviceNode', () => {
  test('web development publishes seven offers across two groups', () => {
    const node = serviceNode('web', 'en-us', enUs);
    const groups = (node.hasOfferCatalog as any).itemListElement;
    expect(groups.length).toBe(2);
    const count = groups.reduce((n: number, g: any) => n + g.itemListElement.length, 0);
    expect(count).toBe(7);
  });

  test('web development prices survive into the offers', () => {
    const node = serviceNode('web', 'en-us', enUs);
    const packages = (node.hasOfferCatalog as any).itemListElement[0].itemListElement;
    expect(packages.map((o: any) => o.priceSpecification.minPrice)).toEqual([549, 749, 949]);
  });

  test('the unpriced add-on is present and has no price node', () => {
    const node = serviceNode('web', 'en-us', enUs);
    const addons = (node.hasOfferCatalog as any).itemListElement[1].itemListElement;
    const setup = addons.find((o: any) => o.name === 'Setup & Go-live');
    expect(setup).toBeDefined();
    expect(setup.priceSpecification).toBeUndefined();
  });

  test('AI publishes three offers, two of them net-priced', () => {
    const offers = (serviceNode('ai', 'en-us', enUs).hasOfferCatalog as any).itemListElement;
    expect(offers.length).toBe(3);
    expect(offers[0].priceSpecification.valueAddedTaxIncluded).toBe(false);
    expect(offers[2].priceSpecification).toBeUndefined();
  });

  test('technical project management has no catalog: no rate is published', () => {
    expect('hasOfferCatalog' in serviceNode('tpm', 'en-us', enUs)).toBe(false);
  });

  test('the umbrella carries the three engagement models, unpriced', () => {
    const offers = (serviceNode('umbrella', 'en-us', enUs).hasOfferCatalog as any).itemListElement;
    expect(offers.map((o: any) => o.name)).toEqual(['Advise', 'Deliver', 'Partner']);
    for (const o of offers) expect(o.priceSpecification).toBeUndefined();
  });

  test('German ids live on German URLs', () => {
    expect(serviceNode('web', 'de-de', deDe)['@id'])
      .toBe('https://www.sebastian-heitmann.dev/de-de/web-entwicklung/#service');
  });

  test('every service is reachable from the home list', () => {
    expect(serviceListItems('en-us', enUs).map((i) => i.url)).toEqual([
      'https://www.sebastian-heitmann.dev/web-development/',
      'https://www.sebastian-heitmann.dev/technical-project-management/',
      'https://www.sebastian-heitmann.dev/ai-process-automation/',
    ]);
    expect(Object.keys(SERVICE_PATHS)).toContain('umbrella');
  });
});
