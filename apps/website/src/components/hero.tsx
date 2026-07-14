import { SiBluesky, SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedInIcon } from './social-icons';
import type { Strings } from '@/i18n/types';

export interface HeroProps {
  hero: Strings['hero'];
  photoSrc: string;
  photoWidth: number;
  photoHeight: number;
}

export function Hero({ hero, photoSrc, photoWidth, photoHeight }: HeroProps) {
  return (
    <section className="mx-auto flex min-h-auto max-w-[1440px] items-center px-6 pt-10 pb-[60px] md:px-12 md:pt-[60px] md:pb-20 lg:min-h-[calc(100vh-80px)] lg:px-20 lg:pt-20 lg:pb-[120px]">
      <div className="grid w-full grid-cols-1 items-start gap-12 md:grid-cols-[180px_1fr] md:gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
        <aside className="order-1 flex flex-row flex-wrap gap-6 border-t border-border pt-6 md:order-none md:flex-col md:gap-5">
          <div className="flex flex-col gap-[2px]">
            <span className="font-mono text-[10px] leading-none tracking-[0.12em] text-muted-foreground uppercase">
              {hero.role.label}
            </span>
            <span className="font-mono text-[13px] leading-[1.4] text-foreground">{hero.role.value}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="font-mono text-[10px] leading-none tracking-[0.12em] text-muted-foreground uppercase">
              {hero.focus.label}
            </span>
            <span className="font-mono text-[13px] leading-[1.4] text-foreground">{hero.focus.value}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="font-mono text-[10px] leading-none tracking-[0.12em] text-muted-foreground uppercase">
              {hero.experience.label}
            </span>
            <span className="font-mono text-[13px] leading-[1.4] text-foreground">{hero.experience.value}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="font-mono text-[10px] leading-none tracking-[0.12em] text-muted-foreground uppercase">
              {hero.projects.label}
            </span>
            <span className="font-mono text-[13px] leading-[1.4] text-foreground">{hero.projects.value}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="font-mono text-[10px] leading-none tracking-[0.12em] text-muted-foreground uppercase">
              {hero.status.label}
            </span>
            <span className="font-mono text-[13px] leading-[1.4] text-[var(--v8-accent-status)]">
              {hero.status.value}
            </span>
          </div>

          <div className="mt-3 hidden md:block">
            <img
              src={photoSrc}
              alt={hero.photoAlt}
              loading="eager"
              width={photoWidth}
              height={photoHeight}
              className="size-[140px] object-cover transition-[filter] duration-400 [filter:var(--v8-photo-filter)] hover:[filter:var(--v8-photo-filter-hover)]"
            />
          </div>

          <div className="flex w-full gap-4 md:w-auto">
            <a
              href="https://www.linkedin.com/in/sebastian-heitmann/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <LinkedInIcon size={16} />
            </a>
            <a
              href="https://github.com/DonHeidi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <SiGithub size={16} color="currentColor" />
            </a>
            <a
              href="https://bsky.app/profile/e2e-developer.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bluesky"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <SiBluesky size={16} color="currentColor" />
            </a>
          </div>
        </aside>

        <div className="flex flex-col gap-8 md:gap-10">
          <h1 className="flex flex-col">
            <span className="font-display text-[clamp(48px,14vw,80px)] leading-[0.88] tracking-[-0.02em] text-foreground md:text-[clamp(72px,12vw,160px)]">
              {hero.firstName}
            </span>
            <span className="font-display text-[clamp(48px,14vw,80px)] leading-[0.88] tracking-[-0.02em] text-foreground md:text-[clamp(72px,12vw,160px)]">
              {hero.lastName}
            </span>
          </h1>

          <div className="h-0.5 w-12 bg-primary" />

          <p className="max-w-[520px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {hero.pitchLead}
          </p>

          <p className="max-w-[520px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {hero.pitch}
          </p>

          <div className="flex flex-col gap-2.5">
            <a
              href="#contact"
              className="group inline-flex w-fit items-center gap-3 border-b border-primary py-4 no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5"
            >
              <span className="font-mono text-xs tracking-[0.08em] text-foreground uppercase">{hero.cta}</span>
              <span className="text-base text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <span className="font-mono text-[11px] tracking-[0.01em] text-muted-foreground">{hero.ctaNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
