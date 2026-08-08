export type Locale = 'en-us' | 'de-de';

/** A schema.org node. Deliberately loose: schema.org is open-world and every
 *  builder in this package is responsible for its own shape. */
export type Node = Record<string, unknown>;

/** A by-@id reference to a node defined elsewhere in the graph, or on another
 *  page. Referencing rather than re-describing is what keeps the entity single. */
export type Ref = { '@id': string };
