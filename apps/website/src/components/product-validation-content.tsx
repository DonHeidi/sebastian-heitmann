import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DotRule } from './dot-rule';
import { FaqSection } from './faq-section';
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

// Vertical dotted spine for the process steps; horizontal counterpart is `DotRule`.
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

// Emphasis list with the accent dot marker.
function DotBulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-none flex-col gap-0 p-0">
      {items.map((item, i) => (
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
            <CtaLink href={contactUrl} className="md:self-center">
              {content.hero.cta}
            </CtaLink>
            <JumpLink href="#package" className="md:self-center">
              {content.hero.secondaryCta}
            </JumpLink>
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
          {/* Prose only. This section used to carry a nine-item capability list,
              but eight of those items restated the package's Included list one
              section below, so the page announced its deliverables twice before
              naming a price. The offer card is the single place scope lives. */}
          <div className="max-w-[640px]">
            {content.whatThisIs.body.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Offer — single corner-framed package card with scope boundaries */}
      <section className="reveal">
        <div id="package" className={`mx-auto max-w-[1440px] ${sectionBase} scroll-mt-[100px]`}>
          <Eyebrow>{content.offer.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.offer.headline}
          </h2>
          {/* A pricing card, not a scope table. It sits beside the description
              rather than spanning the container, so the price, the timeline, and
              the deliverables read as one scannable column. Scope boundaries live
              below it: they inform, they do not sell, and putting them inside the
              card was what made it read as broad. */}
          <div className="flex max-w-[1040px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <div
              className={cn(
                'relative flex w-full shrink-0 flex-col border border-border-accent py-7 px-6 md:py-9 md:px-8 lg:w-[420px]',
                glassCard,
              )}
            >
              <CornerMarks accent />
              <h3 className="font-display text-[clamp(24px,2.2vw,30px)] leading-[1.1] text-foreground italic">
                {content.offer.name}
              </h3>
              <p className="mt-4 font-mono text-xl tracking-[0.02em] text-primary">{content.offer.price}</p>
              <ul className="mt-3 flex list-none flex-col gap-1 p-0">
                {content.offer.meta.map((m) => (
                  <li key={m} className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                    {m}
                  </li>
                ))}
              </ul>
              <h4 className="mt-8 mb-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {content.offer.includedLabel}
              </h4>
              <ul className="flex list-none flex-col gap-0 p-0">
                {content.offer.included.map((item) => (
                  <li
                    key={item}
                    className="relative border-b border-border py-2.5 pl-[22px] font-sans text-[15px] leading-[1.5] font-light text-text-secondary first:border-t"
                  >
                    <span aria-hidden="true" className="absolute top-3 left-0 text-[10px] text-primary">
                      ✱
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <CtaLink href={contactUrl} className="mt-8">
                {content.offer.cta}
              </CtaLink>
            </div>
            <div className="max-w-[520px] lg:pt-2">
              <p className="font-sans text-lg leading-[1.65] font-light text-text-secondary">
                {content.offer.description}
              </p>
              <h4 className="mt-10 mb-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {content.offer.excludedLabel}
              </h4>
              <RuledList items={content.offer.excluded} />
              <p className="mt-7 font-sans text-sm leading-[1.6] font-light text-muted-foreground italic">
                {content.offer.legalNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why start here */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.whyStartHere.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.whyStartHere.headline}
          </h2>
          <p className="mb-6 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.whyStartHere.intro}
          </p>
          <p className="mb-8 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-tertiary">
            {content.whyStartHere.questionsLead}
          </p>
          <DotBulletList items={content.whyStartHere.questions} />
          <div className="mt-10 max-w-[640px]">
            {content.whyStartHere.closing.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 5. When this makes sense — 2x2 situation cards */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.situations.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.situations.headline}
          </h2>
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-7">
            {content.situations.items.map((item) => (
              <article
                key={item.title}
                className={cn(
                  'relative flex flex-col gap-5 border border-[var(--v8-glass-border)] py-7 px-6 transition-colors duration-300 hover:border-muted-foreground md:gap-6 md:py-9 md:px-8',
                  glassCard,
                )}
              >
                <CornerMarks />
                <h3 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.15] text-foreground italic">
                  {item.title}
                </h3>
                <div>
                  {item.body.map((p) => (
                    <p key={p} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-secondary last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Process — dotted spine */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.process.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.process.headline}
          </h2>
          <ol className="relative flex flex-col gap-2 pl-7 md:pl-9">
            <VerticalDotRule />
            {content.process.steps.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[36px_1fr] gap-4 py-5 md:grid-cols-[48px_1fr] md:gap-6">
                <span
                  aria-hidden="true"
                  className="absolute top-[27px] left-[-25px] h-2 w-2 rounded-full bg-primary md:left-[-33px]"
                />
                <span className="pt-1.5 font-mono text-xs tracking-[0.14em] text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="max-w-[640px]">
                  <h3 className="mb-2 font-display text-[clamp(20px,2.2vw,26px)] leading-[1.2] text-foreground italic">
                    {step.title}
                  </h3>
                  {step.description.map((p) => (
                    <p key={p} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-secondary last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Differentiation */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.differentiation.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.differentiation.headline}
          </h2>
          <div className="max-w-[640px]">
            {content.differentiation.body.map((p) => (
              <p key={p} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 8. What comes next — follow-on cards, journey line, optional add-ons */}
      <section className="reveal">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.whatComesNext.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.whatComesNext.headline}
          </h2>
          <div className="mb-10 max-w-[640px]">
            {content.whatComesNext.intro.map((p) => (
              <p key={p} className="mb-5 font-sans text-xl leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <div className="mb-12 flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-x-4">
            {content.whatComesNext.items.map((item) => (
              <article
                key={item.title}
                className={cn(
                  'relative flex flex-col gap-4 border border-[var(--v8-glass-border)] py-7 px-6 transition-colors duration-300 hover:border-muted-foreground md:py-9 md:px-8',
                  glassCard,
                )}
              >
                <CornerMarks />
                <h3 className="font-display text-[clamp(20px,2vw,24px)] leading-[1.15] text-foreground italic">
                  {item.title}
                </h3>
                <p className="font-sans text-base leading-[1.65] font-light text-text-secondary">{item.body}</p>
              </article>
            ))}
          </div>
          <ChipRow items={content.whatComesNext.journey} connected className="mb-6" />
          <p className="mb-12 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.whatComesNext.journeyNote}
          </p>
          {/* Prose, not a tag grid. Ten tags here read as a fourth inventory on a
              page that already carries three; the same options fit in a sentence. */}
          <div className="max-w-[640px]">
            {content.whatComesNext.addOns.map((p, i) => (
              <p
                key={p}
                className={cn(
                  'mb-4 font-sans text-[17px] leading-[1.65] font-light last:mb-0',
                  i === 0 ? 'text-text-secondary' : 'text-muted-foreground italic',
                )}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <FaqSection faq={content.faq} />
    </>
  );
}
