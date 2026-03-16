# Success Stories Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Success Stories" section with staggered card grid, content collection, and detail pages.

**Architecture:** Astro Content Collections with `glob` loader for case study data. A section component on the homepage renders cards in a staggered 2-column grid with large vertical text. Each card links to a dynamic detail page at `/cases/[id]`.

**Tech Stack:** Astro 6, Content Collections (glob loader, Zod schema, image() helper), scoped SCSS, Astro `<Image />` component.

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/content.config.ts` | Content collection schema for cases |
| Create | `src/content/cases/ddp-app.md` | Placeholder case study 1 |
| Create | `src/content/cases/saas-platform.md` | Placeholder case study 2 |
| Create | `src/content/cases/mobile-dashboard.md` | Placeholder case study 3 |
| Create | `src/content/cases/analytics-engine.md` | Placeholder case study 4 |
| Create | `src/components/success-story-card.astro` | Individual card component |
| Create | `src/components/success-stories-section.astro` | Section with vertical text + staggered grid |
| Modify | `src/pages/index.astro:1-6,15` | Import and add section |
| Create | `src/pages/cases/[id].astro` | Dynamic detail page |

---

## Chunk 1: Content Collection Foundation

### Task 1: Create content collection config

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create the content collection config**

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    excerpt: z.string(),
    image: image(),
    order: z.number(),
  }),
});

export const collections = { cases };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(cases): add content collection config for case studies"
```

### Task 2: Create placeholder case study content

**Files:**
- Create: `src/content/cases/ddp-app.md`
- Create: `src/content/cases/saas-platform.md`
- Create: `src/content/cases/mobile-dashboard.md`
- Create: `src/content/cases/analytics-engine.md`

Note: All 4 entries reference `../../assets/fb.jpg` as a placeholder image. The `image()` schema helper resolves relative paths from the markdown file's location.

- [ ] **Step 1: Create `src/content/cases/ddp-app.md`**

```markdown
---
title: "DDP - APP"
subtitle: "LOREM IPSUM"
excerpt: "We build intelligent software solutions from modern landing pages, mobile applications, so SaaS applications with a strategic approach driven by incremental growth."
image: "../../assets/fb.jpg"
order: 1
---

## Overview

DDP - APP is a comprehensive digital product built to streamline operations and improve user engagement. The project involved designing and developing a full-stack application from concept to launch.

## Challenge

The client needed a scalable platform that could handle rapid growth while maintaining performance and reliability across multiple regions.

## Solution

We implemented a modular architecture with microservices, enabling independent scaling of critical components. The frontend was built with a focus on performance and accessibility.

## Results

- 40% reduction in operational overhead
- 3x improvement in page load times
- 99.9% uptime achieved in the first quarter
```

- [ ] **Step 2: Create `src/content/cases/saas-platform.md`**

```markdown
---
title: "SaaS Platform"
subtitle: "LOREM IPSUM"
excerpt: "We build intelligent software solutions from modern landing pages, mobile applications, so SaaS applications with a strategic approach driven by incremental growth."
image: "../../assets/fb.jpg"
order: 2
---

## Overview

A B2B SaaS platform designed to help mid-size companies manage their digital transformation journey with structured workflows and real-time analytics.

## Challenge

Legacy systems were creating bottlenecks in the client's operations. Data was siloed across departments with no unified view.

## Solution

We built a cloud-native platform with a unified data layer, role-based access controls, and automated reporting pipelines.

## Results

- Unified 5 legacy systems into one platform
- 60% faster reporting cycles
- Adopted by 200+ internal users within 3 months
```

- [ ] **Step 3: Create `src/content/cases/mobile-dashboard.md`**

```markdown
---
title: "Mobile Dashboard"
subtitle: "LOREM IPSUM"
excerpt: "We build intelligent software solutions from modern landing pages, mobile applications, so SaaS applications with a strategic approach driven by incremental growth."
image: "../../assets/fb.jpg"
order: 3
---

## Overview

A mobile-first dashboard application providing real-time insights for field teams and executive stakeholders.

## Challenge

The existing reporting tools were desktop-only, leaving field teams without access to critical data during client meetings.

## Solution

We designed a responsive, offline-capable dashboard with progressive web app capabilities and push notifications for critical metrics.

## Results

- 85% adoption rate among field teams
- Reduced reporting delays from days to minutes
- Enabled data-driven decisions in real-time
```

