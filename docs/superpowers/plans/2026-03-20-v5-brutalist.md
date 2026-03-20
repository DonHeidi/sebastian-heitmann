# V5 Brutalist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a v5 Brutalist / Raw Web version of the portfolio at `/v5/`, following the established pattern of self-contained version directories.

**Architecture:** Each version is a standalone page (`src/pages/v{N}/index.astro`) with 8 dedicated components in `src/components/v{N}/`. All versions share the same content but have completely independent styling. The shared `version-switcher.astro` links between versions.

**Tech Stack:** Astro 6, SCSS, Space Mono (self-hosted), no external dependencies beyond what v1-v4 already use.

**Spec:** `docs/superpowers/specs/2026-03-20-brutalist-v5-design.md`

---

### Task 1: Download and commit Space Mono font files

**Files:**
- Create: `public/fonts/SpaceMono-Regular.woff2`
- Create: `public/fonts/SpaceMono-Bold.woff2`

- [ ] **Step 1: Download Space Mono Regular and Bold woff2 files from Google Fonts**

```bash
# Download from google-webfonts-helper or Google Fonts API
curl -L "https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2" -o public/fonts/SpaceMono-Regular.woff2
curl -L "https://fonts.gstatic.com/s/spacemono/v13/i7dMIFZifjKcF5UAWdDRaPpZYFKQHwyVd3U.woff2" -o public/fonts/SpaceMono-Bold.woff2
```

If the direct URLs don't work, use the google-webfonts-helper approach or download from the Google Fonts website and convert with a font tool.

- [ ] **Step 2: Verify files exist and have reasonable size**

```bash
ls -la public/fonts/SpaceMono-*
```

Expected: Two .woff2 files, each 10-30KB.

- [ ] **Step 3: Commit**

```bash
git add public/fonts/SpaceMono-Regular.woff2 public/fonts/SpaceMono-Bold.woff2
git commit -m "feat(v5): add Space Mono font files"
```

---

### Task 2: Create page scaffold with global styles

**Files:**
- Create: `src/pages/v5/index.astro`

This is the page shell with font-face declarations, CSS reset, custom properties, scroll-reveal animations, and body styling. Components will be wired up as placeholder imports initially.

- [ ] **Step 1: Create the page file**

Create `src/pages/v5/index.astro` with the following content. This mirrors the v4 page structure exactly but with v5 imports, colors, and fonts.

```astro
---
import Navigation from '../../components/v5/navigation.astro';
import Hero from '../../components/v5/hero.astro';
import LogoSection from '../../components/v5/logo-section.astro';
import ServicesSection from '../../components/v5/services-section.astro';
import HowIWorkSection from '../../components/v5/how-i-work-section.astro';
import SuccessStoriesSection from '../../components/v5/success-stories-section.astro';
import ContactSection from '../../components/v5/contact-section.astro';
import Footer from '../../components/v5/footer.astro';
import VersionSwitcher from '../../components/version-switcher.astro';
---
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sebastian Heitmann — Fractional CTO</title>
        <link rel="canonical" href="/">
    </head>
    <body>
        <div class="site-container">
            <Navigation />
            <Hero />
            <LogoSection />
            <ServicesSection />
            <HowIWorkSection />
            <SuccessStoriesSection />
            <ContactSection />
            <Footer />
        </div>
        <VersionSwitcher currentVersion="v5" />
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
        font-family: 'Space Mono';
        font-style: normal;
        font-weight: 400;
        src: url('/fonts/SpaceMono-Regular.woff2') format('woff2');
    }
    @font-face {
        font-family: 'Space Mono';
        font-style: normal;
        font-weight: 700;
        src: url('/fonts/SpaceMono-Bold.woff2') format('woff2');
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
    #root, #__next { isolation: isolate; }

    :root {
        --clr-bg: #FFFFFF;
        --clr-text: #000000;
        --clr-accent: #FF6200;
        --clr-border: #000000;
        --clr-muted: #666666;
    }

    .reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .reveal.revealed { opacity: 1; transform: translateY(0); }

    .stagger {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .revealed .stagger { opacity: 1; transform: translateY(0); }
    .stagger-1 { transition-delay: 0.1s; }
    .stagger-2 { transition-delay: 0.2s; }
    .stagger-3 { transition-delay: 0.3s; }
    .stagger-4 { transition-delay: 0.4s; }

    @media (prefers-reduced-motion: reduce) {
        .reveal, .stagger { opacity: 1; transform: none; transition: none; }
    }

    body {
        background-color: var(--clr-bg);
        min-height: 100vh;
        color: var(--clr-text);
        font-family: 'Space Mono', monospace;
    }
</style>

<style lang="scss">
    .site-container {
        max-width: 1440px;
        margin: 0 auto;
    }
</style>
```

