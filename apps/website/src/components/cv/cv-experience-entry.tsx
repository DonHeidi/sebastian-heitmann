import type { Strings } from '@/i18n/types';
import { CvHighlight } from './cv-highlight';

export interface CvExperienceEntryProps {
  entry: Strings['cv']['experience'][number];
}

export function CvExperienceEntry({ entry }: CvExperienceEntryProps) {
  return (
    <div className="cv-entry">
      <h2 className="cv-entry__role font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-foreground md:text-[24px]">
        {entry.role}
      </h2>
      {entry.company ? (
        <span className="cv-entry__company mt-0.5 mb-2 block font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
          {entry.company}
        </span>
      ) : null}
      <p className="cv-entry__description mb-2 max-w-[680px] font-sans text-[16px] leading-[1.6] font-light text-text-tertiary">
        {entry.description}
      </p>
      {entry.highlights?.length ? (
        <ul className="cv-entry__highlights flex max-w-[680px] list-none flex-col gap-1 p-0">
          {entry.highlights.map((h) => (
            <CvHighlight key={h.lead} highlight={h} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
