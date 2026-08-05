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
 * CD-jewel-case tile: a real jewel case's front, front-on (142mm × 125mm,
 * spine included in the width — landscape, not square), with the cover art
 * (or the generated sleeve) as the booklet behind the plastic. The `.v8-jewel-*`
 * chrome (global.css) draws the spine + hinge teeth on the left and the lid's
 * gloss/bevel over everything — it is aria-hidden, pointer-transparent decor,
 * so the printed copy (setlist number top-left, rotated stamp top-right,
 * Anton title over a bottom scrim) and the stretched anchor keep working
 * unchanged. The copy is left-padded past the spine so it sits on the
 * booklet, not the plastic bar. `v8-duotone-host` on the article re-triggers
 * the duotone hover reveal from anywhere over the tile, since the overlaid
 * copy would otherwise swallow the pointer before it reaches the
 * `.v8-duotone` wrapper.
 */
export function CaseCard({ data, href, strings, index, coverPanel, hasCover }: CaseCardProps) {
  const external = data.kind === 'project' ? data.links[0] : undefined;
  const linkHref = data.kind === 'case-study' ? href : external?.url;
  return (
    <article className="reveal v8-duotone-host group @container relative aspect-[142/125] overflow-hidden border border-border bg-surface transition-colors focus-within:border-primary hover:border-muted-foreground">
      {hasCover ? (
        <div className="absolute inset-0">{coverPanel}</div>
      ) : (
        /* Generated sleeve for coverless entries: solid surface ground with a
           big rough off-register asterisk, so the grid stays coherent as
           content grows before art exists. */
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pb-12 pl-[8%]">
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
      <div className="absolute inset-0 flex flex-col justify-between py-5 pr-5 pl-[calc(8%+1.25rem)] md:py-6 md:pr-6 md:pl-[calc(8%+1.5rem)]">
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
      {/* Jewel-case chrome, above art/scrims/copy (plastic sits in FRONT of the
          printed booklet): spine + hinge teeth, then the grill haptic ribs at
          the hinge edge, then the lid's gloss and bevel across the whole face
          including the spine. All layers are hairlines or ≤11%-alpha washes,
          so the copy's AA contrast over the scrims survives untouched. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="v8-jewel-spine absolute inset-y-0 left-0 w-[8%]">
          {/* Hinge teeth: small notches inside the spine profile, flush with
              its very top/bottom edge (no inset margin — the spine's own
              hairline border is the case seam, so any gap read as stray
              space) and flush with its width (no overhang past the seam),
              so the case reads as a closed rectangle. */}
          <div className="v8-jewel-tooth absolute inset-x-0 top-0 h-[3.5%]" />
          <div className="v8-jewel-tooth absolute inset-x-0 bottom-0 h-[3.5%]" />
          {/* Spine title, reading top-to-bottom like a real CD spine. NOTE:
              `top/bottom` must be the PHYSICAL properties — logical `inset-y`
              (inset-block) would map to left/right under vertical-rl. */}
          <span className="absolute top-[18%] bottom-[18%] left-1/2 -translate-x-1/2 overflow-hidden font-mono text-[8px] tracking-[0.18em] uppercase whitespace-nowrap text-ellipsis text-white/70 [writing-mode:vertical-rl]">
            {data.title}
          </span>
        </div>
        {/* Grill haptic: the ribbed grip texture along the lid's hinge edge,
            immediately right of the spine seam — sits UNDER the gloss (so the
            diagonal streaks glaze over it like the rest of the lid) but OVER
            the spine/art (so the ridges read as molded plastic, not a stripe
            painted on the artwork). */}
        <div className="v8-jewel-grill absolute inset-y-0 left-[8%] w-[4%]" />
        <div className="v8-jewel-gloss absolute inset-0" />
        <div className="v8-jewel-bevel absolute inset-0" />
      </div>
    </article>
  );
}
