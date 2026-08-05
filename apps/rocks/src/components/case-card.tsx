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
  backStrings: Strings['caseBack'];
  /** 0-based position within its section; rendered as `01 /`. */
  index: number;
  /** Slotted `<DuotonePanel>` (slot="coverPanel") from the calling `.astro` page
   * (`.astro` components can't be rendered inside `.tsx`, and only a named slot
   * — not a plain prop — crosses that boundary); fills the square tile as the
   * album-cover art. Entries without one get the generated asterisk sleeve. */
  coverPanel?: ReactNode;
  /** Slotted `<DuotonePanel duotone={false}>` (slot="backPanel"): the SAME
   * cover art, full color (no duotone), for the flip side. A second slot
   * rather than an unwrap because the card cannot reach inside a slotted
   * Astro node — the page is the only place that can render the `<Image>`
   * twice (same src/widths, so the browser fetches it once). */
  backPanel?: ReactNode;
  /** Whether the entry actually has cover art. Must be passed explicitly:
   * Astro delivers `coverPanel` as a truthy (empty) node even when the page's
   * slot conditional is false, so the slot's truthiness can't be trusted. */
  hasCover: boolean;
}

/**
 * CD-jewel-case tile: a real jewel case's front, front-on (142mm × 125mm ×
 * 10mm, spine included in the width — landscape, not square), with the cover
 * art (or the generated sleeve) as the booklet behind the plastic. Hover or
 * keyboard focus flips the case horizontally (rotateY, task 23) to its back:
 * the same art in full color under a printed back-inlay panel listing the
 * stack as a track list plus role/year fine print. The `.v8-jewel-*` chrome
 * (global.css) draws the spine + hinge teeth and the lid's gloss/bevel on
 * both faces; on the back the spine chrome is mirrored to the RIGHT edge
 * (`-scale-x-100`), where a physically flipped case's spine lands.
 *
 * Physical depth (task 24): the case is a 3D slab, not a rotating plane.
 * `--case-depth` = 7cqw (10/142 of the tile width — the real case's depth
 * ratio; @container on the article makes cqw track the TILE, so the depth
 * scales with the grid). The slab sits BEHIND the tile plane — front face
 * at z=0, back face at z=-depth — and the scene's rotation origin is pushed
 * to the slab's core (`transform-origin: 50% 50% -depth/2`), so BOTH
 * settled states land their visible face exactly at z=0: the rest state is
 * pixel-identical to the pre-depth tile and the flipped back is not
 * perspective-enlarged. Four edge walls (`.v8-jewel-wall-*`, global.css)
 * close the slab: the left wall is the spine's outer edge, the right wall
 * the opening edge with the lid/tray seam, and thin top/bottom walls plug
 * the see-through slit the perspective's vertical divergence would reveal
 * mid-flip (backface-hidden faces don't paint when seen from inside the
 * slab). All walls are exactly edge-on at 0° and 180°, so the
 * reduced-motion instant swap never shows them and the rest state cannot
 * leak a wall sliver.
 *
 * A11y contract: the whole 3D scene is one `aria-hidden`, pointer-inert
 * layer — purely presentational, so nothing on either face duplicates into
 * the a11y tree. The real semantics live beside it: a single `<h3>` holding
 * ONE stretched anchor whose sr-only text is the title (accessible name
 * unchanged), clickable from both faces at every point of the flip. The
 * anchor's focus drives the flip via `group-focus-within`. The front stays
 * permanently duotone: the anchor overlay means the pointer never reaches
 * the `.v8-duotone` wrapper, and the tile no longer opts into the
 * `v8-duotone-host` reveal (that stays a hero behavior). Tailwind's `hover:`
 * variants are `(hover: hover)`-gated, so touch devices keep the front face
 * and tap-to-navigate; `motion-reduce` swaps faces without animating the
 * rotation.
 */
