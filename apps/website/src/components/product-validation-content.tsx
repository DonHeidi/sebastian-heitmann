import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface ProductValidationContentProps {
  content: Strings['productValidation'];
}

const contactUrl = '#contact';

// Uniform section padding — the site-wide `sectionBase` rhythm, lifted from
// ai-process-automation-content.tsx. This page is unbanded: every section keeps
// the ambient page background, so there is no "first section of a band" variant.
const sectionBase = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20';

// Shared glass-card tokens (the `--v8-glass-*` custom properties).
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

function CtaLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
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

// In-page jump, matching the "details" link on the AI page's offering cards.
function JumpLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 self-start font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4',
        className,
      )}
    >
      <span>{children}</span>
      <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[3px]">
        &darr;
      </span>
    </a>
  );
}

// Glass chips. `connected` draws the dotted run between items (used for the
// journey line); without it the chips are a plain meta row (used in the hero).
function ChipRow({ items, connected = false, className = '' }: { items: string[]; connected?: boolean; className?: string }) {
  return (
    <div role="list" className={cn('flex flex-wrap items-center gap-2 md:gap-3', className)}>
      {items.map((label, i) => (
        <Fragment key={label}>
          {connected && i > 0 && (
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
  );
}

// Two opposing corner ticks, the AI page's card framing.
function CornerMarks({ accent = false }: { accent?: boolean }) {
  const tone = accent ? 'text-primary' : 'text-text-faint';
  return (
    <>
      <span aria-hidden="true" className={cn('pointer-events-none absolute top-2 left-2 h-3 w-3 border-t border-l', tone)} />
      <span aria-hidden="true" className={cn('pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b', tone)} />
    </>
  );
}

// Bordered-row list, used for included/excluded scope and any enumerated set.
function RuledList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-none flex-col gap-0 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="border-b border-border py-3 font-sans text-[15px] leading-[1.6] font-light text-text-secondary first:border-t"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProductValidationContent({ content }: ProductValidationContentProps) {
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
            {content.hero.intro}
          </p>
          <p className="max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-tertiary">
            {content.hero.supporting}
          </p>
          <ChipRow items={content.hero.meta} className="mt-4" />
          <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-10">
            <CtaLink href={contactUrl}>{content.hero.cta}</CtaLink>
            <JumpLink href="#package">{content.hero.secondaryCta}</JumpLink>
          </div>
        </div>
      </section>

      {/* 2. What this is */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.whatThisIs.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.whatThisIs.headline}
          </h2>
          <div className="mb-10 max-w-[640px]">
            {content.whatThisIs.body.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-0 p-0 lg:grid-cols-2 lg:gap-x-12">
            {content.whatThisIs.capabilities.map((item) => (
              <li
                key={item}
                className="relative border-b border-border py-2.5 pl-[22px] font-mono text-xs leading-[1.5] tracking-[0.04em] text-text-secondary transition-colors hover:text-foreground"
              >
                <span aria-hidden="true" className="absolute top-2.5 left-0 text-[10px] text-primary">
                  ✱
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Offer — single corner-framed package card with scope boundaries */}
      <section className="reveal">
        <div id="package" className={`mx-auto max-w-[1440px] ${sectionBase} scroll-mt-[100px]`}>
          <Eyebrow>{content.offer.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.offer.headline}
          </h2>
          <div className={cn('relative flex flex-col border border-border-accent py-7 px-6 md:py-11 md:px-10', glassCard)}>
            <CornerMarks accent />
            <div className="mb-7 flex flex-wrap items-baseline gap-3 border-b border-border pb-5 md:flex-nowrap md:gap-5">
              <h3 className="font-display text-[clamp(26px,2.4vw,32px)] leading-[1.1] text-foreground italic">
                {content.offer.name}
              </h3>
              <span className="ml-auto font-mono text-sm tracking-[0.04em] text-primary">{content.offer.price}</span>
            </div>
            <p className="mb-9 max-w-[640px] font-sans text-lg leading-[1.65] font-light text-text-secondary">
              {content.offer.description}
            </p>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col">
                <h4 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {content.offer.includedLabel}
                </h4>
                <RuledList items={content.offer.included} />
              </div>
              <div className="flex flex-col">
                <h4 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {content.offer.excludedLabel}
                </h4>
                <RuledList items={content.offer.excluded} />
              </div>
            </div>
            <ChipRow items={content.offer.meta} className="mt-9" />
            <p className="mt-7 max-w-[640px] font-sans text-sm leading-[1.6] font-light text-muted-foreground italic">
              {content.offer.legalNote}
            </p>
            <CtaLink href={contactUrl} className="mt-6">
              {content.offer.cta}
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