- [ ] **Step 2: Create placeholder components so the page can render**

Create all 8 component files as minimal placeholders (just a `<section>` with the component name) so the page compiles. Each will be fleshed out in subsequent tasks.

For each of these files, create a minimal component:
- `src/components/v5/navigation.astro`
- `src/components/v5/hero.astro`
- `src/components/v5/logo-section.astro`
- `src/components/v5/services-section.astro`
- `src/components/v5/how-i-work-section.astro`
- `src/components/v5/success-stories-section.astro`
- `src/components/v5/contact-section.astro`
- `src/components/v5/footer.astro`

Each placeholder should be:
```astro
---
---
<section><!-- v5 component-name placeholder --></section>
```

- [ ] **Step 3: Verify the page builds**

```bash
bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/v5/index.astro src/components/v5/
git commit -m "feat(v5): add page scaffold and placeholder components"
```

---

### Task 3: Update version switcher

**Files:**
- Modify: `src/components/version-switcher.astro`

- [ ] **Step 1: Update the Props type to include v5**

Change the type union from `'v1' | 'v2' | 'v3' | 'v4'` to `'v1' | 'v2' | 'v3' | 'v4' | 'v5'`.

- [ ] **Step 2: Add v5 to the versions array**

Add after the v4 entry:
```typescript
{ id: 'v5', href: '/v5/', label: 'Brutalist' },
```

- [ ] **Step 3: Add v5 link styling**

Add this SCSS block inside the `.version-switcher` selector, after the `&__link--v4` block:

```scss
&__link--v5 {
    background: #FFFFFF;
    border: 1px solid #000000;
    color: #000000;
    font-family: 'Space Mono', monospace;
    backdrop-filter: none;
    border-radius: 0;

    .version-switcher__dot { background: #FF6200; }
}
```

- [ ] **Step 4: Verify build**

```bash
bun run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/version-switcher.astro
git commit -m "feat(v5): add Brutalist to version switcher"
```

---

### Task 4: Build navigation component

**Files:**
- Modify: `src/components/v5/navigation.astro` (replace placeholder)

- [ ] **Step 1: Implement the navigation component**

Replace the placeholder with the full component. Key specs from the design:
- Not sticky, scrolls away
- Height `60px`, vertically centered content
- `2px solid black` bottom border, full viewport width
- Left: `SEBASTIAN HEITMANN` — Space Mono Bold, 14px, uppercase, letter-spacing 0.1em
- Right: `WORK`, `SERVICES`, `CONTACT` links — same font styling
- Hover: white text on black bg, instant (transition: none)
- Mobile: hamburger (3 black lines), JS tap toggle, full-width black dropdown with white links

```astro
---
---

<nav class="nav" role="navigation" aria-label="Main Navigation">
    <a class="nav__logo" href="/v5/">SEBASTIAN HEITMANN</a>

    <button class="nav__hamburger" aria-label="Toggle menu" aria-expanded="false">
        <span class="nav__hamburger-line"></span>
        <span class="nav__hamburger-line"></span>
        <span class="nav__hamburger-line"></span>
    </button>

    <div class="nav__links">
        <a class="nav__link" href="#work">WORK</a>
        <a class="nav__link" href="#services">SERVICES</a>
        <a class="nav__link" href="#contact">CONTACT</a>
    </div>
</nav>

<script>
    const hamburger = document.querySelector('.nav__hamburger');
    const links = document.querySelector('.nav__links');
    hamburger?.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        links?.classList.toggle('nav__links--open');
    });
</script>

<style lang="scss">
    .nav {
        height: 60px;
        padding-left: 120px;
            padding-right: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid var(--clr-border);

        &__logo {
            text-decoration: none;
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-text);
            padding: 4px 8px;

            &:hover {
                background: var(--clr-text);
                color: var(--clr-bg);
                transition: none;
            }
        }

        &__hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
        }

        &__hamburger-line {
            display: block;
            width: 24px;
            height: 2px;
            background: var(--clr-text);
        }

        &__links {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0;
        }

        &__link {
            text-decoration: none;
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-text);
            padding: 8px 16px;

            &:hover {
                background: var(--clr-text);
                color: var(--clr-bg);
                transition: none;
            }
        }
    }

    @media (max-width: 768px) {
        .nav {
            padding-inline: 2rem;

            &__hamburger {
                display: flex;
            }

            &__links {
                display: none;
                position: absolute;
                top: 60px;
                left: 0;
                right: 0;
                flex-direction: column;
                background: var(--clr-text);
                z-index: 100;

                &--open {
                    display: flex;
                }
            }

            &__link {
                color: var(--clr-bg);
                width: 100%;
                padding: 16px 2rem;

                &:hover {
                    background: var(--clr-bg);
                    color: var(--clr-text);
                }
            }
        }
    }

    @media (max-width: 375px) {
        .nav {
            padding-inline: 1.25rem;

            &__links {
                &--open .nav__link {
                    padding: 16px 1.25rem;
                }
            }
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/navigation.astro
git commit -m "feat(v5): add navigation component"
```

