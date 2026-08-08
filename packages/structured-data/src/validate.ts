import { PERSON_ID, person } from './person';
import type { Node } from './types';

// Finding 3: Organization is forbidden everywhere — the plan's global
// constraint is "no Organization node anywhere" (an inlined anonymous
// Organization publisher was a motivating defect this package replaced).
// Exact string equality only: a type like OrganizationRole would contain the
// substring "Organization" but must never match this list.
const FORBIDDEN_TYPES = ['ProfessionalService', 'LocalBusiness', 'PostalAddress', 'Organization'];
// Finding 1: `price` asserts an exact cost; every price this site publishes is
// a "from" price via priceSpecification.minPrice, so a bare `price` key is
// forbidden regardless of which node it appears on, not just inside an Offer's
// priceSpecification.
const FORBIDDEN_KEYS = ['priceRange', 'address', 'streetAddress', 'price'];

// The two locale variants the shared Person builder can produce. Both sites
// call this exact function with only a locale, and TypeScript's signature
// (`person(locale: Locale): Node`) admits no other parameter, so these are the
// only two shapes a correct call site can ever emit.
const CANONICAL_PERSON_JSON = new Set([
  JSON.stringify(person('en-us')),
  JSON.stringify(person('de-de')),
]);

export function validateGraph(input: unknown, opts: { path: string }): string[] {
  const errors: string[] = [];
  const at = (message: string) => `${opts.path}: ${message}`;

  if (typeof input !== 'object' || input === null) return [at('not a JSON object')];
  const doc = input as Record<string, unknown>;

  if (doc['@context'] !== 'https://schema.org') errors.push(at('missing or wrong @context'));
  if (!Array.isArray(doc['@graph'])) return [...errors, at('missing @graph array')];

  const nodes = doc['@graph'] as Node[];

  // Finding 2: this must walk the whole graph, not just filter the top-level
  // @graph array. A Person node nested inside another node (e.g. an inline
  // guest author's `{"@type":"Person","@id":PERSON_ID,"name":"Guest"}` on a
  // BlogPosting) carries PERSON_ID but never appears at the top level, so a
  // shallow filter is blind to it — the gate would report "OK" while two
  // conflicting bodies for one @id ship on the same page, which is exactly
  // the defect this check exists to catch.
  const people: Node[] = [];
  walk(nodes, (node) => {
    if (node['@id'] === PERSON_ID && node['@type'] === 'Person') people.push(node);
  });
  if (people.length !== 1) {
    errors.push(at(`expected exactly one Person node with ${PERSON_ID}, found ${people.length}`));
  } else if (!CANONICAL_PERSON_JSON.has(JSON.stringify(people[0]))) {
    // Finding 5: the plan's central invariant is that the Person node is
    // byte-identical on both domains. A per-page structural check cannot
    // compare across a dist tree it never sees (dev's build never sees
    // rocks' dist, and vice versa), so instead this compares the one Person
    // node this page emits against the only two shapes person() can ever
    // legitimately produce, using the same JSON.stringify(...) call both
    // layouts use to serialize the <script> tag. If every page on both sites
    // passes this, every page's Person node is byte-identical to one of these
    // two canonical strings, which makes them byte-identical to each other —
    // transitively closing the cross-site invariant without ever needing a
    // literal cross-dist diff.
    errors.push(at('Person node does not match the canonical person() output for either locale'));
  }

  // Finding 2: a duplicate @id carrying two different @type values (e.g. a
  // WebPage and a ProfilePage sharing one @id — the exact defect that shipped
  // on the CV pages in Task 8). Partial merge nodes (personKnowsAbout,
  // personOccupations, profileMainEntity) share an @id with a typed node but
  // carry no @type of their own, so they never enter this map — that sharing
  // is the deliberate merge-by-@id pattern and must stay legal.
  const typesById = new Map<string, Set<string>>();
  walk(nodes, (node) => {
    const id = node['@id'];
    const type = node['@type'];
    if (typeof id === 'string' && typeof type === 'string') {
      const seen = typesById.get(id) ?? new Set<string>();
      seen.add(type);
      typesById.set(id, seen);
    }
  });
  for (const [id, types] of typesById) {
    if (types.size > 1) {
      errors.push(at(`@id ${id} carries multiple @type values: ${[...types].sort().join(', ')}`));
    }
  }

  // Every @id that is actually *typed* somewhere in the graph — i.e. the id
  // of a real node, not a partial contributor. This is the same map built
  // above, just narrowed to its keys. Finding A: a node with no @type is
  // never itself the thing that "defines" an @id, no matter how many keys it
  // carries — it is either a bare reference ({"@id": "..."}) or a partial
  // node (personKnowsAbout, personOccupations, profileMainEntity) that
  // contributes fields to a node typed elsewhere in this same graph. Both
  // shapes must resolve to a typed id, or be one of the known cross-page ids.
  const typedIds = new Set(typesById.keys());

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

    // An untyped node carrying an @id is either a bare {"@id": "..."}
    // reference or a partial merge node (@id plus payload keys, no @type).
    // Either way it names an id it does not itself define, so that id must
    // resolve to a typed node somewhere in this graph, or be one of the
    // stable ids that legitimately live on another page of the same site.
    // A typed node's own @id is exempt: it defines itself.
    const id = node['@id'];
    if (typeof id === 'string' && typeof type !== 'string') {
      if (!typedIds.has(id) && !isCrossPage(id)) {
        errors.push(at(`dangling reference to ${id}`));
      }
    }

    if (type === 'Offer') {
      if (typeof node.name !== 'string' || !node.name) errors.push(at('Offer without a name'));
      const spec = node.priceSpecification as Node | undefined;
      if (spec) {
        if (typeof spec.minPrice !== 'number') errors.push(at(`Offer "${node.name}": non-numeric minPrice`));
        if (typeof spec.priceCurrency !== 'string') errors.push(at(`Offer "${node.name}": missing priceCurrency`));
      }
    }
  });

  return errors;
}

/** Ids that legitimately live on another page of the same site: the person, the
 *  website, the blog (one per locale), and any #service anchor. Anything else
 *  must be defined in the same graph, or it is a typo.
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
  // Every suffix here is the FULL expected suffix (mirrors blogId() in
  // content.ts: `${siteId(site)}-blog-${locale}` === `${origin}/#website-blog-${locale}`),
  // not a bare substring — a typo like "#wbsite-blog" or "#service-ish" must
  // still be reported dangling, the same way a typo'd "#personn" or
  // "#websites" is. The Blog node is locale-scoped (Finding B: en-us and
  // de-de are distinct entities), so both locale suffixes are listed
  // explicitly rather than matching "#website-blog" as a prefix.
  return id.endsWith('/#person') || id.endsWith('/#website')
    || id.endsWith('/#website-blog-en-us') || id.endsWith('/#website-blog-de-de')
    || id.endsWith('/#service');
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
