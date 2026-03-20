# V2 Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `/v2` landing page based on the updated Pencil design, with a shared floating version-switcher for navigating between v1 and v2.

**Architecture:** New v2-specific section components live in `src/components/v2/`. The v2 page at `src/pages/v2/index.astro` defines light-mode CSS custom properties and a mesh gradient background. A shared `version-switcher.astro` component is added to both v1 and v2 pages. Existing copy components (`headline`, `body`, `overline`, `highlight`) are reused where compatible.

**Tech Stack:** Astro 6, scoped SCSS, CSS custom properties, astro-icon, self-hosted Anton/AntonSC/SpaceGrotesk fonts.

**Design Reference:** `pencil-new.pen` — the Pencil design file is the source of truth for all visual decisions.

**Icons:** Use `@iconify-json/mdi` for UI icons (e.g., `mdi:chevron-up`) and `@iconify-json/simple-icons` for brand icons (e.g., `simple-icons:linkedin`, `simple-icons:github`, `simple-icons:bluesky`). Do NOT use Lucide — it is not installed.

**Responsive:** Every component MUST include `@media` blocks for 1440px, 768px, and 375px breakpoints, matching the v1 pattern. Typically: reduce padding-inline, scale down font sizes, and stack horizontal layouts vertically.

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/pages/v2/index.astro` | V2 landing page with light-mode global styles and mesh gradient |
| `src/components/version-switcher.astro` | Floating pill to switch between v1/v2 (shared) |
| `src/components/v2/navigation.astro` | V2 nav: uppercase links, outlined CTA |
| `src/components/v2/hero.astro` | V2 hero: larger headline, circular photo, outlined CTAs |
| `src/components/v2/logo-section.astro` | Trust logos (largely unchanged) |
| `src/components/v2/highlights-section.astro` | "Making Complexity Work" + 3 glassmorphic cards |
| `src/components/v2/success-stories-section.astro` | Horizontal 4-card layout with large vertical label |
| `src/components/v2/services-section.astro` | Full-width progressive dark strips |
| `src/components/v2/plans-section.astro` | New pricing tiers + decorative text |
| `src/components/v2/why-me-section.astro` | Centered headline + body on light bg |
| `src/components/v2/bento-section.astro` | Current Occupation, Former Career, Skills, Voluntary cards |
| `src/components/v2/contact-section.astro` | Contact form with dark inputs on light bg |
| `src/components/v2/footer.astro` | Minimal footer on light bg |

### Modified Files
| File | Change |
|------|--------|
| `src/pages/index.astro` | Add `<VersionSwitcher />` import and render |

---

## Tasks

### Task 1: Version Switcher + V2 Page Shell

**Files:**
- Create: `src/components/version-switcher.astro`
- Create: `src/pages/v2/index.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create the version switcher component**

The switcher always uses the fixed dark pill style — it's a dev/preview widget, so the dark glassmorphic look works on both light and dark pages. The dark background ensures consistent contrast for the white text labels regardless of page theme.

Create `src/components/version-switcher.astro`:

```astro
---
type Props = {
    current?: 'v1' | 'v2';
}
const { current = 'v1' } = Astro.props;
---
<nav class="version-switcher" aria-label="Version switcher">
    <a href="/" class:list={['version-switcher__link', { active: current === 'v1' }]}>V1</a>
    <a href="/v2" class:list={['version-switcher__link', { active: current === 'v2' }]}>V2</a>
</nav>

<style lang="scss">
    .version-switcher {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
        display: flex;
        gap: 0;
        border-radius: 100vh;
        overflow: hidden;
        backdrop-filter: blur(12px);
        background: rgba(17, 18, 34, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

        &__link {
            padding: 0.625rem 1.5rem;
            font-family: 'Anton', sans-serif;
            font-size: 0.875rem;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.5);
            transition: all 0.25s ease;
            letter-spacing: 0.05em;

            &.active {
                background: var(--clr-magenta, #FF007B);
                color: #fff;
            }

            &:hover:not(.active) {
                color: #fff;
            }
        }
    }
</style>
```

- [ ] **Step 2: Create the v2 page shell**

Create `src/pages/v2/index.astro` with light-mode global styles, mesh gradient background, and font-face declarations:

