import type { ReactNode } from 'react';
import type { Strings } from '../i18n/types';
import { AsteriskMark } from './asterisk-mark';

export interface CaseCardData {
  title: string;
  summary: string;
  kind: 'case-study' | 'project';
  role: string;
  stack: string[];
  links: { label: string; url: string }[];
  startDate: Date;
}

export interface CaseCardProps {
  data: CaseCardData;
  /** Detail-page href for case studies; ignored for kind === 'project'. */
  href: string;
  strings: Strings['cases'];
  /** 0-based position within its section; rendered as `01 /`. */
  index: number;
  /** Slotted `<DuotonePanel>` (slot="coverPanel") from the calling `.astro` page
   * (`.astro` components can't be rendered inside `.tsx`, and only a named slot
   * — not a plain prop — crosses that boundary); fills the square tile as the
   * album-cover art. Entries without one get the generated asterisk sleeve. */
  coverPanel?: ReactNode;
  /** Whether the entry actually has cover art. Must be passed explicitly:
   * Astro delivers `coverPanel` as a truthy (empty) node even when the page's
   * slot conditional is false, so the slot's truthiness can't be trusted. */
  hasCover: boolean;
}

/**
 * Album-cover case tile: a square sleeve where the artwork IS the card and the
 * copy is printed onto it — setlist number top-left, rotated stamp top-right,
 * Anton title over a bottom scrim. The whole tile links out via the stretched
 * anchor around the title (accessible name = title). `v8-duotone-host` on the
 * article re-triggers the duotone hover reveal from anywhere over the tile,
 * since the overlaid copy would otherwise swallow the pointer before it
 * reaches the `.v8-duotone` wrapper.
 */
export function CaseCard({ data, href, strings, index, coverPanel, hasCover }: CaseCardProps) {
  const external = data.kind === 'project' ? data.links[0] : undefined;
  const linkHref = data.kind === 'case-study' ? href : external?.url;
  return (
    <article className="reveal v8-duotone-host group @container relative aspect-square overflow-hidden border border-border bg-surface transition-colors focus-within:border-primary hover:border-muted-foreground">
      {hasCover ? (
        <div className="absolute inset-0">{coverPanel}</div>
      ) : (
        /* Generated sleeve for coverless entries: solid surface ground with a
           big rough off-register asterisk, so the grid stays coherent as
           content grows before art exists. */
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pb-12">
          <AsteriskMark size={230} tone="faint" misregister />
        </div>
      )}
      {hasCover && (
        /* Per-tile scrims (not per-artwork): a strong bottom gradient under the
           title and a faint top one under the number/stamp keep the printed
           copy AA-legible over the duotone AND the revealed full-color art in
           both themes. The sleeve tile skips them: its copy sits on the plain
           surface ground in theme ink. */
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        </div>
      )}
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
        <div className="flex items-start justify-between">
          <span
            className={`font-mono text-[11px] tracking-[0.1em] ${hasCover ? 'text-white/90' : 'text-muted-foreground'}`}
          >
            {String(index + 1).padStart(2, '0')} /
          </span>
          <span
            className={`rotate-2 border px-2 py-1 font-mono text-[9px] tracking-[0.14em] uppercase ${
              hasCover ? 'border-white/60 text-white/95' : 'border-border text-muted-foreground'
            }`}
          >
            {data.kind === 'case-study' ? strings.stampCaseStudy : strings.stampProject}{' '}
            {data.startDate.getUTCFullYear()}
          </span>
        </div>
        <h3
          /* Title scales with the TILE, not the viewport (@container on the
             article): at md the viewport grows but the 2-col tiles shrink, so
             a viewport-based bump would wrap long titles up past the scrim. */
          className={`font-[family-name:var(--v8-font-poster)] text-2xl leading-[1.08] tracking-[0.02em] uppercase @sm:text-[1.75rem] ${
            hasCover ? 'text-white' : 'text-foreground'
          }`}
        >
          {linkHref ? (
            <a
              href={linkHref}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {data.title}
            </a>
          ) : (
            data.title
          )}
        </h3>
      </div>
    </article>
  );
}
