# Articles System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing `cases` content collection with a unified articles system supporting case studies, blog posts, and series — with author data, editorial layout, and locale fallback.

**Architecture:** Two Astro content collections (`articles` + `authors`) with glob loaders. Articles use Markdown files with locale fallback (English default, optional German override). Article detail pages use a two-column layout with sticky author sidebar. Article listing page with card grid.

**Tech Stack:** Astro 6, Astro Content Collections (glob loader, Zod schemas), SCSS, TypeScript

---

## File Map

**Create:**
- `src/content/authors/sebastian-heitmann.json` — author data
- `src/content/articles/ddp-app.md` — migrated case study (English)
- `src/content/articles/saas-platform.md` — migrated case study
- `src/content/articles/analytics-engine.md` — migrated case study
- `src/content/articles/mobile-dashboard.md` — migrated case study
- `src/content/articles/de-de/ddp-app.md` — migrated case study (German)
- `src/content/articles/de-de/saas-platform.md` — migrated case study
- `src/content/articles/de-de/analytics-engine.md` — migrated case study
- `src/content/articles/de-de/mobile-dashboard.md` — migrated case study
- `src/components/author-card.astro` — sticky sidebar author component
- `src/components/article-card.astro` — listing card component
- `src/pages/articles/index.astro` — English listing page
- `src/pages/articles/[slug].astro` — English detail page
- `src/pages/de-de/articles/index.astro` — German listing page
- `src/pages/de-de/articles/[slug].astro` — German detail page

**Modify:**
- `src/content.config.ts` — replace `cases` with `articles` + `authors` collections

**Delete:**
- `src/content/cases/` — entire directory (replaced by `src/content/articles/`)
- `src/pages/cases/[id].astro` — old English case route
- `src/pages/de-de/cases/[id].astro` — old German case route

---

### Task 1: Authors Content Collection

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/authors/sebastian-heitmann.json`

- [ ] **Step 1: Add authors collection to content config**

Replace `src/content.config.ts` with:

```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    description: z.string(),
    email: z.string().email().optional(),
    avatar: image(),
    socials: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).optional().default([]),
  }),
});

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

export const collections = { authors, cases };
```

Note: `cases` is kept temporarily — it will be removed in Task 3 after articles collection is added and cases are migrated.

- [ ] **Step 2: Create author data file**

Create `src/content/authors/sebastian-heitmann.json`:

```json
{
  "name": "Sebastian Heitmann",
  "slug": "sebastian-heitmann",
  "role": "Strategic Technology Consultant",
  "description": "Developer, project manager, consultant. I combine deep technical expertise with executive-level communication to turn stalled initiatives into shipped products.",
  "email": "me@sebastian-heitmann.dev",
  "avatar": "../../assets/fb.jpg",
  "socials": [
    { "platform": "linkedin", "url": "https://www.linkedin.com/in/don-heidi/" },
    { "platform": "github", "url": "https://github.com/DonHeidi" },
    { "platform": "bluesky", "url": "https://www.bluesky.com/e2e_developer" }
  ]
}
```

- [ ] **Step 3: Verify build**

Run: `cd apps/website && bun run build`
Expected: Build succeeds, authors collection loads without errors.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/authors/
git commit -m "feat(website): add authors content collection"
```

---

### Task 2: Articles Content Collection Schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add articles collection to content config**

Update `src/content.config.ts` — add the `articles` collection alongside the existing `cases` (cases will be removed after migration):

```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    description: z.string(),
    email: z.string().email().optional(),
    avatar: image(),
    socials: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).optional().default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    overline: z.string().optional(),
    subline: z.string().optional(),
    abstract: z.string(),
    type: z.enum(['article', 'case-study', 'blog-post', 'series-part']),
    tags: z.array(z.string()).optional().default([]),
    author: z.string(),
    headerImage: image().optional(),
    headerDetailImage: image().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    order: z.number().optional(),
    series: z.object({
      name: z.string(),
      part: z.number(),
    }).optional(),
  }),
});

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

export const collections = { authors, articles, cases };
```

- [ ] **Step 2: Verify build**

