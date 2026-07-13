# --v8-asterisk Design System & Website Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `--v8-asterisk` design system as a shadcn GitHub registry (repo `DonHeidi/v8-asterisk` with Storybook), then migrate `apps/website` from scoped SCSS to Astro 7 + Tailwind v4 + shadcn/ui with all components authored in TSX and only three hydrated islands.

**Architecture:** Three-layer token CSS (`--v8-*` core on `.dark`/`.light` classes → shadcn contract aliases → Tailwind `@theme inline`) distributed as registry items; website consumes theme + primitives via `npx shadcn add DonHeidi/v8-asterisk/<item>`, renders React statically (zero JS) except ContactForm/ThemeToggle/LanguagePicker.

**Tech Stack:** Bun, Astro 7, React 19, Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui CLI 4.x (Base UI primitives), Storybook (react-vite), lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-13-v8-asterisk-design-system-design.md`

## Global Constraints

- **All dependencies installed via `bun add` / `bun add -d` — never hand-edited into package.json.** No version pins; latest is intended.
- Brand name in all human-facing text: `--v8-asterisk`. Machine-facing slug: `v8-asterisk`. Token prefix: `--v8-*`.
- Canonical light palette = warm cream (`#FAF7F0` family). Pure-white palette ships only as the `light-white` override item.
- `--v8-accent` maps to shadcn `--primary` (and `--ring`), NOT shadcn `--accent`.
- `--radius: 0.375rem`.
- Dark/light theming via `.dark`/`.light` classes (on `html` globally, on any element for section banding).
- Website: components receive typed i18n string sections as props (existing pattern, unchanged). No hardcoded user-visible text.
- Website: image URLs go through `getImage()` in `.astro` frontmatter; TSX receives resolved URLs as props. Never use `ImageMetadata.src` directly.
- Website commits: conventional commits (`feat(website): …`). v8-asterisk repo commits: `feat: …`.
- CV print output (A4, `@media print`) is a hard preservation requirement.
- Website work happens in a git worktree (`superpowers:using-git-worktrees`).
- Screenshots for verification go under `apps/website/.screenshots/` (gitignored), never `/tmp`.
- Verification bar: structural parity + improved details (refresh accepted), not pixel parity.

---

## Phase A — the `v8-asterisk` repository

### Task 1: Scaffold the repo and publish it

**Files:**
- Create: `/home/donheidi/code/v8-asterisk/` (new repo root), `package.json` (via bun), `tsconfig.json`, `vite.config.ts`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: a public GitHub repo `DonHeidi/v8-asterisk` that later tasks push registry items into; local dir `/home/donheidi/code/v8-asterisk`.

- [ ] **Step 1: Create directory, init bun + git**

```bash
mkdir -p /home/donheidi/code/v8-asterisk && cd /home/donheidi/code/v8-asterisk
bun init -y
git init -b main
```

- [ ] **Step 2: Add dependencies (latest, via bun only)**

```bash
bun add react react-dom lucide-react class-variance-authority clsx tailwind-merge
bun add -d typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Write config files**

`.gitignore`:
```
node_modules/
dist/
storybook-static/
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["registry", ".storybook"]
}
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`README.md`:
```markdown
# --v8-asterisk

The **--v8-asterisk** design system — the `--v8-*` token language (an AI agent's
8th design iteration; the label stuck) formalized as a shadcn registry.

Warm cream & near-black, orange-red accent (#FF3B00 dark / #B82A00 light),
Instrument Serif / DM Sans / IBM Plex Mono.

## Install

```bash
npx shadcn add DonHeidi/v8-asterisk/theme
npx shadcn add DonHeidi/v8-asterisk/fonts
npx shadcn add DonHeidi/v8-asterisk/button   # …and other ui items
npx shadcn add DonHeidi/v8-asterisk/light-white  # optional pure-white light variant
```

## Development

```bash
bun install
bun run storybook
```
```

- [ ] **Step 4: Create the GitHub repo and push**

```bash
git add -A && git commit -m "feat: scaffold --v8-asterisk design system repo"
gh repo create DonHeidi/v8-asterisk --public --source . --push
```
Expected: repo visible at github.com/DonHeidi/v8-asterisk.

### Task 2: Theme, fonts, light-white variant, registry.json

**Files:**
- Create: `registry/theme/theme.css`, `registry/light-white/light-white.css`, `registry/fonts/fonts.css`, `registry/fonts/files/*.woff2` (copied from website), `registry.json`

**Interfaces:**
- Consumes: repo from Task 1.
- Produces: registry items `theme`, `fonts`, `light-white` installable via `npx shadcn add DonHeidi/v8-asterisk/<name>`; `theme.css` defines every `--v8-*` token, the shadcn contract, and the `@theme inline` block. Later tasks and both apps rely on these exact custom-property names.

- [ ] **Step 1: Write `registry/theme/theme.css`** (complete file)

