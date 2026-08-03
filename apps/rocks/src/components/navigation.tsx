import type { ReactNode } from 'react';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { locales, localeConfig, type Locale } from '../i18n/utils';
import type { Strings } from '../i18n/types';
import { LanguagePicker } from './language-picker';

export interface NavigationProps {
  nav: Strings['nav'];
  languagePicker: Strings['languagePicker'];
  locale: Locale;
  /** Raw `Astro.url.pathname` — still locale-prefixed; stripped internally. */
  currentPath: string;
  /** ThemeToggle island, rendered with client:load by the calling .astro page. */
  children?: ReactNode;
}

export function Navigation({ nav, languagePicker, locale, currentPath, children }: NavigationProps) {
  const rawPagePath = currentPath.replace(/^\/(de-de|en-us)(\/|$)/, '/').replace(/\/$/, '') || '/';

  const languageLinks = locales.map((loc) => ({
    code: loc,
    label: localeConfig[loc].label,
    href: getRelativeLocaleUrl(loc, rawPagePath),
    active: loc === locale,
  }));

  return (
    <nav className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-4 md:flex-nowrap md:gap-0 md:px-20 md:py-7">
      <a
        className="w-full text-xs text-muted-foreground transition-colors hover:text-foreground min-[400px]:w-auto md:text-[13px] md:tracking-[0.02em]"
        href={getRelativeLocaleUrl(locale, '/')}
      >
        {nav.logo}
        <span className="text-primary">.</span>rocks
      </a>
      <div className="flex w-full flex-wrap items-center justify-start gap-2.5 min-[400px]:w-auto min-[400px]:flex-nowrap md:gap-4">
        <LanguagePicker links={languageLinks} label={languagePicker.label} />
        {children}
        <a
          className="border border-border px-3.5 py-2 font-mono text-[10px] tracking-[0.06em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary md:px-6 md:py-2.5 md:text-xs md:tracking-[0.08em]"
          href="https://www.sebastian-heitmann.dev/#contact"
        >
          {nav.contactCta}
        </a>
      </div>
    </nav>
  );
}
