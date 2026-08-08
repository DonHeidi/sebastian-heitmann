import { describe, expect, test } from 'bun:test';
import {
  PERSON_ID, blog, blogPosting, creativeWork, itemList, profilePage,
  personOccupations, personKnowsAbout, siteId,
} from '../src/index';

describe('blogPosting', () => {
  test('author and publisher are the same single person, by reference', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
    });
    expect(node.author).toEqual({ '@id': PERSON_ID });
    expect(node.publisher).toEqual({ '@id': PERSON_ID });
  });

  test('never inlines an anonymous Organization publisher', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
    });
    expect(JSON.stringify(node)).not.toContain('Organization');
  });

  test('joins keywords and links back to its blog', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
      keywords: ['astro', 'seo'], blogId: `${siteId('dev')}-blog`,
    });
    expect(node.keywords).toBe('astro, seo');
    expect(node.isPartOf).toEqual({ '@id': `${siteId('dev')}-blog` });
  });

  test('omits dateModified when the article was never revised', () => {
    const node = blogPosting({
      url: 'https://www.sebastian-heitmann.dev/articles/x/',
      headline: 'X', description: 'd', datePublished: '2026-01-01', locale: 'en-us',
    });
    expect('dateModified' in node).toBe(false);
  });
});

describe('creativeWork', () => {
  test('is created by the one person and carries its portfolio facts', () => {
    const node = creativeWork({
      url: 'https://www.sebastian-heitmann.rocks/cases/blickwerk/',
      name: 'Blickwerk', description: 'd', dateCreated: '2025-03-01',
      keywords: ['Astro', 'TypeScript'], genre: 'case-study', locale: 'en-us',
    });
    expect(node.creator).toEqual({ '@id': PERSON_ID });
    expect(node.genre).toBe('case-study');
    expect(node.keywords).toBe('Astro, TypeScript');
    expect(node.dateCreated).toBe('2025-03-01');
  });
});

describe('itemList', () => {
  test('numbers entries from one and carries urls', () => {
    const node = itemList([
      { url: 'https://www.sebastian-heitmann.dev/web-development/', name: 'Web Development' },
      { url: 'https://www.sebastian-heitmann.dev/cv/', name: 'CV' },
    ]);
    expect(node['@type']).toBe('ItemList');
    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Web Development', url: 'https://www.sebastian-heitmann.dev/web-development/' },
      { '@type': 'ListItem', position: 2, name: 'CV', url: 'https://www.sebastian-heitmann.dev/cv/' },
    ]);
  });
});

describe('profilePage and personOccupations', () => {
  test('the profile page points at the canonical person', () => {
    const node = profilePage({
      url: 'https://www.sebastian-heitmann.dev/cv/', title: 'CV',
      description: 'd', site: 'dev', locale: 'en-us',
    });
    expect(node['@type']).toBe('ProfilePage');
    expect(node.mainEntity).toEqual({ '@id': PERSON_ID });
  });

  test('occupations are a partial node that merges into the person by @id', () => {
    const node = personOccupations([
      { role: 'Fractional CTO', company: 'Independent' },
      { role: 'Sabbatical' },
    ]);
    expect(node['@id']).toBe(PERSON_ID);
    expect(node['@type']).toBeUndefined();
    expect(node.hasOccupation).toEqual([
      { '@type': 'OrganizationRole', roleName: 'Fractional CTO', namedPosition: 'Independent' },
      { '@type': 'Role', roleName: 'Sabbatical' },
    ]);
  });

  test('capabilities are also a partial node, so person() stays identical everywhere', () => {
    const node = personKnowsAbout(['System Architecture', 'Design Sprints']);
    expect(node).toEqual({
      '@id': PERSON_ID,
      knowsAbout: ['System Architecture', 'Design Sprints'],
    });
  });
});