```css
/* ------------------------------------------------------------------ */
/* --v8-asterisk theme                                                 */
/* Layer 1: --v8-* core tokens (source of truth)                       */
/* Layer 2: shadcn contract aliases                                    */
/* Layer 3: Tailwind v4 @theme inline mapping                          */
/* Dark/light via .dark/.light classes — on <html> globally, or on     */
/* any element for section-scoped banding.                             */
/* ------------------------------------------------------------------ */

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --v8-font-display: 'Instrument Serif', Georgia, serif;
  --v8-font-body: 'DM Sans', system-ui, sans-serif;
  --v8-font-mono: 'IBM Plex Mono', monospace;
  --radius: 0.375rem;
}

.dark {
  --v8-bg: #0C0C0C;
  --v8-bg-alt: #101010;
  --v8-bg-surface: #141414;
  --v8-text: #F2F0EB;
  --v8-text-secondary: rgba(242, 240, 235, 0.75);
  --v8-text-tertiary: rgba(242, 240, 235, 0.68);
  --v8-text-muted: rgba(242, 240, 235, 0.65);
  --v8-text-dim: rgba(242, 240, 235, 0.62);
  --v8-text-faint: rgba(242, 240, 235, 0.45);
  --v8-accent: #FF3B00;
  --v8-border: rgba(242, 240, 235, 0.08);
  --v8-border-accent: rgba(255, 59, 0, 0.3);
  --v8-success: #00DC82;
  --v8-success-soft: rgba(0, 220, 130, 0.09);
  --v8-warning: #FFB224;
  --v8-warning-soft: rgba(255, 178, 36, 0.09);
  --v8-destructive: #FF5449;
  --v8-destructive-soft: rgba(255, 84, 73, 0.09);
  --v8-metric-color: var(--v8-text);
  --v8-metric-label-color: var(--v8-text-muted);
  --v8-photo-filter: saturate(0) contrast(1.1) brightness(0.9);
  --v8-photo-filter-hover: saturate(0.8) contrast(1.05);
  --v8-glass-bg: rgba(18, 18, 18, 0.4);
  --v8-glass-border: rgba(242, 240, 235, 0.12);
  --v8-glass-highlight: rgba(242, 240, 235, 0.08);
  --v8-dot-color: rgba(168, 176, 192, 0.5);
  --v8-grid-fine: rgba(168, 176, 192, 0.05);
  --v8-grid-medium: rgba(168, 176, 192, 0.10);
  --v8-grid-major: rgba(168, 176, 192, 0.20);
}

.light {
  --v8-bg: #FAF7F0;
  --v8-bg-alt: #F0EBE0;
  --v8-bg-surface: #F5F0E6;
  --v8-text: #141413;
  --v8-text-secondary: rgba(20, 20, 19, 0.75);
  --v8-text-tertiary: rgba(20, 20, 19, 0.65);
  --v8-text-muted: rgba(20, 20, 19, 0.6);
  --v8-text-dim: rgba(20, 20, 19, 0.6);
  --v8-text-faint: rgba(20, 20, 19, 0.4);
  --v8-accent: #B82A00;
  --v8-border: rgba(20, 20, 19, 0.16);
  --v8-border-accent: rgba(184, 42, 0, 0.35);
  --v8-success: #1A7A52;
  --v8-success-soft: rgba(26, 122, 82, 0.10);
  --v8-warning: #93600A;
  --v8-warning-soft: rgba(147, 96, 10, 0.10);
  --v8-destructive: #B3261E;
  --v8-destructive-soft: rgba(179, 38, 30, 0.08);
  --v8-metric-color: #B82A00;
  --v8-metric-label-color: rgba(20, 20, 19, 0.6);
  --v8-photo-filter: saturate(0.85) contrast(1.08);
  --v8-photo-filter-hover: saturate(1) contrast(1);
  --v8-glass-bg: rgba(255, 252, 245, 0.32);
  --v8-glass-border: rgba(20, 20, 19, 0.18);
  --v8-glass-highlight: rgba(255, 255, 255, 0.85);
  --v8-dot-color: rgba(60, 70, 40, 0.55);
  --v8-grid-fine: rgba(60, 70, 40, 0.08);
  --v8-grid-medium: rgba(60, 70, 40, 0.16);
  --v8-grid-major: rgba(60, 70, 40, 0.28);
}

/* Layer 2: shadcn contract. References flip automatically with .dark/.light. */
:root, .dark, .light {
  --background: var(--v8-bg);
  --foreground: var(--v8-text);
  --card: var(--v8-bg-surface);
  --card-foreground: var(--v8-text);
  --popover: var(--v8-bg-surface);
  --popover-foreground: var(--v8-text);
  --primary: var(--v8-accent);
  --primary-foreground: #FFF7F2;
  --secondary: var(--v8-bg-alt);
  --secondary-foreground: var(--v8-text);
  --muted: var(--v8-bg-alt);
  --muted-foreground: var(--v8-text-muted);
  --accent: var(--v8-bg-surface);
  --accent-foreground: var(--v8-text);
  --destructive: var(--v8-destructive);
  --destructive-foreground: #FFF7F2;
  --success: var(--v8-success);
  --success-soft: var(--v8-success-soft);
  --warning: var(--v8-warning);
  --warning-soft: var(--v8-warning-soft);
  --border: var(--v8-border);
  --input: var(--v8-border);
  --ring: var(--v8-accent);
}

/* Layer 3: Tailwind utilities. */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive-soft: var(--v8-destructive-soft);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-warning: var(--warning);
  --color-warning-soft: var(--warning-soft);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-border-accent: var(--v8-border-accent);
  --color-surface: var(--v8-bg-surface);
  --color-surface-alt: var(--v8-bg-alt);
  --color-text-secondary: var(--v8-text-secondary);
  --color-text-tertiary: var(--v8-text-tertiary);
  --color-text-dim: var(--v8-text-dim);
  --color-text-faint: var(--v8-text-faint);
  --font-display: var(--v8-font-display);
  --font-sans: var(--v8-font-body);
  --font-mono: var(--v8-font-mono);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

- [ ] **Step 2: Write `registry/light-white/light-white.css`** (complete file)

```css
/* --v8-asterisk optional variant: pure-white light mode.
   Import AFTER theme.css to override the warm-cream light palette. */
