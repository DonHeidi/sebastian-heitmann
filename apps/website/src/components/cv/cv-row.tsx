import type { ReactNode } from 'react';

export interface CvRowProps {
  /** Mono left column — a period, or a group label. */
  side: ReactNode;
  /** Second line beneath the side column, e.g. location. */
  sideSub?: ReactNode;
  children: ReactNode;
  className?: string;
}

// The PDF's single layout rhythm: a narrow mono column carrying date and
// location on the left, content on the right. Under 768px it collapses to one
// column, with the side column running horizontally above the body.
export function CvRow({ side, sideSub, children, className = '' }: CvRowProps) {
  return (
    <div
      className={`cv-row grid grid-cols-1 gap-x-8 md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] lg:gap-x-10 ${className}`}
    >
      <div className="cv-row__side flex flex-row items-baseline gap-3 pb-1.5 md:flex-col md:items-start md:gap-0.5 md:pt-[3px] md:pb-0">
        <span className="cv-row__period font-mono text-[12px] leading-[1.55] tracking-[0.04em] whitespace-nowrap text-foreground">
          {side}
        </span>
        {sideSub ? (
          <span className="cv-row__loc font-mono text-[11px] leading-[1.55] tracking-[0.04em] text-text-faint">
            {sideSub}
          </span>
        ) : null}
      </div>
      <div className="cv-row__body">{children}</div>
    </div>
  );
}
