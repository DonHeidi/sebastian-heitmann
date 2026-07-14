import type { ComponentType, ReactNode } from 'react';
import { FileText, Folders, SlidersHorizontal, Rocket, ShieldCheck, Check, X } from 'lucide-react';
import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface WebProjectsContentProps {
  content: Strings['webProjects'];
  /** Resolved via `getRelativeLocaleUrl(locale, '/')` in the calling page. */
  homeUrl: string;
}

const packageIcons: ComponentType<{ size?: number; className?: string }>[] = [FileText, Folders, SlidersHorizontal];
const addonIcons: ComponentType<{ size?: number; className?: string }>[] = [Rocket, ShieldCheck, ShieldCheck, ShieldCheck];

const contactUrl = '#contact';

// Uniform section padding (pt/pb/px kept distinct rather than `py` so the
// "first section of a band" variant below can safely bump only pt without
// specificity/order ambiguity between utilities).
const sectionBase = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20';
// First section after a band transition (Packages after Hero, Comparison
// after Approach, and the solo-band FAQ) gets extra breathing room on
// desktop, matching the old `.wp-section:nth-child(n) { padding-top: 100px }`
// overrides.
const sectionFirst = 'px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-[100px] lg:pb-20';

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

function CtaLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 self-start border-b border-primary py-4 no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5"
    >
      <span className="font-mono text-xs tracking-[0.08em] text-foreground uppercase">{children}</span>
      <span className="text-base text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}