.light {
  --v8-bg: #FFFFFF;
  --v8-bg-alt: #F4F4F2;
  --v8-bg-surface: #F8F8F6;
}
```

- [ ] **Step 3: Write `registry/fonts/fonts.css` and copy woff2 files**

Copy the font binaries from the website (source of truth for the files):
```bash
mkdir -p registry/fonts/files
cp /home/donheidi/code/sebastian-heitmann/apps/website/public/fonts/*.woff2 registry/fonts/files/
ls registry/fonts/files
```

`registry/fonts/fonts.css` — port the three `@font-face` blocks **verbatim** from
`apps/website/src/layouts/Layout.astro` (the `@font-face` declarations near the top of
the global style block, Instrument Serif / DM Sans / IBM Plex Mono), keeping
`src: url('/fonts/<exact-existing-filename>.woff2') format('woff2')` and any
`font-weight`/`font-display: swap` descriptors exactly as they are today. Consumers
must serve the woff2 files at `/fonts/` (the website already does via `public/fonts/`).

- [ ] **Step 4: Write `registry.json`** (complete file)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "v8-asterisk",
  "homepage": "https://github.com/DonHeidi/v8-asterisk",
  "items": [
    {
      "name": "theme",
      "type": "registry:item",
      "title": "--v8-asterisk theme",
      "description": "v8 core tokens, shadcn contract aliases, and Tailwind @theme inline mapping. Warm-cream canonical light palette.",
      "files": [
        { "path": "registry/theme/theme.css", "type": "registry:file", "target": "~/src/styles/v8-theme.css" }
      ]
    },
    {
      "name": "light-white",
      "type": "registry:item",
      "title": "Pure-white light variant",
      "description": "Overrides the warm-cream light palette with pure white. Import after theme.css.",
      "files": [
        { "path": "registry/light-white/light-white.css", "type": "registry:file", "target": "~/src/styles/v8-light-white.css" }
      ]
    },
    {
      "name": "fonts",
      "type": "registry:item",
      "title": "--v8-asterisk fonts",
      "description": "@font-face for Instrument Serif, DM Sans, IBM Plex Mono. Serve the woff2 files at /fonts/.",
      "files": [
        { "path": "registry/fonts/fonts.css", "type": "registry:file", "target": "~/src/styles/v8-fonts.css" }
      ]
    }
  ]
}
```

- [ ] **Step 5: Commit and push**

```bash
git add -A && git commit -m "feat: add theme, fonts, and light-white registry items"
git push
```

- [ ] **Step 6: Verify GitHub-registry install works** (from any scratch dir inside the repo)

```bash
cd /home/donheidi/code/v8-asterisk
npx shadcn@latest view DonHeidi/v8-asterisk/theme
```
Expected: item JSON printed with the theme.css content. If `view` is unavailable in the installed CLI version, verify instead during Task 6's website install.

### Task 3: shadcn primitives, restyled for v8

**Files:**
- Create: `components.json`, `lib/utils.ts`, `registry/ui/button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `badge.tsx`, `avatar.tsx`, `toggle-group.tsx`
- Modify: `registry.json` (add ui items)

**Interfaces:**
- Consumes: theme tokens from Task 2 (`--color-success-soft` etc. as Tailwind colors `bg-success-soft`, `text-success`…).
- Produces: registry ui items named `button`, `card`, `input`, `textarea`, `label`, `badge`, `avatar`, `toggle-group`. Badge gains variants `success | warning | destructive-soft`; Label is mono-uppercase. Component export names follow shadcn convention (`Button`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Input`, `Textarea`, `Label`, `Badge`, `Avatar`, `AvatarImage`, `AvatarFallback`, `ToggleGroup`, `ToggleGroupItem`).

- [ ] **Step 1: Write `components.json`** so the shadcn CLI targets `registry/ui`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": ".storybook/tailwind.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/registry",
    "ui": "@/registry/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/lib/hooks"
  }
}
```

`lib/utils.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Pull the eight primitives (Base UI default)**

```bash
cd /home/donheidi/code/v8-asterisk
bunx shadcn@latest add button card input textarea label badge avatar toggle-group
```
Expected: `.tsx` files appear in `registry/ui/`; peer deps (Base UI packages) are added to package.json by the CLI (via bun — the CLI detects bun.lock).

- [ ] **Step 3: Apply v8 restyling** (edits on top of the pulled files; keep everything else stock)

1. `label.tsx` — add v8's mono-uppercase form-label style to the base classes: append
   `font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground` to the
   existing class list in the Label component.
2. `badge.tsx` — extend `badgeVariants` with three new entries in `variants.variant`:
```ts
success: 'border-transparent bg-success-soft text-success [a&]:hover:bg-success-soft/80',
warning: 'border-transparent bg-warning-soft text-warning [a&]:hover:bg-warning-soft/80',
'destructive-soft': 'border-transparent bg-destructive-soft text-destructive [a&]:hover:bg-destructive-soft/80',
```
   (Adapt the literal class shape to whatever the pulled `badgeVariants` uses — match its
   existing `default`/`secondary` entries' structure exactly, only changing colors.)
3. `button.tsx`, `input.tsx`, `textarea.tsx` — no structural edits; tokens do the theming.
   Verify focus rings use `ring` (maps to `--v8-accent`).

- [ ] **Step 4: Register the ui items in `registry.json`** — append to `items`, one entry per component. For each, copy `dependencies` from the imports actually present in the pulled file (e.g. the Base UI package and `class-variance-authority` where used). Entry shape:

```json
{
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "v8 button",
  "dependencies": ["<copy from the pulled file's non-local imports>"],
  "registryDependencies": [],
  "files": [{ "path": "registry/ui/button.tsx", "type": "registry:ui" }]
}
```
`toggle-group` may list a registry dependency on `toggle` if the pulled file imports it — in that case also `bunx shadcn@latest add toggle` and register it the same way.

- [ ] **Step 5: Typecheck, commit, push**

```bash
bunx tsc --noEmit
git add -A && git commit -m "feat: add v8-styled shadcn primitives to registry"
git push
```
Expected: tsc clean.

### Task 4: Storybook workbench

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.tsx`, `.storybook/tailwind.css`, `stories/tokens.stories.tsx`, `stories/button.stories.tsx`, `stories/badge.stories.tsx`, `stories/form.stories.tsx`, `stories/card.stories.tsx`, `stories/toggle-group.stories.tsx`, `stories/avatar.stories.tsx`
- Modify: `package.json` scripts (via `bun run` additions is fine here — scripts are not dependencies)

**Interfaces:**
- Consumes: theme.css, fonts.css, primitives from Tasks 2–3.
- Produces: `bun run storybook` serving all primitives with a toolbar switching dark / light (cream) / light-white.

- [ ] **Step 1: Install Storybook (latest)**

```bash
cd /home/donheidi/code/v8-asterisk
bun add -d storybook @storybook/react-vite
```

- [ ] **Step 2: Write config**

`.storybook/tailwind.css`:
```css
@import 'tailwindcss';
@import '../registry/fonts/fonts.css';
@import '../registry/theme/theme.css';
@import '../registry/light-white/light-white.css' layer(v8-white);
/* light-white is wrapped in a cascade layer so it only wins when the
   preview decorator adds the .v8-white class — see preview.tsx */
