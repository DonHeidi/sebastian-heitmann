import { Fragment, type ReactNode } from 'react';
import type { Strings } from '@/i18n/types';
import { ContactOrbitalMoment } from './backdrop/contact-orbital-moment';

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
  /**
   * Renders the orbital backdrop moment. Opt-in because this section is shared
   * with the service pages, while the backdrop composition is scoped to the
   * home page (see docs/superpowers/specs/2026-07-20-backdrop-composition-design.md).
   */
  showBackdropMoment?: boolean;
}

export function ContactSection({ contact, children, showBackdropMoment = false }: ContactSectionProps) {
  const headlineLines = contact.headline.split('\n');

  return (
    <section id="contact" className="relative isolate bg-surface-alt px-6 py-[60px] md:px-12 md:py-20 lg:px-20 lg:py-[120px]">
      {showBackdropMoment && <ContactOrbitalMoment />}
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
