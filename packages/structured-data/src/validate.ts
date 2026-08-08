import { PERSON_ID } from './person';
import type { Node } from './types';

const FORBIDDEN_TYPES = ['ProfessionalService', 'LocalBusiness', 'PostalAddress'];
const FORBIDDEN_KEYS = ['priceRange', 'address', 'streetAddress'];

export function validateGraph(input: unknown, opts: { path: string }): string[] {
  const errors: string[] = [];
  const at = (message: string) => `${opts.path}: ${message}`;

  if (typeof input !== 'object' || input === null) return [at('not a JSON object')];
  const doc = input as Record<string, unknown>;

  if (doc['@context'] !== 'https://schema.org') errors.push(at('missing or wrong @context'));
  if (!Array.isArray(doc['@graph'])) return [...errors, at('missing @graph array')];

  const nodes = doc['@graph'] as Node[];

  const people = nodes.filter((n) => n['@id'] === PERSON_ID && n['@type'] === 'Person');
  if (people.length !== 1) {
    errors.push(at(`expected exactly one Person node with ${PERSON_ID}, found ${people.length}`));
  }

  // Every @id defined anywhere in the graph, including nested nodes.
  const defined = new Set<string>();
  walk(nodes, (node) => {
    const id = node['@id'];
    if (typeof id === 'string' && Object.keys(node).length > 1) defined.add(id);
  });

  walk(nodes, (node) => {
    const type = node['@type'];
    if (typeof type === 'string' && FORBIDDEN_TYPES.includes(type)) {
      errors.push(at(`forbidden @type "${type}"`));
    }

    for (const key of Object.keys(node)) {
      if (FORBIDDEN_KEYS.includes(key)) errors.push(at(`forbidden key "${key}"`));
      const value = node[key];
      if (typeof value === 'string' && value.trim() === '') {
        errors.push(at(`empty string on "${key}"`));
      }
      if (value === undefined) errors.push(at(`undefined value on "${key}"`));
    }

    // A bare {"@id": "..."} is a reference. It must resolve to a node defined
    // in this graph, or be one of the stable ids that legitimately live on
    // another page of the same site.
    const id = node['@id'];
    if (typeof id === 'string' && Object.keys(node).length === 1) {
      if (!defined.has(id) && !isCrossPage(id)) {
        errors.push(at(`dangling reference to ${id}`));
      }
    }

    if (type === 'Offer') {
      if (typeof node.name !== 'string' || !node.name) errors.push(at('Offer without a name'));
      const spec = node.priceSpecification as Node | undefined;
      if (spec) {
        if (typeof spec.minPrice !== 'number') errors.push(at(`Offer "${node.name}": non-numeric minPrice`));
        if (typeof spec.priceCurrency !== 'string') errors.push(at(`Offer "${node.name}": missing priceCurrency`));
        if ('price' in spec) errors.push(at(`Offer "${node.name}": use minPrice, not price`));
      }
    }
  });

  return errors;
}

/** Ids that legitimately live on another page of the same site: the person, the
 *  website, the blog, and any #service anchor. Anything else must be defined in
 *  the same graph, or it is a typo.
 *
 *  Both sites' origins must be covered: PERSON_ID always points at the .dev
 *  origin (the canonical identity is hosted there and referenced verbatim from
 *  .rocks — see packages/structured-data/src/person.ts), so a bare prefix check
 *  against ".dev" alone would silently let a typo'd .rocks id like
 *  "https://www.sebastian-heitmann.rocks/#personn" through while a real
 *  .rocks-origin cross-page id (there are none today, but the website/blog
 *  suffixes below are origin-relative) would wrongly be rejected on some future
 *  page. Checking against the literal known origins is precise either way.
 */
function isCrossPage(id: string): boolean {
  if (!id.startsWith('https://www.sebastian-heitmann.dev') && !id.startsWith('https://www.sebastian-heitmann.rocks')) {
    return false;
  }
  return id.endsWith('/#person') || id.endsWith('/#website')
    || id.endsWith('-blog') || id.endsWith('#service');
}

function walk(value: unknown, visit: (node: Node) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (typeof value !== 'object' || value === null) return;
  const node = value as Node;
  visit(node);
  for (const child of Object.values(node)) walk(child, visit);
}
