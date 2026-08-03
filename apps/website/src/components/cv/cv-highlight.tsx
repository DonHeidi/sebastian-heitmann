import type { CvHighlight as CvHighlightData } from '@/i18n/types';

export interface CvHighlightProps {
  highlight: CvHighlightData;
}

// Accent dash marker — a 5x2 block, matching the PDF's `li::before`. Kept as a
// shared class so cv-print.css can target it without knowing the utilities.
const dashBullet =
  "relative before:absolute before:top-[10px] before:left-0 before:h-[2px] before:w-[5px] before:bg-primary before:content-['']";

export function CvHighlight({ highlight }: CvHighlightProps) {
  const { lead, leadLink, leadNote, omitColon, text, link, tech } = highlight;

  return (
    <li
      className={`cv-highlight ${dashBullet} pl-4 font-sans text-[15px] leading-[1.6] font-light text-text-dim`}
    >
      <strong className="cv-highlight__lead font-medium text-foreground">
        {lead}
        {leadLink ? (
          <>
            {' ('}
            <a className="underline underline-offset-2 hover:text-primary" href={leadLink.href}>
              {leadLink.label}
            </a>
            {')'}
          </>
        ) : null}
      </strong>
      {leadNote ? <span className="cv-highlight__note"> ({leadNote})</span> : null}
      {omitColon ? ' ' : ': '}
      {text}
      {link ? (
        <a className="cv-highlight__link underline underline-offset-2 hover:text-primary" href={link.href}>
          {link.label}
        </a>
      ) : null}
      {tech ? (
        <span className="cv-highlight__tech ml-1 font-mono text-[12px] tracking-[0.02em] text-muted-foreground">
          {tech.join(' · ')}
        </span>
      ) : null}
    </li>
  );
}
