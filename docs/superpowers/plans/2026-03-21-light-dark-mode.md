# Light/Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the v8 (dark) and v9 (light) Precision Swiss design the main website with a light/dark mode toggle that defaults to system preference.

**Architecture:** Replace the current index.astro with the v8/v9 design. Both themes share the same components — only CSS custom properties differ. A class on `<html>` (`dark`/`light`) controls which variable set is active. An inline script in `<head>` prevents flash of wrong theme. The toggle lives in the navigation bar.

**Tech Stack:** Astro 6, SCSS, vanilla JS (theme toggle), localStorage

---

### Task 1: Create branch

**Files:** None

- [ ] **Step 1: Create and switch to new branch**

```bash
git checkout -b feat/light-dark-mode
```

- [ ] **Step 2: Verify branch**

```bash
git branch --show-current
```

Expected: `feat/light-dark-mode`

---

### Task 2: Move v8 components to root components directory

**Files:**
- Delete: `src/components/navigation.astro`, `src/components/hero.astro`, `src/components/footer.astro`, `src/components/logo-section.astro`, `src/components/contact-section.astro`, `src/components/services-section.astro`, `src/components/how-i-work-section.astro`, `src/components/success-stories-section.astro`, `src/components/grid-background-container.astro`, `src/components/version-switcher.astro`, `src/components/copy/` (entire directory)
- Move: all files from `src/components/v8/` to `src/components/`

- [ ] **Step 1: Delete old v1 root components**

```bash
rm src/components/navigation.astro src/components/hero.astro src/components/footer.astro src/components/logo-section.astro src/components/contact-section.astro src/components/services-section.astro src/components/how-i-work-section.astro src/components/success-stories-section.astro src/components/grid-background-container.astro src/components/version-switcher.astro
rm -rf src/components/copy/
```

- [ ] **Step 2: Move v8 components to root**

```bash
mv src/components/v8/* src/components/
rmdir src/components/v8
```

- [ ] **Step 3: Update navigation.astro logo link**

In `src/components/navigation.astro`, change the logo `href` from `/v8/` to `/`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: promote v8 components to root, remove old v1 components"
```

---

### Task 3: Update cases page for new design system

**Files:**
- Rewrite: `src/pages/cases/[id].astro`

The cases detail page imports old v1 components (`navigation.astro`, `grid-background-container.astro`, `copy/headline.astro`) that were deleted in Task 2. This must be fixed before any build verification. The page is rewritten to use `--v8-*` variables, the new navigation, and the theme inline script.

- [ ] **Step 1: Rewrite cases/[id].astro**

Replace the entire file with:

```astro
---
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import Navigation from '../../components/navigation.astro';