Run: `cd apps/website && bun run build`
Expected: Build succeeds. Articles collection is empty but valid.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(website): add articles content collection schema"
```

---

### Task 3: Migrate Case Studies to Articles

**Files:**
- Create: `src/content/articles/ddp-app.md`, `src/content/articles/saas-platform.md`, `src/content/articles/analytics-engine.md`, `src/content/articles/mobile-dashboard.md`
- Create: `src/content/articles/de-de/ddp-app.md`, `src/content/articles/de-de/saas-platform.md`, `src/content/articles/de-de/analytics-engine.md`, `src/content/articles/de-de/mobile-dashboard.md`
- Delete: `src/content/cases/` (entire directory)
- Modify: `src/content.config.ts` (remove `cases` collection)

- [ ] **Step 1: Create English article files from cases**

For each case study in `src/content/cases/en-us/`, create a corresponding file in `src/content/articles/` with updated frontmatter. Example for `ddp-app.md`:

```markdown
---
title: "DDP - APP"
overline: "Case Study"
abstract: "We build intelligent software solutions from modern landing pages, mobile applications, so SaaS applications with a strategic approach driven by incremental growth."
type: "case-study"
tags: ["Technical Delivery", "Full-Stack"]
author: "sebastian-heitmann"
headerImage: "../../assets/fb.jpg"
publishedAt: 2025-01-15
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

Repeat for `saas-platform.md` (order: 2, publishedAt: 2025-02-01), `mobile-dashboard.md` (order: 3, publishedAt: 2025-03-01), `analytics-engine.md` (order: 4, publishedAt: 2025-04-01). Each keeps its existing body content, adds the new frontmatter fields.

- [ ] **Step 2: Create German article files**

Copy the same pattern for `src/content/articles/de-de/`. These files already exist in `src/content/cases/de-de/` — move them with the updated frontmatter. Image paths change from `"../../../assets/fb.jpg"` to `"../../../assets/fb.jpg"` (same depth from de-de subdirectory).

- [ ] **Step 3: Remove cases collection and old files**

Delete the entire `src/content/cases/` directory.

Update `src/content.config.ts` — remove the `cases` collection:

```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    description: z.string(),
    email: z.string().email().optional(),
    avatar: image(),
    socials: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).optional().default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    overline: z.string().optional(),
    subline: z.string().optional(),
    abstract: z.string(),
    type: z.enum(['article', 'case-study', 'blog-post', 'series-part']),
    tags: z.array(z.string()).optional().default([]),
    author: z.string(),
    headerImage: image().optional(),
    headerDetailImage: image().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    order: z.number().optional(),
    series: z.object({
      name: z.string(),
      part: z.number(),
    }).optional(),
  }),
});

export const collections = { authors, articles };
```

- [ ] **Step 4: Verify build**

Run: `cd apps/website && bun run build`
Expected: Build succeeds. Articles collection loads 8 entries (4 English + 4 German).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(website): migrate case studies to articles collection"
```

---

### Task 4: Author Card Component

**Files:**
- Create: `src/components/author-card.astro`

- [ ] **Step 1: Create author card component**

Create `src/components/author-card.astro`:

```astro
---
import { Icon } from 'astro-icon/components';
import { Image } from 'astro:assets';

type Props = {
    name: string;
    role: string;
    description: string;
    avatar: ImageMetadata;
    email?: string;
    socials?: Array<{ platform: string; url: string }>;
};

const { name, role, description, avatar, email, socials = [] } = Astro.props;

const platformLabels: Record<string, string> = {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    bluesky: 'Bluesky',
};
---

<aside class="author-card">
    <Image
        src={avatar}
        alt={name}
        width={72}
        height={72}
        class="author-card__avatar"
    />
    <div class="author-card__info">
        <span class="author-card__name">{name}</span>
        <span class="author-card__role">{role}</span>
    </div>
    <p class="author-card__description">{description}</p>
    {socials.length > 0 && (
        <div class="author-card__socials">
            {socials.map((s) => (
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={platformLabels[s.platform] ?? s.platform}>
                    <Icon name={`simple-icons:${s.platform}`} width={16} height={16} />
                </a>
            ))}
        </div>
    )}
</aside>