```astro
---
import VersionSwitcher from '../../components/version-switcher.astro';
---
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sebastian Heitmann - Fractional CTO | V2</title>
    </head>
    <body>
        <!-- Sections will be added in subsequent tasks -->
        <VersionSwitcher current="v2" />
    </body>
</html>

<style lang="scss" is:global>
    /* Font faces (same as v1) */
    @font-face { font-family: 'Anton'; src: url('/fonts/Anton-Regular.ttf') format('truetype'); }
    @font-face { font-family: 'AntonSC'; src: url('/fonts/AntonSC-Regular.ttf') format('truetype'); }
    @font-face { font-family: 'SpaceGrotesk'; src: url('/fonts/SpaceGrotesk-VariableFont_wght.ttf') format('truetype'); }

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
    #root, #__next { isolation: isolate; }

    :root {
        /* V2 light-mode color overrides */
        --clr-bg-primary: #F5F0E8;
        --clr-bg-surface: rgba(22, 24, 48, 0.7);
        --clr-text-primary: #2A2A3C;
        --clr-text-muted: rgba(42, 42, 60, 0.5);
        --clr-white: #fff;
        --clr-black: #000;
        --clr-magenta: #FF007B;
        --clr-blue: #00B7FF;
        --clr-green: #00E08E;
        --clr-border-light: rgba(42, 42, 60, 0.1);
        --clr-border-dark: rgba(255, 255, 255, 0.06);

        --fnt-family-accent: 'AntonSC';
        --fnt-family-primary: 'SpaceGrotesk';
        --fnt-family-secondary: 'Anton';
    }
</style>

<style lang="scss">
    body {
        /* Mesh gradient background matching Pencil design */
        background:
            radial-gradient(ellipse at 20% 10%, #F5F0E8 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, #E8E4F0 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, #F0ECE4 0%, transparent 60%),
            radial-gradient(ellipse at 30% 80%, #EDE8F2 0%, transparent 50%),
            #F5F0E8;
        min-height: 100vh;
    }
</style>
```

- [ ] **Step 3: Add version switcher to v1 page**

In `src/pages/index.astro`, add the import and render the switcher inside `<body>`:

```astro
// Add to frontmatter imports:
import VersionSwitcher from '../components/version-switcher.astro';

// Add before </body>:
<VersionSwitcher current="v1" />
```

- [ ] **Step 4: Verify both pages render**

Run: `bun run dev`
Visit `http://localhost:4321/` — should see v1 with floating switcher pill at bottom-right.
Visit `http://localhost:4321/v2` — should see empty light page with floating switcher pill.
Click between them to verify navigation works.

- [ ] **Step 5: Commit**

```bash
git add src/components/version-switcher.astro src/pages/v2/index.astro src/pages/index.astro
git commit -m "feat(v2): add version switcher and v2 page shell"
```

---

### Task 2: V2 Navigation

**Files:**
- Create: `src/components/v2/navigation.astro`
- Modify: `src/pages/v2/index.astro` (add import)

- [ ] **Step 1: Create navigation component**

Create `src/components/v2/navigation.astro`.

Design reference (from Pencil):
- Links: "OUR WORK", "SERVICES", "CAREER" (uppercase, Anton 22px)
- Logo: "sebastian-heitmann.dev" (Anton 28px, dark text)
- CTA: "Contact" — outlined pill (transparent fill, 1.5px border, cornerRadius 100)
- Layout: flex row, space-between, center-aligned

Note: The navigation includes its own `padding-inline: 144px` and `margin-top: 3.75rem` to be self-contained (no external wrapper needed). The v2 page renders sections directly in `<body>` without a shared container.

```astro
---
---
<nav class="nav" role="navigation" aria-label="Main Navigation">
    <a class="nav-logo" href="/v2">sebastian-heitmann.dev</a>
    <div class="nav-links">
        <a class="nav-link" href="#work">OUR WORK</a>
        <a class="nav-link" href="#services">SERVICES</a>
        <a class="nav-link" href="#career">CAREER</a>
        <a class="nav-cta" href="#contact">Contact</a>
    </div>
</nav>

<style lang="scss">
    .nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;

        &-logo {
            flex-shrink: 0;
            text-decoration: none;
            font-family: 'Anton', sans-serif;
            font-size: 1.75rem;
            font-weight: 700;
            line-height: 1;
            color: var(--clr-text-primary);
        }

        &-links {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2.25rem;
        }

        &-link {
            text-decoration: none;
            font-family: 'Anton', sans-serif;
            font-size: 1.375rem;
            line-height: 1;
            color: var(--clr-text-primary);
        }

        &-cta {
            text-decoration: none;
            font-family: 'Anton', sans-serif;
            font-size: 1.375rem;
            line-height: 1;
            color: var(--clr-text-primary);
            padding: 0.75rem 2.5rem;
            border-radius: 100vh;
            border: 1.5px solid var(--clr-text-primary);
            transition: all 0.25s ease;

            &:hover {
                background: var(--clr-text-primary);
                color: var(--clr-white);
            }
        }
    }

    @media (max-width: 768px) {
        .nav {
            flex-direction: column;
            gap: 1rem;
            &-links { gap: 1rem; flex-wrap: wrap; justify-content: center; }
        }
    }
</style>
```

