import { offer, offerCatalog, service, type Node } from '@sh/structured-data';
import type { Locale } from '../i18n/utils';
import type { Strings } from '../i18n/types';

const ORIGIN = 'https://www.sebastian-heitmann.dev';

export type ServiceKey = 'umbrella' | 'web' | 'tpm' | 'ai';

/** The single declaration of where each service lives. Adding a fourth offering
 *  means one entry here plus its page: it cannot be forgotten in the home list. */
export const SERVICE_PATHS: Record<ServiceKey, Record<Locale, string>> = {
  umbrella: { 'en-us': '/', 'de-de': '/de-de/' },
  web: { 'en-us': '/web-development/', 'de-de': '/de-de/web-entwicklung/' },
  tpm: {
    'en-us': '/technical-project-management/',
    'de-de': '/de-de/technisches-projektmanagement/',
  },
  ai: { 'en-us': '/ai-process-automation/', 'de-de': '/de-de/ki-prozess-automation/' },
};

/** Services that have their own page, in the order the home page lists them. */
const LISTED: ServiceKey[] = ['web', 'tpm', 'ai'];

export function serviceId(key: ServiceKey, locale: Locale): string {
  return `${ORIGIN}${SERVICE_PATHS[key][locale]}#service`;
}

export function serviceUrl(key: ServiceKey, locale: Locale): string {
  return `${ORIGIN}${SERVICE_PATHS[key][locale]}`;
}

function serviceName(key: ServiceKey, s: Strings): string {
  switch (key) {
    case 'umbrella': return s.meta.title;
    case 'web': return s.webProjects.meta.title;
    case 'tpm': return s.technicalProjectManagement.meta.title;
    case 'ai': return s.aiProcessAutomation.meta.title;
  }
}

function catalogFor(key: ServiceKey, s: Strings): Node | undefined {
  switch (key) {
    case 'umbrella':
      // Engagement models: how you buy, not separately priced products. The
      // billing arrangement is stated in the rendered description; no figures
      // are published, so no price node.
      return offerCatalog(s.proof.engagementLabel, s.proof.engagements.map((e) =>
        offer({ name: e.model, description: e.description })
      ));

    case 'web':
      return offerCatalog(s.webProjects.meta.title, [
        offerCatalog(s.webProjects.packages.eyebrow, s.webProjects.packages.items.map((i) =>
          offer({
            name: i.name, description: i.audience,
            priceMin: i.priceMin, currency: i.currency,
            vatIncluded: i.vatIncluded, billing: i.billing,
          })
        )),
        offerCatalog(s.webProjects.addons.eyebrow, s.webProjects.addons.items.map((i) =>
          offer({
            name: i.name, description: i.description,
            priceMin: i.priceMin, currency: i.currency,
            vatIncluded: i.vatIncluded, billing: i.billing,
          })
        )),
      ]);

    case 'ai':
      return offerCatalog(s.aiProcessAutomation.offerings.eyebrow,
        s.aiProcessAutomation.offerings.items.map((i) =>
          offer({
            name: i.name, description: i.tagline,
            priceMin: i.priceMin, currency: i.currency,
            vatIncluded: i.vatIncluded, billing: i.billing,
          })
        ));

    case 'tpm':
      // Billed hourly with no published rate. Inventing one would be a content
      // mismatch, so this service ships without a catalog.
      return undefined;
  }
}

export function serviceNode(key: ServiceKey, locale: Locale, s: Strings): Node {
  return service({
    id: serviceId(key, locale),
    name: serviceName(key, s),
    areaServed: ['DE', 'AT', 'CH'],
    catalog: catalogFor(key, s),
  });
}

export function serviceListItems(locale: Locale, s: Strings): Array<{ url: string; name: string }> {
  return LISTED.map((key) => ({ url: serviceUrl(key, locale), name: serviceName(key, s) }));
}