<style lang="scss">
    .author-card {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
        border: 1px solid var(--v8-border);
        position: sticky;
        top: 100px;

        &__avatar {
            width: 72px;
            height: 72px;
            object-fit: cover;
            filter: var(--v8-photo-filter);
            transition: filter 0.4s ease;

            &:hover {
                filter: var(--v8-photo-filter-hover);
            }
        }

        &__info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        &__name {
            font-family: var(--v8-font-display);
            font-size: 20px;
            line-height: 1.2;
            color: var(--v8-text);
        }

        &__role {
            font-family: var(--v8-font-mono);
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--v8-text-muted);
        }

        &__description {
            font-family: var(--v8-font-body);
            font-size: 14px;
            font-weight: 300;
            line-height: 1.6;
            color: var(--v8-text-tertiary);
        }

        &__socials {
            display: flex;
            gap: 16px;

            a {
                color: var(--v8-text-muted);
                text-decoration: none;
                display: flex;
                align-items: center;
                transition: color 0.2s ease;

                &:hover {
                    color: var(--v8-text);
                }

                :global(svg) {
                    color: inherit;
                    fill: currentColor;
                }
            }
        }
    }

    @media (max-width: 1024px) {
        .author-card {
            position: static;
        }
    }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/author-card.astro
git commit -m "feat(website): add author card component"
```

---

### Task 5: Article Detail Page (English)

**Files:**
- Create: `src/pages/articles/[slug].astro`
- Delete: `src/pages/cases/[id].astro`

- [ ] **Step 1: Create English article detail page**

Create `src/pages/articles/[slug].astro`:

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import { Image } from 'astro:assets';
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/navigation.astro';
import AuthorCard from '../../components/author-card.astro';
import Footer from '../../components/footer.astro';
import { getStrings } from '../../i18n/utils';
import type { Locale } from '../../i18n/utils';
import { getRelativeLocaleUrl } from 'astro:i18n';

export async function getStaticPaths() {
  const allArticles = await getCollection('articles', ({ id, data }) =>
    !id.startsWith('de-de/') && !data.draft
  );
  return allArticles.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

const locale = (Astro.currentLocale ?? 'en-us') as Locale;
const s = getStrings(locale);

const authorEntry = await getEntry('authors', entry.data.author);
const author = authorEntry?.data;

const formattedDate = entry.data.publishedAt.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<Layout
  locale={locale}
  title={`${entry.data.title} — Sebastian Heitmann`}
  description={entry.data.abstract}
>
  <Navigation nav={s.nav} languagePicker={s.languagePicker} />
  <main class="article-page">
    {entry.data.headerImage && (
      <div class="article-page__hero">
        <Image
          src={entry.data.headerImage}
          alt={entry.data.title}
          width={1400}
          height={600}
          class="article-page__hero-image"
        />
      </div>
    )}

    <div class="article-page__layout">
      <article class="article-page__main">
        <header class="article-page__header">
          {entry.data.headerDetailImage && (
            <div class="article-page__detail-image">
              <Image
                src={entry.data.headerDetailImage}
                alt=""
                width={280}
                height={280}
                class="article-page__detail-img"
              />
            </div>
          )}
          <div class="article-page__meta">
            {entry.data.overline && (
              <span class="article-page__overline">{entry.data.overline}</span>
            )}
            <h1 class="article-page__title">{entry.data.title}</h1>
            {entry.data.subline && (
              <p class="article-page__subline">{entry.data.subline}</p>
            )}
            <time class="article-page__date" datetime={entry.data.publishedAt.toISOString()}>
              {formattedDate}
            </time>
          </div>
        </header>

        <div class="article-page__body">
          <Content />
        </div>

        {entry.data.tags.length > 0 && (
          <div class="article-page__tags">
            {entry.data.tags.map((tag) => (
              <span class="article-page__tag">{tag}</span>
            ))}
          </div>
        )}

        <a href={getRelativeLocaleUrl(locale, 'articles')} class="article-page__back">
          &larr; All articles
        </a>
      </article>

      {author && (
        <div class="article-page__sidebar">
          <AuthorCard
            name={author.name}
            role={author.role}
            description={author.description}
            avatar={author.avatar}
            email={author.email}
            socials={author.socials}
          />
        </div>
      )}
    </div>
  </main>
  <Footer footer={s.footer} />
</Layout>

<style lang="scss">
  .article-page {
    max-width: 1440px;
    margin: 0 auto;

    &__hero {
      width: 100%;
      overflow: hidden;
      margin-top: 80px;
      padding: 0 80px;
    }

    &__hero-image {
      width: 100%;
      height: auto;
      max-height: 480px;
      object-fit: cover;
    }

    &__layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 64px;
      padding: 0 80px 120px;
      align-items: start;
    }

    &__main {
      display: flex;
      flex-direction: column;
      gap: 48px;
      min-width: 0;
    }

    &__header {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      margin-top: -40px;
      position: relative;
      z-index: 1;
    }

    &__detail-image {
      flex-shrink: 0;
    }

    &__detail-img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border: 4px solid var(--v8-bg);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 48px;
    }

    &__overline {
      font-family: var(--v8-font-mono);
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--v8-accent);
    }

    &__title {
      font-family: var(--v8-font-display);
      font-size: clamp(36px, 5vw, 56px);
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: var(--v8-text);
    }

    &__subline {
      font-family: var(--v8-font-body);
      font-size: 18px;
      font-weight: 300;
      line-height: 1.5;
      color: var(--v8-text-secondary);
      max-width: 600px;
    }

    &__date {
      font-family: var(--v8-font-mono);
      font-size: 12px;
      color: var(--v8-text-muted);
      letter-spacing: 0.04em;
      margin-top: 8px;
    }

    &__body {
      font-family: var(--v8-font-body);
      font-size: 17px;
      font-weight: 300;
      line-height: 1.7;
      color: var(--v8-text-secondary);

      :global(h2) {
        font-family: var(--v8-font-display);
        font-size: 28px;
        color: var(--v8-text);
        margin-top: 48px;
        margin-bottom: 16px;
      }

      :global(h3) {
        font-family: var(--v8-font-display);
        font-size: 22px;
        color: var(--v8-text);
        margin-top: 32px;
        margin-bottom: 12px;
      }

      :global(p) {
        margin-bottom: 16px;
      }

      :global(ul), :global(ol) {
        padding-left: 24px;
        margin-bottom: 16px;
      }

      :global(li) {
        margin-bottom: 8px;
      }

      :global(blockquote) {
        border-left: 2px solid var(--v8-accent);
        padding-left: 20px;
        margin: 32px 0;
        font-style: italic;
        color: var(--v8-text-tertiary);
      }

      :global(code) {
        font-family: var(--v8-font-mono);
        font-size: 0.9em;
        background: var(--v8-bg-surface);
        padding: 2px 6px;
        border-radius: 2px;
      }

      :global(pre) {
        background: var(--v8-bg-surface);
        padding: 20px;
        overflow-x: auto;
        margin: 24px 0;

        :global(code) {
          background: none;
          padding: 0;
        }
      }

      :global(img) {
        max-width: 100%;
        height: auto;
        margin: 24px 0;
      }
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--v8-border);
    }

    &__tag {
      font-family: var(--v8-font-mono);
      font-size: 11px;
      color: var(--v8-text-tertiary);
      padding: 4px 10px;
      border: 1px solid var(--v8-border);
      border-radius: 2px;
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

    &__sidebar {
      padding-top: 80px;
    }
  }

  @media (max-width: 1024px) {
    .article-page {
      &__layout {
        grid-template-columns: 1fr;
        padding: 0 48px 80px;
      }

      &__hero {
        padding: 0 48px;
      }

      &__sidebar {
        padding-top: 0;
        order: -1;
      }
    }
  }

  @media (max-width: 768px) {
    .article-page {
      &__layout {
        padding: 0 24px 60px;
        gap: 32px;
      }

      &__hero {
        padding: 0 24px;
        margin-top: 40px;
      }

      &__header {
        flex-direction: column;
        margin-top: 0;
      }

      &__detail-img {
        width: 140px;
        height: 140px;
      }

      &__meta {
        padding-top: 0;
      }

      &__sidebar {
        order: 1;
      }
    }
  }
</style>
```

