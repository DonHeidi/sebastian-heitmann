import type { ReactNode } from 'react';
import type { Strings } from '../i18n/types';
import { GraffitiWord } from './graffiti-word';

// Torn-poster clip outlines in objectBoundingBox units (0..1), baked once from a
// seeded generator (irregular vertex spacing, mostly shallow jitter, a few deep
// rips with sharp companion points) so the edge reads as ripped paper rather
// than a uniform zigzag. Amplitudes were scaled per axis against each image's
// aspect ratio so the tear depth is even in *pixels* on every side.
const PANEL_TEAR =
  'M0.0069 0.0037L0.1156 0.0023L0.2070 0.0039L0.2829 0.0348L0.3014 0.0034L0.3488 0.0012L0.4199 0.0087L0.4713 0.0106L0.5500 0.0098L0.6441 0.0129L0.6970 0.0014L0.7411 0.0033L0.8382 0.0007L0.9139 0.0058L0.9615 0.0037L0.9901 0.0081L0.9775 0.0509L0.9861 0.0861L0.9773 0.1210L0.9904 0.2120L0.9940 0.2605L0.9316 0.2995L0.9908 0.3321L0.9899 0.3703L0.9827 0.4198L0.9927 0.4481L0.9999 0.5227L0.9203 0.6143L0.9999 0.6433L0.9832 0.6791L0.9935 0.7639L0.9848 0.8363L0.9854 0.9279L0.9967 0.9615L0.9840 0.9976L0.9427 0.9925L0.9108 0.9986L0.8642 0.9966L0.8292 0.9987L0.7565 0.9986L0.6808 0.9992L0.6130 0.9846L0.5500 0.9986L0.4663 0.9496L0.4477 0.9951L0.4064 0.9875L0.3385 0.9938L0.2570 0.9956L0.2046 0.9959L0.1684 0.9987L0.1100 0.9935L0.0385 0.9879L0.0158 0.9938L0.0082 0.9548L0.0129 0.9014L0.0038 0.8392L0.0092 0.7506L0.0201 0.6939L0.0501 0.5944L0.0069 0.5626L0.0030 0.5267L0.0084 0.4676L0.0184 0.4158L0.0226 0.3492L0.0115 0.3009L0.0621 0.2081L0.0071 0.1754L0.0146 0.1388L0.0064 0.0385Z';

export interface HeroProps {
  hero: Strings['hero'];
  word: 'loud' | 'laut';
  /** Slotted `<Image>` from astro:assets (slot="art"): the flaming rocker artwork. */
  art?: ReactNode;
}

/**
 * A torn-edged print: an offset accent echo of the clip shape behind the clipped image.
 * Shared with the About section, which reuses this technique for the torn-edge avatar
 * (moved there from the hero — see `about-section.tsx` for the avatar's clip shape).
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

export function Hero({ hero, word, art }: HeroProps) {
  // Keep leading punctuation (de: ", wo …") glued to the wordmark so a line
  // break can never orphan it at the start of the next line.
  const rest = hero.headingParts.rest;
  const restLead = /^\S*/.exec(rest)?.[0] ?? '';
  return (
    <header className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 md:px-20 md:pt-20 md:pb-20">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id="v8-torn-panel" clipPathUnits="objectBoundingBox">
            <path d={PANEL_TEAR} />
          </clipPath>
        </defs>
      </svg>
      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_min(38%,420px)] md:gap-14">
        <div>
          <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
          <h1 className="reveal mt-5 max-w-[14ch] font-[family-name:var(--v8-font-display)] text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] text-foreground">
            <span className="sr-only">{hero.headingParts.misregistered}</span>
            <span className="whitespace-nowrap">
              <GraffitiWord
                word={word}
                height={110}
                className="inline-block h-[1.02em]! align-[-0.13em]"
              />
              {restLead}
            </span>
            {rest.slice(restLead.length)}
          </h1>
          <p className="reveal mt-8 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            {hero.intro.before}
            <s className="opacity-60">{hero.intro.struck}</s>{' '}
            <strong className="font-medium text-foreground">{hero.intro.replacement}</strong>
            {hero.intro.after}
          </p>
        </div>
        {art && (
          <figure className="reveal m-0 md:-rotate-1">
            <TornPrint clipId="v8-torn-panel" offset={8}>
              {art}
            </TornPrint>
          </figure>
        )}
      </div>
    </header>
  );
}
