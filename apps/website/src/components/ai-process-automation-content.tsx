import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface AiProcessAutomationContentProps {
  content: Strings['aiProcessAutomation'];
}

const contactUrl = '#contact';

// Uniform section padding — matches the site-wide `sectionBase` rhythm
// (see technical-project-management-content.tsx / web-projects-content.tsx).
// This page is fully unbanded in the source (no `@include lt`/`dk` calls),
// so every section keeps the ambient page background/text and there is no
// "first section of a band" variant here.
const sectionBase = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20';

// Shared glass-card tokens (ported from the SCSS `--v8-glass-*` custom
// properties used by `.ap-offering`, `.ap-system`, and `.ap-cta__inner`).
const glassCard =
  'bg-[var(--v8-glass-bg)] shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_24px_60px_-36px_rgba(0,0,0,0.25)] backdrop-blur-[12px] backdrop-saturate-[1.4]';

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-6">
      <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {children}
      </span>
      <DotRule />
    </div>
  );
}

function CtaLink({
  href,
  children,
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group inline-flex items-center gap-3 self-start border-b border-primary py-4 no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5',
        className,
      )}
    >
      <span className="font-mono text-xs tracking-[0.08em] text-foreground uppercase">{children}</span>
      <span className="text-base text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}

// Vertical dotted spine for the process steps (ported from the SCSS
// `.ap-steps::before` radial-gradient repeat-y pattern; horizontal counterpart
// is `DotRule`).
function VerticalDotRule() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-4 bottom-4 left-[3px] w-2 bg-repeat-y opacity-85"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--v8-text-muted) 0.85px, transparent 1.4px)',
        backgroundSize: '8px 6px',
        backgroundPosition: '50% 0',
      }}
    />
  );
}

