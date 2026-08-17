import type { CSSProperties } from 'react';
import type { BlogTeaser } from '../data/blog-teasers';

export interface TeaserCardProps {
  teaser: BlogTeaser;
  readOn: string;
  /** 0-based position within the shelf; drives the printed serial number
   * (same convention as CaseCard's `index`). */
  index: number;
}

/**
 * Press-teaser as an ADMISSION TICKET, per the owner's reference image: a
 * left STUB carrying an upright vertical serial number in a thin frame, a
 * punched perforation line, notched perforation ends and corner scallops,
 * and a body framed by dashed rules with the display title between them.
 *
 * The silhouette comes from `.v8-ticket` (global.css): the punch holes and
 * notches are mask CUTOUTS, not drawn dots — the concrete ground shows
 * through the perforation and the notches bite into the card's border, like
 * die-cut paper. The stub width here must match --ticket-perf-x there.
 *
 * The card sits AXIS-ALIGNED on purpose. An earlier version rested each
 * ticket at a sub-degree tilt and the owner rejected it on sight: hairline
 * and dashed borders at near-zero angles raster as shimmer. Do not
 * reintroduce rotation here; the ticket read is carried by the die-cut
 * shape.
 *
 * No user-visible words are added — the serial is locale-free, so the i18n
 * Strings contract is untouched.
 */
export function TeaserCard({ teaser, readOn, index }: TeaserCardProps) {
  const number = String(index + 1).padStart(2, '0');
  /* Each ticket is cut from a different region of the brush sheet (see
     --v8-brush-offset in global.css): identical grain on every ticket is
     what gives a texture away as a texture. Co-prime strides against the
     1254px sheet keep consecutive tickets far apart; SSR-deterministic, so
     no hydration drift. */
  const brushOffset = `${(index * 367) % 1254}px ${(index * 523) % 1254}px`;
  return (
    /* STAMPED-METAL ticket riding the magnet physics (owner: "make the
       tickets look metallic ... apply a similar effect as the magnets").
       Same layer split as the metal CTAs: the OUTER div is the tilting 3D
       layer (the magnet script binds to .v8-magnet and writes the tilt +
       light custom properties; .v8-magnet-sheet lengthens the perspective
       for an element this size, and data-magnet-tilt halves the angles), and
       the ARTICLE is the visible face inside it, so the die-cut mask's
       punched edges render as layer CONTENT and keep their antialiasing.
       .v8-metal-sheet supplies the machined finish — gunmetal in dark, which
       also solves the stand-out-from-the-concrete problem the warm-paper
       version addressed (metal separates by temperature AND lightness) and
       returns the accent link to ≈ 4.8:1. The cast shadow lives in
       .v8-ticket (global.css) so the pressed state can tighten it. */
    <div className="v8-magnet v8-magnet-sheet" data-magnet-tilt="4">
      <div className="v8-magnet-tilt">
      <article
        className="v8-ticket v8-metal-sheet reveal relative flex h-full border"
        style={{ '--v8-brush-offset': brushOffset } as CSSProperties}
      >
      {/* Stub: vertical serial in a thin inset frame, reference-style.
          `text-orientation: upright` stacks the glyphs unrotated, the way a
          real ticket's serial digits stack. Width = --ticket-perf-x. */}
      <div className="flex w-[24%] shrink-0 items-center justify-center">
        <span className="rounded-sm border border-border px-1 py-3 font-mono text-[0.625rem] tracking-[0.35em] text-muted-foreground uppercase [writing-mode:vertical-rl] [text-orientation:upright]">
          N{'º'}{number}
        </span>
      </div>
      {/* Body: dashed band, title, teaser, dashed tear line + link — the
          reference's top/bottom dashed rules framing the display text. */}
      <div className="flex min-w-0 flex-1 flex-col p-6 pl-7 md:p-8 md:pl-8">
        <div className="border-t-2 border-dashed border-border" aria-hidden="true" />
        <h3 className="mt-4 font-[family-name:var(--v8-font-poster)] text-xl tracking-[0.02em] text-foreground uppercase">
          {teaser.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{teaser.teaser}</p>
        {/* Tear-here rule: the link is the stub you rip off and take with you. */}
        <div className="mt-5 border-t-2 border-dashed border-border pt-3">
          <a
            href={teaser.url}
            className="font-mono text-[0.625rem] tracking-[0.1em] text-primary uppercase no-underline transition-colors hover:text-foreground"
          >
            {readOn} →
          </a>
        </div>
      </div>
      </article>
      </div>
    </div>
  );
}