---

### Task 5: Build hero component

**Files:**
- Modify: `src/components/v5/hero.astro` (replace placeholder)

- [ ] **Step 1: Implement the hero component**

Key specs:
- Name: `SEBASTIAN HEITMANN` — Space Mono Bold, 96px desktop / 56px tablet / 40px mobile, uppercase, line-height 1.0, letter-spacing -0.03em
- Role: `FRACTIONAL CTO & PRODUCT ENGINEER` — Space Mono Regular, 18px, uppercase, letter-spacing 0.15em, muted, with 6px orange vertical bar to its left
- CTA: `LET'S TALK` — 2px black border, hover inverts
- Spacing: 160px top, 120px bottom padding (desktop)
- No image, no photo
- Bottom: 4px solid black full-width rule

```astro
---
---

<section class="hero reveal">
    <div class="hero__content">
        <h1 class="hero__name stagger stagger-1">SEBASTIAN<br>HEITMANN</h1>
        <div class="hero__role-group stagger stagger-2">
            <span class="hero__role-bar"></span>
            <p class="hero__role">FRACTIONAL CTO & PRODUCT ENGINEER</p>
        </div>
        <a class="hero__cta stagger stagger-3" href="#contact">LET'S TALK</a>
    </div>
</section>

<style lang="scss">
    .hero {
        padding: 160px 40px 120px 120px;
        border-bottom: 4px solid var(--clr-border);

        &__content {
            max-width: 1200px;
        }

        &__name {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 96px;
            text-transform: uppercase;
            line-height: 1.0;
            letter-spacing: -0.03em;
            color: var(--clr-text);
        }

        &__role-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
            margin-top: 24px;
        }

        &__role-bar {
            display: block;
            width: 6px;
            align-self: stretch;
            background: var(--clr-accent);
            flex-shrink: 0;
        }

        &__role {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--clr-muted);
        }

        &__cta {
            display: inline-block;
            margin-top: 48px;
            text-decoration: none;
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-text);
            border: 2px solid var(--clr-border);
            padding: 16px 32px;

            &:hover {
                background: var(--clr-text);
                color: var(--clr-bg);
                transition: none;
            }
        }
    }

    @media (max-width: 768px) {
        .hero {
            padding: 80px 2rem 60px;

            &__name {
                font-size: 56px;
            }
        }
    }

    @media (max-width: 375px) {
        .hero {
            padding: 60px 1.25rem 48px;

            &__name {
                font-size: 40px;
            }

            &__role {
                font-size: 14px;
            }
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/hero.astro
git commit -m "feat(v5): add hero component"
```

---

### Task 6: Build logo section component

**Files:**
- Modify: `src/components/v5/logo-section.astro` (replace placeholder)

- [ ] **Step 1: Implement the logo section**

Key specs:
- Section label: `CLIENTS` — 12px, uppercase, letter-spacing 0.2em, muted
- Company names as text (not logos): Space Mono Bold, 16px, uppercase, letter-spacing 0.05em
- Horizontal row, separated by `·` middle dots in muted color, 32px spacing
- Mobile: two columns
- No hover effects
- Bottom: 4px solid black rule
- Padding: 60px top and bottom

Use the same company names from v4: Jung von Matt, Synergy, Granny & Smith, OFFIS, Pool Position GmbH, mobilespace GmbH.