- [ ] **Step 4: Create `src/content/cases/analytics-engine.md`**

```markdown
---
title: "Analytics Engine"
subtitle: "LOREM IPSUM"
excerpt: "We build intelligent software solutions from modern landing pages, mobile applications, so SaaS applications with a strategic approach driven by incremental growth."
image: "../../assets/fb.jpg"
order: 4
---

## Overview

A custom analytics engine built to process and visualize large datasets for a data-driven product company.

## Challenge

Off-the-shelf analytics tools couldn't handle the client's custom data structures and unique visualization requirements.

## Solution

We built a purpose-built analytics pipeline with custom aggregation logic and interactive visualizations tailored to the team's workflows.

## Results

- Processing 10M+ events per day
- Custom dashboards reduced analysis time by 70%
- Self-service analytics eliminated dependency on engineering
```

- [ ] **Step 5: Verify the content collection loads**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run build`
Expected: Build succeeds (content collection is defined but not yet queried — no errors)

- [ ] **Step 6: Commit**

```bash
git add src/content/cases/
git commit -m "feat(cases): add 4 placeholder case study entries"
```

---

## Chunk 2: Card Component

### Task 3: Create the success story card component

**Files:**
- Create: `src/components/success-story-card.astro`

- [ ] **Step 1: Create `src/components/success-story-card.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

type Props = {
  title: string;
  subtitle: string;
  excerpt: string;
  image: ImageMetadata;
  slug: string;
};

const { title, subtitle, excerpt, image, slug }: Props = Astro.props;
---
<article class="story-card">
  <div class="story-card__image-wrapper">
    <Image
      src={image}
      alt={title}
      width={600}
      height={400}
      fit="cover"
      class="story-card__image"
    />
  </div>
  <div class="story-card__content">
    <div class="story-card__titles">
      <h3 class="story-card__title">{title}</h3>
      <p class="story-card__subtitle">{subtitle}</p>
    </div>
    <p class="story-card__excerpt">{excerpt}</p>
    <a href={`/cases/${slug}`} class="story-card__link">Read More..</a>
  </div>
</article>

