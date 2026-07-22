import type { ComponentType } from 'react';
import { Rocket, RefreshCw, Users, Workflow, ClipboardList, ArrowLeftRight, Eye, Check, X } from 'lucide-react';
import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface TechnicalProjectManagementContentProps {
  content: Strings['technicalProjectManagement'];
}

const situationIcons: ComponentType<{ size?: number; className?: string }>[] = [Rocket, RefreshCw, Users];
const serviceIcons: ComponentType<{ size?: number; className?: string }>[] = [
  Workflow,
  ClipboardList,
  ArrowLeftRight,
  Eye,
];

// Uniform section padding (pt/pb/px kept distinct rather than `py` so the
// "first section of a band" variant below can safely bump only pt without
// specificity/order ambiguity between utilities).
const sectionBase = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20';
// First section after a band transition (Definition after Hero, Services
// after the pull-quote break) gets extra breathing room on desktop, matching
// the old `.tpm-section:nth-child(n) { padding-top: 100px }` overrides.
const sectionFirst = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-[100px] lg:pb-20';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-6">
      <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {children}
      </span>
      <DotRule />
    </div>
  );
}

export function TechnicalProjectManagementContent({ content }: TechnicalProjectManagementContentProps) {
  return (
    <>
      {/* 1. Hero — unbanded, follows the page's ambient theme */}
      <section className="reveal mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pt-[100px] pb-10 md:px-12 md:pt-[120px] md:pb-[60px] lg:px-20 lg:pt-[140px] lg:pb-20">
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          {content.hero.eyebrow}
        </span>
        <h1 className="max-w-[900px] font-display text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-foreground italic">
          {content.hero.headline}
        </h1>
        <p className="max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
          {content.hero.subline}
        </p>
        <div className="flex flex-wrap gap-8">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 self-start border-b border-primary py-4 no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5"
          >
            <span className="font-mono text-xs tracking-[0.08em] text-foreground uppercase">{content.hero.cta}</span>
            <span className="text-base text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a
            href="#situations"
            className="group inline-flex items-center gap-3 self-start border-b border-border py-4 no-underline transition-[gap,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5 hover:border-muted-foreground"
          >
            <span className="font-mono text-xs tracking-[0.08em] text-foreground uppercase">
              {content.hero.ctaSecondary}
            </span>
            <span className="text-base text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1">
              &darr;
            </span>
          </a>
        </div>
      </section>

      {/* 2. Definition — LIGHT band (first section of the band) */}
      <section className="light v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionFirst}`}>
          <Eyebrow>{content.definition.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.definition.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.definition.intro}
          </p>
          <div className="mb-12 grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {content.definition.includes.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-b border-border py-4 font-sans text-base font-light text-text-tertiary"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              {content.definition.notLabel}
            </h3>
            <ul className="flex list-none flex-col gap-0 p-0">
              {content.definition.notItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 py-2.5 font-sans text-sm font-light text-text-faint"
                >
                  <X aria-hidden="true" size={16} className="shrink-0 text-text-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Situations — LIGHT band */}
      <section id="situations" className="light v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.situations.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.situations.headline}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {content.situations.items.map((item, i) => {
              const SituationIcon = situationIcons[i];
              return (
                <div
                  key={item.name}
                  className="flex flex-col border border-border p-8 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-muted-foreground"
                >
                  <SituationIcon aria-hidden="true" size={36} className="mb-4 shrink-0 text-primary" />
                  <h3 className="mb-2 font-display text-[clamp(22px,2.4vw,30px)] leading-[1.1] text-foreground italic">
                    {item.name}
                  </h3>
                  <p className="mb-4 font-sans text-sm font-light text-muted-foreground italic">{item.audience}</p>
                  <p className="mt-auto border-t border-border pt-4 font-sans text-[15px] leading-[1.6] font-light text-text-secondary">
                    {item.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Approach — LIGHT band */}
      <section className="light v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.approach.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.approach.headline}
          </h2>
          <div className="max-w-[640px] border-l-[3px] border-primary pl-7">
            {content.approach.body.map((p, i) => (
              <p
                key={i}
                className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="mt-6 max-w-[640px] border-t border-border pt-6">
            <p className="font-sans text-[15px] leading-[1.65] font-light text-muted-foreground">
              {content.approach.hybrid}
            </p>
          </div>
        </div>
      </section>

      {/* 4b. Pull-quote break — always accent-colored, independent of banding */}
      <div className="reveal flex items-center justify-center bg-primary px-6 py-[60px] text-center md:px-20 md:py-20">
        <p className="max-w-[900px] font-display text-[clamp(32px,4vw,56px)] leading-[1.15] tracking-[-0.01em] text-primary-foreground italic">
          {content.approach.headline}
        </p>
      </div>

      {/* 5. Services — DARK band (first section of the band) */}
      <section className="dark v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionFirst}`}>
          <Eyebrow>{content.services.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.services.headline}
          </h2>
          <div className="grid grid-cols-1 border-t border-border md:grid-cols-2 lg:grid-cols-4">
            {content.services.categories.map((cat, i) => {
              const ServiceIcon = serviceIcons[i];
              return (
                <div
                  key={cat.title}
                  className="flex flex-col border-b border-border py-8 md:odd:border-r md:odd:border-border md:odd:pr-6 md:even:pl-6 lg:border-r lg:border-border lg:pr-6 lg:pl-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <ServiceIcon aria-hidden="true" size={32} className="mb-3 shrink-0 text-primary" />
                  <h3 className="mb-5 font-display text-[clamp(20px,2vw,26px)] leading-[1.1] text-foreground italic">
                    {cat.title}
                  </h3>
                  <p className="mt-auto border-t border-border pt-4 font-sans text-sm font-light text-text-secondary">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Comparison — DARK band */}
      <section className="dark v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.comparison.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.comparison.headline}
          </h2>

          <div className="mt-2 border-t border-border">
            <div className="hidden border-b border-border md:grid md:grid-cols-[160px_repeat(3,1fr)] lg:grid-cols-[200px_repeat(3,1fr)]">
              <div />
              {content.comparison.columnHeaders.map((h, i) => (
                <div
                  key={h}
                  className={`border-l border-border px-5 py-4 font-mono text-[10px] tracking-[0.12em] uppercase ${
                    i === 0
                      ? 'border-t-2 border-t-primary bg-primary/10 text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {h}
                </div>
              ))}
            </div>

            {content.comparison.rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col border-b border-border py-5 first:border-t md:grid md:grid-cols-[160px_repeat(3,1fr)] md:border-t-0 md:py-0 lg:grid-cols-[200px_repeat(3,1fr)]"
              >
                <div className="flex items-start border-b border-border pb-3 font-mono text-[13px] font-medium tracking-[0.04em] text-foreground md:border-b-0 md:py-5 md:pr-5 md:text-xs md:font-normal">
                  {row.label}
                </div>
                {row.cells.map((cell, ci) => (
                  <div
                    key={ci}
                    className={`border-b border-border py-3 font-sans text-[15px] leading-[1.55] font-light text-foreground last:border-b-0 md:border-b-0 md:border-l md:py-5 md:px-5 ${
                      ci === 0 ? 'font-normal md:bg-primary/10' : ''
                    }`}
                  >
                    <span className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase md:hidden">
                      {content.comparison.columnHeaders[ci]}
                    </span>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.comparison.closing}
          </p>
        </div>
      </section>

      {/* 7. Scope — DARK band */}
      <section className="dark v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.scope.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.scope.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.scope.intro}
          </p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col">
              <h3 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {content.scope.includedLabel}
              </h3>
              <ul className="flex list-none flex-col gap-0 p-0">
                {content.scope.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-border py-3.5 font-sans text-base leading-[1.6] font-light text-text-secondary first:border-t"
                  >
                    <Check aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {content.scope.notIncludedLabel}
              </h3>
              <ul className="flex list-none flex-col gap-0 p-0">
                {content.scope.notIncluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-border py-3.5 font-sans text-base leading-[1.6] font-light text-text-faint first:border-t"
                  >
                    <X aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-text-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.scope.billingNote}
          </p>
        </div>
      </section>

      {/* 8. FAQ — LIGHT band (first section of the band) */}
      <section className="light v8-grain reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionFirst}`}>
          <Eyebrow>{content.faq.eyebrow}</Eyebrow>
          <div>
            {content.faq.items.map((item) => (
              <details
                key={item.q}
                className="group border-b border-border transition-colors first:border-t hover:bg-surface-alt"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-sans text-lg font-normal text-foreground transition-colors marker:content-none hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rotate-[-45deg] border-r-[1.5px] border-b-[1.5px] border-muted-foreground transition-transform duration-250 ease-in-out group-open:rotate-[45deg]"
                  />
                </summary>
                <p className="max-w-[640px] pb-6 font-sans text-[15px] leading-[1.65] font-light text-text-secondary">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
