import type { ReactNode } from 'react';
import type { Strings } from '../i18n/types';
import { AsteriskMark } from './asterisk-mark';
import { Masthead } from './masthead';

// ---------------------------------------------------------------------------
// Torn bottom edge for the full-bleed hero (task 15). The previous edge was a
// baked path of uniform small jitter, which read as a rough saw rather than a
// rip (owner: "should look more like a tear"). What sells a real tear is
// LOW-frequency drama — long shallow drifts punctuated by a few deep
// asymmetric V-rips — with fine jitter only as seasoning, plus a visible strip
// of exposed paper fiber hugging the torn line. The geometry is generated once
// at module load from a seeded PRNG (deterministic: identical on the server,
// at hydration, and on every build — no Date.now/Math.random at render), in
// objectBoundingBox units (0..1 of the hero box). Width fractions don't scale
// visually across viewports, so two variants are baked — desktop and a
// wider-notched small-viewport one — and a `md:` split picks which clip is
// live (see HERO_TEAR_SM below). Only the bottom edge tears: the hero bleeds
// to the viewport edges on the other three sides, so side tears would be
// clipped away anyway.
// ---------------------------------------------------------------------------

/** Tiny seeded PRNG (mulberry32) — deterministic across SSR and hydration. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TearEdge {
  /** Clip path for the whole sheet: straight top/sides, torn bottom. */
  clip: string;
  /** The torn line alone, as SVG polyline points — the fiber strokes trace it. */
  edge: string;
  /** Per-point slightly lifted echo of the edge: the wispy broken fiber line. */
  echo: string;
}

interface TearGeometry {
  /** Number of deep V-rips, one per horizontal band. */
  bands: number;
  /**
   * Multiplier on every notch/tag *width* (x fractions). objectBoundingBox x
   * units shrink with the viewport, so the desktop fractions that read as
   * 9-70px rips at 1440 compress into 2-18px needles at 375 (an EKG trace,
   * the sawtooth failure mode this tear exists to avoid). Narrow viewports
   * therefore get their own variant with proportionally wider fractions so
   * V-walls stay comfortably wider than a few device pixels.
   */
  widthScale: number;
  /** Multiplier on the between-rip sampling step, so the fine jitter between
   * rips doesn't itself compress into a mini-sawtooth on narrow viewports. */
  stepScale: number;
}