```astro
---
const companies = [
    'Jung von Matt',
    'Synergy',
    'Granny & Smith',
    'OFFIS',
    'Pool Position',
    'mobilespace',
];
---

<section class="clients reveal">
    <p class="clients__label">CLIENTS</p>
    <div class="clients__names">
        {companies.map((name, i) => (
            <>
                <span class="clients__name">{name}</span>
                {i < companies.length - 1 && <span class="clients__dot">·</span>}
            </>
        ))}
    </div>
</section>

<style lang="scss">
    .clients {
        padding: 60px 40px 60px 120px;
        border-bottom: 4px solid var(--clr-border);

        &__label {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--clr-muted);
            margin-bottom: 24px;
        }

        &__names {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px 32px;
        }

        &__name {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--clr-text);
        }

        &__dot {
            font-family: 'Space Mono', monospace;
            font-size: 20px;
            color: var(--clr-muted);
            user-select: none;
        }
    }

    @media (max-width: 768px) {
        .clients {
            padding: 48px 2rem;

            &__names {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            &__dot {
                display: none;
            }
        }
    }

    @media (max-width: 375px) {
        .clients {
            padding: 40px 1.25rem;

            &__name {
                font-size: 14px;
            }
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/logo-section.astro
git commit -m "feat(v5): add logo section component"
```

---

### Task 7: Build services section component

**Files:**
- Modify: `src/components/v5/services-section.astro` (replace placeholder)

- [ ] **Step 1: Implement the services section**

Key specs:
- Section label: `SERVICES` — 12px, uppercase, muted
- Each service: 4px black left border, 24px left padding, name (28px bold), description (16px, max-width 640px, line-height 1.6), engagement model (13px muted)
- Hover: left border changes to orange, instant
- 48px between services
- Bottom: 4px solid black rule
- Padding: 80px top/bottom

Content from v4: Strategy & Advisory, Product & Engineering, Operations & Scale — with their descriptions and engagement models.

```astro
---
const services = [
    {
        name: 'Strategy & Advisory',
        description: 'Technical due diligence, architecture assessment, build vs. buy analysis, and product roadmap review. For founders who need clarity before committing to a direction.',
        engagement: 'Hourly consulting — $130/hour',
    },
    {
        name: 'Product & Engineering',
        description: 'Full-stack development, sprint planning, delivery, and CI/CD. Hands-on product leadership and engineering execution for teams that need to ship.',
        engagement: 'Fixed iterations — $4,999/iteration',
    },
    {
        name: 'Operations & Scale',
        description: 'Engineering process design, hiring, onboarding, performance monitoring, and incident management. Structure and process for growing companies.',
        engagement: 'Monthly retainer — $2,499/month',
    },
];
---

<section class="services reveal" id="services">
    <p class="services__label">SERVICES</p>
    <div class="services__list">
        {services.map((service, i) => (
            <div class={`services__item stagger stagger-${i + 1}`}>
                <h3 class="services__name">{service.name}</h3>
                <p class="services__desc">{service.description}</p>
                <p class="services__engagement">{service.engagement}</p>
            </div>
        ))}
    </div>
</section>

<style lang="scss">
    .services {
        padding: 80px 40px 80px 120px;
        border-bottom: 4px solid var(--clr-border);

        &__label {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--clr-muted);
            margin-bottom: 48px;
        }

        &__list {
            display: flex;
            flex-direction: column;
            gap: 48px;
        }

        &__item {
            border-left: 4px solid var(--clr-border);
            padding-left: 24px;

            &:hover {
                border-left-color: var(--clr-accent);
                transition: none;
            }
        }

        &__name {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 28px;
            text-transform: uppercase;
            color: var(--clr-text);
        }

        &__desc {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 16px;
            line-height: 1.6;
            color: var(--clr-text);
            max-width: 640px;
            margin-top: 12px;
        }

        &__engagement {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-muted);
            margin-top: 8px;
        }
    }

    @media (max-width: 768px) {
        .services {
            padding: 60px 2rem;

            &__name {
                font-size: 22px;
            }
        }
    }

    @media (max-width: 375px) {
        .services {
            padding: 48px 1.25rem;

            &__name {
                font-size: 20px;
            }

            &__desc {
                font-size: 14px;
            }
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/services-section.astro
git commit -m "feat(v5): add services section component"
```

---

### Task 8: Build how-i-work section component

**Files:**
- Modify: `src/components/v5/how-i-work-section.astro` (replace placeholder)

