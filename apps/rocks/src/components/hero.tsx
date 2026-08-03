import type { Strings } from '../i18n/types';
import { GraffitiWord } from './graffiti-word';

export interface HeroProps {
  hero: Strings['hero'];
}

export function Hero({ hero }: HeroProps) {
  // Keep leading punctuation (de: ", wo …") glued to the wordmark so a line
  // break can never orphan it at the start of the next line.
  const rest = hero.headingParts.rest;
  const restLead = /^\S*/.exec(rest)?.[0] ?? '';
  return (
    <header className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 md:px-20 md:pt-28 md:pb-20">
      <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
      <h1 className="reveal mt-4 max-w-[14ch] pr-28 font-[family-name:var(--v8-font-display)] text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] text-foreground md:pr-0">
        <span className="sr-only">{hero.headingParts.misregistered}</span>
        <span className="whitespace-nowrap">
          <GraffitiWord
            word={hero.headingParts.misregistered.toLowerCase() === 'laut' ? 'laut' : 'loud'}
            height={110}
            className="inline-block h-[1.02em]! align-[-0.13em]"
          />
          {restLead}
        </span>
        {rest.slice(restLead.length)}
      </h1>
      <p className="reveal mt-8 max-w-[58ch] pr-36 text-base leading-relaxed text-muted-foreground md:pr-56 md:text-lg lg:pr-0">
        {hero.intro.before}
        <s className="opacity-60">{hero.intro.struck}</s>{' '}
        <strong className="font-medium text-foreground">{hero.intro.replacement}</strong>
        {hero.intro.after}
      </p>
    </header>
  );
}
