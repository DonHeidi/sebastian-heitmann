import type { CSSProperties, ReactNode } from 'react';
import tearMask from '../assets/tear-mask.png';
import type { Strings } from '../i18n/types';
import { AsteriskMark } from './asterisk-mark';
import { Masthead } from './masthead';

// ---------------------------------------------------------------------------
// Torn bottom edge for the full-bleed hero (task 20). The edge is PHOTOGRAPHIC
// now (owner: "using an image of an actual paper tear is better than using a
// polypath to cut it out"): src/assets/tear-mask.png is a grayscale luminance
// strip derived from a photographed torn-paper fiber line (see
// scripts/generate-tear-mask.mjs for the source, license, and processing), and
// every sheet layer (art, scrims, wrinkle) is CSS-masked with it. This
// replaces the task-15 procedural clip-path pair (seeded-PRNG polypaths +
// hand-drawn fiber strokes) — the photo brings its own fiber, so nothing is
// drawn on top of the edge anymore. The mask is two layers composited with the
// default `add`:
//   1. a solid-white gradient covering everything above the tear strip
//      (`#fff` = fully shown under `mask-mode: luminance`), and
//   2. the strip itself, anchored to the bottom at `100% auto` — full element
//      width, aspect-preserved height — so the photographed fiber scales
//      uniformly with the viewport like a narrower print of the same poster
//      (no per-breakpoint variants needed, unlike the clip-path era where
//      objectBoundingBox fractions distorted with the box).
// The gradient's height leaves the strip's zone to the photo but overlaps it
// slightly (see TEAR_OVERLAP_PX) so rounding or scrollbar-width differences
// (the element is the page width, `vw` includes the scrollbar gutter) can
// never open a transparent seam between the two layers.
// `mask-mode: luminance` is explicit: the PNG is grayscale (no alpha), and the
// default mode for image masks is alpha, which would read the strip as fully
// opaque everywhere.
// Only the bottom edge tears: the hero bleeds to the viewport edges on the
// other three sides, so side tears would be clipped away anyway.
// ---------------------------------------------------------------------------

// The mask strip's top rows are guaranteed pure white by the generator
// (WHITE_MARGIN = 34 source px); the gradient layer reaches this far INTO the
// strip, comfortably above the first fiber, so the two layers always meet on
// solid white.
const TEAR_OVERLAP_PX = 24;
// Displayed strip height tracks the element width by the PNG's own aspect
// ratio (`100% auto`), so the gradient's height is "everything but the strip"
// expressed in vw — computed from the imported image's real dimensions so a
// regenerated mask can never drift out of sync with this math.
const TEAR_GRADIENT_VW = ((tearMask.height - TEAR_OVERLAP_PX) / tearMask.width) * 100;
/** One shared mask for ALL sheet layers (art, scrims, wrinkle). */
const HERO_MASK: CSSProperties = {
  maskImage: `linear-gradient(#fff, #fff), url(${tearMask.src})`,
  maskPosition: 'top center, bottom center',
  maskSize: `100% calc(100% - ${TEAR_GRADIENT_VW.toFixed(4)}vw), 100% auto`,
  maskRepeat: 'no-repeat',
  maskMode: 'luminance',
};

export interface HeroProps {
  hero: Strings['hero'];
  /** Billing-block credits strip ("Previously at") in the poster's bottom zone. */
  credits: Strings['credits'];
  /** Brand literals passed from the section, not i18n strings. */
  nameFirst: string;
  nameLast: string;
  /** Slotted `<DuotonePanel>` (slot="art"): the flaming rocker artwork. */
  art?: ReactNode;
}

/**
 * A torn-edged print: an offset accent echo of the clip shape behind the clipped image.
 * Used by the About section's torn-edge avatar (see `about-section.tsx` for the
 * avatar's clip shape). The hero itself no longer renders one — its art became the
 * full-bleed background, where an offset echo has no edge to peek out from.
 */
export function TornPrint({
  clipId,
  offset,
  children,
  className = '',
}: {
  clipId: string;
  offset: number;
  children: ReactNode;
  className?: string;
}) {
  const clip = { clipPath: `url(#${clipId})` };
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-primary/75"
        style={{ ...clip, transform: `translate(${offset}px, ${offset + 2}px)` }}
      />
      <div className="relative" style={clip}>
        {children}
      </div>
    </div>
  );
}

