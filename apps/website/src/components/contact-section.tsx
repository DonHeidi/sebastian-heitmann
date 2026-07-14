import { Fragment, type ReactNode } from 'react';
import type { Strings } from '@/i18n/types';

export interface ContactSectionProps {
  contact: Pick<Strings['contact'], 'headline' | 'intro'>;
  /**
   * The hydrated `<ContactForm client:visible ...>` island, rendered by the
   * calling `.astro` page and passed in as children — mirrors the
   * Navigation/ThemeToggle pattern (see navigation.tsx): Astro only
   * hydrates islands it renders directly, so a `<ContactForm>` imported and
   * rendered from inside this (static) component would never become
   * interactive.
   */
  children?: ReactNode;
}

export function ContactSection({ contact, children }: ContactSectionProps) {
  const headlineLines = contact.headline.split('\n');

  return (
    <section id="contact" className="bg-surface-alt px-6 py-[60px] md:px-12 md:py-20 lg:px-20 lg:py-[120px]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-[clamp(48px,8vw,80px)] leading-[0.9] tracking-[-0.02em] text-foreground lg:text-[clamp(64px,8vw,120px)]">
            {headlineLines.map((line, index) => (
              // Mirrors the old `set:html={headline.replace(/\n/g, '<br/>')}` —
              // done via React children instead of dangerouslySetInnerHTML.
              <Fragment key={index}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          <p className="max-w-[400px] font-sans text-[15px] leading-relaxed font-light text-muted-foreground">
            {contact.intro}
          </p>
        </div>

        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </section>
  );
}