function makeTear(seed: number, { bands, widthScale, stepScale }: TearGeometry): TearEdge {
  const rand = mulberry32(seed);
  const TAU = Math.PI * 2;
  // Resting tear line, as a fraction of hero height. Depths/amplitudes below
  // are also height fractions: at typical hero heights (~700-900px) the drift
  // wanders ~±13px and the deep rips bite 14-35px up into the sheet.
  const BASE = 0.974;
  // Low-frequency drift: three incommensurate sine waves with seeded phases
  // give the long shallow wander a real tear has between rips.
  const p1 = rand();
  const p2 = rand();
  const p3 = rand();
  const drift = (x: number) =>
    0.01 * Math.sin(TAU * (0.9 * x + p1)) +
    0.005 * Math.sin(TAU * (2.2 * x + p2)) +
    0.0022 * Math.sin(TAU * (5.1 * x + p3));
  const level = (x: number) => BASE + drift(x);

  // Deep asymmetric V-rips: one per horizontal band (so they spread out
  // without colliding), each with a steep narrow side and a shallow wide flap
  // side; one "hero" rip gets extra depth and width.
  const bandW = 0.88 / bands;
  const heroRip = Math.floor(rand() * bands);
  const notches = Array.from({ length: bands }, (_, i) => {
    const xc = 0.06 + bandW * i + bandW * (0.2 + 0.6 * rand());
    const deep = i === heroRip;
    const depth = (deep ? 0.03 : 0.018) + 0.014 * rand();
    const wN = (0.006 + 0.008 * rand()) * widthScale;
    const wW = ((deep ? 0.03 : 0.02) + 0.028 * rand()) * widthScale;
    const steepLeft = rand() < 0.5;
    return {
      xc,
      depth,
      wN,
      wW,
      steepLeft,
      // Little tag of paper left hanging just past some rips.
      tag: rand() < 0.65,
      tagW: (0.006 + 0.008 * rand()) * widthScale,
      tagD: 0.006 + 0.008 * rand(),
      xl: xc - (steepLeft ? wN : wW),
      xr: xc + (steepLeft ? wW : wN),
    };
  });

  const fmt = (v: number) => Number(v.toFixed(4));
  const pts: Array<[number, number]> = [];
  const push = (x: number, y: number) =>
    pts.push([fmt(Math.min(1, Math.max(0, x))), fmt(Math.min(0.996, Math.max(0.92, y)))]);
  // Fine jitter is seasoning only: an order of magnitude below the rip depths.
  const jitter = () => (rand() - 0.5) * 0.004;

  push(0, level(0) + jitter());
  let x = 0;
  let ni = 0;
  while (x < 1) {
    const n = notches[ni];
    const nx = x + (0.016 + 0.03 * rand()) * stepScale;
    if (n && nx > n.xl) {
      const xl = Math.max(n.xl, x + 0.004);
      push(xl, level(xl));
      const tipX = n.steepLeft ? xl + n.wN * 0.7 : n.xr - n.wN * 0.7;
      const tipY = level(n.xc) - n.depth;
      if (n.steepLeft) {
        // Steep drop first, then a concave flap easing back up to the right.
        push(tipX, tipY);
        push(tipX + n.wW * 0.45, tipY + n.depth * 0.35);
      } else {
        // Shallow flap sagging down to the right, then a sharp tip + steep rise.
        push(xl + n.wW * 0.5, tipY + n.depth * 0.45);
        push(tipX, tipY);
      }
      push(n.xr, level(n.xr));
      x = n.xr;
      if (n.tag) {
        push(x + n.tagW * 0.5, level(x) + n.tagD);
        x += n.tagW;
        push(x, level(x));
      }
      ni++;
    } else {
      x = Math.min(nx, 1);
      push(x, level(x) + jitter());
    }
  }
  if (pts[pts.length - 1][0] < 1) push(1, level(1) + jitter());
  pts[pts.length - 1][0] = 1;

  return {
    clip: `M0 0L1 0${[...pts]
      .reverse()
      .map(([px, py]) => `L${px} ${py}`)
      .join('')}Z`,
    edge: pts.map(([px, py]) => `${px},${py}`).join(' '),
    echo: pts.map(([px, py]) => `${px},${fmt(py - (0.0015 + 0.0035 * rand()))}`).join(' '),
  };
}

