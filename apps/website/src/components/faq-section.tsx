import { DotRule } from './dot-rule';
import type { FaqContent } from '@/i18n/types';

export interface FaqSectionProps {
  faq: FaqContent;
}

// Native <details>/<summary>. The disclosure state is exposed to assistive tech
// and operated by keyboard for free, which is the only option consistent with
// the project rule that no React ships to the client — there is no `client:*`
// directive anywhere in this codebase and this component must not need one.
export function FaqSection({ faq }: FaqSectionProps) {
  return (
    <section className="reveal">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-10 md:px-12 md:pt-[60px] md:pb-[60px] lg:px-20 lg:pt-20 lg:pb-20">
        <div className="mb-8 flex items-center gap-6">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {faq.eyebrow}
          </span>
          <DotRule />
        </div>
        <h2 className="mb-8 font-display text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[-0.01em] text-foreground">
          {faq.headline}
        </h2>
        <div className="max-w-[900px]">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="group border-b border-border first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5 font-sans text-lg leading-[1.5] font-light text-text-secondary transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-xs text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
                >
                  ✱
                </span>
                <span className="group-open:text-foreground">{item.question}</span>
              </summary>
              <div className="max-w-[640px] pb-6 pl-8">
                {item.answer.map((p) => (
                  <p key={p} className="mb-4 font-sans text-base leading-[1.65] font-light text-text-tertiary last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
