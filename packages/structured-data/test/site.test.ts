import { describe, expect, test } from 'bun:test';
import { PERSON_ID, website, webPage, breadcrumbs, siteId } from '../src/index';

describe('website', () => {
  test('is about and published by the one person, by reference', () => {
    const node = website('dev', 'en-us', 'Fractional CTO services');
    expect(node.about).toEqual({ '@id': PERSON_ID });
    expect(node.publisher).toEqual({ '@id': PERSON_ID });
  });

  test('each domain gets its own id and description', () => {
    expect(siteId('dev')).toBe('https://www.sebastian-heitmann.dev/#website');
    expect(siteId('rocks')).toBe('https://www.sebastian-heitmann.rocks/#website');
    expect(website('rocks', 'en-us', 'Portfolio of work').description).toBe('Portfolio of work');
  });

  test('carries the BCP-47 tag for the locale', () => {
    expect(website('dev', 'de-de', 'x').inLanguage).toBe('de-DE');
    expect(website('dev', 'en-us', 'x').inLanguage).toBe('en-US');
  });
});

describe('webPage', () => {
  test('is part of its site and identified by its own url', () => {
    const node = webPage({
      url: 'https://www.sebastian-heitmann.dev/cv/',
      title: 'CV', description: 'd', site: 'dev', locale: 'en-us',
    });
    expect(node['@id']).toBe('https://www.sebastian-heitmann.dev/cv/');
    expect(node.isPartOf).toEqual({ '@id': siteId('dev') });
    expect(node['@type']).toBe('WebPage');
  });

  test('accepts a narrower page type', () => {
    const node = webPage({
      url: 'https://www.sebastian-heitmann.rocks/', title: 'Work',
      description: 'd', site: 'rocks', locale: 'en-us', type: 'CollectionPage',
    });
    expect(node['@type']).toBe('CollectionPage');
  });
});

describe('breadcrumbs', () => {
  test('returns null on a home page, which has nothing to trail', () => {
    expect(breadcrumbs({ pathname: '/', title: 'Home', site: 'dev', locale: 'en-us' })).toBeNull();
    expect(breadcrumbs({ pathname: '/de-de/', title: 'Start', site: 'dev', locale: 'de-de' })).toBeNull();
  });

  test('trails Home > leaf for a top-level page', () => {
    const node = breadcrumbs({ pathname: '/cv/', title: 'CV', site: 'dev', locale: 'en-us' })!;
    expect(node['@type']).toBe('BreadcrumbList');
    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.sebastian-heitmann.dev/' },
      { '@type': 'ListItem', position: 2, name: 'CV' },
    ]);
  });

  test('includes the intermediate segment for a nested page whose route is declared', () => {
    const node = breadcrumbs({
      pathname: '/articles/some-post/', title: 'Some Post', site: 'dev', locale: 'en-us',
      segments: { articles: { label: 'Articles', routed: true } },
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(3);
    expect(items[1]).toEqual({
      '@type': 'ListItem', position: 2, name: 'Articles',
      item: 'https://www.sebastian-heitmann.dev/articles/',
    });
    expect(items[2]).toEqual({ '@type': 'ListItem', position: 3, name: 'Some Post' });
  });

  test('fails safe: an undeclared intermediate segment gets a name-only, title-cased crumb, never a guessed URL', () => {
    // Regression for apps/rocks emitting `item: ".../cases/"` with no
    // cases/index.astro behind it — a real BreadcrumbList 404 in production.
    const node = breadcrumbs({
      pathname: '/cases/blickwerk/', title: 'Blickwerk', site: 'rocks', locale: 'en-us',
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(3);
    expect(items[1]).toEqual({ '@type': 'ListItem', position: 2, name: 'Cases' });
    expect('item' in items[1]!).toBe(false);
  });

  test('a segment declared routed without a label still title-cases the fallback name', () => {
    const node = breadcrumbs({
      pathname: '/cases/blickwerk/', title: 'Blickwerk', site: 'rocks', locale: 'en-us',
      segments: { cases: { routed: true } },
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items[1]).toEqual({
      '@type': 'ListItem', position: 2, name: 'Cases',
      item: 'https://www.sebastian-heitmann.rocks/cases/',
    });
  });

  test('a segment with a label but not routed gets the label with no item', () => {
    const node = breadcrumbs({
      pathname: '/cases/blickwerk/', title: 'Blickwerk', site: 'rocks', locale: 'en-us',
      segments: { cases: { label: 'Cases' } },
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items[1]).toEqual({ '@type': 'ListItem', position: 2, name: 'Cases' });
    expect('item' in items[1]!).toBe(false);
  });

  test('a nested German path gets a localized intermediate label, not the English title-cased slug', () => {
    // Regression: titleCase(segment) used to derive the crumb from the raw
    // URL slug with no reference to locale, so a German page emitted the
    // English 'Articles' crumb even though its own nav says 'Artikel'. No
    // prior test exercised a nested German path at all.
    const node = breadcrumbs({
      pathname: '/de-de/articles/irgendein-post/', title: 'Irgendein Post', site: 'dev', locale: 'de-de',
      segments: { articles: { label: 'Artikel', routed: true } },
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(3);
    expect(items[0]).toEqual({
      '@type': 'ListItem', position: 1, name: 'Start',
      item: 'https://www.sebastian-heitmann.dev/de-de/',
    });
    expect(items[1]).toEqual({
      '@type': 'ListItem', position: 2, name: 'Artikel',
      item: 'https://www.sebastian-heitmann.dev/de-de/articles/',
    });
    expect(items[2]).toEqual({ '@type': 'ListItem', position: 3, name: 'Irgendein Post' });
  });

  test('strips the locale prefix so German trails do not carry a de-de crumb', () => {
    const node = breadcrumbs({
      pathname: '/de-de/lebenslauf/', title: 'Lebenslauf', site: 'dev', locale: 'de-de',
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(2);
    expect(items[0]).toEqual({
      '@type': 'ListItem', position: 1, name: 'Start',
      item: 'https://www.sebastian-heitmann.dev/de-de/',
    });
  });

  test('the last crumb carries no item, per Google guidance', () => {
    const node = breadcrumbs({ pathname: '/cv/', title: 'CV', site: 'dev', locale: 'en-us' })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items[items.length - 1]!.item).toBeUndefined();
  });

  test('uses the explicit label for the leaf crumb instead of the full <title>', () => {
    // Finding C: `title` is a <title> tag value dressed up with a site-name
    // suffix ("CV — Sebastian Heitmann"), which Google renders verbatim as
    // the SERP breadcrumb. `label` lets a caller supply a short crumb name.
    const node = breadcrumbs({
      pathname: '/cv/', title: 'CV — Sebastian Heitmann', label: 'CV', site: 'dev', locale: 'en-us',
    })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items[items.length - 1]).toEqual({ '@type': 'ListItem', position: 2, name: 'CV' });
  });

  test('falls back to the full title when no label is given', () => {
    const node = breadcrumbs({ pathname: '/cv/', title: 'CV — Sebastian Heitmann', site: 'dev', locale: 'en-us' })!;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items[items.length - 1]!.name).toBe('CV — Sebastian Heitmann');
  });
});
