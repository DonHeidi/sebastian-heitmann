# Articles System Design

Unified content system for the portfolio website, replacing the existing `cases` collection with a flexible articles system supporting case studies, blog posts, and multi-part series.

## Content Collections

### Authors (`src/content/authors/`)

JSON files, one per author. Referenced by slug from article frontmatter.

**Loader:** `glob({ pattern: '**/*.json', base: './src/content/authors' })`

**Schema:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | Display name |
| `slug` | string | yes | URL-safe identifier, used as reference key |
| `role` | string | yes | Title/role (e.g. "Strategic Technology Consultant") |
| `description` | string | yes | Short bio / teaser |
| `email` | string | no | Contact email |
| `avatar` | image | yes | Profile photo |
| `socials` | array | no | `{ platform: string, url: string }[]` |

**Example:** `src/content/authors/sebastian-heitmann.json`

### Articles (`src/content/articles/`)

Markdown files. Replaces the existing `cases` collection.

**Loader:** `glob({ pattern: '**/*.md', base: './src/content/articles' })`

**Locale strategy:**
- `src/content/articles/my-article.md` — English (default)
- `src/content/articles/de-de/my-article.md` — German (optional)
- If no German version exists, the English version is served on German routes

**Schema:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `title` | string | yes | | Article title |
| `overline` | string | no | | Small label above title (e.g. "Case Study") |
| `subline` | string | no | | Subtitle below title |
| `abstract` | string | yes | | Used for listing cards and meta description |
| `type` | enum | yes | | `article`, `case-study`, `blog-post`, `series-part` |
| `tags` | string[] | no | `[]` | Labels/categories |
| `author` | string | yes | | Slug referencing authors collection |
| `headerImage` | image | no | | Full-span header image |
| `headerDetailImage` | image | no | | Floating accent image near title |
| `publishedAt` | date | yes | | Publication date, used for sort order |
| `updatedAt` | date | no | | Last update date |
| `draft` | boolean | no | `false` | Drafts excluded from production builds |
| `order` | number | no | | Legacy field for case study ordering on home page |
| `series` | object | no | | `{ name: string, part: number }` for multi-part articles |

## Page Routes

### Article Detail — `/articles/[slug]/`

Dynamic route generating one page per article.

**Locale routing:**
- `/articles/[slug]/` — English (default locale, no prefix)
- `/de-de/articles/[slug]/` — German (falls back to English content if no German file exists)

**Page files:**
- `src/pages/articles/[slug].astro`
- `src/pages/de-de/articles/[slug].astro`

### Article Listing — `/articles/`

Index page showing all published articles sorted by `publishedAt` descending.

**Page files:**
- `src/pages/articles/index.astro`
- `src/pages/de-de/articles/index.astro`

## Article Detail Layout

Top to bottom:

1. **Navigation** — existing nav component
2. **Header image** — full-width `headerImage`, edge-to-edge within the max-width container
3. **Title block** — overlapping the header bottom edge:
   - `headerDetailImage` floating to the right, overlapping the header edge (editorial callout style)
   - Overline in mono uppercase
   - Title in large display serif
   - Subline in body text
4. **Content area** — two-column layout:
   - **Main column (~70%)** — rendered Markdown body, tags at bottom
   - **Sidebar (~30%)** — author card (avatar, name, role, description, social links), sticky on scroll
5. **Footer** — existing footer component

### Typography for Article Body

Inherits from the existing design system:
- `h2`: display serif, 28px
- `h3`: display serif, 22px
- Body: body font, 17px, weight 300, line-height 1.7
- Code blocks: mono font
- Blockquotes: body italic with accent left border

### Responsive Behavior

- **Desktop (>1024px):** two-column layout, sidebar sticky
- **Tablet (768–1024px):** sidebar collapses above or below content
- **Mobile (<768px):** single column, author card moves to end of article

## Article Listing Layout

1. **Page header** — "Articles" in display serif with accent rule (matching CV page pattern)
2. **Article grid** — cards in a responsive grid:
   - Card contents: `headerImage` thumbnail, overline, title, abstract, tags, date
   - Sorted by `publishedAt` descending
   - Drafts excluded
3. **Footer**

No type filtering for v1. Can be added later.

## Migration from Cases

1. Move `src/content/cases/*.md` files to `src/content/articles/` (drop `en-us/` prefix for English, keep `de-de/` prefix for German)
2. Add new frontmatter fields: `type: case-study`, `author: sebastian-heitmann`, `publishedAt`, `abstract` (from existing `excerpt`)
3. Remove old `cases` collection from `content.config.ts`
4. Remove `src/pages/cases/` and `src/pages/de-de/cases/` routes
5. Home page proof section stays unchanged (uses i18n strings, not content collection)

## Author Card Component

Sticky sidebar card displaying:
- Avatar image
- Name in display serif
- Role in mono uppercase
- Description in body text
- Social links as icon row (reusing existing icon pattern from hero/footer)
- Optional email link

## Out of Scope (for now)

- MDX / custom components in article body
- Type filtering on listing page
- Navigation link to articles
- RSS feed
- Reading time estimate
- Related articles
- Comments
- Search