- [ ] **Step 1: Implement the how-i-work section**

Key specs:
- Section label: `PROCESS` — 12px, uppercase, muted
- Each step: number in Space Mono Bold 64px orange, step name 22px bold uppercase, description 16px, max-width 520px
- Numbers in fixed-width 80px left column, text to the right
- 56px between steps
- Mobile: numbers shrink to 48px, same two-column layout
- Bottom: 4px solid black rule
- Padding: 80px top/bottom

Content from v4: Discovery, Strategy, Delivery, Handoff.

```astro
---
const steps = [
    {
        number: '1',
        title: 'Discovery',
        description: 'We start with your business context — goals, constraints, team, and timeline. No templates. I need to understand the real problem before proposing a solution.',
    },
    {
        number: '2',
        title: 'Strategy',
        description: 'I map out the technical approach, identify risks early, and align the plan with your business objectives. You get a clear roadmap, not a vague proposal.',
    },
    {
        number: '3',
        title: 'Delivery',
        description: 'Hands-on execution — building, shipping, and iterating. I work with your team or independently, with full transparency and regular check-ins.',
    },
    {
        number: '4',
        title: 'Handoff',
        description: 'Every engagement ends with documentation, knowledge transfer, and systems your team can own. I build to leave, not to create dependency.',
    },
];
---

<section class="process reveal" id="process">
    <p class="process__label">PROCESS</p>
    <div class="process__steps">
        {steps.map((step, i) => (
            <div class={`process__step stagger stagger-${i + 1}`}>
                <span class="process__number">{step.number}</span>
                <div class="process__text">
                    <h3 class="process__title">{step.title}</h3>
                    <p class="process__desc">{step.description}</p>
                </div>
            </div>
        ))}
    </div>
</section>

<style lang="scss">
    .process {
        padding: 80px 40px 80px 120px;
        border-bottom: 4px solid var(--clr-border);

        &__label {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--clr-muted);
            margin-bottom: 48px;
        }

        &__steps {
            display: flex;
            flex-direction: column;
            gap: 56px;
        }

        &__step {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 24px;
        }

        &__number {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 64px;
            line-height: 1;
            color: var(--clr-accent);
            width: 80px;
            flex-shrink: 0;
        }

        &__text {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-top: 8px;
        }

        &__title {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 22px;
            text-transform: uppercase;
            color: var(--clr-text);
        }

        &__desc {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 16px;
            line-height: 1.6;
            color: var(--clr-text);
            max-width: 520px;
        }
    }

    @media (max-width: 768px) {
        .process {
            padding: 60px 2rem;

            &__number {
                font-size: 48px;
                width: 60px;
            }

            &__title {
                font-size: 18px;
            }
        }
    }

    @media (max-width: 375px) {
        .process {
            padding: 48px 1.25rem;

            &__desc {
                font-size: 14px;
            }
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/how-i-work-section.astro
git commit -m "feat(v5): add how-i-work section component"
```

---

### Task 9: Build success stories section component

**Files:**
- Modify: `src/components/v5/success-stories-section.astro` (replace placeholder)

- [ ] **Step 1: Implement the success stories section**

Key specs:
- Section label: `WORK` — 12px, uppercase, muted
- Each story separated by 2px solid black horizontal rules (thinner than section dividers)
- Company name: Space Mono Bold, 20px, uppercase
- Description: 16px, line-height 1.6, 2-3 sentences
- Key stat: Space Mono Bold, 14px, orange, uppercase, letter-spacing 0.1em
- Hover: entire block inverts (black bg, white text, orange stat stays orange), hard cut
- 40px padding per story
- Bottom: 4px solid black rule
- Padding: 80px top/bottom

Content from v4: SaaS Platform Rebuild, Scale-Up Team Building, Cloud Migration, E-Commerce Relaunch.

