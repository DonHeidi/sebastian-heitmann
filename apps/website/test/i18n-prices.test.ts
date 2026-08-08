import { describe, expect, test } from 'bun:test';
import { enUs } from '../src/i18n/en-us';
import { deDe } from '../src/i18n/de-de';
import type { Strings } from '../src/i18n/types';

const locales: Array<[string, Strings]> = [['en-us', enUs], ['de-de', deDe]];

describe.each(locales)('%s prices', (_name, s) => {
  test('every web package publishes a structured minimum', () => {
    expect(s.webProjects.packages.items.map((i) => i.priceMin)).toEqual([549, 749, 949]);
    for (const item of s.webProjects.packages.items) {
      expect(item.currency).toBe('EUR');
      expect(item.billing).toBe('one-time');
    }
  });

  test('support add-ons are monthly, and Setup & Go-live stays unpriced', () => {
    const priced = s.webProjects.addons.items.filter((i) => i.priceMin !== undefined);
    expect(priced.map((i) => i.priceMin)).toEqual([39, 69, 99]);
    for (const item of priced) expect(item.billing).toBe('monthly');

    const unpriced = s.webProjects.addons.items.filter((i) => i.priceMin === undefined);
    expect(unpriced.length).toBe(1);
    expect(unpriced[0]!.price).toBeUndefined();
  });

  test('the two priced AI tiers are net, the third has no figure', () => {
    const items = s.aiProcessAutomation.offerings.items;
    expect(items.map((i) => i.priceMin)).toEqual([4200, 10990, undefined]);
    for (const item of items.slice(0, 2)) {
      expect(item.currency).toBe('EUR');
      expect(item.vatIncluded).toBe(false);
    }
  });

  test('a structured minimum never contradicts the rendered string', () => {
    const all = [
      ...s.webProjects.packages.items,
      ...s.webProjects.addons.items,
      ...s.aiProcessAutomation.offerings.items,
    ];
    for (const item of all) {
      if (item.priceMin === undefined) continue;
      const digits = (item.price ?? '').replace(/[^0-9]/g, '');
      expect(digits).toContain(String(item.priceMin));
    }
  });
});
