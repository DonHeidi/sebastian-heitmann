import type { ReactNode } from 'react';
import type { Strings } from '../i18n/types';
import { AsteriskMark } from './asterisk-mark';
import { TornPrint } from './hero';

// Torn-poster clip outline in objectBoundingBox units (0..1) — the avatar's clip
// shape, moved here from the hero (see hero.tsx PANEL_TEAR docs for the baking
// technique). The avatar now lives in the About section instead of the hero.
const AVATAR_TEAR =
  'M0.0263 0.0146L0.0717 0.0245L0.1545 0.0148L0.2481 0.0028L0.3886 0.0062L0.5266 0.0948L0.5739 0.0193L0.6053 0.0316L0.6950 0.0089L0.8225 0.0083L0.8834 0.0228L0.9615 0.0248L0.9663 0.0120L0.9824 0.0690L0.9981 0.1951L0.9967 0.3271L0.9839 0.4459L0.9854 0.5487L0.9885 0.5983L0.9480 0.6836L0.9118 0.7261L0.9837 0.7453L0.9780 0.7730L0.9940 0.8845L0.9789 0.9615L0.9856 0.9916L0.9325 0.9553L0.8128 0.9499L0.7144 0.9987L0.6613 0.8615L0.6401 0.9861L0.5417 0.9863L0.3757 0.9880L0.2821 0.9761L0.1813 0.9832L0.0385 0.9991L0.0104 0.9720L0.0196 0.8957L0.0258 0.8042L0.0163 0.6937L0.0029 0.6047L0.1039 0.5086L0.0014 0.4779L0.0524 0.3956L0.0482 0.3173L0.0142 0.2024L0.0106 0.1297L0.0078 0.0907L0.0257 0.0385Z';

// Same DEV constant convention as footer.tsx / data/blog-teasers.ts. The domain
// isn't translated, so it appears verbatim in `about.body` in every locale; the
// chip label is derived from this single URL rather than a separate i18n key,
// so the two can't drift.
const DEV = 'https://www.sebastian-heitmann.dev';
const DEV_LABEL = DEV.replace(/^https:\/\/www\./, '');

export interface AboutSectionProps {
  about: Strings['about'];
  /** Slotted `<Image>` from astro:assets (slot="avatar"): the portrait. */
  avatar?: ReactNode;
}

export function AboutSection({ about, avatar }: AboutSectionProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-20" id="about">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <clipPath id="v8-torn-avatar" clipPathUnits="objectBoundingBox">
            <path d={AVATAR_TEAR} />
          </clipPath>
        </defs>
      </svg>
      <h2 className="reveal flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        <AsteriskMark size={12} tone="accent" className="v8-spin-hover" />
        {about.sectionTitle}
      </h2>
      <div className="reveal mt-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
        {avatar && (
          <TornPrint clipId="v8-torn-avatar" offset={4} className="w-36 shrink-0 rotate-2 md:w-40">
            {avatar}
          </TornPrint>
        )}
        <div>
          <p className="max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg">{about.body}</p>
          <a
            href={DEV}
            className="mt-6 inline-block border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            {DEV_LABEL}
          </a>
        </div>
      </div>
    </section>
  );
}
