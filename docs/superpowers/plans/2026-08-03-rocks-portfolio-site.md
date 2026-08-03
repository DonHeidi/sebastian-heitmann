# sebastian-heitmann.rocks Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and wire up the `sebastian-heitmann.rocks` portfolio site: a new Astro app `apps/rocks` plus Scaleway hosting/DNS Terraform, a deploy script, and a DNS onboarding runbook.

**Architecture:** New Bun workspace mirroring `apps/website` conventions (Astro 7, Tailwind v4, `--v8-asterisk` tokens, React islands, en-us/de-de i18n). Infra mirrors the `.dev` resources in the existing `infra/` Terraform root: second bucket, second Edge Services pipeline, second apex-redirect function (same handler zip), new DNS zone file. Spec: `docs/superpowers/specs/2026-08-03-rocks-portfolio-site-design.md`.

**Tech Stack:** Astro 7, Tailwind v4, React 19, TypeScript, Bun workspaces, Terraform (Scaleway provider ~> 2.70), rclone.

## Global Constraints

- Install dependencies with `bun add` (latest versions); never hand-edit versions into package.json.
- Components are `.tsx`, accept typed string props, no hardcoded user-visible text; interactive components are React islands hydrated from the calling `.astro` page (`client:*` directive). No `<style>` blocks, no SCSS.
- All colors/fonts via `--v8-*` custom properties; both `.dark` and `.light` must work.
- Conventional commits (`feat(rocks): …`, `feat(infra): …`, `docs(…): …`).
- Site origin is `https://www.sebastian-heitmann.rocks`; canonical URLs use trailing slashes.
- en-us is unprefixed, de-de lives under `/de-de/`. Every case-study entry MUST exist in both locales (same slug under `src/content/cases/en-us/` and `src/content/cases/de-de/`).
- No contact form, no mail service wiring, no varlock in `apps/rocks` (the app has no env vars).
- Work happens in the existing worktree branch `worktree-feat-rocks-portfolio-site`. Never push `main`; final delivery is a pushed branch + PR.
- The repo has no JS test framework for apps; verification for app tasks is `bun run build` succeeding plus rendered-output checks described per task. Terraform verification is `terraform fmt -check` + `terraform validate`.

---

### Task 1: Buildable `apps/rocks` skeleton

**Files:**
- Create: `apps/rocks/package.json` (via `bun init`-less manual file + `bun add`)
- Create: `apps/rocks/astro.config.mjs`
- Create: `apps/rocks/tsconfig.json` (copy)
- Create: `apps/rocks/src/styles/{global.css,v8-theme.css,v8-fonts.css}` (copies)
- Create: `apps/rocks/src/lib/utils.ts` (copy)
- Create: `apps/rocks/public/fonts/*` (copies), `apps/rocks/public/favicon.svg` (copy), `apps/rocks/public/robots.txt` (new)
- Create: `apps/rocks/src/pages/index.astro` (temporary placeholder, replaced in Task 5)

**Interfaces:**
- Consumes: nothing.
- Produces: a workspace where `bun run build` succeeds; `src/styles/global.css` importable as `../styles/global.css`; `cn()` from `@/lib/utils`.

- [ ] **Step 1: Create the workspace manifest**

Write `apps/rocks/package.json`:

```json
{
  "name": "sebastian-heitmann-rocks",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 2: Install dependencies (latest)**

```bash
cd apps/rocks
bun add astro @astrojs/react @astrojs/sitemap react react-dom tailwindcss @tailwindcss/vite tailwind-merge clsx class-variance-authority sharp lucide-react radix-ui @icons-pack/react-simple-icons
bun add -d @types/react @types/react-dom @types/bun typescript
```

- [ ] **Step 3: Astro config, tsconfig, styles, fonts, robots**

Write `apps/rocks/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://www.sebastian-heitmann.rocks',
    integrations: [sitemap(), react()],
    i18n: {
        locales: ['en-us', 'de-de'],
        defaultLocale: 'en-us',
        routing: {
            prefixDefaultLocale: false,
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
```

Copy the rest verbatim from the sibling app (paths relative to repo root):

```bash
cp apps/website/tsconfig.json apps/rocks/tsconfig.json
mkdir -p apps/rocks/src/styles apps/rocks/src/lib apps/rocks/public/fonts
cp apps/website/src/styles/global.css apps/website/src/styles/v8-theme.css apps/website/src/styles/v8-fonts.css apps/rocks/src/styles/
cp apps/website/src/lib/utils.ts apps/rocks/src/lib/utils.ts
cp apps/website/public/fonts/*.woff2 apps/rocks/public/fonts/
cp apps/website/public/favicon.svg apps/rocks/public/favicon.svg
```

Do NOT copy `cv-print.css` (CV stays on `.dev`). Write `apps/rocks/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://www.sebastian-heitmann.rocks/sitemap-index.xml
```

- [ ] **Step 4: Placeholder index page**

Write `apps/rocks/src/pages/index.astro` (replaced in Task 5; exists so the build emits something):

```astro
---
import '../styles/global.css';
---
<html lang="en"><head><meta charset="UTF-8"><title>sebastian-heitmann.rocks</title></head><body><h1>rocks skeleton</h1></body></html>
```

- [ ] **Step 5: Verify the build**

Run: `cd apps/rocks && bun run build`
Expected: build completes, `dist/index.html` exists. If Tailwind or React versions conflict, fix with `bun add` (never hand-pin).

- [ ] **Step 6: Commit**

```bash
git add apps/rocks bun.lock
git commit -m "feat(rocks): scaffold buildable apps/rocks workspace"
```

---

### Task 2: i18n module and Layout

**Files:**
- Create: `apps/rocks/src/i18n/types.ts`
- Create: `apps/rocks/src/i18n/en-us.ts`
- Create: `apps/rocks/src/i18n/de-de.ts`
- Create: `apps/rocks/src/i18n/utils.ts`
- Create: `apps/rocks/src/layouts/Layout.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` (Task 1).
- Produces: `Strings` interface; `getStrings(locale)`, `locales`, `localeConfig`, `type Locale`, `siteOrigin()`, `absoluteUrl(path)`, `getHreflangAlternates(enPath, dePath?)` from `../i18n/utils`; `Layout.astro` with props `{ locale, title, description, alternates?, includeRedirectScript?, ogType?, canonical? }`.

- [ ] **Step 1: Write `src/i18n/types.ts`**

```ts
export interface Strings {
  meta: {
    title: string;
    description: string;
    notFoundTitle: string;
  };
  nav: {
    logo: string;
    contactCta: string;
  };
  languagePicker: {
    label: string;
  };
  hero: {
    kicker: string;
    heading: string;
    intro: string;
  };
  cases: {
    sectionTitle: string;
    readCase: string;
    roleLabel: string;
    stackLabel: string;
    linksLabel: string;
    periodLabel: string;
    ongoing: string;
    backToOverview: string;
  };
  projects: {
    sectionTitle: string;
  };
  teasers: {
    sectionTitle: string;
    intro: string;
    readOn: string;
  };
  footer: {
    copyright: string;
    privacyLabel: string;
    imprintLabel: string;
    contactLabel: string;
  };
  notFound: {
    heading: string;
    body: string;
    backHome: string;
  };
}
```

- [ ] **Step 2: Write `src/i18n/en-us.ts`**

```ts
import type { Strings } from './types';

export const enUs: Strings = {
  meta: {
    title: 'Sebastian Heitmann — Portfolio',
    description: 'Case studies and projects by Sebastian Heitmann: product engineering, platform work, and AI-assisted delivery.',
    notFoundTitle: 'Page not found — Sebastian Heitmann',
  },
  nav: {
    logo: 'sebastian-heitmann',
    contactCta: 'Get in touch',
  },
  languagePicker: {
    label: 'Language',
  },
  hero: {
    kicker: 'Portfolio',
    heading: 'Work that ships.',
    intro: 'I build products and platforms end to end: architecture, code, infrastructure, and the delivery process around them. These are selected case studies and projects.',
  },
  cases: {
    sectionTitle: 'Case studies',
    readCase: 'Read case study',
    roleLabel: 'Role',
    stackLabel: 'Stack',
    linksLabel: 'Links',
    periodLabel: 'Period',
    ongoing: 'ongoing',
    backToOverview: 'Back to overview',
  },
  projects: {
    sectionTitle: 'Projects',
  },
  teasers: {
    sectionTitle: 'Writing',
    intro: 'Longer-form thinking lives on sebastian-heitmann.dev. A few picks:',
    readOn: 'Read on sebastian-heitmann.dev',
  },
  footer: {
    copyright: '© 2026 Sebastian Heitmann',
    privacyLabel: 'Privacy',
    imprintLabel: 'Imprint',
    contactLabel: 'Contact',
  },
  notFound: {
    heading: '404',
    body: 'This page does not exist.',
    backHome: 'Back to the start',
  },
};
```

- [ ] **Step 3: Write `src/i18n/de-de.ts`**

```ts
import type { Strings } from './types';

export const deDe: Strings = {
  meta: {
    title: 'Sebastian Heitmann — Portfolio',
    description: 'Fallstudien und Projekte von Sebastian Heitmann: Produktentwicklung, Plattform-Arbeit und KI-gestützte Umsetzung.',
    notFoundTitle: 'Seite nicht gefunden — Sebastian Heitmann',
  },
  nav: {
    logo: 'sebastian-heitmann',
    contactCta: 'Kontakt aufnehmen',
  },
  languagePicker: {
    label: 'Sprache',
  },
  hero: {
    kicker: 'Portfolio',
    heading: 'Arbeit, die live geht.',
    intro: 'Ich baue Produkte und Plattformen von Anfang bis Ende: Architektur, Code, Infrastruktur und den Lieferprozess drumherum. Hier: ausgewählte Fallstudien und Projekte.',
  },
  cases: {
    sectionTitle: 'Fallstudien',
    readCase: 'Fallstudie lesen',
    roleLabel: 'Rolle',
    stackLabel: 'Stack',
    linksLabel: 'Links',
    periodLabel: 'Zeitraum',
    ongoing: 'laufend',
    backToOverview: 'Zurück zur Übersicht',
  },
  projects: {
    sectionTitle: 'Projekte',
  },
  teasers: {
    sectionTitle: 'Texte',
    intro: 'Längere Texte erscheinen auf sebastian-heitmann.dev. Eine Auswahl:',
    readOn: 'Auf sebastian-heitmann.dev lesen',
  },
  footer: {
    copyright: '© 2026 Sebastian Heitmann',
    privacyLabel: 'Datenschutz',
    imprintLabel: 'Impressum',
    contactLabel: 'Kontakt',
  },
  notFound: {
    heading: '404',
    body: 'Diese Seite existiert nicht.',
    backHome: 'Zurück zum Anfang',
  },
};
```

- [ ] **Step 4: Write `src/i18n/utils.ts`**

Same shape as the `.dev` one, with the `.rocks` origin and no env lookup:

```ts
import type { Strings } from './types';
import { enUs } from './en-us';
import { deDe } from './de-de';

export type Locale = 'en-us' | 'de-de';

export const locales: Locale[] = ['en-us', 'de-de'];
export const defaultLocale: Locale = 'en-us';

const strings: Record<Locale, Strings> = {
  'en-us': enUs,
  'de-de': deDe,
};

export function getStrings(locale: string | undefined): Strings {
  return strings[(locale as Locale) ?? defaultLocale] ?? strings[defaultLocale];
}

export const localeConfig: Record<Locale, { flag: string; label: string; htmlLang: string }> = {
  'en-us': { flag: '🇺🇸', label: 'EN', htmlLang: 'en' },
  'de-de': { flag: '🇩🇪', label: 'DE', htmlLang: 'de-DE' },
};

export function siteOrigin(): string {
  return 'https://www.sebastian-heitmann.rocks';
}

// Absolute URL with a trailing slash — hreflang/canonical targets must match the
// canonical (trailing-slash) form exactly, or Google crawls a 301 per reference.
export function absoluteUrl(path: string): string {
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${siteOrigin()}${withSlash}`;
}

// Hreflang pair for a page. `dePath` defaults to the /de-de/-prefixed mirror of
// `enPath`. x-default points at the English page (site default).
export function getHreflangAlternates(enPath: string, dePath?: string) {
  const en = absoluteUrl(enPath);
  const de = absoluteUrl(dePath ?? `/de-de${enPath === '/' ? '/' : enPath}`);
  return [
    { hreflang: 'en', href: en },
    { hreflang: 'de-DE', href: de },
    { hreflang: 'x-default', href: en },
  ];
}
```

- [ ] **Step 5: Write `src/layouts/Layout.astro`**

Adapted from `apps/website/src/layouts/Layout.astro`. Differences: `.rocks` origin, JSON-LD is a `Person` (not `ProfessionalService`, no street address), no `msvalidate.01` meta, no default OG image (none exists yet). Theme anti-FOUC script, first-visit redirect script, and reveal observer are kept verbatim.

```astro
---
import '../styles/global.css';
import { localeConfig } from '../i18n/utils';
import type { Locale } from '../i18n/utils';

type Props = {
  locale: Locale;
  title: string;
  description: string;
  alternates?: Array<{ hreflang: string; href: string }>;
  includeRedirectScript?: boolean;
  ogType?: string;
  canonical?: string;
};

const {
  locale,
  title,
  description,
  alternates = [],
  includeRedirectScript = false,
  ogType = 'website',
  canonical,
} = Astro.props;
const htmlLang = localeConfig[locale].htmlLang;
const siteOrigin = 'https://www.sebastian-heitmann.rocks';
const canonicalUrl = canonical ?? `${siteOrigin}${Astro.url.pathname}`;
---

<html lang={htmlLang}>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="apple-touch-icon" href="/favicon.svg">
        <meta name="theme-color" content="#0C0C0C">
        <title>{title}</title>
        <meta name="description" content={description}>
        <link rel="canonical" href={canonicalUrl}>
        <meta property="og:type" content={ogType}>
        <meta property="og:title" content={title}>
        <meta property="og:description" content={description}>
        <meta property="og:url" content={canonicalUrl}>
        <meta property="og:locale" content={locale === 'de-de' ? 'de_DE' : 'en_US'}>
        <meta property="og:locale:alternate" content={locale === 'de-de' ? 'en_US' : 'de_DE'}>
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content={title}>
        <meta name="twitter:description" content={description}>
        <link rel="preload" href="/fonts/InstrumentSerif-Regular.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/IBMPlexMono-Regular.woff2" as="font" type="font/woff2" crossorigin>
        {alternates.map(alt => (
            <link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
        ))}
        <script type="application/ld+json" set:html={JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sebastian Heitmann",
            "jobTitle": "Technology Consultant",
            "description": description,
            "url": "https://www.sebastian-heitmann.rocks",
            "sameAs": [
                "https://www.sebastian-heitmann.dev",
                "https://www.linkedin.com/in/sebastian-heitmann/",
                "https://github.com/DonHeidi"
            ],
            "knowsLanguage": ["de", "en"]
        })} />
        <script is:inline>
            (function() {
                var stored = localStorage.getItem('theme');
                if (stored === 'dark' || stored === 'light') {
                    document.documentElement.classList.add(stored);
                } else {
                    document.documentElement.classList.add(
                        window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
                    );
                }
            })();
        </script>
        <slot name="head" />
        {includeRedirectScript && (
            <script is:inline>
                (function() {
                    if (localStorage.getItem('locale')) return;
                    var lang = (navigator.language || '').toLowerCase();
                    var target;
                    if (lang.startsWith('de')) target = 'de-de';
                    if (target) {
                        localStorage.setItem('locale', target);
                        window.location.replace('/' + target + '/');
                    } else {
                        localStorage.setItem('locale', 'en-us');
                    }
                })();
            </script>
        )}
    </head>
    <body>
        <slot />
    </body>
</html>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    });
</script>
```

- [ ] **Step 6: Verify the build**

Run: `cd apps/rocks && bun run build`
Expected: build passes (Layout not yet referenced by a page; this catches TS/syntax errors via the build's type-aware compile of imported modules only after Task 5 — for now expect a clean build with the placeholder page).

- [ ] **Step 7: Commit**

```bash
git add apps/rocks/src
git commit -m "feat(rocks): add i18n module and shared layout"
```

---

### Task 3: Cases content collection with seed entries

**Files:**
- Create: `apps/rocks/src/content.config.ts`
- Create: `apps/rocks/src/content/cases/en-us/portfolio-platform.md`
- Create: `apps/rocks/src/content/cases/de-de/portfolio-platform.md`

**Interfaces:**
- Consumes: nothing new.
- Produces: collection `cases`; entry ids are `<locale>/<slug>`; helpers pattern for pages: `caseLocale(id) = id.split('/')[0]`, `caseSlug(id) = id.split('/').slice(1).join('/')`. Schema fields: `title, summary, kind ('case-study'|'project'), role, stack (string[]), startDate, endDate?, links ({label,url}[]), cover?, featured, draft`.

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['case-study', 'project']).default('case-study'),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    cover: image().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
```

- [ ] **Step 2: Seed one real entry (both locales)**

This entry is true and demonstrable (this repo); Sebastian's own content extends or replaces it later. Write `src/content/cases/en-us/portfolio-platform.md`:

```markdown
---
title: 'sebastian-heitmann.dev — site and cloud platform'
summary: 'A bilingual Astro site with a fully terraformed Scaleway platform behind it: CDN, serverless functions, DNS, and transactional email — deployed from a Bun monorepo.'
kind: 'case-study'
role: 'Design, development, and operations'
stack: ['Astro', 'TypeScript', 'Tailwind v4', 'Bun', 'Terraform', 'Scaleway']
startDate: 2026-05-01
links:
  - label: 'Live site'
    url: 'https://www.sebastian-heitmann.dev'
featured: true
draft: false
---

## The setup

sebastian-heitmann.dev is a bilingual (English/German) static site built with Astro and a precision-Swiss design system, served from Scaleway Object Storage behind an Edge Services CDN.

## What makes it interesting

Everything around the site is code. Terraform manages the project, bucket, CDN pipeline, DNS zone, a serverless contact-form function, and the transactional-email domain. Secrets never touch disk: a varlock schema per workspace resolves them from Proton Pass at runtime. Deploys are two idempotent scripts.

## Outcome

A site whose entire platform can be rebuilt from a clean machine with three commands, and whose DNS — including live Microsoft 365 mail records — moved registrar-free from GoDaddy to Scaleway with a documented, reversible runbook.
```

Write `src/content/cases/de-de/portfolio-platform.md`:

```markdown
---
title: 'sebastian-heitmann.dev — Website und Cloud-Plattform'
summary: 'Eine zweisprachige Astro-Website mit vollständig terraformter Scaleway-Plattform dahinter: CDN, Serverless Functions, DNS und Transaktions-E-Mail — deployt aus einem Bun-Monorepo.'
kind: 'case-study'
role: 'Design, Entwicklung und Betrieb'
stack: ['Astro', 'TypeScript', 'Tailwind v4', 'Bun', 'Terraform', 'Scaleway']
startDate: 2026-05-01
links:
  - label: 'Live-Website'
    url: 'https://www.sebastian-heitmann.dev'
featured: true
draft: false
---

## Ausgangslage

sebastian-heitmann.dev ist eine zweisprachige (Englisch/Deutsch) statische Website, gebaut mit Astro und einem Precision-Swiss-Designsystem, ausgeliefert über Scaleway Object Storage hinter einem Edge-Services-CDN.

## Was daran interessant ist

Alles um die Website herum ist Code. Terraform verwaltet Projekt, Bucket, CDN-Pipeline, DNS-Zone, eine Serverless Function für das Kontaktformular und die Transaktions-E-Mail-Domain. Secrets landen nie auf der Platte: Ein varlock-Schema pro Workspace löst sie zur Laufzeit aus Proton Pass auf. Deploys sind zwei idempotente Skripte.

## Ergebnis

Eine Website, deren gesamte Plattform sich mit drei Befehlen von einer frischen Maschine wiederherstellen lässt — und deren DNS inklusive produktiver Microsoft-365-Mail-Records ohne Registrar-Wechsel dokumentiert und reversibel von GoDaddy zu Scaleway umgezogen ist.
```

- [ ] **Step 3: Verify the build**

Run: `cd apps/rocks && bun run build`
Expected: build passes; collection compiles without schema errors (the collection is not yet rendered — schema errors still surface at sync time).

- [ ] **Step 4: Commit**

```bash
git add apps/rocks/src/content.config.ts apps/rocks/src/content
git commit -m "feat(rocks): add cases collection with seed case study"
```

---

### Task 4: Site chrome components (navigation, footer, toggles)

**Files:**
- Create: `apps/rocks/src/components/theme-toggle.tsx` (copy)
- Create: `apps/rocks/src/components/ui/toggle-group.tsx`, `apps/rocks/src/components/ui/toggle.tsx` (copies)
- Create: `apps/rocks/src/components/language-picker.tsx` (copy)
- Create: `apps/rocks/src/components/social-icons.tsx` (copy)
- Create: `apps/rocks/src/components/navigation.tsx` (new, simplified)
- Create: `apps/rocks/src/components/footer.tsx` (new)

**Interfaces:**
- Consumes: `Strings`, `Locale`, `locales`, `localeConfig` (Task 2); `cn()` (Task 1).
- Produces: `Navigation({ nav, languagePicker, locale, currentPath, children })` — `children` is the ThemeToggle island rendered by the calling page; `Footer({ footer })` with fixed absolute `.dev` links inside; `ThemeToggle({ labels })` copied as-is (check its props in the copied file and pass what it declares).

- [ ] **Step 1: Copy the reusable components verbatim**

```bash
mkdir -p apps/rocks/src/components/ui
cp apps/website/src/components/theme-toggle.tsx apps/rocks/src/components/
cp apps/website/src/components/language-picker.tsx apps/rocks/src/components/
cp apps/website/src/components/social-icons.tsx apps/rocks/src/components/
cp apps/website/src/components/ui/toggle-group.tsx apps/website/src/components/ui/toggle.tsx apps/rocks/src/components/ui/
```

Then open each copied file and fix imports that reference things `apps/rocks` doesn't have (e.g. if `theme-toggle.tsx` imports strings types, keep them; all four import only `@/lib/utils`, `lucide-react`, `radix-ui`, and each other, so normally no edits are needed). If `theme-toggle.tsx` declares label props typed against `Strings`, adjust the import to `../i18n/types`.

- [ ] **Step 2: Write `src/components/navigation.tsx`**

Simplified from the `.dev` navigation: no route map (rocks has no per-locale slugs), no CV link, logo suffix `.rocks`, CTA links to the `.dev` contact section.

```tsx
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
```

- [ ] **Step 3: Write `src/components/footer.tsx`**

Legal/contact links are absolute URLs into `.dev` (spec: no duplicated legal pages). Socials match the `.dev` footer.

```tsx
import { SiBluesky, SiGithub } from '@icons-pack/react-simple-icons';
import { LinkedInIcon } from './social-icons';
import type { Strings } from '../i18n/types';

export interface FooterProps {
  footer: Strings['footer'];
}

const DEV = 'https://www.sebastian-heitmann.dev';

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="mx-auto max-w-[1440px] border-t-2 border-primary p-6 md:py-10 md:px-20">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <span className="flex-1 font-mono text-[11px] text-muted-foreground">{footer.copyright}</span>
        <div className="flex flex-1 justify-center gap-6">
          <a href={`${DEV}/privacy`} className="font-mono text-[11px] text-muted-foreground no-underline transition-colors hover:text-foreground">
            {footer.privacyLabel}
          </a>
          <a href={`${DEV}/imprint`} className="font-mono text-[11px] text-muted-foreground no-underline transition-colors hover:text-foreground">
            {footer.imprintLabel}
          </a>
          <a href={`${DEV}/#contact`} className="font-mono text-[11px] text-muted-foreground no-underline transition-colors hover:text-foreground">
            {footer.contactLabel}
          </a>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <a href="https://www.linkedin.com/in/sebastian-heitmann/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground">
            <LinkedInIcon size={14} />
          </a>
          <a href="https://github.com/DonHeidi" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground">
            <SiGithub size={14} color="currentColor" />
          </a>
          <a href="https://bsky.app/profile/e2e-developer.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground">
            <SiBluesky size={14} color="currentColor" />
          </a>
        </div>
      </div>
    </footer>
  );
}
```

Note: the German footer links point at the same English `.dev` privacy/imprint URLs; `.dev` handles its own locale switching. If `.dev` has `/de-de/privacy` and `/de-de/imprint` pages, this is acceptable v1 behavior; do not build locale-aware external links now (YAGNI).

- [ ] **Step 4: Verify the build**

Run: `cd apps/rocks && bun run build`
Expected: build passes (components unreferenced but type-checked when imported in Task 5; run `bunx astro check` if available for early signal — treat check errors in copied files as fix-now).

- [ ] **Step 5: Commit**

```bash
git add apps/rocks/src/components
git commit -m "feat(rocks): add site chrome components"
```

---

### Task 5: Landing page (both locales) with cases, projects, and blog teasers

**Files:**
- Create: `apps/rocks/src/data/blog-teasers.ts`
- Create: `apps/rocks/src/components/hero.tsx`
- Create: `apps/rocks/src/components/case-card.tsx`
- Create: `apps/rocks/src/components/teaser-card.tsx`
- Create: `apps/rocks/src/pages/index.astro` (replace placeholder)
- Create: `apps/rocks/src/pages/de-de/index.astro`

**Interfaces:**
- Consumes: `Strings`, `getStrings`, `getHreflangAlternates` (Task 2); `cases` collection (Task 3); `Navigation`, `Footer`, `ThemeToggle` (Task 4).
- Produces: `blogTeasers: Record<Locale, BlogTeaser[]>` where `BlogTeaser = { title: string; teaser: string; url: string }`; `Hero({ hero })`, `CaseCard({ data, href, strings })`, `TeaserCard({ teaser, readOn })`.

- [ ] **Step 1: Write `src/data/blog-teasers.ts`**

Curated links into `.dev`. The three picked articles all have German translations on `.dev`, so the German list links the `/de-de/` URLs.

```ts
import type { Locale } from '../i18n/utils';

export interface BlogTeaser {
  title: string;
  teaser: string;
  url: string;
}

const DEV = 'https://www.sebastian-heitmann.dev';

export const blogTeasers: Record<Locale, BlogTeaser[]> = {
  'en-us': [
    {
      title: 'Software development is becoming a management discipline',
      teaser: 'What changes when the bottleneck moves from writing code to directing the systems that write it.',
      url: `${DEV}/articles/software-development-is-becoming-a-management-discipline/`,
    },
    {
      title: "Your knowledge system isn't finished until it ships",
      teaser: 'Notes that never leave the vault are drafts. On closing the loop between collecting and publishing.',
      url: `${DEV}/articles/your-knowledge-system-isnt-finished-until-it-ships/`,
    },
    {
      title: "Why your AI-written strategy isn't a strategy",
      teaser: 'A strategy you did not think through yourself is a document, not a decision.',
      url: `${DEV}/articles/why-your-ai-written-strategy-isnt-a-strategy/`,
    },
  ],
  'de-de': [
    {
      title: 'Softwareentwicklung wird zur Management-Disziplin',
      teaser: 'Was sich ändert, wenn der Engpass nicht mehr das Schreiben von Code ist, sondern das Steuern der Systeme, die ihn schreiben.',
      url: `${DEV}/de-de/articles/software-development-is-becoming-a-management-discipline/`,
    },
    {
      title: 'Dein Wissenssystem ist erst fertig, wenn es liefert',
      teaser: 'Notizen, die den Vault nie verlassen, sind Entwürfe. Über das Schließen der Lücke zwischen Sammeln und Veröffentlichen.',
      url: `${DEV}/de-de/articles/your-knowledge-system-isnt-finished-until-it-ships/`,
    },
    {
      title: 'Warum deine KI-geschriebene Strategie keine Strategie ist',
      teaser: 'Eine Strategie, die du nicht selbst durchdacht hast, ist ein Dokument, keine Entscheidung.',
      url: `${DEV}/de-de/articles/why-your-ai-written-strategy-isnt-a-strategy/`,
    },
  ],
};
```

- [ ] **Step 2: Write `src/components/hero.tsx`**

```tsx
import type { Strings } from '../i18n/types';

export interface HeroProps {
  hero: Strings['hero'];
}

export function Hero({ hero }: HeroProps) {
  return (
    <header className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 md:px-20 md:pt-28 md:pb-20">
      <p className="reveal font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{hero.kicker}</p>
      <h1 className="reveal mt-4 max-w-[16ch] font-[family-name:var(--v8-font-display)] text-5xl leading-[1.05] text-foreground md:text-7xl">
        {hero.heading}
      </h1>
      <p className="reveal mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
        {hero.intro}
      </p>
    </header>
  );
}
```

- [ ] **Step 3: Write `src/components/case-card.tsx`**

One card component for both kinds: case studies get a detail link, projects render the first external link instead.

```tsx
import type { Strings } from '../i18n/types';

export interface CaseCardData {
  title: string;
  summary: string;
  kind: 'case-study' | 'project';
  role: string;
  stack: string[];
  links: { label: string; url: string }[];
}

export interface CaseCardProps {
  data: CaseCardData;
  /** Detail-page href for case studies; ignored for kind === 'project'. */
  href: string;
  strings: Strings['cases'];
}

export function CaseCard({ data, href, strings }: CaseCardProps) {
  const external = data.kind === 'project' ? data.links[0] : undefined;
  return (
    <article className="reveal flex h-full flex-col border border-border bg-surface p-6 transition-colors hover:border-muted-foreground md:p-8">
      <h3 className="font-[family-name:var(--v8-font-display)] text-2xl text-foreground">{data.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
      <dl className="mt-5 space-y-1">
        <div className="flex gap-2">
          <dt className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{strings.roleLabel}</dt>
          <dd className="font-mono text-[10px] text-foreground">{data.role}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{strings.stackLabel}</dt>
          <dd className="font-mono text-[10px] text-foreground">{data.stack.join(' · ')}</dd>
        </div>
      </dl>
      {data.kind === 'case-study' ? (
        <a href={href} className="mt-6 inline-block border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary">
          {strings.readCase}
        </a>
      ) : external ? (
        <a href={external.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary">
          {external.label}
        </a>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 4: Write `src/components/teaser-card.tsx`**

```tsx
import type { BlogTeaser } from '../data/blog-teasers';

export interface TeaserCardProps {
  teaser: BlogTeaser;
  readOn: string;
}

export function TeaserCard({ teaser, readOn }: TeaserCardProps) {
  return (
    <article className="reveal flex h-full flex-col border border-border p-6 md:p-8">
      <h3 className="font-[family-name:var(--v8-font-display)] text-xl text-foreground">{teaser.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{teaser.teaser}</p>
      <a href={teaser.url} className="mt-5 font-mono text-[10px] tracking-[0.1em] text-primary uppercase no-underline transition-colors hover:text-foreground">
        {readOn} →
      </a>
    </article>
  );
}
```

- [ ] **Step 5: Write `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import Layout from '../layouts/Layout.astro';
import { getStrings, getHreflangAlternates } from '../i18n/utils';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { ThemeToggle } from '../components/theme-toggle';
import { Hero } from '../components/hero';
import { CaseCard } from '../components/case-card';
import { TeaserCard } from '../components/teaser-card';
import { blogTeasers } from '../data/blog-teasers';

const locale = 'en-us';
const t = getStrings(locale);

const entries = (await getCollection('cases'))
  .filter((e) => e.id.startsWith(`${locale}/`) && !e.data.draft)
  .sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());
const caseStudies = entries.filter((e) => e.data.kind === 'case-study');
const projects = entries.filter((e) => e.data.kind === 'project');
const caseHref = (e: (typeof entries)[number]) =>
  getRelativeLocaleUrl(locale, `/cases/${e.id.split('/').slice(1).join('/')}`);
---

<Layout
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  alternates={getHreflangAlternates('/')}
  includeRedirectScript={true}
>
  <Navigation nav={t.nav} languagePicker={t.languagePicker} locale={locale} currentPath={Astro.url.pathname}>
    <ThemeToggle client:load />
  </Navigation>
  <main>
    <Hero hero={t.hero} />
    <section class="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="cases">
      <h2 class="reveal font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t.cases.sectionTitle}</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-2">
        {caseStudies.map((e) => (
          <CaseCard data={e.data} href={caseHref(e)} strings={t.cases} />
        ))}
      </div>
    </section>
    {projects.length > 0 && (
      <section class="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="projects">
        <h2 class="reveal font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t.projects.sectionTitle}</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((e) => (
            <CaseCard data={e.data} href={caseHref(e)} strings={t.cases} />
          ))}
        </div>
      </section>
    )}
    <section class="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="writing">
      <h2 class="reveal font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t.teasers.sectionTitle}</h2>
      <p class="reveal mt-3 max-w-[58ch] text-sm text-muted-foreground">{t.teasers.intro}</p>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        {blogTeasers[locale].map((teaser) => (
          <TeaserCard teaser={teaser} readOn={t.teasers.readOn} />
        ))}
      </div>
    </section>
  </main>
  <Footer footer={t.footer} />
</Layout>
```

Note: if the copied `theme-toggle.tsx` exports a different symbol name or requires label props, match its actual signature here (read the file; do not guess).

- [ ] **Step 6: Write `src/pages/de-de/index.astro`**

Identical structure with `const locale = 'de-de'` and no redirect script:

```astro
---
import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import Layout from '../../layouts/Layout.astro';
import { getStrings, getHreflangAlternates } from '../../i18n/utils';
import { Navigation } from '../../components/navigation';
import { Footer } from '../../components/footer';
import { ThemeToggle } from '../../components/theme-toggle';
import { Hero } from '../../components/hero';
import { CaseCard } from '../../components/case-card';
import { TeaserCard } from '../../components/teaser-card';
import { blogTeasers } from '../../data/blog-teasers';

const locale = 'de-de';
const t = getStrings(locale);

const entries = (await getCollection('cases'))
  .filter((e) => e.id.startsWith(`${locale}/`) && !e.data.draft)
  .sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());
const caseStudies = entries.filter((e) => e.data.kind === 'case-study');
const projects = entries.filter((e) => e.data.kind === 'project');
const caseHref = (e: (typeof entries)[number]) =>
  getRelativeLocaleUrl(locale, `/cases/${e.id.split('/').slice(1).join('/')}`);
---

<Layout
  locale={locale}
  title={t.meta.title}
  description={t.meta.description}
  alternates={getHreflangAlternates('/')}
>
  <Navigation nav={t.nav} languagePicker={t.languagePicker} locale={locale} currentPath={Astro.url.pathname}>
    <ThemeToggle client:load />
  </Navigation>
  <main>
    <Hero hero={t.hero} />
    <section class="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="cases">
      <h2 class="reveal font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t.cases.sectionTitle}</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-2">
        {caseStudies.map((e) => (
          <CaseCard data={e.data} href={caseHref(e)} strings={t.cases} />
        ))}
      </div>
    </section>
    {projects.length > 0 && (
      <section class="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="projects">
        <h2 class="reveal font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t.projects.sectionTitle}</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((e) => (
            <CaseCard data={e.data} href={caseHref(e)} strings={t.cases} />
          ))}
        </div>
      </section>
    )}
    <section class="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="writing">
      <h2 class="reveal font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t.teasers.sectionTitle}</h2>
      <p class="reveal mt-3 max-w-[58ch] text-sm text-muted-foreground">{t.teasers.intro}</p>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        {blogTeasers[locale].map((teaser) => (
          <TeaserCard teaser={teaser} readOn={t.teasers.readOn} />
        ))}
      </div>
    </section>
  </main>
  <Footer footer={t.footer} />
</Layout>
```

- [ ] **Step 7: Verify the build output**

Run: `cd apps/rocks && bun run build && ls dist/index.html dist/de-de/index.html && grep -c 'hreflang' dist/index.html`
Expected: both pages emitted; 3 hreflang links in the head; no build errors.

- [ ] **Step 8: Commit**

```bash
git add apps/rocks/src
git commit -m "feat(rocks): build landing page with cases, projects, and blog teasers"
```

---

### Task 6: Case detail pages and 404

**Files:**
- Create: `apps/rocks/src/pages/cases/[slug].astro`
- Create: `apps/rocks/src/pages/de-de/cases/[slug].astro`
- Create: `apps/rocks/src/pages/404.astro`

**Interfaces:**
- Consumes: everything from Tasks 2-5.
- Produces: `/cases/<slug>/` and `/de-de/cases/<slug>/` static pages; `404.html` in dist (referenced by the bucket error_document).

- [ ] **Step 1: Write `src/pages/cases/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import Layout from '../../layouts/Layout.astro';
import { getStrings, getHreflangAlternates } from '../../i18n/utils';
import { Navigation } from '../../components/navigation';
import { Footer } from '../../components/footer';
import { ThemeToggle } from '../../components/theme-toggle';

export async function getStaticPaths() {
  const entries = await getCollection('cases');
  return entries
    .filter((e) => e.id.startsWith('en-us/') && e.data.kind === 'case-study' && !e.data.draft)
    .map((entry) => ({
      params: { slug: entry.id.split('/').slice(1).join('/') },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const locale = 'en-us';
const t = getStrings(locale);
const slug = entry.id.split('/').slice(1).join('/');
const { Content } = await render(entry);

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
const period = `${formatDate(entry.data.startDate)} — ${entry.data.endDate ? formatDate(entry.data.endDate) : t.cases.ongoing}`;
---

<Layout
  locale={locale}
  title={`${entry.data.title} — ${t.meta.title}`}
  description={entry.data.summary}
  alternates={getHreflangAlternates(`/cases/${slug}/`)}
  ogType="article"
>
  <Navigation nav={t.nav} languagePicker={t.languagePicker} locale={locale} currentPath={Astro.url.pathname}>
    <ThemeToggle client:load />
  </Navigation>
  <main class="mx-auto max-w-[840px] px-6 py-12 md:py-20">
    <a href={getRelativeLocaleUrl(locale, '/')} class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase no-underline transition-colors hover:text-foreground">
      ← {t.cases.backToOverview}
    </a>
    <h1 class="mt-6 font-[family-name:var(--v8-font-display)] text-4xl leading-[1.1] text-foreground md:text-5xl">{entry.data.title}</h1>
    <p class="mt-4 text-base leading-relaxed text-muted-foreground">{entry.data.summary}</p>
    <dl class="mt-8 grid gap-2 border-y border-border py-5 md:grid-cols-3">
      <div>
        <dt class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{t.cases.roleLabel}</dt>
        <dd class="mt-1 text-sm text-foreground">{entry.data.role}</dd>
      </div>
      <div>
        <dt class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{t.cases.periodLabel}</dt>
        <dd class="mt-1 text-sm text-foreground">{period}</dd>
      </div>
      <div>
        <dt class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{t.cases.stackLabel}</dt>
        <dd class="mt-1 text-sm text-foreground">{entry.data.stack.join(' · ')}</dd>
      </div>
    </dl>
    <article class="case-prose mt-10">
      <Content />
    </article>
    {entry.data.links.length > 0 && (
      <div class="mt-10 flex flex-wrap gap-3">
        {entry.data.links.map((link) => (
          <a href={link.url} target="_blank" rel="noopener noreferrer" class="border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase no-underline transition-colors hover:border-primary hover:text-primary">
            {link.label} ↗
          </a>
        ))}
      </div>
    )}
  </main>
  <Footer footer={t.footer} />
</Layout>
```

- [ ] **Step 2: Add prose styling for rendered markdown**

Append to `apps/rocks/src/styles/global.css` under `@layer components` (create the layer block if the copied file structures it differently — keep it documented in place, matching the repo convention):

```css
@layer components {
  /* Typography for rendered case-study markdown (`<Content />`). Utilities
     can't reach into rendered markdown, so this is the one sanctioned place
     for element selectors. */
  .case-prose h2 {
    font-family: var(--v8-font-display);
    font-size: 1.75rem;
    color: var(--v8-text);
    margin-top: 2.5rem;
  }
  .case-prose p {
    margin-top: 1rem;
    font-size: 0.9375rem;
    line-height: 1.75;
    color: var(--v8-text-secondary);
  }
  .case-prose ul,
  .case-prose ol {
    margin-top: 1rem;
    padding-left: 1.25rem;
    color: var(--v8-text-secondary);
  }
  .case-prose li {
    margin-top: 0.375rem;
    font-size: 0.9375rem;
    line-height: 1.7;
  }
  .case-prose a {
    color: var(--v8-accent);
  }
  .case-prose code {
    font-family: var(--v8-font-mono);
    font-size: 0.85em;
  }
}
```

- [ ] **Step 3: Write `src/pages/de-de/cases/[slug].astro`**

Same as Step 1 with these differences: filter `e.id.startsWith('de-de/')`, `const locale = 'de-de'`, date format `d.toLocaleDateString('de-DE', { year: 'numeric', month: 'short' })`, Layout import path `../../../layouts/Layout.astro`, component import paths `../../../components/...`, i18n import `../../../i18n/utils`. Full file:

```astro
---
import { getCollection, render } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import Layout from '../../../layouts/Layout.astro';
import { getStrings, getHreflangAlternates } from '../../../i18n/utils';
import { Navigation } from '../../../components/navigation';
import { Footer } from '../../../components/footer';
import { ThemeToggle } from '../../../components/theme-toggle';

export async function getStaticPaths() {
  const entries = await getCollection('cases');
  return entries
    .filter((e) => e.id.startsWith('de-de/') && e.data.kind === 'case-study' && !e.data.draft)
    .map((entry) => ({
      params: { slug: entry.id.split('/').slice(1).join('/') },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const locale = 'de-de';
const t = getStrings(locale);
const slug = entry.id.split('/').slice(1).join('/');
const { Content } = await render(entry);

const formatDate = (d: Date) =>
  d.toLocaleDateString('de-DE', { year: 'numeric', month: 'short' });
const period = `${formatDate(entry.data.startDate)} — ${entry.data.endDate ? formatDate(entry.data.endDate) : t.cases.ongoing}`;
---

<Layout
  locale={locale}
  title={`${entry.data.title} — ${t.meta.title}`}
  description={entry.data.summary}
  alternates={getHreflangAlternates(`/cases/${slug}/`)}
  ogType="article"
>
  <Navigation nav={t.nav} languagePicker={t.languagePicker} locale={locale} currentPath={Astro.url.pathname}>
    <ThemeToggle client:load />
  </Navigation>
  <main class="mx-auto max-w-[840px] px-6 py-12 md:py-20">
    <a href={getRelativeLocaleUrl(locale, '/')} class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase no-underline transition-colors hover:text-foreground">
      ← {t.cases.backToOverview}
    </a>
    <h1 class="mt-6 font-[family-name:var(--v8-font-display)] text-4xl leading-[1.1] text-foreground md:text-5xl">{entry.data.title}</h1>
    <p class="mt-4 text-base leading-relaxed text-muted-foreground">{entry.data.summary}</p>
    <dl class="mt-8 grid gap-2 border-y border-border py-5 md:grid-cols-3">
      <div>
        <dt class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{t.cases.roleLabel}</dt>
        <dd class="mt-1 text-sm text-foreground">{entry.data.role}</dd>
      </div>
      <div>
        <dt class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{t.cases.periodLabel}</dt>
        <dd class="mt-1 text-sm text-foreground">{period}</dd>
      </div>
      <div>
        <dt class="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{t.cases.stackLabel}</dt>
        <dd class="mt-1 text-sm text-foreground">{entry.data.stack.join(' · ')}</dd>
      </div>
    </dl>
    <article class="case-prose mt-10">
      <Content />
    </article>
    {entry.data.links.length > 0 && (
      <div class="mt-10 flex flex-wrap gap-3">
        {entry.data.links.map((link) => (
          <a href={link.url} target="_blank" rel="noopener noreferrer" class="border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase no-underline transition-colors hover:border-primary hover:text-primary">
            {link.label} ↗
          </a>
        ))}
      </div>
    )}
  </main>
  <Footer footer={t.footer} />
</Layout>
```

- [ ] **Step 4: Write `src/pages/404.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getStrings } from '../i18n/utils';

const locale = 'en-us';
const t = getStrings(locale);
---

<Layout locale={locale} title={t.meta.notFoundTitle} description={t.notFound.body}>
  <main class="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col items-start justify-center px-6 md:px-20">
    <h1 class="font-[family-name:var(--v8-font-display)] text-7xl text-foreground">{t.notFound.heading}</h1>
    <p class="mt-4 text-muted-foreground">{t.notFound.body}</p>
    <a href="/" class="mt-8 border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase no-underline transition-colors hover:border-primary hover:text-primary">
      {t.notFound.backHome}
    </a>
  </main>
</Layout>
```

- [ ] **Step 5: Verify the build output**

Run: `cd apps/rocks && bun run build && ls dist/cases/portfolio-platform/index.html dist/de-de/cases/portfolio-platform/index.html dist/404.html`
Expected: all three files exist.

- [ ] **Step 6: Commit**

```bash
git add apps/rocks/src
git commit -m "feat(rocks): add case detail pages and 404"
```

---

### Task 7: Visual verification

**Files:** none created (screenshots go to the scratchpad or are viewed inline; fixes land in the files from Tasks 4-6).

**Interfaces:**
- Consumes: the running dev server (`cd apps/rocks && bun run dev`).
- Produces: a visually verified site; any fixes committed as `fix(rocks): …`.

- [ ] **Step 1: Start the dev server** (`cd apps/rocks && bun run dev`, note the port)
- [ ] **Step 2: Screenshot with Chrome DevTools MCP** — for each of `/`, `/de-de/`, `/cases/portfolio-platform/`, `/404`: viewports 1440, 1024, 768, and 375 wide, in BOTH dark and light themes (toggle via the theme control or by evaluating `document.documentElement.classList` swaps). Check: token colors applied (no unstyled black-on-white), fonts loaded (Instrument Serif headings), cards aligned, nav wraps correctly at 375px, language picker links point to the right locale URLs, footer links point at `.dev`.
- [ ] **Step 3: Fix every defect found before proceeding.** Re-screenshot after each fix. Commit fixes: `git commit -m "fix(rocks): <defect>"`.

---

### Task 8: Terraform for hosting and DNS

**Files:**
- Modify: `infra/variables.tf` (append)
- Create: `infra/rocks-storage.tf`
- Create: `infra/rocks-cdn.tf`
- Create: `infra/rocks-redirect.tf`
- Create: `infra/rocks-dns.tf`
- Modify: `infra/outputs.tf` (append)

**Interfaces:**
- Consumes: existing `scaleway_account_project.main`, `scaleway_edge_services_plan.main`, `scaleway_function_namespace.redirect`, `var.region`, the apex-redirect handler zip.
- Produces: resources named `*_rocks` / `rocks` and outputs `rocks_cdn_pipeline_id`, `rocks_bucket_endpoint`, `rocks_apex_redirect_endpoint`.

- [ ] **Step 1: Append variables to `infra/variables.tf`**

```hcl
variable "rocks_domain" {
  description = "Root domain of the portfolio site. Registered at GoDaddy; DNS hosted at Scaleway (see infra/rocks-dns.tf)"
  type        = string
  default     = "sebastian-heitmann.rocks"
}

variable "bind_rocks_apex_domain" {
  description = "Bind the .rocks apex hostname to its redirect function (provisions its managed cert). Keep false until the NS delegation for sebastian-heitmann.rocks is live at Scaleway — cert issuance needs the apex resolving to the function first. See the rocks DNS onboarding runbook."
  type        = bool
  default     = false
}

variable "rocks_scaleway_challenge" {
  description = "TXT value of the _scaleway-challenge record for the .rocks external-domain onboarding. Empty until the domain is registered via POST /domain/v2beta1/external-domains (the API returns the token); then commit the value here (repo convention: committed defaults, no tfvars)."
  type        = string
  default     = ""
}
```

- [ ] **Step 2: Write `infra/rocks-storage.tf`**

```hcl
resource "scaleway_object_bucket" "rocks" {
  name       = "sebastian-heitmann-rocks"
  project_id = scaleway_account_project.main.id
}

resource "scaleway_object_bucket_acl" "rocks" {
  bucket     = scaleway_object_bucket.rocks.id
  acl        = "public-read"
  project_id = scaleway_account_project.main.id
}

resource "scaleway_object_bucket_website_configuration" "rocks" {
  bucket     = scaleway_object_bucket.rocks.name
  project_id = scaleway_account_project.main.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}
```

- [ ] **Step 3: Write `infra/rocks-cdn.tf`**

```hcl
resource "scaleway_edge_services_pipeline" "rocks" {
  name        = "sebastian-heitmann-rocks"
  description = "CDN for sebastian-heitmann.rocks static website"
  project_id  = scaleway_account_project.main.id

  depends_on = [scaleway_edge_services_plan.main]
}

resource "scaleway_edge_services_backend_stage" "rocks" {
  pipeline_id = scaleway_edge_services_pipeline.rocks.id

  s3_backend_config {
    bucket_name   = scaleway_object_bucket.rocks.name
    bucket_region = var.region
    is_website    = true
  }
}

resource "scaleway_edge_services_cache_stage" "rocks" {
  pipeline_id      = scaleway_edge_services_pipeline.rocks.id
  backend_stage_id = scaleway_edge_services_backend_stage.rocks.id
}

resource "scaleway_edge_services_tls_stage" "rocks" {
  pipeline_id         = scaleway_edge_services_pipeline.rocks.id
  cache_stage_id      = scaleway_edge_services_cache_stage.rocks.id
  managed_certificate = true
}

resource "scaleway_edge_services_dns_stage" "rocks" {
  pipeline_id  = scaleway_edge_services_pipeline.rocks.id
  tls_stage_id = scaleway_edge_services_tls_stage.rocks.id
  fqdns        = ["www.${var.rocks_domain}"]
}

resource "scaleway_edge_services_head_stage" "rocks" {
  pipeline_id   = scaleway_edge_services_pipeline.rocks.id
  head_stage_id = scaleway_edge_services_dns_stage.rocks.id
}
```

- [ ] **Step 4: Write `infra/rocks-redirect.tf`**

```hcl
# Apex → www redirect for the .rocks portfolio, reusing the same handler zip and
# function namespace as the .dev apex redirect (the handler is generic: it 301s
# every request to REDIRECT_TARGET with path and query preserved).

resource "scaleway_function" "apex_redirect_rocks" {
  namespace_id = scaleway_function_namespace.redirect.id
  name         = "apex-redirect-rocks"
  runtime      = "node22"
  handler      = "handler.handle"
  privacy      = "public"
  http_option  = "enabled"
  min_scale    = 0
  max_scale    = 2
  timeout      = 10
  memory_limit = 128
  zip_file     = "${path.module}/../apps/apex-redirect/dist/handler.zip"
  zip_hash     = fileexists("${path.module}/../apps/apex-redirect/dist/handler.zip") ? filesha256("${path.module}/../apps/apex-redirect/dist/handler.zip") : null
  deploy       = true

  environment_variables = {
    REDIRECT_TARGET = "https://www.${var.rocks_domain}"
  }
}

# Gated like the .dev apex binding: cert issuance needs the apex resolving to
# the function, which only happens after the .rocks NS delegation to Scaleway.
resource "scaleway_function_domain" "rocks_apex" {
  count = var.bind_rocks_apex_domain ? 1 : 0

  function_id = scaleway_function.apex_redirect_rocks.id
  hostname    = var.rocks_domain

  depends_on = [scaleway_domain_record.rocks_apex]
}
```

- [ ] **Step 5: Write `infra/rocks-dns.tf`**

```hcl
# DNS zone for sebastian-heitmann.rocks, hosted at Scaleway Domains and DNS.
# Registration stays at GoDaddy; the zone was onboarded via
# POST /domain/v2beta1/external-domains (manual, not terraformable) — see the
# rocks DNS onboarding runbook in docs/runbooks/. This file manages every record.
#
# No mailbox and no sender exists under this domain, so the zone carries
# explicit "no mail" records: null MX (RFC 7505), an SPF that authorizes
# nothing, and a reject-all DMARC.

resource "scaleway_domain_record" "rocks_apex" {
  dns_zone = var.rocks_domain
  name     = ""
  type     = "ALIAS"
  data     = "${scaleway_function.apex_redirect_rocks.domain_name}."
  ttl      = 300
}

resource "scaleway_domain_record" "rocks_www" {
  dns_zone = var.rocks_domain
  name     = "www"
  type     = "CNAME"
  data     = "${scaleway_edge_services_pipeline.rocks.id}.svc.edge.scw.cloud."
  ttl      = 300
}

# Ownership challenge from the external-domain onboarding; created once the
# token is known (kept permanently — Scaleway re-checks it periodically).
resource "scaleway_domain_record" "rocks_scaleway_challenge" {
  count = var.rocks_scaleway_challenge != "" ? 1 : 0

  dns_zone = var.rocks_domain
  name     = "_scaleway-challenge"
  type     = "TXT"
  data     = var.rocks_scaleway_challenge
  ttl      = 600
}

resource "scaleway_domain_record" "rocks_null_mx" {
  dns_zone = var.rocks_domain
  name     = ""
  type     = "MX"
  data     = "."
  priority = 0
  ttl      = 3600
}

resource "scaleway_domain_record" "rocks_spf" {
  dns_zone = var.rocks_domain
  name     = ""
  type     = "TXT"
  data     = "v=spf1 -all"
  ttl      = 3600
}

resource "scaleway_domain_record" "rocks_dmarc" {
  dns_zone = var.rocks_domain
  name     = "_dmarc"
  type     = "TXT"
  data     = "v=DMARC1; p=reject;"
  ttl      = 3600
}
```

- [ ] **Step 6: Append outputs to `infra/outputs.tf`**

```hcl
output "rocks_cdn_pipeline_id" {
  description = "Edge Services pipeline ID for the .rocks site"
  value       = scaleway_edge_services_pipeline.rocks.id
}

output "rocks_bucket_endpoint" {
  description = "Object Storage website endpoint for the .rocks bucket"
  value       = scaleway_object_bucket_website_configuration.rocks.website_endpoint
}

output "rocks_apex_redirect_endpoint" {
  description = "Native URL of the .rocks apex → www redirect function (the apex ALIAS record targets this host)"
  value       = scaleway_function.apex_redirect_rocks.domain_name
}
```

- [ ] **Step 7: Validate**

Run (no credentials needed):

```bash
cd infra
terraform fmt -check -diff
terraform init -backend=false -input=false
terraform validate
```

Expected: fmt clean (fix if not), validate succeeds. Do NOT run `terraform plan` or `apply` here; that happens with the runbook via `./scripts/apply-infra.sh`.

- [ ] **Step 8: Commit**

```bash
git add infra
git commit -m "feat(infra): add .rocks bucket, CDN pipeline, apex redirect, and DNS zone"
```

---

### Task 9: Deploy script

**Files:**
- Create: `scripts/deploy-rocks.sh` (mode 755)

**Interfaces:**
- Consumes: `infra/.env.schema` (varlock credentials), the `apps/rocks` build, bucket `sebastian-heitmann-rocks`.
- Produces: an idempotent deploy of `apps/rocks/dist/` to the rocks bucket.

- [ ] **Step 1: Write `scripts/deploy-rocks.sh`**

Trimmed copy of `deploy-website.sh`: no terraform lookup, no mail-endpoint check (the app has no env), same varlock re-exec, same orphan pruning and chunk safety net, same two-phase rclone upload.

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Must resolve to THIS file, never a fixed name: the re-exec below would otherwise
# hand control to whichever script name was hardcoded, so a copy or wrapper would
# silently run the original's behaviour instead of its own.
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
INFRA_DIR="$ROOT_DIR/infra"
ROCKS_DIR="$ROOT_DIR/apps/rocks"
PROJECT_NAME="sebastian-heitmann-dev"
BUCKET="sebastian-heitmann-rocks"
VARLOCK="$ROOT_DIR/node_modules/.bin/varlock"

# Re-exec under `varlock run` so Scaleway credentials (SCW_ACCESS_KEY, SCW_SECRET_KEY,
# SCW_DEFAULT_ORGANIZATION_ID) come from Proton Pass — no ~/.config/scw/config.yaml needed.
# varlock loads infra/.env.schema from the infra directory (the cwd at exec time).
if [[ -z "${VARLOCK_INJECTED:-}" ]]; then
  cd "$INFRA_DIR"
  exec "$VARLOCK" run --inject vars -- env VARLOCK_INJECTED=1 bash "$SCRIPT_PATH" "$@"
fi

# --- below runs with secrets injected by varlock ---

# The scw CLI authenticates from the SCW_* env vars varlock provides.
PROJECT_ID=$(scw account project list -o json | jq -r --arg n "$PROJECT_NAME" '.[] | select(.name == $n) | .id')
if [[ -z "$PROJECT_ID" ]]; then
  echo "Could not resolve Scaleway project '$PROJECT_NAME' via scw CLI." >&2
  exit 1
fi

export AWS_ACCESS_KEY_ID="${SCW_ACCESS_KEY}@${PROJECT_ID}"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"

cd "$ROCKS_DIR"

bun run build

# Astro's content-collection image() schema imports each source asset via Vite,
# which emits the originals to dist/_astro/ even when only transformed variants
# (webp/jpg) are referenced. Prune any IMAGE in dist/_astro/ that isn't
# referenced by any emitted HTML/CSS/JS. Only images are ever true orphans:
# JS/CSS chunks reference each other via bare relative paths ("./chunk.js")
# that this grep cannot see, so they must never be pruned.
REFERENCED="$(grep -rhoE '_astro/[A-Za-z0-9._-]+' dist --include='*.html' --include='*.css' --include='*.js' --include='*.xml' | sort -u)"
while IFS= read -r -d '' file; do
  rel="${file#dist/}"
  if ! grep -qxF "$rel" <<< "$REFERENCED"; then
    rm -f "$file"
  fi
done < <(find dist/_astro -maxdepth 1 -type f \
  \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' \
     -o -name '*.gif' -o -name '*.avif' -o -name '*.svg' \) -print0)

# Safety net: every bare relative chunk import inside surviving JS must resolve.
# Aborts the deploy instead of shipping a site with a broken module graph.
while IFS= read -r -d '' js; do
  while IFS= read -r chunk; do
    if [ -n "$chunk" ] && [ ! -f "dist/_astro/$chunk" ]; then
      echo "ERROR: dist/_astro/$(basename "$js") imports missing chunk ./$chunk — aborting deploy." >&2
      exit 1
    fi
  done < <(grep -oE 'from"\./[A-Za-z0-9._-]+\.js"' "$js" | sed 's|from"\./||; s|"$||')
done < <(find dist/_astro -maxdepth 1 -type f -name '*.js' -print0)

# Incremental upload via rclone (checksum-exact, MD5 vs S3 ETag).
# Phase 1: assets first so no live HTML ever references a missing file.
# Phase 2: HTML + deletions of stale objects (bucket is fully regenerable from git).
export RCLONE_CONFIG_SCW_TYPE=s3
export RCLONE_CONFIG_SCW_PROVIDER=Scaleway
export RCLONE_CONFIG_SCW_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export RCLONE_CONFIG_SCW_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_SCW_ENDPOINT="https://s3.nl-ams.scw.cloud"
export RCLONE_CONFIG_SCW_ACL=public-read

rclone copy dist/ "scw:$BUCKET" \
  --checksum --exclude '*.html' --fast-list --transfers 8 -v \
  --s3-acl public-read

rclone sync dist/ "scw:$BUCKET" \
  --checksum --fast-list --transfers 8 -v \
  --s3-acl public-read

# Post-deploy verification (non-fatal, matching deploy-website.sh).
rclone check dist/ "scw:$BUCKET" --checksum --fast-list \
  || echo "WARNING: post-deploy rclone check reported differences — inspect the output above." >&2
```

- [ ] **Step 2: Make it executable and sanity-check syntax**

Run: `chmod +x scripts/deploy-rocks.sh && bash -n scripts/deploy-rocks.sh`
Expected: no output (syntax OK). Do NOT run the script for real; the bucket doesn't exist until Terraform is applied via the runbook.

- [ ] **Step 3: Commit**

```bash
git add scripts/deploy-rocks.sh
git commit -m "feat(scripts): add deploy script for the .rocks site"
```

---

### Task 10: Runbook and docs

**Files:**
- Create: `docs/runbooks/2026-08-03-rocks-dns-onboarding.md` (re-date if executed later)
- Modify: `AGENTS.md` (monorepo structure section + a Rocks summary)

**Interfaces:**
- Consumes: everything before.
- Produces: an executable runbook; updated repo docs.

- [ ] **Step 1: Write the runbook**

`docs/runbooks/2026-08-03-rocks-dns-onboarding.md`, modeled on `docs/runbooks/2026-08-02-apex-dns-cutover.md` (read it first and mirror its structure/tone). Required content, in order:

1. **Goal and current state.** sebastian-heitmann.rocks registered at GoDaddy on default parked DNS; target: zone hosted at Scaleway, www on Edge Services, apex 301 via function. No mail on this domain (and none planned): the zone carries null-MX/SPF-deny/DMARC-reject records.
2. **Step 0 — export the GoDaddy zone** for rollback; archive as `docs/runbooks/<date>-godaddy-rocks-zone-export.txt` (same convention as the `.dev` export).
3. **Step 1 — register the external domain**: `POST /domain/v2beta1/external-domains` with the domain name and project id (same call the `.dev` runbook documents; use `./scripts/scw` or curl with the API key). Record the returned `_scaleway-challenge` token.
4. **Step 2 — set the challenge TXT at GoDaddy** (`_scaleway-challenge.sebastian-heitmann.rocks` TXT = token), wait for Scaleway to validate the domain.
5. **Step 3 — commit the token** into `rocks_scaleway_challenge` in `infra/variables.tf`, then build the redirect handler (`cd apps/apex-redirect && bun run build`) and run `./scripts/apply-infra.sh`. This creates the zone records, bucket, pipeline, and redirect function.
6. **Step 4 — first deploy**: `./scripts/deploy-rocks.sh` so the bucket serves content before any DNS points at it.
7. **Step 5 — pre-delegation checks**: `dig @ns0.dom.scw.cloud www.sebastian-heitmann.rocks CNAME`, apex ALIAS resolution, TXT records; all must match `rocks-dns.tf`.
8. **Step 6 — NS switch at GoDaddy** to `ns0.dom.scw.cloud` / `ns1.dom.scw.cloud`.
9. **Step 7 — after propagation**: set `bind_rocks_apex_domain = true` (commit), re-run `./scripts/apply-infra.sh`; verify apex cert and 301 (`curl -sI https://sebastian-heitmann.rocks/x?y=1` → `301` with `location: https://www.sebastian-heitmann.rocks/x?y=1`), verify `https://www.sebastian-heitmann.rocks` serves the site with valid TLS, spot-check `/de-de/` and a case page.
10. **Rollback**: switch NS back to GoDaddy (exported zone still present there); Scaleway zone keeps working for retry.
11. **Cost note**: confirm the Edge Services plan covers a second pipeline before the apply in step 3 (console → Edge Services → plan usage); bump the plan if needed.

- [ ] **Step 2: Update `AGENTS.md`**

In the Monorepo Structure block, add under `apps/`:

```
├── rocks/            # Astro 7 portfolio site (sebastian-heitmann.rocks)
```

In the Commands section, add to the app command list:

```bash
# Rocks (portfolio)
cd apps/rocks
bun run dev                          # Start dev server
bun run build                        # Production build
./scripts/deploy-rocks.sh            # Build and upload to the rocks bucket (run from repo root)
```

Add a short `## Rocks (apps/rocks/)` section after the Website section stating: portfolio site (case studies + projects, bilingual, same design system); no contact form (contact relays to `.dev`); blog teasers are a curated data file `src/data/blog-teasers.ts` linking to `.dev` articles; legal pages link to `.dev`; case entries must exist in both `src/content/cases/en-us/` and `src/content/cases/de-de/` under the same slug; infra lives in `infra/rocks-*.tf` with onboarding runbook in `docs/runbooks/`. Also update the Infrastructure overview list with the second bucket/pipeline/redirect function and the `.rocks` DNS zone.

- [ ] **Step 3: Commit**

```bash
git add docs/runbooks AGENTS.md
git commit -m "docs(rocks): add DNS onboarding runbook and update repo docs"
```

---

### Task 11: Final verification and PR

**Files:** none new.

- [ ] **Step 1: Full clean build**

Run: `cd apps/rocks && rm -rf dist && bun run build`
Expected: success; `dist/` contains `index.html`, `de-de/index.html`, `cases/portfolio-platform/index.html`, `de-de/cases/portfolio-platform/index.html`, `404.html`, `sitemap-index.xml`, `robots.txt`, fonts.

- [ ] **Step 2: Terraform still clean**

Run: `cd infra && terraform fmt -check && terraform validate`
Expected: clean. (init with `-backend=false` if a fresh environment.)

- [ ] **Step 3: Apex-redirect tests still pass**

Run: `cd apps/apex-redirect && bun test`
Expected: 6 pass, 0 fail.

- [ ] **Step 4: Push the branch and open a PR**

Per repo convention: push, open PR with `gh`, stop for Sebastian to rebase-merge. Never merge locally or push main.

```bash
git push -u origin worktree-feat-rocks-portfolio-site
gh pr create \
  --title "feat: sebastian-heitmann.rocks portfolio site (app + infra + runbook)" \
  --body "$(cat <<'EOF'
## Summary
- New Astro app `apps/rocks`: bilingual portfolio (case studies + projects), --v8-asterisk design system, curated blog teasers linking to .dev
- Terraform: rocks bucket, Edge Services pipeline, apex-redirect function, DNS zone with no-mail hygiene records
- `scripts/deploy-rocks.sh` + DNS onboarding runbook

Spec: docs/superpowers/specs/2026-08-03-rocks-portfolio-site-design.md
Plan: docs/superpowers/plans/2026-08-03-rocks-portfolio-site.md

## Not done here (post-merge, via runbook)
- External-domain registration, challenge TXT, NS delegation at GoDaddy
- terraform apply + first deploy
- Real portfolio content from Sebastian (seed entry is the .dev platform case study)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Report** — summarize what shipped, what the runbook still gates, and the open cost question (second Edge Services pipeline).