```
Note: the `layer(v8-white)` trick keeps both light palettes loadable at once; the
decorator toggles which applies. If layering proves awkward, alternative: scope the
white override in preview by injecting `<style>` only for the white theme option —
either is acceptable; the requirement is a 3-way toolbar: dark / light-cream / light-white.

`.storybook/main.ts`:
```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  staticDirs: [{ from: '../registry/fonts/files', to: '/fonts' }],
}
export default config
```

`.storybook/preview.tsx`:
```tsx
import * as React from 'react'
import type { Preview } from '@storybook/react-vite'
import './tailwind.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'v8 theme',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light (cream)' },
          { value: 'light-white', title: 'Light (white)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string
      const cls = theme === 'dark' ? 'dark' : 'light'
      document.documentElement.classList.remove('dark', 'light', 'v8-white')
      document.documentElement.classList.add(cls)
      if (theme === 'light-white') document.documentElement.classList.add('v8-white')
      return (
        <div className="bg-background text-foreground font-sans min-h-screen p-8">
          <Story />
        </div>
      )
    },
  ],
}
export default preview
```
If the `layer()` approach from tailwind.css is used, adjust `light-white.css` selector to
`.v8-white .light, .v8-white.light { … }` so the class gates it. Keep the registry item’s
published CSS as written in Task 2 (consumers opt in by import order, not class); the
class-gated variant lives only in the Storybook build if needed.

`package.json` scripts (add):
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

- [ ] **Step 3: Write stories.** `stories/tokens.stories.tsx` (complete):

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'

const swatches = [
  ['--v8-bg', 'bg'], ['--v8-bg-alt', 'bg-alt'], ['--v8-bg-surface', 'surface'],
  ['--v8-text', 'text'], ['--v8-text-muted', 'muted'], ['--v8-accent', 'accent'],
  ['--v8-border', 'border'], ['--v8-success', 'success'], ['--v8-warning', 'warning'],
  ['--v8-destructive', 'destructive'],
] as const

function Tokens() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">--v8-asterisk</h1>
      <div className="grid grid-cols-5 gap-4">
        {swatches.map(([varName, label]) => (
          <div key={varName} className="space-y-2">
            <div className="h-16 rounded-md border border-border" style={{ background: `var(${varName})` }} />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-display text-3xl">Instrument Serif — display</p>
        <p className="font-sans text-xl">DM Sans — body</p>
        <p className="font-mono text-sm uppercase tracking-widest">IBM Plex Mono — labels</p>
      </div>
    </div>
  )
}

const meta: Meta<typeof Tokens> = { title: 'Foundation/Tokens', component: Tokens }
export default meta
export const Overview: StoryObj<typeof Tokens> = {}
```

Per-primitive stories follow the same shape — one file each for button, badge, card,
avatar, toggle-group, and a combined `form.stories.tsx` (Label + Input + Textarea +
Button composed as the contact-form layout). Each story file must render every variant
the component defines (for badge that includes `success`, `warning`, `destructive-soft`).
Minimal example, `stories/button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/registry/ui/button'

const meta: Meta<typeof Button> = { title: 'UI/Button', component: Button }
export default meta
type Story = StoryObj<typeof Button>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
```

- [ ] **Step 4: Run and verify visually**

```bash
bun run storybook
```
Expected: Storybook at :6006; toolbar switches all three themes; fonts render
(serif headline, mono labels); badge soft tints visible in all themes. Screenshot
each theme via Chrome DevTools MCP for the record.

- [ ] **Step 5: Commit and push**

```bash
git add -A && git commit -m "feat: add Storybook workbench with theme switching"
git push
```

---

## Phase B — website migration (`apps/website`)

All Phase B work happens in a git worktree of `sebastian-heitmann` (use
`superpowers:using-git-worktrees`; branch suggestion: `feat/v8-asterisk-migration`).
After every task: `bun run build` must pass from `apps/website/`, and screenshots
(dark + light, at minimum the affected pages) go to `apps/website/.screenshots/<task>/`.
Add `.screenshots/` to `apps/website/.gitignore` in Task 6.