```astro
---
const stories = [
    {
        name: 'SaaS Platform Rebuild',
        description: 'Architecture overhaul of a multi-tenant SaaS platform serving 200+ enterprise clients. Migrated from monolithic PHP to distributed Node.js, tripling throughput.',
        stat: '40% COST REDUCTION',
    },
    {
        name: 'Scale-Up Team Building',
        description: 'Built an engineering team from scratch. Established hiring pipelines, onboarding, and code review culture that cut deploy time from weeks to hours.',
        stat: '12-PERSON TEAM',
    },
    {
        name: 'Cloud Migration',
        description: 'Migrated a legacy monolith to cloud-native microservices on AWS — zero downtime, 5M records preserved, 60% infrastructure cost reduction.',
        stat: '99.99% UPTIME',
    },
    {
        name: 'E-Commerce Relaunch',
        description: 'Rebuilt a failing e-commerce platform end-to-end, delivering 3x conversion rate improvement and 60% faster page loads.',
        stat: '3X CONVERSIONS',
    },
];
---

<section class="work reveal" id="work">
    <p class="work__label">WORK</p>
    <div class="work__stories">
        {stories.map((story, i) => (
            <div class={`work__story stagger stagger-${Math.min(i + 1, 4)}`}>
                <h3 class="work__name">{story.name}</h3>
                <p class="work__desc">{story.description}</p>
                <p class="work__stat">{story.stat}</p>
            </div>
        ))}
    </div>
</section>

<style lang="scss">
    .work {
        padding: 80px 40px 80px 120px;
        border-bottom: 4px solid var(--clr-border);

        &__label {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--clr-muted);
            margin-bottom: 48px;
        }

        &__stories {
            display: flex;
            flex-direction: column;
        }

        &__story {
            padding: 40px 0;
            border-top: 2px solid var(--clr-border);

            &:last-child {
                border-bottom: 2px solid var(--clr-border);
            }

            &:hover {
                background: var(--clr-text);
                padding: 40px 24px;
                margin: 0 -24px;
                transition: none;

                .work__name,
                .work__desc {
                    color: var(--clr-bg);
                }
            }
        }

        &__name {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 20px;
            text-transform: uppercase;
            color: var(--clr-text);
        }

        &__desc {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 16px;
            line-height: 1.6;
            color: var(--clr-text);
            margin-top: 8px;
        }

        &__stat {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-accent);
            margin-top: 12px;
        }
    }

    @media (max-width: 768px) {
        .work {
            padding: 60px 2rem;

            &__story:hover {
                padding: 40px 2rem;
                margin: 0 -2rem;
            }

            &__name {
                font-size: 18px;
            }
        }
    }

    @media (max-width: 375px) {
        .work {
            padding: 48px 1.25rem;

            &__story:hover {
                padding: 40px 1.25rem;
                margin: 0 -1.25rem;
            }

            &__desc {
                font-size: 14px;
            }
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/success-stories-section.astro
git commit -m "feat(v5): add success stories section component"
```

---

### Task 10: Build contact section component

**Files:**
- Modify: `src/components/v5/contact-section.astro` (replace placeholder)

- [ ] **Step 1: Implement the contact section**

Key specs:
- Section label: `CONTACT` — 12px, muted
- Headline: `LET'S WORK TOGETHER` — Space Mono Bold, 48px desktop / 32px mobile
- Form fields: NAME, EMAIL, MESSAGE — 2px black border, no border-radius, 16px padding
- Labels: 12px, uppercase, letter-spacing 0.15em, above inputs
- Focus: border thickens to 4px, no outline glow
- No placeholders
- Submit: `SEND` — black bg, white text, hover inverts
- Static/decorative form, no submission
- Bottom: 4px solid black rule
- Padding: 80px top/bottom

