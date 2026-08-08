import { compact, ref } from './graph';
import { PERSON_ID } from './person';
import type { Node } from './types';

export type Billing = 'one-time' | 'monthly' | 'hourly' | 'per-cycle';

export type OfferInput = {
  name: string;
  description?: string;
  /** Published "from" price. Omit when the page publishes no figure: the offer
   *  still gets a node, it just gets no price node. */
  priceMin?: number;
  currency?: string;
  /** false when the copy says "net". Omitted when the copy is silent. */
  vatIncluded?: boolean;
  billing?: Billing;
};

/** UN/CEFACT codes. Only the recurring billings need one. */
const UNIT_CODE: Partial<Record<Billing, string>> = { monthly: 'MON', hourly: 'HUR' };

export function offer(input: OfferInput): Node {
  if (input.priceMin !== undefined && (!input.currency || !input.currency.trim())) {
    throw new Error(`offer "${input.name}": priceMin requires a currency`);
  }

  return compact({
    '@type': 'Offer',
    name: input.name,
    description: input.description,
    priceSpecification: input.priceMin === undefined ? undefined : priceSpec(input),
  });
}

function priceSpec(input: OfferInput): Node {
  const unitCode = input.billing ? UNIT_CODE[input.billing] : undefined;

  return compact({
    '@type': unitCode ? 'UnitPriceSpecification' : 'PriceSpecification',
    minPrice: input.priceMin,
    priceCurrency: input.currency,
    valueAddedTaxIncluded: input.vatIncluded,
    referenceQuantity: unitCode
      ? { '@type': 'QuantitativeValue', value: 1, unitCode }
      : undefined,
  });
}

export function offerCatalog(name: string, items: Node[]): Node {
  return compact({ '@type': 'OfferCatalog', name, itemListElement: items });
}

export function service(input: {
  id: string;
  name: string;
  description?: string;
  serviceType?: string;
  areaServed?: string[];
  catalog?: Node;
}): Node {
  return compact({
    '@type': 'Service',
    '@id': input.id,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    areaServed: input.areaServed,
    provider: ref(PERSON_ID),
    hasOfferCatalog: input.catalog,
  });
}
