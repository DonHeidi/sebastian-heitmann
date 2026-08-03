import type { Strings } from '../i18n/types';

export interface HeroProps {
  hero: Strings['hero'];
}

export function Hero({ hero }: HeroProps) {
  return (
    <header className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 md:px-20 md:pt-28 md:pb-20">
      <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
      <h1 className="reveal mt-4 max-w-[14ch] font-[family-name:var(--v8-font-display)] text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] text-foreground">
        <span className="misregister-text" data-text={hero.headingParts.misregistered}>
          {hero.headingParts.misregistered}
        </span>
        {hero.headingParts.rest}
      </h1>
      <p className="reveal mt-8 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
        {hero.intro.before}
        <s className="opacity-60">{hero.intro.struck}</s>{' '}
        <strong className="font-medium text-foreground">{hero.intro.replacement}</strong>
        {hero.intro.after}
      </p>
    </header>
  );
}