export async function getStaticPaths() {
  const cases = await getCollection('cases');
  return cases.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{entry.data.title} — Sebastian Heitmann</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap" rel="stylesheet">
    <script is:inline>
      (function() {
        const stored = localStorage.getItem('theme');
        if (stored) {
          document.documentElement.classList.add(stored);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body>
    <Navigation />
    <div class="detail-page">
      <article class="detail-page__article">
        <div class="detail-page__hero">
          <Image
            src={entry.data.image}
            alt={entry.data.title}
            width={1200}
            height={600}
            class="detail-page__hero-image"
          />
        </div>
        <div class="detail-page__content">
          <header class="detail-page__header">
            <h1 class="detail-page__title">{entry.data.title}</h1>
            <p class="detail-page__subtitle">{entry.data.subtitle}</p>
          </header>
          <div class="detail-page__body">
            <Content />
          </div>
          <a href="/#proof" class="detail-page__back">&larr; Back to results</a>
        </div>
      </article>
    </div>
  </body>
</html>

<style lang="scss" is:global>
  @font-face {
    font-family: 'IBM Plex Mono';
    font-style: normal;
    font-weight: 400;
    src: url('/fonts/IBMPlexMono-Regular.woff2') format('woff2');
  }
  @font-face {
    font-family: 'IBM Plex Mono';
    font-style: normal;
    font-weight: 700;
    src: url('/fonts/IBMPlexMono-Bold.woff2') format('woff2');
  }

  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

  html.dark {
    --v8-bg: #0C0C0C;
    --v8-bg-surface: #141414;
    --v8-text: #F2F0EB;
    --v8-text-muted: rgba(242, 240, 235, 0.4);
    --v8-text-secondary: rgba(242, 240, 235, 0.7);
    --v8-text-tertiary: rgba(242, 240, 235, 0.6);
    --v8-text-dim: rgba(242, 240, 235, 0.5);
    --v8-text-faint: rgba(242, 240, 235, 0.2);
    --v8-accent: #FF3B00;
    --v8-accent-status: #00DC82;
    --v8-border: rgba(242, 240, 235, 0.08);
    --v8-border-accent: rgba(255, 59, 0, 0.3);
  }

  html.light {
    --v8-bg: #F7F6F2;
    --v8-bg-surface: #ECEAE4;
    --v8-text: #141413;
    --v8-text-muted: rgba(20, 20, 19, 0.5);
    --v8-text-secondary: rgba(20, 20, 19, 0.75);
    --v8-text-tertiary: rgba(20, 20, 19, 0.65);
    --v8-text-dim: rgba(20, 20, 19, 0.55);
    --v8-text-faint: rgba(20, 20, 19, 0.25);
    --v8-accent: #B82A00;
    --v8-accent-status: #1A7A52;
    --v8-border: rgba(20, 20, 19, 0.16);
    --v8-border-accent: rgba(184, 42, 0, 0.35);
  }

  :root {
    --v8-font-display: 'Instrument Serif', Georgia, serif;
    --v8-font-body: 'DM Sans', system-ui, sans-serif;
    --v8-font-mono: 'IBM Plex Mono', monospace;
  }
</style>

<style lang="scss">
  body {
    background-color: var(--v8-bg);
    color: var(--v8-text);
    min-height: 100dvh;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .detail-page {
    max-width: 1440px;
    margin: 0 auto;
    padding-inline: 80px;

    &__article {
      padding-block: 4rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    &__hero {
      width: 100%;
      overflow: hidden;
    }

    &__hero-image {
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 800px;
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &__title {
      font-family: var(--v8-font-display);
      font-size: 48px;
      line-height: 1.1;
      color: var(--v8-text);
    }

    &__subtitle {
      font-family: var(--v8-font-mono);
      font-size: 13px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--v8-text-muted);
    }

    &__body {
      font-family: var(--v8-font-body);
      font-size: 16px;
      font-weight: 300;
      line-height: 1.7;
      color: var(--v8-text-secondary);

      :global(h2) {
        font-family: var(--v8-font-display);
        font-size: 28px;
        color: var(--v8-text);
        margin-top: 2rem;
        margin-bottom: 1rem;
      }

      :global(p) {
        margin-bottom: 1rem;
      }

      :global(ul), :global(ol) {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
      }

      :global(li) {
        margin-bottom: 0.5rem;
      }
    }

    &__back {
      font-family: var(--v8-font-mono);
      font-size: 12px;
      letter-spacing: 0.05em;
      color: var(--v8-accent);
      text-decoration: none;
      width: fit-content;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  @media (max-width: 768px) {
    .detail-page {
      padding-inline: 24px;

      &__article {
        padding-block: 2rem;
        gap: 2rem;
      }

      &__title {
        font-size: 32px;
      }
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/cases/ && git commit -m "feat: update cases page to use new design system with light/dark support"
```

---

### Task 4: Delete old version pages and components

**Files:**
- Delete: `src/pages/v2/`, `src/pages/v4/`, `src/pages/v6/`, `src/pages/v7/`, `src/pages/v8/`, `src/pages/v9/`
- Delete: `src/components/v2/`, `src/components/v4/`, `src/components/v6/`, `src/components/v7/`

Note: There is no `src/components/v9/` directory — v9 reused v8 components, which have already been moved in Task 2.

- [ ] **Step 1: Delete all version page directories**

```bash
rm -rf src/pages/v2 src/pages/v4 src/pages/v6 src/pages/v7 src/pages/v8 src/pages/v9
```

- [ ] **Step 2: Delete all version component directories**

```bash
rm -rf src/components/v2 src/components/v4 src/components/v6 src/components/v7
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove old version pages and components"
```

---

### Task 5: Rewrite index.astro with dual-theme support

**Files:**
- Rewrite: `src/pages/index.astro`

The new index.astro:
- Imports components from `../components/` (no more v8 subdirectory)
- No `VersionSwitcher`
- Defines both dark and light CSS variable sets using `html.dark` and `html.light` selectors
- Includes an inline `<script>` in `<head>` that reads `localStorage.getItem('theme')`, falls back to `prefers-color-scheme`, and sets the class on `<html>` before render
- Keeps the reveal animation script and global styles

- [ ] **Step 1: Rewrite index.astro**

Replace the entire file with:

```astro
---
import Navigation from '../components/navigation.astro';
import Hero from '../components/hero.astro';
import LogoSection from '../components/logo-section.astro';
import SituationsSection from '../components/situations-section.astro';
import ProofSection from '../components/proof-section.astro';
import ContactSection from '../components/contact-section.astro';
import Footer from '../components/footer.astro';
---
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sebastian Heitmann — Fractional CTO</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap" rel="stylesheet">
        <script is:inline>
            (function() {
                const stored = localStorage.getItem('theme');
                if (stored) {
                    document.documentElement.classList.add(stored);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
    </head>
    <body>
        <Navigation />
        <main>
            <Hero />
            <LogoSection />
            <SituationsSection />
            <ProofSection />
            <ContactSection />
        </main>
        <Footer />
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

<style lang="scss" is:global>
    @font-face {
        font-family: 'IBM Plex Mono';
        font-style: normal;
        font-weight: 400;
        src: url('/fonts/IBMPlexMono-Regular.woff2') format('woff2');
    }
    @font-face {
        font-family: 'IBM Plex Mono';
        font-style: normal;
        font-weight: 700;
        src: url('/fonts/IBMPlexMono-Bold.woff2') format('woff2');
    }

    *, *::before, *::after { box-sizing: border-box; }
    * { margin: 0; }

    @media (prefers-reduced-motion: no-preference) {
        html { interpolate-size: allow-keywords; }
    }

    body {
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
    }
    img, picture, video, canvas, svg { display: block; max-width: 100%; }
    input, button, textarea, select { font: inherit; }
    p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
    p { text-wrap: pretty; }
    h1, h2, h3, h4, h5, h6 { text-wrap: balance; }

    html.dark {
        --v8-bg: #0C0C0C;
        --v8-bg-surface: #141414;
        --v8-text: #F2F0EB;
        --v8-text-muted: rgba(242, 240, 235, 0.4);
        --v8-text-secondary: rgba(242, 240, 235, 0.7);
        --v8-text-tertiary: rgba(242, 240, 235, 0.6);
        --v8-text-dim: rgba(242, 240, 235, 0.5);
        --v8-text-faint: rgba(242, 240, 235, 0.2);
        --v8-accent: #FF3B00;
        --v8-accent-status: #00DC82;
        --v8-border: rgba(242, 240, 235, 0.08);
        --v8-border-accent: rgba(255, 59, 0, 0.3);
        --v8-metric-color: var(--v8-text);
        --v8-metric-label-color: var(--v8-text-muted);
        --v8-photo-filter: saturate(0) contrast(1.1) brightness(0.9);
        --v8-photo-filter-hover: saturate(0.8) contrast(1.05);
    }

    html.light {
        --v8-bg: #F7F6F2;
        --v8-bg-surface: #ECEAE4;
        --v8-text: #141413;
        --v8-text-muted: rgba(20, 20, 19, 0.5);
        --v8-text-secondary: rgba(20, 20, 19, 0.75);
        --v8-text-tertiary: rgba(20, 20, 19, 0.65);
        --v8-text-dim: rgba(20, 20, 19, 0.55);
        --v8-text-faint: rgba(20, 20, 19, 0.25);
        --v8-accent: #B82A00;
        --v8-accent-status: #1A7A52;
        --v8-metric-color: #B82A00;
        --v8-metric-label-color: rgba(20, 20, 19, 0.6);
        --v8-border: rgba(20, 20, 19, 0.16);
        --v8-border-accent: rgba(184, 42, 0, 0.35);
        --v8-photo-filter: saturate(0.85) contrast(1.08);
        --v8-photo-filter-hover: saturate(1) contrast(1);
    }

    :root {
        --v8-font-display: 'Instrument Serif', Georgia, serif;
        --v8-font-body: 'DM Sans', system-ui, sans-serif;
        --v8-font-mono: 'IBM Plex Mono', monospace;
    }

    .reveal {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .reveal.revealed { opacity: 1; transform: translateY(0); }

    @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1; transform: none; transition: none; }
    }
</style>

<style lang="scss">
    body {
        background-color: var(--v8-bg);
        color: var(--v8-text);
        min-height: 100vh;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro && git commit -m "feat: rewrite index.astro with dual light/dark theme support"
```

---

### Task 6: Add theme toggle to navigation

**Files:**
- Modify: `src/components/navigation.astro`

Add a theme toggle button between the logo and the CTA. The button shows a sun icon in dark mode (click to switch to light) and a moon icon in light mode (click to switch to dark). Uses inline SVG.

- [ ] **Step 1: Update navigation.astro**

Add the toggle button to the nav markup, between the logo link and the CTA link:

```html
<div class="nav-actions">
    <button class="nav-theme-toggle" type="button" aria-label="Toggle theme">
        <svg class="nav-theme-toggle__icon nav-theme-toggle__icon--sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="nav-theme-toggle__icon nav-theme-toggle__icon--moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>
    <a class="nav-cta" href="#contact">Book a Call</a>
</div>
```

The full updated nav markup should be:

```html
<nav class="nav">
    <a class="nav-logo" href="/">sebastian-heitmann<span class="nav-logo__dot">.</span>dev</a>
    <div class="nav-actions">
        <button class="nav-theme-toggle" type="button" aria-label="Toggle theme">
            <!-- sun and moon SVGs as above -->
        </button>
        <a class="nav-cta" href="#contact">Book a Call</a>
    </div>
</nav>
```

Add the toggle script (client-side) at the bottom of the component:

```html
<script>
    const toggle = document.querySelector('.nav-theme-toggle');
    toggle?.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        html.classList.remove('dark', 'light');
        const next = isDark ? 'light' : 'dark';
        html.classList.add(next);
        localStorage.setItem('theme', next);
    });
</script>
```

Add styles within the existing `.nav` block:

```scss
&-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

&-theme-toggle {
    background: none;
    border: 1px solid var(--v8-border);
    color: var(--v8-text-muted);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, color 0.2s ease;

    &:hover {
        border-color: var(--v8-accent);
        color: var(--v8-accent);
    }

    &__icon {
        display: block;

        &--sun {
            display: none;
        }
    }
}

:global(html.dark) .nav-theme-toggle {
    .nav-theme-toggle__icon--sun { display: block; }
    .nav-theme-toggle__icon--moon { display: none; }
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Visual verification**

```bash
bun run dev
```

Open browser. Verify:
- Toggle button appears in nav next to CTA
- Clicking toggles between light and dark themes
- Refresh preserves the chosen theme
- With no stored preference, follows system setting

- [ ] **Step 4: Commit**

```bash
git add src/components/navigation.astro && git commit -m "feat: add light/dark theme toggle to navigation"
```

---

### Task 7: Remove unused font files

**Files:**
- Delete from `public/fonts/`: all fonts except `IBMPlexMono-Regular.woff2` and `IBMPlexMono-Bold.woff2`

After removing all old versions, these font files are no longer referenced: `Anton-Regular.ttf`, `AntonSC-Regular.ttf`, `BebasNeue-Regular.woff2`, `LibreBaskerville-Bold.woff2`, `LibreBaskerville-Italic.woff2`, `LibreBaskerville-Regular.woff2`, `Outfit-latin.woff2`, `Outfit-latin-ext.woff2`, `Rajdhani-Bold.woff2`, `Rajdhani-Regular.woff2`, `SpaceGrotesk-VariableFont_wght.ttf`, `SpaceMono-Bold.woff2`, `SpaceMono-Regular.woff2`.

The new design uses `Instrument Serif` and `DM Sans` from Google Fonts CDN, and `IBM Plex Mono` self-hosted.

- [ ] **Step 1: Delete unused fonts**

```bash
rm public/fonts/Anton-Regular.ttf public/fonts/AntonSC-Regular.ttf public/fonts/BebasNeue-Regular.woff2 public/fonts/LibreBaskerville-Bold.woff2 public/fonts/LibreBaskerville-Italic.woff2 public/fonts/LibreBaskerville-Regular.woff2 public/fonts/Outfit-latin.woff2 public/fonts/Outfit-latin-ext.woff2 public/fonts/Rajdhani-Bold.woff2 public/fonts/Rajdhani-Regular.woff2 public/fonts/SpaceGrotesk-VariableFont_wght.ttf public/fonts/SpaceMono-Bold.woff2 public/fonts/SpaceMono-Regular.woff2
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove unused font files from old design versions"
```

---

### Task 8: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

Update the project structure section and design system references to reflect the new component structure (no versioned directories, no copy/ or interactive/ subdirectories). Update color variable references from `--clr-*` to `--v8-*`. Remove references to magenta/blue/green brand colors. Add note about light/dark mode toggle. Update font references to IBM Plex Mono, Instrument Serif, DM Sans.

- [ ] **Step 1: Update CLAUDE.md**

Update the Project Structure, Fonts, Design System, and Component Patterns sections.

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md && git commit -m "docs: update CLAUDE.md for new component structure and design system"
```

---

### Task 9: Final verification

- [ ] **Step 1: Clean build**

```bash
bun run build
```

Expected: No errors, no warnings about missing files.

- [ ] **Step 2: Dev server check**

```bash
bun run dev
```

Verify in browser:
- Homepage loads with correct theme (system preference)
- Toggle switches between light and dark
- Theme persists across page refreshes
- All sections render correctly in both themes
- Cases detail page renders correctly in both themes
- No 404s for old version URLs
- Navigation logo links to `/`
- Body background transitions smoothly when toggling

- [ ] **Step 3: Commit any remaining fixes if needed**
