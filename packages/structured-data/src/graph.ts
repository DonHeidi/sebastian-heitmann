import type { Node, Ref } from './types';

export function ref(id: string): Ref {
  return { '@id': id };
}

/** Drop empty values so builders can pass optionals through unconditionally.
 *  An `undefined` that reaches JSON.stringify vanishes silently; an empty array
 *  or string does not, and ships as a meaningless claim. */
export function compact(node: Node): Node {
  const out: Node = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    out[key] = value;
  }
  return out;
}

export function graph(...nodes: Array<Node | null | undefined>): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is Node => node != null),
  };
}