**Screenshot procedure (referenced by every task as “screenshot matrix”):**
```bash
cd apps/website && bun run build && bun run preview   # serves dist on :4321
```
Then via Chrome DevTools MCP: navigate to the page, `emulate` dark/light if needed —
the site’s theme is class-driven, so instead run
`document.documentElement.classList.replace('dark','light')` via evaluate_script to
flip themes — screenshot at 1440 and 375 widths.

### Task 5: Astro 6 → 7 upgrade

**Files:**
- Modify: `apps/website/package.json` (via bun), `apps/website/astro.config.mjs` if the migration guide requires it

**Interfaces:**
- Produces: website building green on Astro 7; unchanged visuals.

- [ ] **Step 1: Upgrade**

```bash
cd apps/website
bunx @astrojs/upgrade
```
(This official tool bumps astro + integrations together. If unavailable: `bun add astro@latest @astrojs/sitemap@latest astro-icon@latest sharp@latest`.)

- [ ] **Step 2: Read the v7 migration notes and fix breakage**

Fetch https://docs.astro.build/en/guides/upgrade-to/v7/ and apply anything that
matches this codebase (config renames, image API changes, i18n changes). Then:
```bash
bun run build
```
Expected: build green. Fix errors per the guide until it is.

- [ ] **Step 3: Visual smoke + commit**

Screenshot matrix on `/`, `/de-de/`, one article, `/cv` (or actual CV route), TPM and
web-projects pages. Compare against pre-upgrade production look — expect no change.
```bash
git add -A && git commit -m "feat(website): upgrade to Astro 7"
```

### Task 6: Tailwind + React plumbing; tokens go live from the registry

**Files:**
- Modify: `apps/website/astro.config.mjs`, `apps/website/tsconfig.json`, `apps/website/src/layouts/Layout.astro`, `apps/website/.gitignore`
- Create: `apps/website/src/styles/global.css`, `apps/website/components.json`; `src/styles/v8-theme.css` + `src/styles/v8-fonts.css` arrive via shadcn add

**Interfaces:**
- Produces: Tailwind v4 utilities + all `--v8-*`/shadcn tokens available site-wide from the registry copy; `@/` alias; React renderer installed. Site still renders its SCSS components, now reading registry tokens (light mode becomes warm cream site-wide — intended refresh). `cn()` at `src/lib/utils.ts`.

- [ ] **Step 1: Dependencies**

```bash
cd apps/website
bunx astro add react   # installs @astrojs/react + react + react-dom, wires astro.config
bun add tailwindcss @tailwindcss/vite
bun add lucide-react @icons-pack/react-simple-icons class-variance-authority clsx tailwind-merge
```

- [ ] **Step 2: Wire Tailwind and alias**

`astro.config.mjs` — add to the existing config:
```js
import tailwindcss from '@tailwindcss/vite'
// inside defineConfig:
vite: { plugins: [tailwindcss()] },
```
`tsconfig.json` — ensure:
```json
"compilerOptions": {
  "jsx": "react-jsx",
  "jsxImportSource": "react",
  "baseUrl": ".",
  "paths": { "@/*": ["./src/*"] }
}
```

- [ ] **Step 3: shadcn init + pull theme/fonts/primitives from the registry**