<style lang="scss">
  .story-card {
    border-radius: 12px;
    overflow: hidden;
    background: rgba(22, 24, 48, 0.7);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow:
      inset 1px 1px 1px 0 rgba(101, 108, 161, 0.15),
      -1px -1px 2px 0 rgba(101, 108, 161, 0.08),
      inset -1px -1px 0 0 rgba(0, 0, 0, 0.3),
      2px 2px 8px 0 rgba(0, 0, 0, 0.4);
    transition:
      transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.35s ease;

    &:hover {
      transform: translateY(-6px);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        inset 1px 1px 1px 0 rgba(101, 108, 161, 0.2),
        -1px -1px 2px 0 rgba(101, 108, 161, 0.12),
        inset -1px -1px 0 0 rgba(0, 0, 0, 0.3),
        4px 8px 20px 0 rgba(0, 0, 0, 0.5);
    }

    &__image-wrapper {
      width: 100%;
      aspect-ratio: 3 / 2;
      overflow: hidden;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &__titles {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    &__title {
      font-family: 'AntonSC', sans-serif;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.2;
      color: #fff;
    }

    &__subtitle {
      font-family: 'AntonSC', sans-serif;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.2;
      color: rgba(255, 255, 255, 0.7);
    }

    &__excerpt {
      font-family: 'SpaceGrotesk', sans-serif;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--clr-font-primary);
    }

    &__link {
      font-family: 'AntonSC', sans-serif;
      font-size: 0.875rem;
      color: #fff;
      text-decoration: underline;
      text-underline-offset: 3px;
      width: fit-content;
      transition: opacity 0.2s ease;

      &::after {
        content: ' -->';
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/success-story-card.astro
git commit -m "feat(cases): add success story card component"
```

---

## Chunk 3: Section Component

### Task 4: Create the success stories section

**Files:**
- Create: `src/components/success-stories-section.astro`

- [ ] **Step 1: Create `src/components/success-stories-section.astro`**

```astro
---
import { getCollection } from 'astro:content';
import SuccessStoryCard from './success-story-card.astro';
import CTA from './interactive/call-to-action.astro';

const stories = (await getCollection('cases')).sort(
  (a, b) => a.data.order - b.data.order
);
---
<section id="cases" class="success-stories">
  <div class="success-stories__layout">
    <div class="success-stories__vertical-text" aria-hidden="true">
      <span>Success Story</span>
    </div>
    <div class="success-stories__grid">
      <div class="success-stories__column success-stories__column--left">
        {stories.filter((_, i) => i % 2 === 0).map((story) => (
          <SuccessStoryCard
            title={story.data.title}
            subtitle={story.data.subtitle}
            excerpt={story.data.excerpt}
            image={story.data.image}
            slug={story.id}
          />
        ))}
      </div>
      <div class="success-stories__column success-stories__column--right">
        {stories.filter((_, i) => i % 2 === 1).map((story) => (
          <SuccessStoryCard
            title={story.data.title}
            subtitle={story.data.subtitle}
            excerpt={story.data.excerpt}
            image={story.data.image}
            slug={story.id}
          />
        ))}
      </div>
    </div>
  </div>
  <div class="success-stories__cta">
    <CTA link="/contact" type="primary">Book a Call</CTA>
  </div>
</section>

<style lang="scss">
  .success-stories {
    position: relative;
    padding-inline: 144px;
    padding-block: 6rem;
    background-color: var(--clr-bg-primary);

    &__layout {
      display: grid;
      grid-template-columns: 6rem 1fr;
      gap: 2rem;
      align-items: start;
    }

    &__vertical-text {
      writing-mode: vertical-lr;
      transform: rotate(180deg);
      font-family: 'AntonSC', sans-serif;
      font-size: 8rem;
      line-height: 1;
      color: rgba(255, 255, 255, 0.08);
      user-select: none;
      white-space: nowrap;
      align-self: stretch;
      display: flex;
      align-items: center;
      text-transform: uppercase;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    &__column {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      &--right {
        margin-top: 6rem;
      }
    }

    &__cta {
      display: flex;
      justify-content: center;
      margin-top: 4rem;
    }
  }

  @media (max-width: 1440px) {
    .success-stories {
      padding-inline: 80px;

      &__vertical-text {
        font-size: 6rem;
      }

      &__layout {
        grid-template-columns: 4.5rem 1fr;
      }
    }
  }

  @media (max-width: 768px) {
    .success-stories {
      padding-inline: 2rem;
      padding-block: 4rem;

      &__layout {
        grid-template-columns: 3rem 1fr;
        gap: 1rem;
      }

      &__vertical-text {
        font-size: 4rem;
      }

      &__grid {
        grid-template-columns: 1fr;
      }

      &__column--right {
        margin-top: 0;
      }
    }
  }

  @media (max-width: 375px) {
    .success-stories {
      padding-inline: 1.25rem;
      padding-block: 3rem;

      &__layout {
        grid-template-columns: 2rem 1fr;
      }

      &__vertical-text {
        font-size: 2rem;
      }
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/success-stories-section.astro
git commit -m "feat(cases): add success stories section with staggered grid layout"
```

---

## Chunk 4: Integration & Detail Page

### Task 5: Add section to index page

**Files:**
- Modify: `src/pages/index.astro:1-6` (imports) and `:15` (component placement)

- [ ] **Step 1: Add import to `index.astro`**

Add after the existing imports (line 5):

```astro
import SuccessStoriesSection from '../components/success-stories-section.astro';
```

- [ ] **Step 2: Add component to page body**

Insert after `<HighlightSection />` (line 15), before `<UseCases />`:

```astro
        <SuccessStoriesSection />
```

- [ ] **Step 3: Verify the build**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Verify dev server**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run dev`
Expected: Homepage renders with the success stories section visible after the highlights section.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(cases): integrate success stories section into homepage"
```

### Task 6: Create the detail page

**Files:**
- Create: `src/pages/cases/[id].astro`

- [ ] **Step 1: Create `src/pages/cases/[id].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import Navigation from '../../components/navigation.astro';
import GridBackgroundContainer from '../../components/grid-background-container.astro';
import Headline from '../../components/copy/headline.astro';

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
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{entry.data.title} — Sebastian Heitmann</title>
  </head>
  <body>
    <GridBackgroundContainer>
      <div class="detail-page">
        <nav class="detail-page__nav">
          <Navigation />
        </nav>
        <article class="detail-page__article">
          <div class="detail-page__hero">
            <Image
              src={entry.data.image}
              alt={entry.data.title}
              width={1200}
              height={600}
              fit="cover"
              class="detail-page__hero-image"
            />
          </div>
          <div class="detail-page__content">
            <header class="detail-page__header">
              <Headline element="h1" as="h3">{entry.data.title}</Headline>
              <p class="detail-page__subtitle">{entry.data.subtitle}</p>
            </header>
            <div class="detail-page__body">
              <Content />
            </div>
            <a href="/#cases" class="detail-page__back">&larr; Back to cases</a>
          </div>
        </article>
      </div>
    </GridBackgroundContainer>
  </body>
</html>

<style lang="scss" is:global>
  @font-face {
    font-family: 'Anton';
    src: url('/fonts/Anton-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'AntonSC';
    src: url('/fonts/AntonSC-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'SpaceGrotesk';
    src: url('/fonts/SpaceGrotesk-VariableFont_wght.ttf') format('truetype');
  }

  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    background-color: #111222;
    color: #E7E5DB;
  }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

  :root {
    color-scheme: light dark;
    --fnt-family-accent: 'AntonSC';
    --fnt-family-primary: 'SpaceGrotesk';
    --fnt-family-secondary: 'Anton';
    --clr-font-primary: light-dark(black, #E7E5DB);
    --clr-white: #fff;
    --clr-black: #000;
    --clr-magenta: #FF007B;
    --clr-blue: #00B7FF;
    --clr-green: #00E08E;
    --clr-bg-primary: #111222;
  }
</style>

<style lang="scss">
  .detail-page {
    min-height: 100dvh;
    padding-inline: 144px;

    &__nav {
      padding-block: 0;
    }

    &__article {
      padding-block: 4rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    &__hero {
      width: 100%;
      border-radius: 12px;
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

    &__subtitle {
      font-family: 'AntonSC', sans-serif;
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
    }

    &__body {
      font-family: 'SpaceGrotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.7;
      color: var(--clr-font-primary);

      :global(h2) {
        font-family: 'AntonSC', sans-serif;
        font-size: 1.5rem;
        color: #fff;
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
      font-family: 'SpaceGrotesk', sans-serif;
      font-size: 0.875rem;
      color: var(--clr-blue);
      text-decoration: none;
      width: fit-content;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  @media (max-width: 1440px) {
    .detail-page {
      padding-inline: 80px;
    }
  }

  @media (max-width: 768px) {
    .detail-page {
      padding-inline: 2rem;

      &__article {
        padding-block: 2rem;
        gap: 2rem;
      }
    }
  }

  @media (max-width: 375px) {
    .detail-page {
      padding-inline: 1.25rem;
    }
  }
</style>
```

- [ ] **Step 2: Verify the build**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run build`
Expected: Build succeeds. Detail pages generated at `dist/cases/ddp-app/index.html`, etc.

- [ ] **Step 3: Verify dev server**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run dev`
Expected: Clicking "Read More.." on a card navigates to the detail page. Back link returns to homepage cases section.

- [ ] **Step 4: Commit**

```bash
git add src/pages/cases/
git commit -m "feat(cases): add dynamic detail page for case studies"
```
