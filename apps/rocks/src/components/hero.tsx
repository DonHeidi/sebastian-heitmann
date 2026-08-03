import type { Strings } from '../i18n/types';

export interface HeroProps {
  hero: Strings['hero'];
}

export function Hero({ hero }: HeroProps) {
  return (
    <header className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 md:px-20 md:pt-28 md:pb-20">
      <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
      <h1 className="reveal mt-4 max-w-[16ch] font-[family-name:var(--v8-font-display)] text-5xl leading-[1.05] text-foreground md:text-7xl">
        {hero.headingParts.misregistered}
        {hero.headingParts.rest}
      </h1>
      <p className="reveal mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
        {hero.intro.before}
        {hero.intro.replacement}
        {hero.intro.after}
      </p>
    </header>
  );
}
