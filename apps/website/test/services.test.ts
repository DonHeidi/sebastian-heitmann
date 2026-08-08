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
    expect(offers[1].priceSpecification.valueAddedTaxIncluded).toBe(false);
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

  test('service names are clean noun phrases, not page titles', () => {
    const expected: Record<'en-us' | 'de-de', Record<'umbrella' | 'web' | 'tpm' | 'ai', string>> = {
      'en-us': {
        umbrella: 'Technology Consulting',
        web: 'Web Projects',
        tpm: 'Technical Project Management',
        ai: 'AI Products & Processes',
      },
      'de-de': {
        umbrella: 'Technologieberatung',
        web: 'Webprojekte',
        tpm: 'Technisches Projektmanagement',
        ai: 'KI-Produkte & Prozesse',
      },
    };
    for (const [locale, strings] of [['en-us', enUs], ['de-de', deDe]] as const) {
      for (const key of ['umbrella', 'web', 'tpm', 'ai'] as const) {
        const name = serviceNode(key, locale, strings).name as string;
        expect(name).toBe(expected[locale][key]);
        expect(name).not.toContain('Sebastian Heitmann');
      }
    }
  });

  test('no published name anywhere in the graph carries the site-name suffix', () => {
    // Walks every node recursively so it catches Service.name, every nested
    // OfferCatalog.name, and every Offer.name at once — a single line of copy
    // reverting to `meta.title` anywhere in the tree fails this, not just the
    // one property a narrower assertion happens to check.
    function collectNames(value: unknown, out: string[]): void {
      if (Array.isArray(value)) {
        for (const item of value) collectNames(item, out);
        return;
      }
      if (value && typeof value === 'object') {
        for (const [key, val] of Object.entries(value)) {
          if (key === 'name' && typeof val === 'string') out.push(val);
          collectNames(val, out);
        }
      }
    }

    for (const [locale, strings] of [['en-us', enUs], ['de-de', deDe]] as const) {
      for (const key of ['umbrella', 'web', 'tpm', 'ai'] as const) {
        const names: string[] = [];
        collectNames(serviceNode(key, locale, strings), names);
        expect(names.length).toBeGreaterThan(0);
        for (const name of names) expect(name).not.toContain('Sebastian Heitmann');
      }
    }
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