export function AiProcessAutomationContent({ content }: AiProcessAutomationContentProps) {
  return (
    <>
      {/* 1. Hero — unbanded, follows the page's ambient theme */}
      <section className="reveal px-6 pt-[120px] pb-10 md:px-12 md:pt-[140px] md:pb-[60px] lg:px-20 lg:pt-[160px] lg:pb-20">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
          <span className="mb-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {content.hero.eyebrow}
          </span>
          <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-foreground italic">
            {content.hero.headline}
          </h1>
          <p className="max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.hero.subline}
          </p>
          <div role="list" className="mt-4 flex flex-wrap items-center gap-2 md:gap-3">
            {content.hero.flow.map((label, i) => (
              <Fragment key={label}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="h-2 w-4 shrink-0 bg-left bg-repeat-x opacity-85 md:w-7"
                    style={{
                      backgroundImage: 'radial-gradient(circle, var(--v8-text-muted) 0.85px, transparent 1.4px)',
                      backgroundSize: '6px 8px',
                    }}
                  />
                )}
                <span
                  role="listitem"
                  className="border border-[var(--v8-glass-border)] bg-[var(--v8-glass-bg)] px-3 py-2 font-mono text-[11px] tracking-[0.08em] whitespace-normal text-text-secondary uppercase shadow-[0_1px_0_var(--v8-glass-highlight)_inset] backdrop-blur-[12px] backdrop-saturate-[1.4] md:px-4 md:py-2.5 md:whitespace-nowrap"
                >
                  {label}
                </span>
              </Fragment>
            ))}
          </div>
          <CtaLink href={contactUrl} className="mt-8">
            {content.hero.cta}
          </CtaLink>
        </div>
      </section>

      {/* 2. Approach */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.approach.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.approach.headline}
          </h2>
          <div className="max-w-[640px]">
            {content.approach.body.map((p, i) => (
              <p key={i} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Offerings — side-by-side tiers, subgrid-aligned (see capabilities-section.tsx) */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.offerings.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.offerings.headline}
          </h2>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:gap-y-7">
            {content.offerings.items.map((o, i) => (
              <article
                key={o.name}
                className={cn(
                  'relative flex flex-col gap-5 border py-7 px-6 transition-colors duration-300 md:gap-6 md:py-9 md:px-8 lg:grid lg:grid-rows-subgrid lg:row-span-4 lg:gap-0',
                  glassCard,
                  o.featured
                    ? 'border-border-accent hover:border-primary'
                    : 'border-[var(--v8-glass-border)] hover:border-muted-foreground',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute top-2 left-2 h-3 w-3 border-t border-l',
                    o.featured ? 'text-primary' : 'text-text-faint',
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b',
                    o.featured ? 'text-primary' : 'text-text-faint',
                  )}
                />
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-sm tracking-[0.04em] text-primary">{o.price}</span>
                </div>
                <div>
                  <h3 className="mb-1.5 font-display text-[clamp(26px,2.4vw,32px)] leading-[1.1] text-foreground italic">
                    {o.name}
                  </h3>
                  <p className="font-sans text-[15px] font-light text-muted-foreground italic">{o.tagline}</p>
                </div>
                <div className="max-w-[640px]">
                  {o.description.map((p, di) => (
                    <p
                      key={di}
                      className="mb-4 font-sans text-base leading-[1.65] font-light text-text-secondary last:mb-0"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <a
                  href={`#offering-details-${i + 1}`}
                  className="group inline-flex items-center gap-2.5 self-start border-t border-border pt-4 font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4 lg:mt-auto"
                >
                  <span>{content.offerings.details.linkLabel}</span>
                  <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[3px]">
                    &darr;
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3b. Offering details */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.offerings.details.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.offerings.details.headline}
          </h2>
          <div className="flex flex-col gap-[72px]">
            {content.offerings.items.map((o, i) => (
              <article key={o.name} id={`offering-details-${i + 1}`} className="scroll-mt-[100px]">
                <div className="mb-7 flex flex-wrap items-baseline gap-3 border-b border-border pb-5 md:flex-nowrap md:gap-5">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[clamp(22px,2.4vw,28px)] leading-[1.1] text-foreground italic">
                    {o.name}
                  </h3>
                  <span className="ml-auto font-mono text-[13px] tracking-[0.04em] text-primary">{o.price}</span>
                </div>
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
                  <div className="flex flex-col">
                    <h4 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      {o.scopeLabel}
                    </h4>
                    <ul className="flex list-none flex-col gap-0 p-0">
                      {o.scope.map((item) => (
                        <li
                          key={item}
                          className="border-b border-border py-3 font-sans text-[15px] leading-[1.6] font-light text-text-secondary first:border-t"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      {o.outcomeLabel}
                    </h4>
                    <p className="mb-4 font-sans text-[15px] leading-[1.6] font-light text-text-secondary">
                      {o.outcomeIntro}
                    </p>
                    {o.outcomes && (
                      <ul className="flex list-none flex-col gap-0 p-0">
                        {o.outcomes.map((item) => (
                          <li
                            key={item}
                            className="border-b border-border py-3 font-sans text-[15px] leading-[1.6] font-light text-text-secondary first:border-t"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {o.priceNote && (
                  <p className="mt-7 max-w-[640px] font-sans text-sm leading-[1.6] font-light text-muted-foreground italic">
                    {o.priceNote}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Example: Job Directory */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.example.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.example.headline}
          </h2>
          <div className={cn('relative flex flex-col py-7 px-6 md:py-11 md:px-10', glassCard)}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 h-3 w-3 border-t border-l text-text-faint"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b text-text-faint"
            />
            <p className="mb-8 max-w-[640px] font-sans text-lg leading-[1.65] font-light text-text-secondary">
              {content.example.intro}
            </p>
            <ul className="mb-9 grid grid-cols-1 gap-0 p-0 lg:grid-cols-2 lg:gap-x-12">
              {content.example.components.map((item) => (
                <li
                  key={item}
                  className="relative border-b border-border py-2.5 pl-[22px] font-mono text-xs tracking-[0.04em] leading-[1.5] text-text-secondary transition-colors hover:text-foreground"
                >
                  <span aria-hidden="true" className="absolute top-2.5 left-0 text-[10px] text-primary">
                    ✱
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="max-w-[640px]">
              {content.example.body.map((p, i) => (
                <p key={i} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-secondary last:mb-0">
                  {p}
                </p>
              ))}
            </div>
            <CtaLink href={content.example.linkHref} external className="mt-8">
              {content.example.linkLabel}
            </CtaLink>
          </div>
        </div>
      </section>

      {/* 5. Use cases */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.useCases.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.useCases.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.useCases.intro}
          </p>
          <ul className="flex list-none flex-col gap-0 p-0">
            {content.useCases.items.map((item, i) => (
              <li
                key={item}
                className="group relative border-b border-border py-6 pl-8 font-sans text-xl leading-[1.6] font-light text-text-tertiary transition-colors duration-300 first:border-t hover:text-foreground"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-[1.3]"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.useCases.closing}
          </p>
        </div>
      </section>

      {/* 6. Process steps — dotted spine */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.process.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.process.headline}
          </h2>
          <ol className="relative flex flex-col gap-2 pl-7 md:pl-9">
            <VerticalDotRule />
            {content.process.steps.map((step, i) => (
              <li
                key={step.title}
                className="relative grid grid-cols-[36px_1fr] gap-4 py-5 md:grid-cols-[48px_1fr] md:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[27px] left-[-25px] h-2 w-2 rounded-full bg-primary md:left-[-33px]"
                />
                <span className="pt-1.5 font-mono text-xs tracking-[0.14em] text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="mb-2 font-display text-[clamp(20px,2.2vw,26px)] leading-[1.2] text-foreground italic">
                    {step.title}
                  </h3>
                  <p className="max-w-[640px] font-sans text-base leading-[1.65] font-light text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Evolution — tag grid */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.evolution.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.evolution.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.evolution.intro}
          </p>
          <ul className="mb-10 flex max-w-[900px] list-none flex-wrap gap-2.5 p-0">
            {content.evolution.items.map((item) => (
              <li
                key={item}
                className="border border-border px-4 py-2.5 font-mono text-xs tracking-[0.04em] text-text-secondary transition-colors hover:border-muted-foreground hover:text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.evolution.closing}
          </p>
        </div>
      </section>

      {/* 8. CTA bridge — corner-framed glass panel */}
      <section className={cn('reveal', sectionBase, 'lg:pb-10')}>
        <div
          className={cn(
            'relative mx-auto flex max-w-[1440px] flex-col items-start py-10 px-6 md:py-16 md:px-14',
            glassCard,
          )}
        >
          {[
            { pos: 'top-3 left-3', border: 'border-t border-l' },
            { pos: 'top-3 right-3', border: 'border-t border-r' },
            { pos: 'bottom-3 left-3', border: 'border-b border-l' },
            { pos: 'bottom-3 right-3', border: 'border-b border-r' },
          ].map((c) => (
            <span
              key={c.pos}
              aria-hidden="true"
              className={`pointer-events-none absolute h-6 w-6 text-text-faint ${c.pos} ${c.border}`}
            />
          ))}
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.cta.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.cta.body}
          </p>
          <ul className="flex w-full list-none flex-col gap-0 self-stretch p-0">
            {content.cta.bullets.map((item) => (
              <li
                key={item}
                className="group relative border-b border-border py-4 pl-8 font-sans text-[17px] leading-[1.6] font-light text-text-tertiary transition-colors duration-300 first:border-t hover:text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-[1.3]"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.cta.closing}
          </p>
        </div>
      </section>
    </>
  );
}
