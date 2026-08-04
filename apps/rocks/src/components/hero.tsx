import type { ReactNode } from 'react';
import type { Strings } from '../i18n/types';
import { Masthead } from './masthead';

// Torn bottom edge for the full-bleed hero, in objectBoundingBox units (0..1),
// baked once from a seeded generator (irregular vertex spacing, mostly shallow
// jitter, a few deep rips with sharp companion points) so the edge reads as
// ripped paper rather than a uniform zigzag. Only the bottom edge tears: the
// hero bleeds to the viewport edges on the other three sides, so side tears
// would be clipped away anyway. Depths are fractions of the hero's height
// (~0.03 deep, ~0.01 shallow), i.e. roughly 8-30px at typical viewport heights.
const HERO_BOTTOM_TEAR =
  'M0 0L1 0L1 0.9874L0.9656 0.9905L0.9292 0.9712L0.9159 0.9964L0.8658 0.9705L0.8564 0.9958L0.8091 0.9885L0.7520 0.9854L0.6927 0.9901L0.6306 0.9897L0.5693 0.9855L0.5107 0.9900L0.4725 0.9879L0.4243 0.9868L0.3753 0.9868L0.3331 0.9881L0.2989 0.9893L0.2625 0.9615L0.2553 0.9975L0.1994 0.9617L0.1891 0.9952L0.1614 0.9954L0.1149 0.9956L0.0719 0.9612L0.0659 0.9949L0.0233 0.9853L0.0000 0.9949L0 0.9875Z';

export interface HeroProps {
  hero: Strings['hero'];
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

export function Hero({ hero, nameFirst, nameLast, art }: HeroProps) {
  return (
    /* `v8-duotone-host` scopes the duotone hover reveal to the whole poster
       block (the content stack sits above the art, so the wrapper itself never
       receives :hover — see global.css). The reveal only swaps blend/filter on
       the image layer, so there is no layout shift on hover. */
    <header className="v8-duotone-host relative flex min-h-[calc(100svh-6rem)] flex-col overflow-hidden">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id="v8-hero-tear" clipPathUnits="objectBoundingBox">
            <path d={HERO_BOTTOM_TEAR} />
          </clipPath>
        </defs>
      </svg>
      {/* Background art: the duotone panel fills the block edge to edge, and the
          torn clip on this layer (not the header) rips only the art + scrim, so
          the page background shows through the tear beneath unclipped content. */}
      {art && (
        <div className="absolute inset-0" style={{ clipPath: 'url(#v8-hero-tear)' }}>
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
      </div>
    </header>
  );
}
