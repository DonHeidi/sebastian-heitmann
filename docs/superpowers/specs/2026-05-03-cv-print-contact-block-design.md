# CV Print Contact Block

## Goal

Add a print-only identity block (name, address, email, website) to the CV page so the printed PDF reads as a German-style Lebenslauf with letterhead-style contact information. The block is invisible on screen and appears only when the user prints (Cmd+P or the existing download button).

## Context

The CV page (`apps/website/src/pages/cv.astro` + `apps/website/src/components/cv-section.astro`) already has a comprehensive `@media print` stylesheet that strips nav/footer, switches to A4, and recompresses every section. There is currently no name, address, or contact info anywhere on the page — the `cv-headline` is the document type ("Curriculum Vitae" / "Lebenslauf"), not the person.

The user's existing PDF CV is titled "CV Sebastian Heitmann" / "Lebenslauf Sebastian Heitmann" — i.e., the document type stacked with the name. We mirror that convention.

## Design

### Visual layout (print only, top of page 1)

```
LEBENSLAUF                                          ← existing cv-headline, shrunk to mono eyebrow
Sebastian Heitmann                                  ← NEW print-only name (display font, ~22px)

Kastanienallee 24 · 21255 Tostedt                   ← NEW address line (mono, ~9px, muted)
me@sebastian-heitmann.dev · sebastian-heitmann.dev  ← NEW contact line (mono, ~9px, muted)

──                                                  ← existing cv-rule
Technology Consultant with 15 years…                ← existing cv-summary
```

Separator between address parts and contact parts is `·` (middle dot, U+00B7).

### Markup change (`cv-section.astro`)

Inside `.cv-header`, between `.cv-header__top` and `.cv-rule`, add:

```astro
<div class="cv-print-identity">
    <p class="cv-print-name">{cv.print.name}</p>
    <p class="cv-print-address">{cv.print.address}</p>
    <p class="cv-print-contact">{cv.print.contact}</p>
</div>
```

### Style change (`cv-section.astro`)

In the scoped screen styles:
```scss
.cv-print-identity { display: none; }
```

In the inline `@media print` block:
- `.cv-print-identity { display: block !important; margin-bottom: 8px !important; }`
- `.cv-print-name { font-family: var(--v8-font-display); font-size: 22px; line-height: 1.1; color: var(--v8-text); margin: 0 0 6px 0; }`
- `.cv-print-address`, `.cv-print-contact { font-family: var(--v8-font-mono); font-size: 9px; line-height: 1.5; color: var(--v8-text-muted); margin: 0; letter-spacing: 0.04em; }`
- Shrink existing `.cv-headline` print rule from 28px → 10px, mono, uppercase, letter-spacing 0.12em, color muted, so it reads as an eyebrow above the name.

### i18n change

Add to `Strings['cv']` in `apps/website/src/i18n/types.ts`:

```ts
print: {
  name: string;
  address: string;
  contact: string;
};
```

Values for both locales (en-us, de-de) — identical, since the address doesn't translate:

```ts
print: {
  name: 'Sebastian Heitmann',
  address: 'Kastanienallee 24 · 21255 Tostedt',
  contact: 'me@sebastian-heitmann.dev · sebastian-heitmann.dev',
}
```

## Files Touched

- `apps/website/src/components/cv-section.astro` — add markup, screen `display:none`, print overrides
- `apps/website/src/i18n/types.ts` — add `print` sub-shape to `cv`
- `apps/website/src/i18n/en-us.ts` — add `print` values
- `apps/website/src/i18n/de-de.ts` — add `print` values

No changes needed to `cv.astro` page files — they consume the strings unchanged.

## Out of Scope

- Phone number (user opted out)
- Photo (German Lebenslauf convention varies; not requested)
- Date of birth, nationality, marital status (omitted by modern preference)
- Per-page running header/footer
- Screen visibility of the identity block
