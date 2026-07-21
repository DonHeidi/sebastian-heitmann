import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';

export interface SituationsSectionProps {
  situations: Strings['situations'];
}

export function SituationsSection({ situations }: SituationsSectionProps) {
  return (
    <section className="reveal mt-16 bg-surface-alt py-10 px-6 md:px-12 lg:px-20 lg:py-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <div className="flex items-center gap-6">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {situations.label}
          </span>
          <DotRule />
        </div>

        <ul className="flex list-none flex-col gap-0 p-0">
          {situations.items.map((item, i) => (
            <li
              key={item}
              className="group relative border-b border-border py-6 pl-8 font-sans text-[15px] leading-[1.6] font-light text-text-tertiary transition-colors first:border-t hover:text-foreground md:text-xl"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full border border-primary transition-colors group-hover:bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