- [ ] **Step 2: Delete old English case route**

Delete `src/pages/cases/[id].astro`.

- [ ] **Step 3: Verify build**

Run: `cd apps/website && bun run build`
Expected: Build succeeds, article detail pages generated at `/articles/ddp-app/`, etc.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(website): add article detail page, remove old case routes"
```

---

### Task 6: Article Detail Page (German with Fallback)

**Files:**
- Create: `src/pages/de-de/articles/[slug].astro`
- Delete: `src/pages/de-de/cases/[id].astro`

- [ ] **Step 1: Create German article detail page with fallback**

Create `src/pages/de-de/articles/[slug].astro`:

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import { Image } from 'astro:assets';
import Layout from '../../../layouts/Layout.astro';
import Navigation from '../../../components/navigation.astro';
import AuthorCard from '../../../components/author-card.astro';
import Footer from '../../../components/footer.astro';
import { getStrings } from '../../../i18n/utils';
import type { Locale } from '../../../i18n/utils';
import { getRelativeLocaleUrl } from 'astro:i18n';

export async function getStaticPaths() {
  const allArticles = await getCollection('articles', ({ data }) => !data.draft);

  // Collect English articles (no locale prefix)
  const enArticles = allArticles.filter(({ id }) => !id.startsWith('de-de/'));

  // Collect German articles
  const deArticles = allArticles.filter(({ id }) => id.startsWith('de-de/'));
  const deSlugs = new Set(deArticles.map(({ id }) => id.replace('de-de/', '')));

  const paths = [];

  // German versions
  for (const entry of deArticles) {
    const slug = entry.id.replace('de-de/', '');
    paths.push({ params: { slug }, props: { entry } });
  }

  // Fallback: English articles without a German version
  for (const entry of enArticles) {
    if (!deSlugs.has(entry.id)) {
      paths.push({ params: { slug: entry.id }, props: { entry } });
    }
  }

  return paths;
}

const { entry } = Astro.props;
const { Content } = await render(entry);

const locale = (Astro.currentLocale ?? 'de-de') as Locale;
const s = getStrings(locale);

const authorEntry = await getEntry('authors', entry.data.author);
const author = authorEntry?.data;

const formattedDate = entry.data.publishedAt.toLocaleDateString('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<Layout
  locale={locale}
  title={`${entry.data.title} — Sebastian Heitmann`}
  description={entry.data.abstract}
>
  <Navigation nav={s.nav} languagePicker={s.languagePicker} />
  <main class="article-page">
    {entry.data.headerImage && (
      <div class="article-page__hero">
        <Image
          src={entry.data.headerImage}
          alt={entry.data.title}
          width={1400}
          height={600}
          class="article-page__hero-image"
        />
      </div>
    )}

    <div class="article-page__layout">
      <article class="article-page__main">
        <header class="article-page__header">
          {entry.data.headerDetailImage && (
            <div class="article-page__detail-image">
              <Image
                src={entry.data.headerDetailImage}
                alt=""
                width={280}
                height={280}
                class="article-page__detail-img"
              />
            </div>
          )}
          <div class="article-page__meta">
            {entry.data.overline && (
              <span class="article-page__overline">{entry.data.overline}</span>
            )}
            <h1 class="article-page__title">{entry.data.title}</h1>
            {entry.data.subline && (
              <p class="article-page__subline">{entry.data.subline}</p>
            )}
            <time class="article-page__date" datetime={entry.data.publishedAt.toISOString()}>
              {formattedDate}
            </time>
          </div>
        </header>

        <div class="article-page__body">
          <Content />
        </div>

        {entry.data.tags.length > 0 && (
          <div class="article-page__tags">
            {entry.data.tags.map((tag) => (
              <span class="article-page__tag">{tag}</span>
            ))}
          </div>
        )}

        <a href={getRelativeLocaleUrl(locale, 'articles')} class="article-page__back">
          &larr; Alle Artikel
        </a>
      </article>

      {author && (
        <div class="article-page__sidebar">
          <AuthorCard
            name={author.name}
            role={author.role}
            description={author.description}
            avatar={author.avatar}
            email={author.email}
            socials={author.socials}
          />
        </div>
      )}
    </div>
  </main>
  <Footer footer={s.footer} />
</Layout>

<style lang="scss">
  /* Identical to English version — shared via same class names */
  .article-page {
    max-width: 1440px;
    margin: 0 auto;

    &__hero {
      width: 100%;
      overflow: hidden;
      margin-top: 80px;
      padding: 0 80px;
    }

    &__hero-image {
      width: 100%;
      height: auto;
      max-height: 480px;
      object-fit: cover;
    }

    &__layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 64px;
      padding: 0 80px 120px;
      align-items: start;
    }

    &__main {
      display: flex;
      flex-direction: column;
      gap: 48px;
      min-width: 0;
    }

    &__header {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      margin-top: -40px;
      position: relative;
      z-index: 1;
    }

    &__detail-image { flex-shrink: 0; }

    &__detail-img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border: 4px solid var(--v8-bg);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 48px;
    }

    &__overline {
      font-family: var(--v8-font-mono);
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--v8-accent);
    }

    &__title {
      font-family: var(--v8-font-display);
      font-size: clamp(36px, 5vw, 56px);
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: var(--v8-text);
    }

    &__subline {
      font-family: var(--v8-font-body);
      font-size: 18px;
      font-weight: 300;
      line-height: 1.5;
      color: var(--v8-text-secondary);
      max-width: 600px;
    }

    &__date {
      font-family: var(--v8-font-mono);
      font-size: 12px;
      color: var(--v8-text-muted);
      letter-spacing: 0.04em;
      margin-top: 8px;
    }

    &__body {
      font-family: var(--v8-font-body);
      font-size: 17px;
      font-weight: 300;
      line-height: 1.7;
      color: var(--v8-text-secondary);

      :global(h2) { font-family: var(--v8-font-display); font-size: 28px; color: var(--v8-text); margin-top: 48px; margin-bottom: 16px; }
      :global(h3) { font-family: var(--v8-font-display); font-size: 22px; color: var(--v8-text); margin-top: 32px; margin-bottom: 12px; }
      :global(p) { margin-bottom: 16px; }
      :global(ul), :global(ol) { padding-left: 24px; margin-bottom: 16px; }
      :global(li) { margin-bottom: 8px; }
      :global(blockquote) { border-left: 2px solid var(--v8-accent); padding-left: 20px; margin: 32px 0; font-style: italic; color: var(--v8-text-tertiary); }
      :global(code) { font-family: var(--v8-font-mono); font-size: 0.9em; background: var(--v8-bg-surface); padding: 2px 6px; border-radius: 2px; }
      :global(pre) { background: var(--v8-bg-surface); padding: 20px; overflow-x: auto; margin: 24px 0; :global(code) { background: none; padding: 0; } }
      :global(img) { max-width: 100%; height: auto; margin: 24px 0; }
    }

    &__tags { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 16px; border-top: 1px solid var(--v8-border); }
    &__tag { font-family: var(--v8-font-mono); font-size: 11px; color: var(--v8-text-tertiary); padding: 4px 10px; border: 1px solid var(--v8-border); border-radius: 2px; }
    &__back { font-family: var(--v8-font-mono); font-size: 12px; letter-spacing: 0.05em; color: var(--v8-accent); text-decoration: none; width: fit-content; transition: opacity 0.2s ease; &:hover { opacity: 0.7; } }
    &__sidebar { padding-top: 80px; }
  }

  @media (max-width: 1024px) {
    .article-page {
      &__layout { grid-template-columns: 1fr; padding: 0 48px 80px; }
      &__hero { padding: 0 48px; }
      &__sidebar { padding-top: 0; order: -1; }
    }
  }

  @media (max-width: 768px) {
    .article-page {
      &__layout { padding: 0 24px 60px; gap: 32px; }
      &__hero { padding: 0 24px; margin-top: 40px; }
      &__header { flex-direction: column; margin-top: 0; }
      &__detail-img { width: 140px; height: 140px; }
      &__meta { padding-top: 0; }
      &__sidebar { order: 1; }
    }
  }
</style>
```