export function Hero({ hero, credits, nameFirst, nameLast, art }: HeroProps) {
  return (
    /* `v8-duotone-host` scopes the duotone hover reveal to the whole poster
       block (the content stack sits above the art, so the wrapper itself never
       receives :hover — see global.css). The reveal only swaps blend/filter on
       the image layer, so there is no layout shift on hover.

       Height is measure-free (task 18): the calling page wraps `Navigation` +
       this hero in a `flex min-h-svh flex-col` column, and `flex-1` here
       makes the hero fill whatever viewport space the nav didn't take —
       matching the desktop "poster fills the first screen" relationship at
       EVERY width, including de-de's 3-row mobile nav (longer CTA wraps the
       nav to 3 rows at 375, vs 2 for en-us). The old `min-h-[calc(100svh-
       6rem)]` assumed a fixed ~6rem desktop-nav height; on mobile the nav can
       be taller (2-3 wrapped rows), so the hero's height stayed pinned to the
       wrong constant and its bottom edge (billing block, tear) overshot the
       first viewport instead of ending exactly where the nav's actual height
       allows. A flex item's automatic min-height is its content size, so the
       hero still grows past one viewport when its own content needs more
       room (e.g. a very short viewport) — same "at least, can grow" contract
       the old min-height had, just measured by layout instead of a constant. */
    <header className="v8-duotone-host relative flex flex-1 flex-col overflow-hidden">
      {/* Background art: the duotone panel fills the block edge to edge, and the
          torn mask on this layer (not the header) rips only the art + scrims, so
          the page background shows through the tear beneath unmasked content.
          Two nested wrappers on purpose: the INNER one carries the mask, the
          OUTER one carries the light-theme drop-shadow. Filters apply BEFORE
          masking on the same element, so a same-element shadow would be cut off
          by its own mask — on a parent it shadows the child's already-masked
          silhouette, giving the ragged edge a soft lip shadow that lifts the
          cream sheet off the cream page. On dark the page is near-black and a
          black shadow is invisible noise, so it's disabled there. */}
      {art && (
        <div className="absolute inset-0 [filter:drop-shadow(0_2px_2px_rgb(0_0_0/0.28))_drop-shadow(0_7px_9px_rgb(0_0_0/0.12))] dark:[filter:none]">
          <div className="absolute inset-0" style={HERO_MASK}>
            {art}
            {/* Theme-aware scrim between art and content: the lockup now anchors
                the top of the poster (bill-style), so the wash is top-heavy
                instead of the old center radial — a tall band behind kicker +
                masthead + tagline, plus a bottom band behind the intro. The
                middle of the poster (the figure's torso/keyboard) is left mostly
                bare so the artwork owns it, per the brief. Alpha is baked into
                each color stop via `var(--v8-bg)`, so both bands adapt to theme
                automatically: the mostly-black artwork under a weak cream wash
                reads as murky gray and sinks the accent kicker below AA, so the
                stops lean strong rather than needing separate `dark:` overrides.

                `min-[1024px]:max-[1363px]:` widens/strengthens the band for one
                specific zone: the masthead (`Masthead`'s fluid `clamp()` type)
                wraps to two lines anywhere from ~320px up to 1362px inclusive
                (measured directly via `getBoundingClientRect` on the name
                spans — 1362px wraps, 1363px doesn't). Below 1024px the poster
                is portrait-tall and the helmet deliberately shares space with
                the text band (task 19: art covers by construction, scrims own
                legibility), so this band's extra reach isn't the mechanism
                there. From 1363px the
                masthead is single-line again and the tagline sits high enough
                that the base band already covers it. Only 1024–1362px has both
                problems at once — two-line masthead (tagline pushed down) *and*
                the desktop crop (visor un-panned, sitting right under the
                tagline) — so that's the only range that needs extra reach.
                `max-[1363px]` (not `max-[1362px]`) because Tailwind's `max-*`
                is an exclusive `width <` comparison — `max-[1363px]` is what
                actually includes the 1362px boundary. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[46%] min-[1024px]:max-[1363px]:h-[74%] bg-gradient-to-b from-[var(--v8-bg)]/92 via-[var(--v8-bg)]/55 min-[1024px]:max-[1363px]:via-[var(--v8-bg)]/90 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--v8-bg)]/90 via-[var(--v8-bg)]/40 to-transparent"
            />
            {/* Light-only scrim reinforcement (task 14): the raw light artwork
                is far busier and brighter through the tagline and intro zones
                than the mostly-black dark artwork the band alphas above were
                tuned against, so the light theme gets an extra cream wash over
                the same two band geometries. Additive `dark:hidden` layers
                rather than reworked base utilities on purpose: stacking a layer
                can only strengthen a scrim, so the protected
                `min-[1024px]:max-[1363px]` band can't be weakened by variant
                -ordering surprises between `dark:` and the arbitrary
                breakpoint variants. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-[var(--v8-bg)]/35 via-[var(--v8-bg)]/40 to-transparent dark:hidden"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--v8-bg)]/45 via-[var(--v8-bg)]/45 to-transparent dark:hidden"
            />
          </div>
        </div>
      )}
      {/* Content stack: kicker + masthead + tagline anchor the TOP of the
          poster (concert-bill lockup, owner directive), the intro is pinned to
          the bottom via `mt-auto` above the torn edge — the figure's
          helmet/keyboard then owns the middle of the sheet between the two
          text bands. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center px-6 pt-12 pb-16 text-center md:px-20 md:pt-16 md:pb-20">
        <div>
          <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
          <div className="mt-5">
            <Masthead nameFirst={nameFirst} nameLast={nameLast} tagline={hero.tagline} />
          </div>
        </div>
        <p className="reveal mx-auto mt-auto max-w-[58ch] pt-10 text-base leading-relaxed text-muted-foreground md:pt-14 md:text-lg">
          {hero.intro.before}
          <s className="opacity-60">{hero.intro.struck}</s>{' '}
          <strong className="font-medium text-foreground">{hero.intro.replacement}</strong>
          {hero.intro.after}
        </p>
        {/* Movie-poster billing block: the dense, centered credits strip along a
            poster's bottom edge, translated into the site's system — mono
            eyebrow label, Anton uppercase names, small accent asterisks as
            separators (the AC/DC-lightning-bolt divider role, same as the
            masthead's name divider, just much smaller). The names + separators
            render as one flex-wrap row of name/mark pairs (each pair kept
            together so a wrap can only fall *between* pairs), and the mark is
            only rendered inside a pair when a next name follows — so a line
            break never strands a lone separator at its start or end. */}
        <div className="reveal mt-8 flex flex-col items-center gap-3 md:mt-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            {credits.label}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-[family-name:var(--v8-font-poster)] text-sm tracking-[0.06em] text-foreground uppercase md:text-base">
            {credits.names.map((name, index) => (
              <span key={name} className="flex items-center gap-3">
                <span>{name}</span>
                {index < credits.names.length - 1 && (
                  <span
                    className="inline-flex h-[10px] w-[10px] shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <AsteriskMark size={10} tone="accent" />
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
      {/* Wrinkle morphism (owner directive): a theme-matched crumpled-paper
          texture over the ENTIRE poster — art, scrim, masthead, billing block —
          so the whole sheet reads as one physical print rather than text
          floating over a textured image. It sits ABOVE the content stack
          (z-20 > z-10) because blending it below the scrim washes it out under
          the strong top band; at the tuned low opacity it shades the text
          without degrading legibility (verified per theme in task-14 shots).
          Same torn mask as the art layer so the texture stops at the rip
          instead of crumpling the page background below it (a mask, unlike
          clip-path, leaves hit-testing untouched, so pointer-events-none still
          does that job). Texture choice, blend mode and opacity are
          theme-scoped in global.css (.v8-wrinkle); a static overlay cannot
          shift layout on hover. */}
      {art && (
        <div
          aria-hidden="true"
          className="v8-wrinkle pointer-events-none absolute inset-0 z-20"
          style={HERO_MASK}
        />
      )}
    </header>
  );
}