export function CaseCard({ data, href, strings, backStrings, index, coverPanel, backPanel, hasCover }: CaseCardProps) {
  const external = data.kind === 'project' ? data.links[0] : undefined;
  const linkHref = data.kind === 'case-study' ? href : external?.url;
  const number = String(index + 1).padStart(2, '0');
  const faceChrome =
    'absolute inset-0 overflow-hidden border border-border bg-surface backface-hidden transition-colors group-hover:border-muted-foreground group-focus-within:border-primary';
  return (
    <article className="reveal group @container relative aspect-[142/125] perspective-distant hover:z-10 focus-within:z-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transform-3d transition-transform duration-[620ms] ease-[cubic-bezier(0.3,0.1,0.25,1)] [--case-depth:7cqw] [transform-origin:50%_50%_calc(var(--case-depth)/-2)] group-hover:rotate-y-180 group-focus-within:rotate-y-180 motion-reduce:transition-none"
      >
        {/* ---- FRONT face: the jewel case's lid, permanently duotone. ---- */}
        <div className={faceChrome}>
          {hasCover ? (
            <div className="absolute inset-0">{coverPanel}</div>
          ) : (
            /* Generated sleeve for coverless entries: solid surface ground with a
               big rough off-register asterisk, so the grid stays coherent as
               content grows before art exists. */
            <div className="absolute inset-0 flex items-center justify-center pb-12 pl-[8%]">
              <AsteriskMark size={230} tone="faint" misregister />
            </div>
          )}
          {hasCover && (
            /* Per-tile scrims (not per-artwork): a strong bottom gradient under the
               title and a faint top one under the number/stamp keep the printed
               copy AA-legible over the duotone art in both themes. The sleeve
               tile skips them: its copy sits on the plain surface ground in
               theme ink. */
            <div className="absolute inset-0">
              <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
            </div>
          )}
          <div className="absolute inset-0 flex flex-col justify-between py-5 pr-5 pl-[calc(8%+1.25rem)] md:py-6 md:pr-6 md:pl-[calc(8%+1.5rem)]">
            <div className="flex items-start justify-between">
              <span
                className={`font-mono text-[11px] tracking-[0.1em] ${hasCover ? 'text-white/90' : 'text-muted-foreground'}`}
              >
                {number} /
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
            <p
              /* Visual title only (the semantic h3 + link live outside the
                 aria-hidden scene). Scales with the TILE, not the viewport
                 (@container on the article): at md the viewport grows but the
                 2-col tiles shrink, so a viewport-based bump would wrap long
                 titles up past the scrim. */
              className={`font-[family-name:var(--v8-font-poster)] text-2xl leading-[1.08] tracking-[0.02em] uppercase @sm:text-[1.75rem] ${
                hasCover ? 'text-white' : 'text-foreground'
              }`}
            >
              {data.title}
            </p>
          </div>
          {/* Jewel-case chrome, above art/scrims/copy (plastic sits in FRONT of the
              printed booklet): spine + ribbed hinge teeth, then the lid's gloss
              and bevel across the whole face including the spine. All layers are
              hairlines or ≤11%-alpha washes, so the copy's AA contrast over the
              scrims survives untouched. */}
          <div className="absolute inset-0">
            <div className="v8-jewel-spine absolute inset-y-0 left-0 w-[8%]">
              {/* Hinge teeth: small ribbed blocks inside the spine profile, flush
                  with its very top/bottom edge (no inset margin — the spine's own
                  hairline border is the case seam, so any gap read as stray
                  space) and flush with its width (no overhang past the seam), so
                  the case reads as a closed rectangle. The grip-ridge texture
                  (::before, global.css) is scoped to these blocks only — a real
                  jewel case's hinge grill lives on the tooth itself, not
                  elsewhere on the spine or cover. */}
              <div className="v8-jewel-tooth absolute inset-x-0 top-0 h-[6px]" />
              <div className="v8-jewel-tooth absolute inset-x-0 bottom-0 h-[6px]" />
              {/* Spine title, reading top-to-bottom like a real CD spine. NOTE:
                  `top/bottom` must be the PHYSICAL properties — logical `inset-y`
                  (inset-block) would map to left/right under vertical-rl. */}
              <span className="absolute top-[18%] bottom-[18%] left-1/2 -translate-x-1/2 overflow-hidden font-mono text-[8px] tracking-[0.18em] uppercase whitespace-nowrap text-ellipsis text-white/70 [writing-mode:vertical-rl]">
                {data.title}
              </span>
            </div>
            <div className="v8-jewel-gloss absolute inset-0" />
            <div className="v8-jewel-bevel absolute inset-0" />
          </div>
        </div>
        {/* ---- BACK face: the back inlay. Pre-rotated 180° so the flip lands
             on it reading normally, and pushed a full case-depth behind the
             front face (rotate-then-translate: the translateZ runs along the
             face's own flipped axis, landing it at scene z = -depth); spine
             chrome mirrored to the right edge. ---- */}
        <div className={`${faceChrome} [transform:rotateY(180deg)_translateZ(var(--case-depth))]`}>
          {hasCover ? (
            /* Same art, full color, no duotone — slightly blurred (scaled past
               its own blur fringe) and darkened so the inlay panel stays
               AA-legible over any artwork. */
            <>
              <div className="absolute inset-0 [&_img]:h-full [&_img]:w-full [&_img]:scale-105 [&_img]:object-cover [&_img]:blur-[2px]">
                {backPanel}
              </div>
              <div className="absolute inset-0 bg-black/35" />
            </>
          ) : (
            /* Coverless entries keep the sleeve ground behind the inlay panel,
               mirrored: asterisk offset pads away from the RIGHT spine. */
            <div className="absolute inset-0 flex items-center justify-center pb-12 pr-[8%]">
              <AsteriskMark size={230} tone="faint" misregister />
            </div>
          )}
          {/* Printed back-inlay panel: track list from the stack, then the
              fine-print register (role · year) under a hairline, like a CD
              back inlay's credits line. Dark translucent regardless of theme
              or ground (it is printed ink, not themed UI); text tones tuned
              for AA over black/75 even on the light sleeve ground. */}
          <div className="absolute inset-0 flex items-center p-4 pr-[calc(8%+1rem)] @sm:p-5 @sm:pr-[calc(8%+1.25rem)]">
            {/* Content-hugging (not full-height) so the full-color art stays
                visible above and below the printed panel. */}
            {/* Sizes step with the TILE via @container (like the front title):
                2-col tiles at 768 are narrower than 3-col tiles at 1440, and
                de-de's longer role line wraps — the compact base keeps all six
                tracks + the two-line register inside the case. */}
            <div className="flex max-h-full w-full min-w-0 flex-col overflow-hidden bg-black/80 px-3.5 py-3 @sm:px-5 @sm:py-4">
              <div className="flex items-baseline justify-between gap-2 border-b border-white/25 pb-2 font-mono text-[9px] tracking-[0.16em] uppercase text-white/80">
                <span>{backStrings.tracksLabel}</span>
                <span>{number} /</span>
              </div>
              <ol className="mt-2 space-y-1 overflow-hidden font-mono text-[10px] leading-tight text-white/95 @sm:mt-2.5 @sm:space-y-1.5 @sm:text-[11px]">
                {data.stack.map((tech, n) => (
                  <li key={tech} className="flex items-baseline gap-2">
                    <span className="text-white/75">{String(n + 1).padStart(2, '0')}</span>
                    <span className="truncate">{tech}</span>
                    <span className="min-w-4 flex-1 border-b border-dotted border-white/30" />
                  </li>
                ))}
              </ol>
              <div className="mt-2 border-t border-white/25 pt-2 font-mono text-[9px] leading-relaxed tracking-[0.05em] text-white/80 @sm:mt-2.5">
                <span className="tracking-[0.14em] uppercase text-white/70">{strings.roleLabel}</span> {data.role}
                <span className="mx-1 text-white/70">·</span>
                <span className="tracking-[0.14em] uppercase text-white/70">{backStrings.yearLabel}</span>{' '}
                {data.startDate.getUTCFullYear()}
              </div>
            </div>
          </div>
          {/* Back chrome: the SAME spine + teeth, mirrored via -scale-x-100 and
              parked on the right edge — a horizontally flipped case's spine
              lands on the right, and mirroring the element flips its gradients,
              seam shadows and grip ridges in one move. The spine title span
              re-mirrors itself (nested -scale-x-100) so it still reads
              top-to-bottom. Gloss/bevel stay unmirrored: lighting is
              environmental (top-left), it does not flip with the object. */}
          <div className="absolute inset-0">
            <div className="v8-jewel-spine absolute inset-y-0 right-0 w-[8%] -scale-x-100">
              <div className="v8-jewel-tooth absolute inset-x-0 top-0 h-[6px]" />
              <div className="v8-jewel-tooth absolute inset-x-0 bottom-0 h-[6px]" />
              <span className="absolute top-[18%] bottom-[18%] left-1/2 -translate-x-1/2 -scale-x-100 overflow-hidden font-mono text-[8px] tracking-[0.18em] uppercase whitespace-nowrap text-ellipsis text-white/70 [writing-mode:vertical-rl]">
                {data.title}
              </span>
            </div>
            <div className="v8-jewel-gloss absolute inset-0" />
            <div className="v8-jewel-bevel absolute inset-0" />
          </div>
        </div>
        {/* ---- EDGE WALLS: the slab's 10mm sides. Each is an edge-anchored
             plane rotated 90° about the edge it closes and slid half a depth
             inward, spanning z 0..-depth between the faces (transform lists
             read outer-to-inner: translate to the edge, recess into the slab,
             then rotate the plane on). `backface-hidden` keeps them
             exterior-only, matching the faces — the slab never paints its
             hollow inside. Purely presentational (inside the aria-hidden
             scene); absolutely positioned, so zero layout at rest. */}
        {/* Left wall — the spine's outer edge (dark plastic, vertical specular). */}
        <div className="v8-jewel-wall-spine absolute inset-y-0 left-0 w-[var(--case-depth)] backface-hidden [transform:translateX(calc(var(--case-depth)/-2))_translateZ(calc(var(--case-depth)/-2))_rotateY(-90deg)]" />
        {/* Right wall — the opening edge (lighter plastic, lid/tray seam). */}
        <div className="v8-jewel-wall-open absolute inset-y-0 right-0 w-[var(--case-depth)] backface-hidden [transform:translateX(calc(var(--case-depth)/2))_translateZ(calc(var(--case-depth)/-2))_rotateY(90deg)]" />
        {/* Top/bottom walls — plain lid-edge plastic. Needed: the tile-centered
             perspective diverges ±~10° vertically, so without them the mid-flip
             silhouette shows a see-through slit along the top/bottom edges. */}
        <div className="v8-jewel-wall-lid absolute inset-x-0 top-0 h-[var(--case-depth)] backface-hidden [transform:translateY(calc(var(--case-depth)/-2))_translateZ(calc(var(--case-depth)/-2))_rotateX(90deg)]" />
        <div className="v8-jewel-wall-lid absolute inset-x-0 bottom-0 h-[var(--case-depth)] backface-hidden [transform:translateY(calc(var(--case-depth)/2))_translateZ(calc(var(--case-depth)/-2))_rotateX(-90deg)]" />
      </div>
      {/* The ONE real link, outside the 3D scene so it stays hit-testable from
          both faces (a backface-hidden front would swallow a stretched ::after
          mid-flip). sr-only text keeps the accessible name = title. */}
      {linkHref ? (
        <h3 className="absolute inset-0 z-10">
          <a
            href={linkHref}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="block h-full w-full outline-none"
          >
            <span className="sr-only">{data.title}</span>
          </a>
        </h3>
      ) : (
        <h3 className="sr-only">{data.title}</h3>
      )}
    </article>
  );
}