- [ ] **Step 2: Delete old German case route**

Delete `src/pages/de-de/cases/[id].astro`.

- [ ] **Step 3: Verify build**

Run: `cd apps/website && bun run build`
Expected: Build succeeds, German article pages generated at `/de-de/articles/ddp-app/`, etc.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(website): add German article detail page with locale fallback"
```

---

### Task 7: Article Card Component

**Files:**
- Create: `src/components/article-card.astro`

- [ ] **Step 1: Create article card component**

Create `src/components/article-card.astro`:

```astro
---
import { Image } from 'astro:assets';

type Props = {
    title: string;
    abstract: string;
    overline?: string;
    tags: string[];
    publishedAt: Date;
    slug: string;
    headerImage?: ImageMetadata;
    locale: string;
};

const { title, abstract, overline, tags, publishedAt, slug, headerImage, locale } = Astro.props;

const dateLocale = locale === 'de-de' ? 'de-DE' : 'en-US';
const formattedDate = publishedAt.toLocaleDateString(dateLocale, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const baseUrl = locale === 'de-de' ? '/de-de' : '';
const href = `${baseUrl}/articles/${slug}/`;
---

<a href={href} class="article-card">
    {headerImage && (
        <div class="article-card__image-wrap">
            <Image
                src={headerImage}
                alt={title}
                width={600}
                height={340}
                class="article-card__image"
            />
        </div>
    )}
    <div class="article-card__content">
        <div class="article-card__top">
            {overline && <span class="article-card__overline">{overline}</span>}
            <time class="article-card__date" datetime={publishedAt.toISOString()}>{formattedDate}</time>
        </div>
        <h3 class="article-card__title">{title}</h3>
        <p class="article-card__abstract">{abstract}</p>
        {tags.length > 0 && (
            <div class="article-card__tags">
                {tags.map((tag) => (
                    <span class="article-card__tag">{tag}</span>
                ))}
            </div>
        )}
    </div>
</a>

<style lang="scss">
    .article-card {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        border: 1px solid var(--v8-border);
        transition: border-color 0.2s ease;

        &:hover {
            border-color: var(--v8-text-muted);
        }

        &__image-wrap {
            overflow: hidden;
        }

        &__image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        &:hover &__image {
            transform: scale(1.03);
        }

        &__content {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        &__top {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }

        &__overline {
            font-family: var(--v8-font-mono);
            font-size: 10px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--v8-accent);
        }

        &__date {
            font-family: var(--v8-font-mono);
            font-size: 10px;
            color: var(--v8-text-muted);
            letter-spacing: 0.04em;
        }

        &__title {
            font-family: var(--v8-font-display);
            font-size: 24px;
            line-height: 1.15;
            color: var(--v8-text);
            letter-spacing: -0.01em;
        }

        &__abstract {
            font-family: var(--v8-font-body);
            font-size: 14px;
            font-weight: 300;
            line-height: 1.6;
            color: var(--v8-text-tertiary);
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        &__tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 4px;
        }

        &__tag {
            font-family: var(--v8-font-mono);
            font-size: 10px;
            color: var(--v8-text-dim);
            padding: 2px 8px;
            border: 1px solid var(--v8-border);
            border-radius: 2px;
        }
    }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/article-card.astro
git commit -m "feat(website): add article card component"
```

---

### Task 8: Article Listing Pages

**Files:**
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/de-de/articles/index.astro`

- [ ] **Step 1: Create English listing page**

Create `src/pages/articles/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/navigation.astro';
import ArticleCard from '../../components/article-card.astro';
import Footer from '../../components/footer.astro';
import { getStrings, getHreflangAlternates } from '../../i18n/utils';
import type { Locale } from '../../i18n/utils';

const locale = (Astro.currentLocale ?? 'en-us') as Locale;
const s = getStrings(locale);
const alternates = getHreflangAlternates();

const articles = await getCollection('articles', ({ id, data }) =>
  !id.startsWith('de-de/') && !data.draft
);

const sorted = articles.sort((a, b) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
);
---
<Layout locale={locale} title="Articles — Sebastian Heitmann" description="Articles, case studies, and insights on technology strategy, architecture, and delivery." alternates={alternates}>
  <Navigation nav={s.nav} languagePicker={s.languagePicker} />
  <main class="articles-page">
    <div class="articles-page__header reveal">
      <h1 class="articles-page__headline">Articles</h1>
      <div class="articles-page__rule"></div>
    </div>
    <div class="articles-page__grid">
      {sorted.map((article, i) => (
        <div class="reveal" style={`transition-delay: ${0.1 + i * 0.06}s`}>
          <ArticleCard
            title={article.data.title}
            abstract={article.data.abstract}
            overline={article.data.overline}
            tags={article.data.tags}
            publishedAt={article.data.publishedAt}
            slug={article.id}
            headerImage={article.data.headerImage}
            locale={locale}
          />
        </div>
      ))}
    </div>
  </main>
  <Footer footer={s.footer} />
</Layout>

<style lang="scss">
  .articles-page {
    padding: 160px 80px 120px;
    max-width: 1440px;
    margin: 0 auto;

    &__header {
      margin-bottom: 64px;
    }

    &__headline {
      font-family: var(--v8-font-display);
      font-size: clamp(48px, 6vw, 80px);
      line-height: 1;
      letter-spacing: -0.02em;
      color: var(--v8-text);
      margin-bottom: 24px;
    }

    &__rule {
      width: 48px;
      height: 2px;
      background: var(--v8-accent);
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
  }

  @media (max-width: 1024px) {
    .articles-page {
      padding: 120px 48px 80px;
    }
  }

  @media (max-width: 768px) {
    .articles-page {
      padding: 120px 24px 80px;

      &__grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
```

- [ ] **Step 2: Create German listing page with fallback**

Create `src/pages/de-de/articles/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../../layouts/Layout.astro';
import Navigation from '../../../components/navigation.astro';
import ArticleCard from '../../../components/article-card.astro';
import Footer from '../../../components/footer.astro';
import { getStrings, getHreflangAlternates } from '../../../i18n/utils';
import type { Locale } from '../../../i18n/utils';

const locale = (Astro.currentLocale ?? 'de-de') as Locale;
const s = getStrings(locale);
const alternates = getHreflangAlternates();

const allArticles = await getCollection('articles', ({ data }) => !data.draft);

// Prefer German versions, fall back to English
const enArticles = allArticles.filter(({ id }) => !id.startsWith('de-de/'));
const deArticles = allArticles.filter(({ id }) => id.startsWith('de-de/'));
const deSlugs = new Set(deArticles.map(({ id }) => id.replace('de-de/', '')));

const articles = [
  ...deArticles,
  ...enArticles.filter(({ id }) => !deSlugs.has(id)),
];

const sorted = articles.sort((a, b) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
);

function getSlug(id: string) {
  return id.replace('de-de/', '');
}
---
<Layout locale={locale} title="Artikel — Sebastian Heitmann" description="Artikel, Fallstudien und Einblicke zu Technologiestrategie, Architektur und Delivery." alternates={alternates}>
  <Navigation nav={s.nav} languagePicker={s.languagePicker} />
  <main class="articles-page">
    <div class="articles-page__header reveal">
      <h1 class="articles-page__headline">Artikel</h1>
      <div class="articles-page__rule"></div>
    </div>
    <div class="articles-page__grid">
      {sorted.map((article, i) => (
        <div class="reveal" style={`transition-delay: ${0.1 + i * 0.06}s`}>
          <ArticleCard
            title={article.data.title}
            abstract={article.data.abstract}
            overline={article.data.overline}
            tags={article.data.tags}
            publishedAt={article.data.publishedAt}
            slug={getSlug(article.id)}
            headerImage={article.data.headerImage}
            locale={locale}
          />
        </div>
      ))}
    </div>
  </main>
  <Footer footer={s.footer} />
</Layout>

<style lang="scss">
  .articles-page {
    padding: 160px 80px 120px;
    max-width: 1440px;
    margin: 0 auto;

    &__header {
      margin-bottom: 64px;
    }

    &__headline {
      font-family: var(--v8-font-display);
      font-size: clamp(48px, 6vw, 80px);
      line-height: 1;
      letter-spacing: -0.02em;
      color: var(--v8-text);
      margin-bottom: 24px;
    }

    &__rule {
      width: 48px;
      height: 2px;
      background: var(--v8-accent);
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
  }

  @media (max-width: 1024px) {
    .articles-page {
      padding: 120px 48px 80px;
    }
  }

  @media (max-width: 768px) {
    .articles-page {
      padding: 120px 24px 80px;

      &__grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

Run: `cd apps/website && bun run build`
Expected: Build succeeds, listing pages at `/articles/` and `/de-de/articles/`, all article detail pages generated.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(website): add article listing pages with locale fallback"
```

---

### Task 9: Final Verification and Cleanup

**Files:**
- Verify all routes work
- Clean up any remaining references to old `cases` routes

- [ ] **Step 1: Check for remaining references to cases**

Search the codebase for any remaining imports or links to `cases/`:

```bash
cd apps/website && grep -r "cases/" src/ --include="*.astro" --include="*.ts"
```

If any found (e.g. in the home page proof section linking to `/cases/`), update them to point to `/articles/`.

- [ ] **Step 2: Full build and verify page count**

Run: `cd apps/website && bun run build`
Expected: Build succeeds with correct page count:
- 4 English article detail pages + 4 German article detail pages
- 1 English listing + 1 German listing
- Plus all existing pages (home, cv, imprint, privacy, 404)

- [ ] **Step 3: Commit any cleanup**

```bash
git add -A
git commit -m "fix(website): clean up remaining case study references"
```
