import { AsteriskMark } from './asterisk-mark';

export interface MastheadProps {
  /** Brand literals, not locale copy — the site owner's name. */
  nameFirst: string;
  nameLast: string;
  tagline: string;
}

/**
 * Gig-poster masthead: NAME ✳ NAME in Anton with the asterisk mark as the
 * divider (the AC/DC-lightning-bolt role), tagline bar with rules beneath.
 * Centered lockup: the poster composition stacks kicker / masthead / tagline
 * / artwork / intro in one centered column, so the name lockup and the
 * tagline bar both center as a unit (and wrap to centered lines on mobile)
 * rather than sitting left-aligned.
 *
 * The divider must scale with the type, so the mark is em-sized: `!`-forced
 * em width/height on the mark's root span (its `size` prop sets inline px
 * styles, which only `!important` utilities can beat) plus `[&>svg]:*-full`
 * so the inner svg tracks the span. The spokes only span ~45% of the svg
 * viewBox, so the box is deliberately larger than the visual mark
 * (0.9em box ≈ 0.4em visual ≈ 0.55-0.6 of Anton's ~0.72em cap height); the
 * svg has `overflow: visible`, and the narrower wrapper (0.62em) pulls the
 * names in so the *visual* gap matches the letter gap, not the box gap.
 */
export function Masthead({ nameFirst, nameLast, tagline }: MastheadProps) {
  return (
    <div className="text-center">
      <h1 className="reveal flex flex-wrap items-center justify-center gap-x-[0.14em] gap-y-1 font-[family-name:var(--v8-font-poster)] text-[clamp(3.25rem,13vw,8.5rem)] leading-[0.95] tracking-[0.01em] text-foreground uppercase">
        <span>{nameFirst}</span>
        {' '}
        <span
          className="inline-flex h-[0.72em] w-[0.62em] shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <AsteriskMark
            size={100}
            tone="accent"
            misregister
            className="v8-masthead-mark h-[0.9em]! w-[0.9em]! shrink-0 [&>svg]:h-full [&>svg]:w-full"
          />
        </span>
        <span>{nameLast}</span>
      </h1>
      <p className="reveal mt-5 flex items-center gap-4 font-mono text-[clamp(0.7rem,1.4vw,0.95rem)] tracking-[0.32em] text-foreground uppercase">
        <span className="h-[2px] flex-1 bg-primary" aria-hidden="true" />
        <span>{tagline}</span>
        <span className="h-[2px] flex-1 bg-primary" aria-hidden="true" />
      </p>
    </div>
  );
}
