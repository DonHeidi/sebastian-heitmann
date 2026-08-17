import type { ReactNode } from 'react';
import type { Strings } from '../i18n/types';
import { SectionHeader } from './section-header';

// Same DEV constant convention as footer.tsx / data/blog-teasers.ts. The domain
// isn't translated, so it appears verbatim in `about.body` in every locale; the
// chip label is derived from this single URL rather than a separate i18n key,
// so the two can't drift.
const DEV = 'https://www.sebastian-heitmann.dev';
const DEV_LABEL = DEV.replace(/^https:\/\/www\./, '');

export interface AboutSectionProps {
  about: Strings['about'];
  /** The CRT monitor figure (slot="monitor" from about-section.astro): the
   * RAYMARCHED body render as an `astro:assets` image (which only `.astro`
   * can produce — the same slot dance as case-card's coverPanel) with the
   * live DOM terminal seated over its glass. See scripts/render-crt.mjs for
   * why the body is a build-time render: stacked 2D fills — CSS planes, DOM
   * slices, SVG, canvas painting — can never make a smooth 3D shape; a
   * surface with real per-pixel normals shades continuously by
   * construction. */
  monitor?: ReactNode;
}

/** The phosphor content: `$ cat about.txt` with the localized about body as
 * the output and a blinking block cursor. Rendered by about-section.astro
 * inside the monitor's screen overlay. The command line is a technical
 * artifact, deliberately untranslated; the OUTPUT is the localized
 * `about.body`. */
export function TerminalContent({ about }: { about: Strings['about'] }) {
  return (
    <div className="px-5 py-4 font-mono text-[0.8125rem] leading-relaxed md:px-6 md:py-5">
      <p className="text-white/90">
        <span className="text-primary">$</span> cat about.txt
      </p>
      <p className="mt-3 max-w-[52ch] text-white/80">{about.body}</p>
      <p className="mt-3 text-white/90">
        <span className="text-primary">$</span>{' '}
        <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse bg-white/80 motion-reduce:animate-none" />
      </p>
    </div>
  );
}

export function AboutSection({ about, monitor }: AboutSectionProps) {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-12 md:px-20" id="about">
      <SectionHeader title={about.sectionTitle} />
      <div className="reveal mt-8 flex justify-center">{monitor}</div>
      {/* Magnetic metal button — same mover/tilter/face split as the nav CTA
          (see .v8-magnet in global.css). */}
      <div className="mt-10 flex justify-center">
        <a href={DEV} className="v8-magnet group">
          <span className="v8-magnet-tilt">
            <span className="v8-metal [--v8-brush-offset:731px_988px] block px-4 py-2 font-mono text-[0.625rem] tracking-[0.1em] text-foreground uppercase group-hover:text-primary">
              {DEV_LABEL}
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