- [ ] **Step 2: Import and render in v2 page**

Add to `src/pages/v2/index.astro` frontmatter and body.

- [ ] **Step 3: Verify navigation renders correctly**

Run dev server, check `/v2` — nav should show logo left, uppercase links + outlined CTA right.

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/navigation.astro src/pages/v2/index.astro
git commit -m "feat(v2): add navigation with outlined CTA"
```

---

### Task 3: V2 Hero Section

**Files:**
- Create: `src/components/v2/hero.astro`
- Modify: `src/pages/v2/index.astro` (add import)

- [ ] **Step 1: Create hero component**

Design reference (from Pencil):
- Headline: "Sebastian\nHeitmann" — Anton 176px (11rem), letterSpacing -3px, lineHeight 0.9
- Overline: "I build **products**. I lead **teams**. I solve **problems**." (magenta/blue/green)
- Body text: 2 paragraphs, SpaceGrotesk 16px, max-width ~480px
- CTAs: "BOOK A CALL" (outlined pill with bg-surface fill, 1.5px border) + "more about me →" text link
- Aside: Circular profile photo (320px, border-radius 50%), social icons, magenta "Fractional CTO" badge (absolute positioned)
- Layout: absolute positioning for headline, left column, aside
- Total height: 900px, padding: 60px 144px 80px 144px

Structural skeleton for `src/components/v2/hero.astro`:

```astro
---
import { Icon } from 'astro-icon/components';
import { Image } from 'astro:assets';
import picture from '../../assets/fb.jpg';
---
<section class="hero">
    <div class="hero__overline">
        <span>I build </span><span class="magenta">products</span>
        <span>. I lead </span><span class="blue">teams</span>
        <span>. I solve </span><span class="green">problems</span><span>.</span>
    </div>

    <div class="hero__main">
        <h1 class="hero__headline">Sebastian<br>Heitmann</h1>

        <div class="hero__left">
            <div class="hero__body">
                <p>From scale-ups to B2B SaaS founders, I help teams grow through smart software and strong operations.</p>
                <p>With 10+ years of experience across industries and company sizes, I bring structure, speed, and clarity to complex challenges.</p>
            </div>
            <div class="hero__cta-row">
                <a href="#contact" class="hero__cta-primary">BOOK A CALL</a>
                <a href="#career" class="hero__cta-secondary">more about me →</a>
            </div>
        </div>

        <aside class="hero__aside">
            <div class="hero__social-row">
                <Image class="hero__photo" src={picture} alt="Sebastian Heitmann" width={320} height={320} />
                <div class="hero__social-icons">
                    <a href="https://www.linkedin.com/in/don-heidmann/" target="_blank">
                        <Icon name="simple-icons:linkedin" width={32} height={32} />
                    </a>
                    <a href="https://github.com/DonHeidi" target="_blank">
                        <Icon name="simple-icons:github" width={32} height={32} />
                    </a>
                    <a href="https://www.bluesky.com/e2e_developer" target="_blank">
                        <Icon name="simple-icons:bluesky" width={28} height={28} />
                    </a>
                </div>
            </div>
            <div class="hero__badge">
                <span class="hero__badge-title">Fractional CTO</span>
                <div class="hero__badge-skills">
                    <span>Software Development</span>
                    <span>·</span>
                    <span>Technical PM</span>
                    <span>·</span>
                    <span>Solution Design</span>
                </div>
            </div>
        </aside>
    </div>