`components.json` (write directly — init’s questionnaire adds nothing here):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/styles/global.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/lib/hooks"
  }
}
```
```bash
bunx shadcn@latest add DonHeidi/v8-asterisk/theme DonHeidi/v8-asterisk/fonts
bunx shadcn@latest add DonHeidi/v8-asterisk/button DonHeidi/v8-asterisk/card DonHeidi/v8-asterisk/input DonHeidi/v8-asterisk/textarea DonHeidi/v8-asterisk/label DonHeidi/v8-asterisk/badge DonHeidi/v8-asterisk/avatar DonHeidi/v8-asterisk/toggle-group
```
Expected: `src/styles/v8-theme.css`, `src/styles/v8-fonts.css`, `src/components/ui/*.tsx`,
`src/lib/utils.ts` created; Base UI deps added by the CLI. If the GitHub-registry fetch
fails, fall back to local paths: `bunx shadcn@latest add /home/donheidi/code/v8-asterisk/registry.json` items — but resolve and fix the GitHub path before Phase B ends, it is the delivery contract.

- [ ] **Step 4: Global CSS + Layout wiring**

`src/styles/global.css`:
```css
@import 'tailwindcss';
@import './v8-fonts.css';
@import './v8-theme.css';
```
In `Layout.astro`: `import '../styles/global.css'` in frontmatter. Then delete from the
global SCSS block: the three `@font-face` declarations and the `html.dark { … }` /
`html.light { … }` / `:root { --v8-font-* }` token blocks (theme + fonts now come from
the registry files). Keep everything else (reset, backdrop helpers, `.reveal`) for now.
Keep the font `<link rel="preload">` tags — filenames unchanged.

- [ ] **Step 5: Add `.screenshots/` to `apps/website/.gitignore`, build, verify, commit**

```bash
bun run build
```
Expected: green. Screenshot matrix on `/`: dark mode identical to before; light mode now
warm cream everywhere (this is the accepted refresh moment — capture it clearly).
SCSS components must all still render correctly (they read the same token names).
```bash
git add -A && git commit -m "feat(website): wire Tailwind v4 + React + --v8-asterisk registry theme"
```

### SCSS → Tailwind conversion rules (used by Tasks 7–14)

Apply these uniformly; they are the whole porting method:

| Current SCSS pattern | Target |
|---|---|
| `color: var(--v8-text-muted)` | `text-muted-foreground` |
| `color: var(--v8-text-secondary/-tertiary/-dim/-faint)` | `text-text-secondary` / `text-text-tertiary` / `text-text-dim` / `text-text-faint` |
| `background: var(--v8-bg)` / `-alt` / `-surface` | `bg-background` / `bg-surface-alt` / `bg-surface` |
| `color: var(--v8-accent)` | `text-primary` |
| `border-color: var(--v8-border)` | `border-border` (or just `border` + default) |
| `font-family: var(--v8-font-display/body/mono)` | `font-display` / `font-sans` / `font-mono` |
| mono uppercase eyebrow labels | `font-mono text-xs uppercase tracking-[0.12em]` (match current letter-spacing per component) |
| media queries 1440/1024/768/375 | Tailwind responsive prefixes; site is desktop-first today — invert to mobile-first while porting, checking each breakpoint in screenshots |
| `&:hover` nesting | `hover:` variants |
| scoped `<style lang="scss">` block | deleted entirely; classes inline in TSX |
| section banding `@include lt` / `@include dk` | `class="light"` / `class="dark"` on the section element (tokens re-scope automatically) |
| truly unportable decorative CSS (backdrop dot/grid layers, keyframes, `.reveal`) | stays as plain CSS in `global.css` (converted from SCSS: expand nesting manually, replace SCSS functions with their computed output) |
| `astro-icon` `<Icon name="mdi:...">` | `lucide-react` equivalent; `simple-icons:*` → `@icons-pack/react-simple-icons` |
| `import { Image } from 'astro:assets'` inside component | component takes `imageSrc: string` (+ width/height/alt) props; the calling `.astro` page resolves via `getImage()` |

**Per-component task procedure (identical in Tasks 7–14):**
1. Read the old `.astro` component fully.
2. Write `src/components/<name>.tsx` — typed props preserving the existing i18n string-section props plus any new image/href props; JSX mirroring the old markup; Tailwind classes per the table; shadcn primitives where the spec maps them (cards → `Card`, tags → `Badge`, avatar → `Avatar`, buttons/links-as-buttons → `Button` with `asChild`/render-prop per the pulled implementation).
3. Update every page importing the old component (both locales) to import the `.tsx` (no `client:` directive unless the task says island).
4. Delete the old `.astro` component.
5. `bun run build` → green; screenshot matrix on affected pages, both themes.
6. Commit `feat(website): migrate <name> to TSX`.

### Task 7: Leaf components — article-card, author-card, article-cta

**Files:**
- Create: `src/components/article-card.tsx`, `author-card.tsx`, `article-cta.tsx`
- Modify: pages/components referencing them (grep `article-card`, `author-card`, `article-cta` across `src/`)
- Delete: the three old `.astro` files

**Interfaces:**
- Consumes: `Card`, `Badge`, `Avatar`, `Button` from `@/components/ui/*`; `cn` from `@/lib/utils`.
- Produces: `<ArticleCard>`, `<AuthorCard>`, `<ArticleCta>` — props: the exact string-section objects the old components accepted (copy their current `Props` interfaces), with images/hrefs as resolved-URL props.

- [ ] **Step 1–6:** run the per-component procedure for each of the three, committing separately. `ArticleCard` reference shape (adapt to the real current props when reading the old file):

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ArticleCardProps {
  href: string
  title: string
  abstract: string
  date: string
  tags: string[]
  imageSrc?: string
  imageAlt?: string
}

export function ArticleCard({ href, title, abstract, date, tags, imageSrc, imageAlt }: ArticleCardProps) {
  return (
    <a href={href} className="group block">
      <Card className="h-full overflow-hidden transition-colors hover:border-border-accent">
        {imageSrc && (
          <img src={imageSrc} alt={imageAlt ?? ''} loading="lazy"
               className="aspect-[16/9] w-full object-cover [filter:var(--v8-photo-filter)] transition group-hover:[filter:var(--v8-photo-filter-hover)]" />
        )}
        <CardContent className="space-y-3 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{date}</p>
          <h3 className="font-display text-2xl leading-snug">{title}</h3>
          <p className="text-sm text-text-secondary">{abstract}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map(tag => <Badge key={tag} variant="secondary" className="font-mono text-[11px] uppercase">{tag}</Badge>)}
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
```

### Task 8: Navigation with ThemeToggle + LanguagePicker

**Files:**
- Create: `src/components/navigation.tsx` (static), `src/components/theme-toggle.tsx` (island), `src/components/language-picker.tsx`
- Modify: `Layout.astro` (or pages) rendering `navigation.astro`
- Delete: `src/components/navigation.astro`

**Interfaces:**
- Consumes: `ToggleGroup`, `ToggleGroupItem`.
- Produces: `<Navigation strings={...} currentPath={...} locale={...}>` static; inside it `<ThemeToggle client:load labels={...}>`; `<LanguagePicker currentPath locale>` — static if it renders plain locale links (check the old implementation; only hydrate if it has JS behavior today).

- [ ] **Step 1: `theme-toggle.tsx`** (complete island; preserves the exact storage/class contract and the anti-FOUC script in Layout stays untouched):

```tsx
import * as React from 'react'
import { Monitor, Sun, Moon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type Mode = 'system' | 'light' | 'dark'

function apply(mode: Mode) {
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  const resolved = mode === 'system' ? (prefersLight ? 'light' : 'dark') : mode
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
}

export function ThemeToggle({ labels }: { labels: { system: string; light: string; dark: string } }) {
  const [mode, setMode] = React.useState<Mode>('system')

  React.useEffect(() => {
    const stored = localStorage.getItem('theme') as Mode | null
    if (stored === 'light' || stored === 'dark') setMode(stored)
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => { if ((localStorage.getItem('theme') ?? 'system') === 'system') apply('system') }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  function select(next: Mode) {
    setMode(next)
    if (next === 'system') localStorage.removeItem('theme')
    else localStorage.setItem('theme', next)
    apply(next)
  }

  return (
    <ToggleGroup type="single" value={mode} onValueChange={(v) => v && select(v as Mode)}
                 aria-label="Theme" className="border border-border rounded-md">
      <ToggleGroupItem value="system" aria-label={labels.system}><Monitor className="size-3.5" /></ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label={labels.light}><Sun className="size-3.5" /></ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label={labels.dark}><Moon className="size-3.5" /></ToggleGroupItem>
    </ToggleGroup>
  )
}
```
IMPORTANT: compare against the old `navigation.astro` toggle logic while porting — if it
stores `'system'` explicitly rather than removing the key, replicate the stored-value
semantics exactly (the anti-FOUC script in Layout.astro is the contract; read it first).

- [ ] **Steps 2–6:** port `navigation.tsx` + `language-picker.tsx` per the procedure; render from Layout with `<ThemeToggle client:load ...>` nested via prop or composed in the `.astro` layout directly. Verify: toggle works in the preview build (all three modes, persistence across reload), no hydration warnings in console, nav identical structurally. Commit.

### Task 9: ContactForm island

**Files:**
- Create: `src/components/contact-form.tsx`, `src/components/contact-section.tsx` (static wrapper)
- Modify: pages rendering `contact-section.astro` (both locales)
- Delete: `src/components/contact-section.astro`

**Interfaces:**
- Consumes: `Input`, `Textarea`, `Label`, `Button`.
- Produces: `<ContactSection strings endpoint>` static section containing `<ContactForm client:visible strings endpoint>`. Fetch contract unchanged: POST JSON `{ name, email, context?, message }`, success/error/sending states, `aria-live="polite"` status.

- [ ] **Step 1: `contact-form.tsx`** (complete):

```tsx
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ContactFormStrings {
  nameLabel: string; emailLabel: string; contextLabel: string; messageLabel: string
  submit: string; sending: string; success: string; error: string
}

export function ContactForm({ strings, endpoint }: { strings: ContactFormStrings; endpoint: string }) {
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!endpoint) { setStatus('error'); return }
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload: Record<string, string> = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      message: String(fd.get('message') ?? ''),
    }
    const context = String(fd.get('context') ?? '')
    if (context) payload.context = context
    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { setStatus('success'); form.reset() } else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cf-name">{strings.nameLabel}</Label>
          <Input id="cf-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-email">{strings.emailLabel}</Label>
          <Input id="cf-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-context">{strings.contextLabel}</Label>
        <Input id="cf-context" name="context" type="text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cf-message">{strings.messageLabel}</Label>
        <Textarea id="cf-message" name="message" rows={4} required />
      </div>
      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? strings.sending : strings.submit}
      </Button>
      <p aria-live="polite"
         className={status === 'success' ? 'text-success text-sm' : status === 'error' ? 'text-destructive text-sm' : 'sr-only'}>
        {status === 'success' ? strings.success : status === 'error' ? strings.error : ''}
      </p>
    </form>
  )
}
```
Match the field set/labels/underline styling intent against the old
`contact-section.astro` while porting (keep the underline-input look by adding
`className` overrides on Input/Textarea if the section design calls for it:
`border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary`).

- [ ] **Steps 2–6:** static `contact-section.tsx` wrapper (headline + form), wire pages with `client:visible`, delete old file, build, screenshots, **manual form test in preview**: submit with `PUBLIC_MAIL_ENDPOINT` unset → error state announced; states styled correctly. Commit.

### Task 10: Sections — hero, capabilities, situations, proof, logos, featured-articles, footer

**Files:**
- Create: `src/components/{hero,capabilities-section,situations-section,proof-section,logo-section,featured-articles-section,footer}.tsx`
- Modify: referencing pages (both locales)
- Delete: the seven old `.astro` files

**Interfaces:**
- Consumes: primitives + `ArticleCard` from Task 7.
- Produces: seven static components; props = existing string sections + resolved image/logo URLs (logo-section imports its images in the calling page frontmatter via `getImage()` and passes URLs).

- [ ] **Steps:** per-component procedure × 7, one commit each. Watch items: hero photo uses `--v8-photo-filter` (arbitrary property syntax as in ArticleCard); logo strip images come through `getImage()`; footer link lists are locale-aware via props (unchanged). Screenshot the full landing page after all seven and compare section-by-section against production.

### Task 11: article-view

**Files:**
- Create: `src/components/article-view.tsx`
- Modify: article pages (both locales) — content-collection `render()` stays in `.astro`; rendered HTML body passes into TSX as a `<slot>`-equivalent: `<ArticleView {...props}><Content /></ArticleView>` composed in the `.astro` page with `children`
- Delete: `src/components/article-view.astro`

**Interfaces:**
- Consumes: `AuthorCard`, `ArticleCta` (Task 7).
- Produces: `<ArticleView>` accepting `children` (the rendered MDX/markdown) + header metadata props.

- [ ] **Steps:** per-component procedure. Extra care: typographic styles for rendered
markdown (headings, lists, links inside the article body) were scoped SCSS —
re-express as descendant utilities on the wrapper via Tailwind arbitrary variants
(e.g. `[&_h2]:font-display [&_h2]:text-3xl [&_a]:text-primary [&_a]:underline` …)
matching the old rules; verify on the longest article in both locales. Commit.

### Task 12: TPM content page (section banding)

**Files:**
- Create: `src/components/technical-project-management-content.tsx`
- Modify: TPM pages (both locales)
- Delete: `src/components/technical-project-management-content.astro`

**Interfaces:**
- Consumes: banding mechanism — `class="light"` / `class="dark"` on `<section>` elements.
- Produces: static TSX; the SCSS `lt`/`dk` mixins are replaced by the theme classes.

- [ ] **Step 1:** Read the old file; list its sections and which are `@include lt` vs `dk`.
- [ ] **Step 2:** Port section-by-section per the conversion rules; each banded section gets `className="light …"` or `className="dark …"` plus `bg-background text-foreground` so the re-scoped tokens actually paint. NOTE the old mixins used slightly different values than the global theme (e.g. light bg `#F5F4F0`) — do NOT reproduce those deltas; the registry tokens are canonical now (accepted refresh).
- [ ] **Step 3:** Build, screenshot every band in both global themes (banding must look identical regardless of global theme), compare structure to production. Commit.

### Task 13: web-projects content page

Same procedure, files, and banding notes as Task 12, for
`src/components/web-projects-content.astro` → `web-projects-content.tsx`. Commit.

### Task 14: CV + print preservation

**Files:**
- Create: `src/components/cv-section.tsx`, `src/styles/cv-print.css`
- Modify: CV pages (both locales)
- Delete: `src/components/cv-section.astro`

**Interfaces:**
- Produces: static CV component; `cv-print.css` imported only by the CV pages, containing the `@media print` rules.

- [ ] **Step 1: BEFORE any changes** — capture the print baseline: open the production/pre-task CV page in Chrome, print-preview to PDF (A4), save as `apps/website/.screenshots/task14/cv-print-before.pdf`.
- [ ] **Step 2:** Extract the existing `<style is:inline>` `@media print` block from `cv-section.astro` into `src/styles/cv-print.css` **verbatim** (including `!important` token overrides), imported from the CV page frontmatter.
- [ ] **Step 3:** Port the screen styles to TSX per the conversion rules. The print CSS targets class names — keep the same class names on the TSX elements that the print rules select (add them alongside Tailwind utilities: `className="cv-entry flex …"`).
- [ ] **Step 4:** Build; print-preview to PDF again → `cv-print-after.pdf`; compare page count, layout, and token overrides side by side. **This must match the baseline** (hard requirement). Screen screenshots both themes. Commit.

### Task 15: Cleanup — SCSS out

**Files:**
- Modify: `src/layouts/Layout.astro` (convert remaining global SCSS to plain CSS in `global.css`), `package.json` (via bun)
- Delete: any remaining `<style lang="scss">` blocks

**Interfaces:**
- Produces: zero SCSS in the repo; `sass` removed; `astro-icon` removed if no `.astro` file still uses it.

- [ ] **Step 1:** `grep -rn 'lang="scss"' apps/website/src` — port any stragglers (reset, `.page-backdrop` dot/grid decorative layers, `.reveal` utility) into `global.css` as plain CSS: expand SCSS nesting by hand and replace `@function`/`@mixin` output with their computed CSS (compute the current output once from the built site's CSS if needed).
- [ ] **Step 2:**
```bash
cd apps/website
bun remove sass
grep -rn 'astro-icon\|astro:icon\|from "astro-icon' src || bun remove astro-icon @iconify-json/mdi @iconify-json/simple-icons
bun run build
```
Expected: build green with no sass. (Only remove astro-icon if the grep finds nothing.)
- [ ] **Step 3:** Screenshot matrix on all pages; commit `feat(website): remove SCSS — migration complete`.

### Task 16: Full verification

- [ ] **Step 1:** `bun run build` from `apps/website` — green, and check `dist/_astro/` for unexpected multi-MB originals (the `getImage()` rule).
- [ ] **Step 2:** Full screenshot matrix: every page (`/`, `/de-de/`, articles index + one article, CV, TPM, web-projects, 404 if present) × dark/light × 1440/375 → `apps/website/.screenshots/final/`. Review each against production for structural parity.
- [ ] **Step 3:** JS payload audit: in Chrome DevTools network panel on `/`, confirm only the island chunks + React runtime load, and that pages without islands ship no framework JS. Record numbers.
- [ ] **Step 4:** Contact form states, theme toggle persistence, language picker, `.reveal` scroll animations, first-visit locale redirect — all manually in preview.
- [ ] **Step 5:** CV print PDF check (again, against Task 14 baseline).
- [ ] **Step 6:** Deploy dry run: run the build path of `scripts/deploy-website.sh` if it supports dry-run, otherwise verify its orphan-pruning grep logic against the new `dist/` manually (every file in `dist/_astro/` referenced from HTML/CSS/JS).
- [ ] **Step 7:** `bunx tsc --noEmit` (or `bunx astro check`) green; commit anything outstanding. Present the before/after screenshot set to the user; use `superpowers:finishing-a-development-branch` for merge/PR decision.

---

## Self-review notes

- Spec coverage: registry repo (T1–3), Storybook (T4), Astro 7 (T5), plumbing + cream light (T6), all 15 components (T7–14: 3 leaf + nav/toggle/picker + contact + 7 sections + article-view + TPM + web-projects + CV), SCSS removal (T15), verification incl. print/deploy/JS-payload (T16). Out-of-scope items (job-directory, landing, infra) have no tasks — correct.
- Big content pages (T11–13) intentionally carry conversion rules + procedure instead of full inline code: their source is 780–1,220 lines each and the target code is a mechanical function of the source plus the rules table. The rules table + banding note + acceptance criteria are the deterministic spec for those tasks.
- Type consistency: component names/props used across tasks (`ArticleCard` in T7 consumed by featured-articles in T10; ui exports listed in T3 consumed in T7–T9) match.
