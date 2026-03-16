# Services Section Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `UseCases` component with an accordion-based "Our Services" section.

**Architecture:** A single Astro component using native `<details>`/`<summary>` HTML elements for accordion behavior, with a small client-side script enforcing single-open-at-a-time. Service data is hardcoded in the component. Replaces the existing `UseCases` component in `index.astro`.

**Tech Stack:** Astro 6, scoped SCSS, astro-icon (mdi:chevron-up), native `<details>`/`<summary>`.

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/services-section.astro` | Accordion services section |
| Modify | `src/pages/index.astro:2-6,18` | Swap UseCases for ServicesSection |
| Delete | `src/components/use-cases.astro` | Remove placeholder |

---

## Chunk 1: Services Section

### Task 1: Create the services section component

**Files:**
- Create: `src/components/services-section.astro`

- [ ] **Step 1: Create `src/components/services-section.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import Headline from './copy/headline.astro';
import Body from './copy/body.astro';

const services = [
  {
    title: 'UX & UI',
    description: 'Crafting intuitive user experiences and polished interfaces that balance aesthetics with usability. From wireframes to high-fidelity designs, every interaction is intentional.',
    caseLinks: [
      { label: 'DDP - APP', slug: 'ddp-app' },
      { label: 'Mobile Dashboard', slug: 'mobile-dashboard' },
    ],
  },
  {
    title: 'Solution Design',
    description: 'Translating business requirements into technical architectures that scale. Selecting the right tools, defining system boundaries, and mapping data flows before a single line of code is written.',
    caseLinks: [
      { label: 'SaaS Platform', slug: 'saas-platform' },
      { label: 'Analytics Engine', slug: 'analytics-engine' },
    ],
  },
  {
    title: 'Product Development',
    description: 'Building and shipping digital products end-to-end. From MVP to mature platform, applying engineering discipline and iterative delivery to turn ideas into production-ready software.',
    caseLinks: [
      { label: 'DDP - APP', slug: 'ddp-app' },
      { label: 'SaaS Platform', slug: 'saas-platform' },
    ],
  },
  {
    title: 'Operations & Evolution',
    description: 'Keeping systems healthy and evolving. Monitoring, incident response, performance tuning, and continuous improvement to ensure products grow with the business.',
    caseLinks: [
      { label: 'Mobile Dashboard', slug: 'mobile-dashboard' },
      { label: 'Analytics Engine', slug: 'analytics-engine' },
    ],
  },
];
---
<section id="services" class="services">
  <div class="services__header">
    <Headline element="h2" as="h3">Our Services</Headline>
    <Body>
      We build intelligent software solutions from modern landing pages,
      mobile applications, to SaaS applications with a strategic approach
      driven by incremental growth.
    </Body>
  </div>
  <div class="services__accordion">
    {services.map((service) => (
      <details class="services__item">
        <summary class="services__summary">
          <span class="services__title">{service.title}</span>
          <Icon name="mdi:chevron-up" class="services__icon" width={24} height={24} />
        </summary>
        <div class="services__content">
          <p class="services__description">{service.description}</p>
          <div class="services__links">
            {service.caseLinks.map((link) => (
              <a href={`/cases/${link.slug}`} class="services__link">{link.label}</a>
            ))}
          </div>
        </div>
      </details>
    ))}
  </div>
</section>

<script>
  const section = document.querySelector('.services__accordion');
  if (section) {
    section.addEventListener('toggle', (e) => {
      const target = e.target as HTMLDetailsElement;
      if (target.open) {
        section.querySelectorAll('details[open]').forEach((el) => {
          if (el !== target) (el as HTMLDetailsElement).open = false;
        });
      }
    }, true);
  }
</script>

<style lang="scss">
  .services {
    position: relative;
    padding-inline: 144px;
    padding-block: 6rem;
    background-color: var(--clr-bg-primary);

    &__header {
      margin-bottom: 3.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 50ch;
    }

    &__accordion {
      display: flex;
      flex-direction: column;
    }

    &__item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);

      &[open] .services__icon {
        transform: rotate(180deg);
      }
    }

    &__summary {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      padding-block: 1.5rem;
      cursor: pointer;
      list-style: none;

      &::-webkit-details-marker {
        display: none;
      }

      &::marker {
        display: none;
        content: '';
      }

      &:focus-visible {
        outline: 2px solid var(--clr-blue);
        outline-offset: 2px;
      }
    }

    &__title {
      font-family: 'AntonSC', sans-serif;
      font-size: 2rem;
      font-weight: 500;
      line-height: 1;
      color: #fff;
    }

    &__icon {
      color: #fff;
      flex-shrink: 0;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &__content {
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 60ch;
      margin-left: auto;
    }

    &__description {
      font-family: 'SpaceGrotesk', sans-serif;
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--clr-font-primary);
    }

    &__links {
      display: flex;
      gap: 1.5rem;
    }

    &__link {
      font-family: 'AntonSC', sans-serif;
      font-size: 0.875rem;
      color: var(--clr-blue);
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  @media (max-width: 1440px) {
    .services {
      padding-inline: 80px;
    }
  }

  @media (max-width: 768px) {
    .services {
      padding-inline: 2rem;
      padding-block: 4rem;

      &__title {
        font-size: 1.5rem;
      }
    }
  }

  @media (max-width: 375px) {
    .services {
      padding-inline: 1.25rem;
      padding-block: 3rem;

      &__title {
        font-size: 1.25rem;
      }
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/services-section.astro
git commit -m "feat(services): add accordion services section component"
```

### Task 2: Integrate into index page and remove UseCases

**Files:**
- Modify: `src/pages/index.astro:5,18` (swap import and component)
- Delete: `src/components/use-cases.astro`

- [ ] **Step 1: Replace UseCases import with ServicesSection in `index.astro`**

Replace line 5:
```
import UseCases from '../components/use-cases.astro';
```
With:
```
import ServicesSection from '../components/services-section.astro';
```

- [ ] **Step 2: Replace component usage in `index.astro`**

Replace line 18:
```
        <UseCases />
```
With:
```
        <ServicesSection />
```

- [ ] **Step 3: Delete the old UseCases component**

```bash
rm src/components/use-cases.astro
```

- [ ] **Step 4: Verify the build**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro && git rm src/components/use-cases.astro && git commit -m "feat(services): replace UseCases placeholder with services accordion"
```