</section>
```

Key CSS structure:
- `.hero` — height 900px, padding 60px 144px 80px 144px
- `.hero__main` — position: relative, flex: 1
- `.hero__headline` — Anton 11rem, letterSpacing -3px, lineHeight 0.9, color var(--clr-text-primary)
- `.hero__left` — position: absolute or margin-top ~330px, width 480px
- `.hero__aside` — position: absolute, right area (left: 580px, top: 100px)
- `.hero__photo` — width 320px, height 320px, border-radius: 50%, object-fit: cover
- `.hero__social-icons a` — color: var(--clr-text-primary); rotations: LinkedIn -7deg, GitHub 10deg, Bluesky -4deg
- `.hero__badge` — position: absolute, left: 20px, top: 270px, background: var(--clr-magenta) with ~60% opacity, backdrop-blur 8.5px, border-radius: 10px, padding: 20px 36px, width: 440px
- `.hero__cta-primary` — outlined pill: border 1.5px solid var(--clr-text-primary), border-radius: 100vh, padding: 14px 48px, background: var(--clr-bg-surface)
- `.hero__cta-secondary` — text link: SpaceGrotesk 14px

Responsive: at 768px stack vertically, reduce headline to ~4rem, hide aside or stack below. At 375px headline ~2.5rem, full-width layout.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Verify hero layout**

Check headline size, overline colors, profile photo circle, badge position, CTA styling.

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/hero.astro src/pages/v2/index.astro
git commit -m "feat(v2): add hero section with circular photo and outlined CTAs"
```

---

### Task 4: V2 Logo Section

**Files:**
- Create: `src/components/v2/logo-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create logo section**

Design reference (from Pencil):
- Label: "TRUSTED BY COMPANIES LIKE" — SpaceGrotesk 14px, 500 weight, muted color, letterSpacing 2px
- 3 placeholder logos: "ACME Corp", "TechFlow", "Nextera" — Anton 20px, 30% opacity
- Layout: centered column, gap 32px, padding 48px 144px
- Logos in horizontal row with gap 80px

Responsive: at 1440px reduce padding to 80px inline. At 768px padding 2rem, reduce logo gap to 40px. At 375px stack logos vertically.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Commit**

```bash
git add src/components/v2/logo-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add logo trust section"
```

---

### Task 5: V2 Highlights Section

**Files:**
- Create: `src/components/v2/highlights-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create highlights section**

Design reference (from Pencil):
- Overline: "What sets me **apart**" (magenta highlight)
- Headline: "Making Complexity Work" — Anton 72px, white, letterSpacing -1.5px
- 3 glassmorphic cards in horizontal row (gap 24px):
  - Each card: cornerRadius 12px, fill bg-surface, 1px border, backdrop-blur 14px
  - Accent line: 40x3px colored bar (magenta/blue/green)
  - Faded number: Anton 48px, ~6% opacity in brand color
  - Title: Anton 28px, white
  - Body: SpaceGrotesk 14px, muted text
- Cards: "Business Engineering Mindset", "Product-Minded Thinking", "Business-Technology Bridge"
- Padding: 96px 144px, gap 48px between header and cards

Responsive: at 1440px reduce padding to 80px. At 768px stack cards vertically (1 column), padding 2rem, headline ~3rem. At 375px padding 1.25rem, headline ~2rem.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Verify cards render with glassmorphism effect**

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/highlights-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add highlights section with glassmorphic cards"
```

---

### Task 6: V2 Success Stories Section

**Files:**
- Create: `src/components/v2/success-stories-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create success stories section**