```astro
---
---

<section class="contact reveal" id="contact">
    <p class="contact__label">CONTACT</p>
    <h2 class="contact__headline stagger stagger-1">LET'S WORK TOGETHER</h2>

    <form class="contact__form stagger stagger-2" action="#" method="POST">
        <div class="contact__field">
            <label class="contact__field-label" for="v5-name">NAME</label>
            <input class="contact__input" type="text" id="v5-name" name="name" required />
        </div>

        <div class="contact__field">
            <label class="contact__field-label" for="v5-email">EMAIL</label>
            <input class="contact__input" type="email" id="v5-email" name="email" required />
        </div>

        <div class="contact__field">
            <label class="contact__field-label" for="v5-message">MESSAGE</label>
            <textarea class="contact__textarea" id="v5-message" name="message" required></textarea>
        </div>

        <button type="submit" class="contact__submit">SEND</button>
    </form>
</section>

<style lang="scss">
    .contact {
        padding: 80px 40px 80px 120px;
        border-bottom: 4px solid var(--clr-border);

        &__label {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--clr-muted);
            margin-bottom: 24px;
        }

        &__headline {
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 48px;
            text-transform: uppercase;
            color: var(--clr-text);
            margin-bottom: 48px;
        }

        &__form {
            display: flex;
            flex-direction: column;
            gap: 32px;
            max-width: 640px;
        }

        &__field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        &__field-label {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--clr-text);
        }

        &__input {
            border: 2px solid var(--clr-border);
            border-radius: 0;
            padding: 16px;
            font-family: 'Space Mono', monospace;
            font-size: 16px;
            color: var(--clr-text);
            background: var(--clr-bg);
            outline: none;

            &:focus {
                border-width: 4px;
                padding: 14px;
            }
        }

        &__textarea {
            border: 2px solid var(--clr-border);
            border-radius: 0;
            padding: 16px;
            font-family: 'Space Mono', monospace;
            font-size: 16px;
            color: var(--clr-text);
            background: var(--clr-bg);
            outline: none;
            height: 160px;
            resize: vertical;

            &:focus {
                border-width: 4px;
                padding: 14px;
            }
        }

        &__submit {
            width: fit-content;
            padding: 16px 48px;
            border: 2px solid var(--clr-border);
            border-radius: 0;
            background: var(--clr-text);
            color: var(--clr-bg);
            font-family: 'Space Mono', monospace;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;

            &:hover {
                background: var(--clr-bg);
                color: var(--clr-text);
                transition: none;
            }
        }
    }

    @media (max-width: 768px) {
        .contact {
            padding: 60px 2rem;

            &__headline {
                font-size: 36px;
            }
        }
    }

    @media (max-width: 375px) {
        .contact {
            padding: 48px 1.25rem;

            &__headline {
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

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/contact-section.astro
git commit -m "feat(v5): add contact section component"
```

---

### Task 11: Build footer component

**Files:**
- Modify: `src/components/v5/footer.astro` (replace placeholder)

- [ ] **Step 1: Implement the footer**

Key specs:
- Single row: left (copyright), right (social links as text)
- Copyright: `© 2026 SEBASTIAN HEITMANN` — 12px, muted
- Links: `GITHUB`, `LINKEDIN`, `EMAIL` — 12px, uppercase, black, 24px spacing
- Hover: invert (white on black), no transition
- Mobile: stack — links top, copyright below, left-aligned
- No top rule (previous section's bottom rule serves as boundary)
- Padding: 40px top/bottom

```astro
---
---

<footer class="footer">
    <p class="footer__copyright">&copy; 2026 SEBASTIAN HEITMANN</p>
    <div class="footer__links">
        <a class="footer__link" href="https://github.com/DonHeidi" target="_blank" rel="noopener noreferrer">GITHUB</a>
        <a class="footer__link" href="https://www.linkedin.com/in/don-heidmann/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        <a class="footer__link" href="mailto:hello@sebastian-heitmann.dev">EMAIL</a>
    </div>
</footer>

<style lang="scss">
    .footer {
        padding: 40px 40px 40px 120px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        &__links {
            display: flex;
            flex-direction: row;
            gap: 24px;
        }

        &__link {
            text-decoration: none;
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-text);
            padding: 4px 8px;

            &:hover {
                background: var(--clr-text);
                color: var(--clr-bg);
                transition: none;
            }
        }

        &__copyright {
            font-family: 'Space Mono', monospace;
            font-weight: 400;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--clr-muted);
        }
    }

    @media (max-width: 768px) {
        .footer {
            padding: 40px 2rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;

            &__links {
                order: -1;
            }
        }
    }

    @media (max-width: 375px) {
        .footer {
            padding: 32px 1.25rem;
        }
    }
</style>
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/v5/footer.astro
git commit -m "feat(v5): add footer component"
```

---

### Task 12: Final build verification and visual check

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

```bash
bun run build
```

Expected: Clean build, no errors or warnings.

- [ ] **Step 2: Start dev server and verify at /v5/**

```bash
bun run dev
```

Open `http://localhost:4321/v5/` and verify:
- All sections render
- Space Mono font loads correctly
- Orange accents appear only where specified (hero bar, process numbers, success story stats)
- Hover inversions work (nav links, CTA buttons, service borders, success story blocks, footer links)
- Section dividers (4px black rules) are present between all sections
- Version switcher shows and links to other versions
- Mobile responsive at 768px and 375px breakpoints

- [ ] **Step 3: Verify version switcher on other versions**

Navigate to `/`, `/v2/`, `/v3/`, `/v4/` and confirm the "Brutalist" link appears in the version switcher on each page.
