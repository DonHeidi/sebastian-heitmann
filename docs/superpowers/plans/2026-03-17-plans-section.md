# Plans Section Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pricing/plans section with three colored tier cards, a CTA, and a large decorative heading.

**Architecture:** A section component renders a CTA, a 3-column card grid inside a `GridBackgroundContainer`, and a large heading with partial color highlight. A card subcomponent accepts tier data as props with variant-colored solid backgrounds. Plan data is hardcoded in the section component.

**Tech Stack:** Astro 6, scoped SCSS, astro-icon, existing typography and CTA components.

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/plan-card.astro` | Individual pricing tier card |
| Create | `src/components/plans-section.astro` | Section with CTA, card grid, heading |
| Modify | `src/pages/index.astro:1-6,19` | Add PlansSection import and component |

---

## Chunk 1: Plan Card and Section

### Task 1: Create the plan card component

**Files:**
- Create: `src/components/plan-card.astro`

- [ ] **Step 1: Create `src/components/plan-card.astro`**

```astro
---
type Props = {
  title: string;
  price: string;
  features: string[];
  variant: 'magenta' | 'blue' | 'green';
  featured?: boolean;
};

const { title, price, features, variant, featured = false }: Props = Astro.props;

const colorMap = {
  magenta: 'var(--clr-magenta)',
  blue: 'var(--clr-blue)',
  green: 'var(--clr-green)',
};

const bgColor = colorMap[variant];
---
<div class:list={['plan-card', variant, { featured }]}>
  {featured && <span class="plan-card__badge">Popular</span>}
  <h3 class="plan-card__title">{title}</h3>
  <p class="plan-card__price">{price}</p>
  <ul class="plan-card__features">
    {features.map((feature) => (
      <li class="plan-card__feature">{feature}</li>
    ))}
  </ul>
</div>

<style lang="scss" define:vars={{ bgColor }}>
  .plan-card {
    position: relative;
    background-color: var(--bgColor);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    &.featured {
      transform: translateY(-1.5rem);
    }

    &__badge {
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%) rotate(-8deg);
      background-color: var(--clr-green);
      backdrop-filter: blur(8px);
      color: #fff;
      font-family: 'AntonSC', sans-serif;
      font-size: 0.875rem;
      line-height: 1;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      white-space: nowrap;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    }

    &__title {
      font-family: 'AntonSC', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1;
      color: #fff;
    }

    &__price {
      font-family: 'AntonSC', sans-serif;
      font-size: 2.5rem;
      font-weight: 500;
      line-height: 1;
      color: #fff;
    }

    &__features {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    &__feature {
      font-family: 'SpaceGrotesk', sans-serif;
      font-size: 0.875rem;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.85);
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/plan-card.astro
git commit -m "feat(plans): add plan card component with variant colors"
```

### Task 2: Create the plans section component

**Files:**
- Create: `src/components/plans-section.astro`

- [ ] **Step 1: Create `src/components/plans-section.astro`**

```astro
---
import CTA from './interactive/call-to-action.astro';
import GridBackgroundContainer from './grid-background-container.astro';
import Headline from './copy/headline.astro';
import CopyHighlight from './copy/highlight.astro';
import PlanCard from './plan-card.astro';

const plans = [
  {
    title: 'Starter',
    price: '$2,500/mo',
    features: [
      'Weekly strategy sessions',
      'Technical architecture review',
      'Team mentoring',
      'Code review oversight',
    ],
    variant: 'magenta' as const,
  },
  {
    title: 'Growth',
    price: '$5,000/mo',
    features: [
      'Everything in Starter',
      'Hands-on product development',
      'Sprint planning & delivery',
      'Vendor & hiring support',
      'Performance monitoring',
    ],
    variant: 'blue' as const,
    featured: true,
  },
  {
    title: 'Enterprise',
    price: '$9,000/mo',
    features: [
      'Everything in Growth',
      'Full-time embedded CTO',
      'Board & investor reporting',
      'Security & compliance oversight',
      'Custom integrations',
    ],
    variant: 'green' as const,
  },
];
---
<section id="plans" class="plans">
  <div class="plans__cta">
    <CTA link="/contact" type="primary">Book a Call</CTA>
  </div>
  <GridBackgroundContainer>
    <div class="plans__grid">
      {plans.map((plan) => (
        <PlanCard
          title={plan.title}
          price={plan.price}
          features={plan.features}
          variant={plan.variant}
          featured={plan.featured ?? false}
        />
      ))}
    </div>
  </GridBackgroundContainer>
  <div class="plans__heading">
    <Headline element="p" as="h1" shadow>
      The <CopyHighlight color="magenta">Right Plan</CopyHighlight> For
    </Headline>
    <Headline element="p" as="h1" class="plans__heading-muted">
      Your Business
    </Headline>
  </div>
</section>

<style lang="scss">
  .plans {
    position: relative;
    padding-inline: 144px;
    padding-block: 6rem;
    background-color: var(--clr-bg-primary);

    &__cta {
      display: flex;
      justify-content: center;
      margin-bottom: 4rem;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      padding-block: 4rem;
      align-items: end;
    }

    &__heading {
      margin-top: 4rem;
    }

    &__heading-muted {
      color: rgba(255, 255, 255, 0.15);
    }
  }

  @media (max-width: 1440px) {
    .plans {
      padding-inline: 80px;
    }
  }

  @media (max-width: 768px) {
    .plans {
      padding-inline: 2rem;
      padding-block: 4rem;

      &__grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding-block: 2rem;
      }
    }
  }

  @media (max-width: 375px) {
    .plans {
      padding-inline: 1.25rem;
      padding-block: 3rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/plans-section.astro
git commit -m "feat(plans): add plans section with card grid and heading"
```

### Task 3: Integrate into index page

**Files:**
- Modify: `src/pages/index.astro:6,19`

- [ ] **Step 1: Add import to `index.astro`**

Add after the existing imports (after `import SuccessStoriesSection`):

```astro
import PlansSection from '../components/plans-section.astro';
```

- [ ] **Step 2: Add component to page body**

Insert after `<ServicesSection />`, before `</body>`:

```astro
        <PlansSection />
```

- [ ] **Step 3: Verify the build**

Run: `cd /Users/sebhe/Code/sebastian-heitmann && bun run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(plans): integrate plans section into homepage"
```
