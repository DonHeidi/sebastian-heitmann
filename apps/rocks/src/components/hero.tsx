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
          {/* Theme-aware scrim between art and content: a center-weighted
              radial wash (strongest behind the content stack, fading out so
              the art stays punchy at the edges) plus top/bottom gradients, so
              kicker, tagline, and intro hold contrast in both themes and in
              both duotone and hover-revealed states. The wash is heavier in
              light mode (base styles) than dark (`dark:` overrides): the
              mostly-black artwork under a weak cream wash reads as murky gray
              and sinks the accent kicker below AA, while a stronger wash turns
              it into a faded print that dark text clears comfortably. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_75%_62%_at_50%_46%,var(--v8-bg)_0%,transparent_78%)] opacity-70 dark:opacity-55"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[var(--v8-bg)]/75 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--v8-bg)]/90 via-[var(--v8-bg)]/40 to-transparent"
          />
        </div>
      )}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-20 md:py-20">
        <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
        <div className="mt-5">
          <Masthead nameFirst={nameFirst} nameLast={nameLast} tagline={hero.tagline} />
        </div>
        <p className="reveal mx-auto mt-10 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:mt-14 md:text-lg">
          {hero.intro.before}
          <s className="opacity-60">{hero.intro.struck}</s>{' '}
          <strong className="font-medium text-foreground">{hero.intro.replacement}</strong>
          {hero.intro.after}
        </p>
      </div>
    </header>
  );
}
