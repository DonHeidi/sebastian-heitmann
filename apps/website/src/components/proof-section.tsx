import { DotRule } from './dot-rule';
import { ProofSchematicMoment } from './backdrop/proof-schematic-moment';
import type { Strings } from '@/i18n/types';

export interface ProofSectionProps {
  proof: Strings['proof'];
  webDevLink?: { label: string; href: string };
  tpmLink?: { label: string; href: string };
  aiLink?: { label: string; href: string };
}

const CORNERS = [
  { key: 'tl', pos: 'top-4 left-4 md:top-6 md:left-6 lg:top-10 lg:left-10', border: 'border-t border-l' },
  { key: 'tr', pos: 'top-4 right-4 md:top-6 md:right-6 lg:top-10 lg:right-10', border: 'border-t border-r' },
  { key: 'bl', pos: 'bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-10 lg:left-10', border: 'border-b border-l' },
  { key: 'br', pos: 'bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-10 lg:right-10', border: 'border-b border-r' },
];

export function ProofSection({ proof, webDevLink, tpmLink, aiLink }: ProofSectionProps) {
  return (
    <section
      id="proof"
      className="relative isolate mx-auto max-w-[1440px] py-[60px] px-6 md:px-12 md:py-20 lg:border-t lg:border-border lg:px-20 lg:py-[120px]"
    >
      <ProofSchematicMoment />
      {/* quiet-field seam patch for the writing seam below: hosted here, not in the
          writing section, so -z-10 puts it behind content instead of over these cards */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bd-grid-fine absolute bottom-[-80px] left-[8%] h-[300px] w-[280px] md:w-[430px]" />
      </div>
      {CORNERS.map((c) => (
        <span
          key={c.key}
          aria-hidden="true"
          className={`pointer-events-none absolute h-6 w-6 border-current text-text-faint md:h-9 md:w-9 ${c.pos} ${c.border}`}
        />
      ))}

      <div className="flex flex-col gap-[72px]">
        <div className="reveal flex items-center gap-6">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {proof.resultsLabel}
          </span>
          <DotRule />
        </div>

        <div className="flex flex-col gap-3">
          {proof.cases.map((c, i) => (
            /* `reveal` lives on a wrapper (like featured-articles) so the card's
               `transition-colors` utility can't outrank the reveal transition */
            <div key={c.tag} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
            <article
              className="grid grid-cols-1 items-baseline gap-3 border border-[var(--v8-glass-border)] bg-[var(--v8-glass-bg)] py-6 px-5 shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_24px_60px_-36px_rgba(0,0,0,0.25)] backdrop-blur-[12px] backdrop-saturate-[1.4] transition-colors hover:border-muted-foreground md:py-7 md:px-6 lg:grid-cols-[280px_1fr_auto] lg:gap-12 lg:py-9 lg:px-8"
            >
              <div className="flex flex-col gap-1">
                <span className="font-display text-[44px] leading-none tracking-[-0.02em] text-[var(--v8-metric-color)] lg:text-[56px]">
                  {c.metric}
                </span>
                <span className="font-sans text-sm font-light text-[var(--v8-metric-label-color)]">
                  {c.metricLabel}
                </span>
              </div>
              <p className="max-w-[520px] font-sans text-lg leading-[1.7] font-light text-text-tertiary">
                {c.description}
              </p>
              <span className="justify-self-start font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase lg:justify-self-end">
                {c.tag}
              </span>
            </article>
            </div>
          ))}
        </div>

        <div className="reveal flex flex-col">
          <div className="mb-6 flex items-center gap-6">
            <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              {proof.engagementLabel}
            </span>
            <DotRule />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {proof.engagements.map((e, i) => (
              <div
                key={e.model}
                className={`relative flex flex-col gap-5 border bg-[var(--v8-glass-bg)] pt-11 pb-9 px-8 shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_24px_60px_-36px_rgba(0,0,0,0.25)] backdrop-blur-[12px] backdrop-saturate-[1.4] transition-colors ${
                  e.featured ? 'border-border-accent' : 'border-[var(--v8-glass-border)]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-2 left-2 h-3 w-3 border-t border-l ${e.featured ? 'text-primary' : 'text-text-faint'}`}
                />
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r ${e.featured ? 'text-primary' : 'text-text-faint'}`}
                />
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {e.model}
                </span>
                <span
                  className={`font-display text-4xl leading-[1.1] tracking-[-0.01em] ${e.featured ? 'text-primary' : 'text-foreground'}`}
                >
                  {e.billing}
                </span>
                <p className="font-sans text-[15px] leading-[1.7] font-light text-text-tertiary">{e.description}</p>
                {i === 0 && tpmLink && (
                  <a
                    href={tpmLink.href}
                    className="group mt-auto inline-flex items-center gap-2.5 border-t border-border pt-4 font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4"
                  >
                    <span>{tpmLink.label}</span>
                    <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px]">
                      &rarr;
                    </span>
                  </a>
                )}
                {e.featured && aiLink && (
                  <a
                    href={aiLink.href}
                    className="group mt-auto inline-flex items-center gap-2.5 border-t border-border pt-4 font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4"
                  >
                    <span>{aiLink.label}</span>
                    <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px]">
                      &rarr;
                    </span>
                  </a>
                )}
                {e.featured && webDevLink && (
                  <a
                    href={webDevLink.href}
                    className={`group inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.08em] text-primary uppercase no-underline transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4 ${
                      aiLink ? 'pt-3' : 'mt-auto border-t border-border pt-4'
                    }`}
                  >
                    <span>{webDevLink.label}</span>
                    <span className="text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px]">
                      &rarr;
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