// Two baked variants of the one tear, same seed, viewport-appropriate geometry
// (both generated once at module load — still zero render-time randomness).
// `md:` picks which is live: objectBoundingBox width fractions don't scale
// visually, so the desktop rips that read at >=768px collapse into near-uniform
// 2-5px spikes at 375px. The small-viewport variant compensates with fewer rips
// (2 vs 4) at ~3x the width so a V-wall still spans >=8px at 375.
const HERO_TEAR = makeTear(0x524f434b, { bands: 4, widthScale: 1, stepScale: 1 });
const HERO_TEAR_SM = makeTear(0x524f434b, { bands: 2, widthScale: 3, stepScale: 2.5 });
/** One shared clip for ALL hero layers (art, scrim, wrinkle) per breakpoint. */
const HERO_CLIP = '[clip-path:url(#v8-hero-tear-sm)] md:[clip-path:url(#v8-hero-tear)]';

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
       the image layer, so there is no layout shift on hover. */
    <header className="v8-duotone-host relative flex min-h-[calc(100svh-6rem)] flex-col overflow-hidden">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id="v8-hero-tear" clipPathUnits="objectBoundingBox">
            <path d={HERO_TEAR.clip} />
          </clipPath>
          <clipPath id="v8-hero-tear-sm" clipPathUnits="objectBoundingBox">
            <path d={HERO_TEAR_SM.clip} />
          </clipPath>
        </defs>
      </svg>
      {/* Background art: the duotone panel fills the block edge to edge, and the
          torn clip on this layer (not the header) rips only the art + scrim, so
          the page background shows through the tear beneath unclipped content. */}
      {art && (
        <div className={`absolute inset-0 ${HERO_CLIP}`}>
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
              spans — 1362px wraps, 1363px doesn't), but the `lg`/`max-lg`
              crop split in `hero-section.astro` switches to the
              single-line-tuned desktop crop right at 1024px. Below 1024px
              the mobile crop already zooms/pans the helmet out from under
              the (two-line) text band, so it's unaffected. From 1363px the
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
          Same torn clip as the art layer so the texture stops at the rip
          instead of crumpling the page background below it. Texture choice,
          blend mode and opacity are theme-scoped in global.css (.v8-wrinkle);
          pointer-events-none keeps the duotone hover reveal hit-testing
          intact, and a static overlay cannot shift layout on hover. */}
      {art && (
        <div
          aria-hidden="true"
          className={`v8-wrinkle pointer-events-none absolute inset-0 z-20 ${HERO_CLIP}`}
        />
      )}
      {/* Exposed paper fiber along the tear (task 15): a torn edge is never a
          clean cut — the rip drags up a thin, slightly irregular strip of
          lighter fiber. Both strokes trace the SAME generated points as the
          clip path (an offset echo, not a separate random line), stretched to
          the hero box by preserveAspectRatio="none" while non-scaling strokes
          keep the fiber hairline-thin at every viewport. Layers: a soft dark
          shadow below the lip (light theme only — it sells the sheet lifting
          off the page; on the near-black dark bg it would be invisible), the
          main fiber line straddling the edge, and a lifted, dash-broken echo
          reading as stray fibers. Sits above the wrinkle (z-30) so the texture
          cannot mute the edge; pointer-events-none keeps the duotone hover
          hit-testing intact, and none of this affects layout. */}
      {art && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          /* Explicit h/w-full: an absolutely positioned SVG with auto height
             keeps its intrinsic viewBox ratio instead of stretching to
             inset-0, which would park the strokes below the hero. */
          className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
        >
          {/* The fiber (and its light-theme shadow) must follow whichever clip
              path is live, so both tear variants render here and the same `md:`
              split that swaps the clip swaps the visible group. `md:inline`
              (SVG elements' initial display), not `md:block`. */}
          {(
            [
              [HERO_TEAR_SM, 'md:hidden'],
              [HERO_TEAR, 'hidden md:inline'],
            ] as const
          ).map(([tear, visibility]) => (
            <g key={visibility} className={visibility}>
              {/* Soft shadow: stacked widening/fading strokes rather than a blur
                  filter — CSS filter lengths on SVG children resolve in user
                  units, and one user unit here is the whole hero box, so even
                  blur(1px) diffuses the stroke into invisibility. Three
                  translated strokes approximate the falloff instead. */}
              {(
                [
                  [0.004, 3, 'stroke-black/20'],
                  [0.006, 6, 'stroke-black/12'],
                  [0.009, 10, 'stroke-black/8'],
                ] as const
              ).map(([dy, width, cls]) => (
                <polyline
                  key={dy}
                  points={tear.edge}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={width}
                  transform={`translate(0 ${dy})`}
                  className={`${cls} dark:hidden`}
                />
              ))}
              <polyline
                points={tear.edge}
                fill="none"
                vectorEffect="non-scaling-stroke"
                strokeWidth={2}
                className="stroke-white dark:stroke-[#EFE8D8]/90"
              />
              <polyline
                points={tear.echo}
                fill="none"
                vectorEffect="non-scaling-stroke"
                strokeWidth={1}
                strokeDasharray="0.018 0.011 0.032 0.007 0.024 0.014"
                className="stroke-white/70 dark:stroke-[#EFE8D8]/50"
              />
            </g>
          ))}
        </svg>
      )}
    </header>
  );
}
