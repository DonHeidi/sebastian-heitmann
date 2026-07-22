import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface CapabilitiesSectionProps {
  capabilities: Strings['capabilities'];
}

export function CapabilitiesSection({ capabilities }: CapabilitiesSectionProps) {
  return (
    <section className="relative isolate reveal mx-auto max-w-[1440px] px-6 py-10 md:px-12 md:py-[60px] lg:px-20 lg:py-20">
      {/* quiet-field seam patch: lives in THIS section, not the situations band below,
          because -z-10 only paints behind its own section's content — a patch hosted
          below and bled upward would paint on top of these cards */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bd-dots absolute bottom-[-150px] left-[6%] h-[300px] w-[280px]" />
      </div>
      <div className="mb-10 flex items-center gap-6 pb-8 md:mb-0">
        <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          {capabilities.eyebrow}
        </span>
        <DotRule />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.categories.map((cat, i) => (
          <div
            key={cat.title}
            className="grid grid-rows-subgrid row-span-2 border border-[var(--v8-glass-border)] bg-[var(--v8-glass-bg)] p-7 shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_24px_60px_-36px_rgba(0,0,0,0.25)] backdrop-blur-[12px] backdrop-saturate-[1.4] md:p-8"
          >
            <div className="mb-7 flex flex-col gap-3">
              <span className="font-mono text-[10px] tracking-[0.14em] text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-[clamp(22px,2.4vw,30px)] leading-[1.1] tracking-[-0.01em] text-foreground italic">
                {cat.title}
              </h3>
            </div>
            <ul className="flex flex-col gap-0 p-0 list-none">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="cursor-default border-t border-[var(--v8-glass-border)] py-2.5 font-mono text-xs tracking-[0.04em] text-text-secondary [transition:color_0.2s_ease,padding-left_0.3s_cubic-bezier(0.22,1,0.36,1)] hover:pl-2 hover:text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