Design reference (from Pencil):
- Large "SUCCESS STORY" vertical text — Anton 170px, color #F5F0E8 (cream), rotated 90deg, absolute positioned, letterSpacing 6px
- 4 dark glassmorphic cards in horizontal row (varied widths: 400, 340, 380, 360px):
  - Each card: cornerRadius 12px, dark fill (#1A1C3AE6), backdrop-blur 14px, 1px border rgba(255,255,255,0.1)
  - Image placeholder at top (cornerRadius 8px)
  - Title: Anton 24px, white (uppercase in design)
  - Description: SpaceGrotesk 13px, muted
  - Tag pill: colored background (magenta/blue/green at 12% opacity) with matching text
  - "read more..." link text in cyan/teal
- "BOOK A CALL" dark button below cards (dark fill, outlined, cornerRadius 100vh)
- Padding: 96px 0 96px 144px (no right padding — cards extend)
- Grid container: height 464px, gap 20px

Key layout:
- Parent is horizontal flex
- Vertical label is absolutely positioned
- Content column is vertical flex with cards row and button

Responsive: at 1440px reduce padding-left to 80px. At 768px hide vertical label, stack cards vertically, reduce card widths to 100%. At 375px padding 1.25rem, single-column cards.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Verify horizontal card layout and vertical text**

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/success-stories-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add success stories with horizontal cards and vertical label"
```

---

### Task 7: V2 Services Section

**Files:**
- Create: `src/components/v2/services-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create services section**

Design reference (from Pencil):
- Header: "What I **offer**" overline + "My Services" headline (Anton 72px)
  - Header has bottom padding 48px, max-width 560px
  - Padding: 96px 144px 48px 144px
- 4 full-width service rows as separate elements (NOT inside the services frame):
  - Each row: full viewport width (1440px), horizontal flex, space-between, center-aligned
  - Progressive dark backgrounds: #0C0E1E → #141630 → #1C1F42 → #252854
  - Content: service name (Anton 24px, white, letterSpacing -0.5) + chevron-up icon (`mdi:chevron-up`, 16px, muted)
  - Bottom border: 1px rgba(255,255,255,0.07)
  - Padding: 28px 144px
  - Justify: flex-end with gap 12px between text and icon

Note: In the Pencil design, service rows are direct children of the main page frame (not nested inside the services header section). Implement the same: the services header is one component, and each service row renders as a separate full-width block within the page. Alternatively, wrap everything in one component that uses negative margins or full-bleed technique for the rows.

Recommended: Single component that contains both header and rows, with rows using `width: 100vw` and negative margin to break out of container padding.

Responsive: at 1440px reduce header padding to 80px, row padding to 80px. At 768px padding 2rem, font-size 1.125rem. At 375px padding 1.25rem.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Verify full-width strips with progressive colors**

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/services-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add services section with full-width progressive strips"
```

---

### Task 8: V2 Plans Section

**Files:**
- Create: `src/components/v2/plans-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create plans section**

Design reference (from Pencil):
- 3 plan cards in horizontal row (gap 24px), aligned bottom:
  1. **Hourly Based Consulting** — $130/per hour
     - cornerRadius 20px, padding 40px, bg-surface fill, 1px border
     - Features: Weekly strategy sessions, Technical architecture reviews, Team mentoring, Code review oversight
  2. **Fixed Prototype Iterations** — $4,999/per iteration (FEATURED)
     - "POPULAR" badge pill (magenta)
     - cornerRadius 16px, padding 32px 28px, blue border 1.5px
     - Features: Everything in Practice, Hands-on product development, Sprint planning & delivery, Remote & Async support, Performance tracking support
     - Divider line between price and features
  3. **Monthly CTO Retainer** — $2,499/month
     - cornerRadius 16px, padding 32px, bg-surface fill, 1px border
     - Features: Everything in Growth, Dedicated CTO, Board & stakeholder reporting, Security & compliance oversight, Custom integrations

- Large decorative text below cards:
  - "THE **RIGHT PLAN** FOR" on first line — Anton 84px, #7B7992 gray, "RIGHT PLAN" in magenta, letterSpacing 6px
  - "YOUR BUSINESS" on second line — Anton 84px, #7B7992
  - Centered, padding-top 32px

- Section padding: 96px 144px 64px 144px

Responsive: at 1440px reduce padding to 80px. At 768px stack cards vertically, reduce decorative text to ~48px, padding 2rem. At 375px hide decorative text or reduce to 32px, padding 1.25rem.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Verify card layout and decorative text**

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/plans-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add plans section with new pricing tiers"
```

---

### Task 9: V2 Why Me Section

**Files:**
- Create: `src/components/v2/why-me-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create why-me section**

Design reference (from Pencil):
- Title: "Why " (not visible/light) + "Me" in magenta — Anton 72px
- Blue accent line: 200x4px, cornerRadius 2px
- Body text: SpaceGrotesk 16px, centered, max-width 620px, lineHeight 1.7
- Layout: centered column, gap 24px, padding 96px 144px
- Light/transparent background (inherits mesh gradient)

Responsive: at 1440px reduce padding to 80px. At 768px padding 2rem, headline ~3rem, body max-width 100%. At 375px padding 1.25rem.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Commit**

```bash
git add src/components/v2/why-me-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add why-me section"
```

---

### Task 10: V2 Bento Section

**Files:**
- Create: `src/components/v2/bento-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create bento section**

This is the most complex section. Design reference (from Pencil):

**Title:** "More About Me" — Anton 48px, dark text (uses bg-surface card text color since cards are dark)

**Bento Grid (gap 20px):**

**Row 1 — Current Occupation Card (full width, height ~300px):**
- Horizontal layout: left side (text content) + right side (image, width 461px)
- Left: title "CURRENT OCCUPATION" + description + tag pills ("Software +" , "Career")
- Right: AI-generated space/astronaut image, clipped to card
- Dark bg-surface fill, cornerRadius 12px

**Row 2 — Two columns (gap 20px):**
- **Left column (fill):**
  - Former Career Card:
    - Title: "FORMER CAREER" (Anton, bold)
    - Timeline entry: "Technical Consultant" with company, description
    - "Projects, Tasks, and Tools" subheading with tag pills
    - Dark bg-surface, cornerRadius 12px, padding 32px 28px
  - Skills Card (below Former Career):
    - Title: "Skills"
    - Rows of colored skill tag pills (TypeScript, React, Node.js, AWS, Python, PostgreSQL, Docker, Terraform, etc.)
    - Multi-row layout with varied colors (magenta/blue/green)
    - Dark bg-surface, cornerRadius 12px

- **Right column (width ~470px):**
  - Voluntary Card:
    - Title: "Voluntary" — yellow/gold (#F5C518), Anton 32px
    - Multiple entries with role titles (Anton, bold) and descriptions (SpaceGrotesk, small)
    - Entries: "Member of the Advisory Board", "Fellow Software Development", "Head of Quality & Innovation Management", "Chairman of the Board", separator, "Head of Acquisition & Project Management", "Voluntary Social Year"
    - Dark bg-surface, cornerRadius 12px, padding 28px 24px
    - Spans full height of left column

Responsive: at 1440px reduce padding to 80px. At 768px single-column layout for all cards, Voluntary card full width. At 375px padding 1.25rem, reduce title sizes.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Verify bento grid layout and card content**

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/bento-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add bento section with career, skills, and voluntary cards"
```

---

### Task 11: V2 Contact Section

**Files:**
- Create: `src/components/v2/contact-section.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create contact section**

Design reference (from Pencil):
- Header: "Get in Touch" title + subtitle (centered)
- Form: 2-column rows for Name/Email and Company/Plan, full-width Message textarea
- Input styling: dark gray fill (bg-surface), cornerRadius 8px, 1px border rgba(255,255,255,0.08)
- Plan field: select dropdown with chevron-down icon
- Submit: full-width magenta pill button with glow shadow
- Padding: 96px 280px (narrower than other sections)
- Light/transparent background

Note: This is a static design — form does not need to be functional (matches v1 pattern of progressive enhancement).

Responsive: at 1440px reduce padding to 80px inline. At 768px padding 2rem, stack form rows to single column. At 375px padding 1.25rem.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Commit**

```bash
git add src/components/v2/contact-section.astro src/pages/v2/index.astro
git commit -m "feat(v2): add contact form section"
```

---

### Task 12: V2 Footer

**Files:**
- Create: `src/components/v2/footer.astro`
- Modify: `src/pages/v2/index.astro`

- [ ] **Step 1: Create footer**

Design reference (from Pencil):
- Logo: "sebastian-heitmann.dev" — Anton 22px
- Social icons: `simple-icons:linkedin`, `simple-icons:github`, `simple-icons:bluesky` (24px, muted color)
- Copyright: "2026 Sebastian Heitmann. All rights reserved." — SpaceGrotesk 12px, 40% opacity
- Layout: centered column, gap 24px, padding 40px 144px
- Top border: 1px solid var(--clr-border-light) (dark-toned for light background)
- Light background

Responsive: at 1440px reduce padding to 80px. At 768px padding 2rem. At 375px padding 1.25rem, reduce logo size.

- [ ] **Step 2: Import and add to v2 page**

- [ ] **Step 3: Final full-page review**

Run dev server, scroll through entire `/v2` page. Verify:
- Mesh gradient background visible throughout
- All sections render in correct order
- Version switcher works for navigation
- Responsive behavior at 1440px, 768px, 375px

- [ ] **Step 4: Commit**

```bash
git add src/components/v2/footer.astro src/pages/v2/index.astro
git commit -m "feat(v2): add footer and complete v2 landing page"
```
