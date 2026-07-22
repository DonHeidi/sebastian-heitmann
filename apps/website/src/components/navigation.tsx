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
  /**
   * The theme toggle, rendered by the calling .astro file with its own
   * `client:load` directive. Astro can only hydrate islands it renders
   * directly — a <ThemeToggle> imported and rendered from inside this (static)
   * component would never become interactive. So the .astro page renders
   * `<Navigation ...><ThemeToggle client:load .../></Navigation>` and this
   * component just places the already-processed island via `children`.
   */
  children?: ReactNode;
}

// Asymmetric route mapping for pages with different slugs per locale.
const routeMap: Record<string, Record<string, string>> = {
  '/web-entwicklung': { 'en-us': '/web-development', 'de-de': '/web-entwicklung' },
  '/web-development': { 'en-us': '/web-development', 'de-de': '/web-entwicklung' },
  '/technical-project-management': {
    'en-us': '/technical-project-management',
    'de-de': '/technisches-projektmanagement',
  },
  '/technisches-projektmanagement': {
    'en-us': '/technical-project-management',
    'de-de': '/technisches-projektmanagement',
  },
  '/ai-process-automation': {
    'en-us': '/ai-process-automation',
    'de-de': '/ki-prozess-automation',
  },
  '/ki-prozess-automation': {
    'en-us': '/ai-process-automation',
    'de-de': '/ki-prozess-automation',
  },
};

function getPagePathForLocale(rawPagePath: string, loc: Locale): string {
  const mapping = routeMap[rawPagePath];
  if (mapping && mapping[loc]) return mapping[loc];
  return rawPagePath;
}

export function Navigation({ nav, languagePicker, locale, currentPath, children }: NavigationProps) {
  const rawPagePath = currentPath.replace(/^\/(de-de|en-us)(\/|$)/, '/').replace(/\/$/, '') || '/';

  const languageLinks = locales.map((loc) => ({
    code: loc,
    label: localeConfig[loc].label,
    href: getRelativeLocaleUrl(loc, getPagePathForLocale(rawPagePath, loc)),
    active: loc === locale,
  }));

  return (
    <nav className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-4 md:flex-nowrap md:gap-0 md:px-20 md:py-7">
      <a
        className="w-full text-xs text-muted-foreground transition-colors hover:text-foreground min-[400px]:w-auto md:text-[13px] md:tracking-[0.02em]"
        href={getRelativeLocaleUrl(locale, '/')}
      >
        {nav.logo}
        {/* The i18n `logoDot` field is unused here too — the old
            navigation.astro markup hardcoded ".dev" regardless of its
            value, so this preserves the exact current rendered output. */}
        <span className="text-primary">.</span>dev
      </a>
      <div className="flex w-full flex-wrap items-center justify-start gap-2.5 min-[400px]:w-auto min-[400px]:flex-nowrap md:gap-4">
        <LanguagePicker links={languageLinks} label={languagePicker.label} />
        {children}
        <a
          className="border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-muted-foreground hover:text-foreground"
          href={getRelativeLocaleUrl(locale, 'cv')}
        >
          {nav.cvLabel}
        </a>
        <a
          className="border border-border px-3.5 py-2 font-mono text-[10px] tracking-[0.06em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary md:px-6 md:py-2.5 md:text-xs md:tracking-[0.08em]"
          href={`${getRelativeLocaleUrl(locale, '/')}#contact`}
        >
          {nav.cta}
        </a>
      </div>
    </nav>
  );
}