export function WebProjectsContent({ content, homeUrl }: WebProjectsContentProps) {
  return (
    <>
      {/* 1. Hero — unbanded, theme-swapped photo background, left-aligned glass card */}
      <section className="reveal relative flex min-h-[70vh] flex-col justify-end overflow-hidden px-6 pt-[120px] pb-10 md:min-h-[85vh] md:px-12 md:pb-[60px] lg:px-20 lg:pt-[160px] lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background-image:url('/images/hero-light.png')] [background-position:65%_center] [background-size:cover] md:[background-position:center] dark:[background-image:url('/images/hero-dark.png')]"
        />
        <div className="relative z-[1] flex w-full max-w-[800px] flex-col gap-6 border border-[var(--v8-glass-border)] bg-[var(--v8-glass-bg)] px-5 py-6 shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-[24px] backdrop-saturate-[1.35] md:px-14 md:py-12">
          <span className="mb-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {content.hero.eyebrow}
          </span>
          <h1 className="font-display text-[clamp(28px,7vw,40px)] leading-[1.05] tracking-[-0.02em] text-foreground italic md:text-[clamp(40px,6vw,72px)]">
            {content.hero.headline}
          </h1>
          <p className="max-w-[640px] font-sans text-[15px] leading-[1.65] font-light text-text-secondary md:text-xl">
            {content.hero.subline}
          </p>
          <CtaLink href={contactUrl}>{content.hero.cta}</CtaLink>
        </div>
      </section>

      {/* 2. Packages & Add-ons — LIGHT band (first section of the band) */}
      <section className="light reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionFirst}`}>
          <Eyebrow>{content.packages.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.packages.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.packages.intro}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {content.packages.items.map((pkg, i) => {
              const PackageIcon = packageIcons[i];
              return (
                <div
                  key={pkg.name}
                  className="flex flex-col border border-border p-8 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-muted-foreground"
                >
                  <PackageIcon aria-hidden="true" size={40} className="mb-4 shrink-0 text-primary" />
                  <h3 className="mb-1.5 font-display text-[clamp(22px,2.4vw,30px)] leading-[1.1] text-foreground italic">
                    {pkg.name}
                  </h3>
                  <span className="mb-3 font-mono text-sm tracking-[0.04em] text-primary">{pkg.price}</span>
                  <p className="mb-6 font-sans text-sm leading-[1.5] font-light text-muted-foreground italic">
                    {pkg.audience}
                  </p>
                  <ul className="mb-6 flex flex-1 list-none flex-col gap-0 p-0">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className="border-t border-border py-2.5 font-mono text-xs tracking-[0.04em] text-text-secondary last:border-b last:border-border"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-2 font-mono text-xs tracking-[0.04em] text-primary">
                    {pkg.delivery}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <CtaLink href={contactUrl}>{content.hero.cta}</CtaLink>
          </div>

          <div className="mt-20">
            <Eyebrow>{content.addons.eyebrow}</Eyebrow>
            <h3 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
              {content.addons.headline}
            </h3>
            <div className="grid grid-cols-1 border-t border-border md:grid-cols-2 lg:grid-cols-4">
              {content.addons.items.map((addon, i) => {
                const AddonIcon = addonIcons[i];
                return (
                  <div
                    key={addon.name}
                    className="flex flex-col border-b border-border py-8 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:border-muted-foreground md:odd:border-r md:odd:border-border md:odd:pr-6 md:even:pl-6 lg:border-r lg:border-border lg:pr-6 lg:pl-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                  >
                    <AddonIcon aria-hidden="true" size={32} className="mb-3 shrink-0 text-primary" />
                    <h4 className="mb-1.5 font-display text-[clamp(20px,2vw,26px)] leading-[1.1] text-foreground italic">
                      {addon.name}
                    </h4>
                    {addon.price && (
                      <span className="mb-3 font-mono text-[13px] tracking-[0.04em] text-primary">{addon.price}</span>
                    )}
                    <p className="mb-5 font-sans text-sm leading-[1.55] font-light text-muted-foreground">
                      {addon.description}
                    </p>
                    <ul className="mt-auto flex list-none flex-col gap-0 p-0">
                      {addon.features.map((f) => (
                        <li
                          key={f}
                          className="border-t border-border py-2 font-mono text-[11px] tracking-[0.02em] leading-[1.5] text-text-secondary last:border-b last:border-border"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 max-w-[72ch] font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-text-faint">
              {content.addons.supportNote}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Problem ("What counts") — LIGHT band */}
      <section className="light reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.problem.eyebrow}</Eyebrow>
          <p className="mb-8 max-w-[640px] font-sans text-xl leading-[1.65] font-light text-text-secondary">
            {content.problem.intro}
          </p>
          <ul className="flex list-none flex-col gap-0 p-0">
            {content.problem.items.map((item, i) => (
              <li
                key={item}
                className="group relative border-b border-border py-6 pl-8 font-sans text-[15px] leading-[1.6] font-light text-text-tertiary transition-colors duration-300 first:border-t hover:text-foreground md:text-xl"
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
        </div>
      </section>

      {/* 4. Approach — LIGHT band */}
      <section className="light reveal bg-background text-foreground">
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

      {/* 5. Comparison — DARK band (first section of the band) */}
      <section className="dark reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionFirst}`}>
          <Eyebrow>{content.comparison.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.comparison.headline}
          </h2>

          <div className="mt-2 border-t border-border">
            <div className="hidden border-b border-border md:grid md:grid-cols-[160px_repeat(3,1fr)] lg:grid-cols-[200px_repeat(3,1fr)]">
              <div />
              {content.comparison.columnHeaders.map((h) => (
                <div
                  key={h}
                  className="border-l border-border px-5 py-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
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
                    className={`border-b border-border py-3 font-sans text-[15px] leading-[1.55] font-light text-foreground last:border-b-0 md:border-b-0 md:border-l md:px-5 md:py-5 ${
                      ci === row.cells.length - 1 ? 'font-normal' : ''
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
        </div>
      </section>

      {/* 6. AI usage — DARK band */}
      <section className="dark reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.ai.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.ai.headline}
          </h2>
          <p className="mb-8 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.ai.intro}
          </p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col">
              <h3 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {content.ai.doesLabel}
              </h3>
              <ul className="flex list-none flex-col gap-0 p-0">
                {content.ai.does.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-border py-3.5 font-sans text-base leading-[1.6] font-light text-text-secondary first:border-t"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {content.ai.doesNotLabel}
              </h3>
              <ul className="flex list-none flex-col gap-0 p-0">
                {content.ai.doesNot.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-border py-3.5 font-sans text-base leading-[1.6] font-light text-text-faint first:border-t"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 max-w-[640px] font-sans text-[17px] leading-[1.65] font-light text-text-secondary">
            {content.ai.closing}
          </p>
        </div>
      </section>

      {/* 7. Scope — DARK band */}
      <section className="dark reveal bg-background text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.scope.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.scope.headline}
          </h2>
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
        </div>
      </section>

      {/* 8. Consulting bridge — DARK band, always dark (bg-surface-alt, not bg-background) */}
      <section className="dark bg-surface-alt text-foreground">
        <div className={`mx-auto max-w-[1440px] ${sectionBase}`}>
          <Eyebrow>{content.consulting.eyebrow}</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
            {content.consulting.headline}
          </h2>
          <div className="max-w-[640px]">
            {content.consulting.body.map((p, i) => (
              <p key={i} className="mb-5 font-sans text-[17px] leading-[1.65] font-light text-text-secondary last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <CtaLink href={homeUrl}>{content.consulting.cta}</CtaLink>
        </div>
      </section>

      {/* 9. FAQ — LIGHT band (first section of the band) */}
      <section className="light reveal bg-background text-foreground">
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
