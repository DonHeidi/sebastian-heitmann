import type { ReactNode } from 'react';
import type { Strings } from '@/i18n/types';
import { CvRow } from './cv-row';
import { CvTags } from './cv-tags';
import { CvExperienceEntry } from './cv-experience-entry';

export interface CvSectionProps {
  cv: Strings['cv'];
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="cv-section-header mt-14 mb-8 flex items-center gap-4 md:mt-16 md:mb-10">
      <span className="cv-section-label shrink-0 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
        {children}
      </span>
      <span className="cv-section-line h-px flex-1 bg-border" />
    </div>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <span className="cv-group-label font-mono text-[10px] leading-[1.6] tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </span>
  );
}

export function CvSection({ cv }: CvSectionProps) {
  return (
    <section className="cv mx-auto max-w-[1100px] px-6 pt-[120px] pb-20 md:px-12 lg:px-20 lg:pt-[160px] lg:pb-[120px]">
      <header className="cv-header reveal">
        <div className="cv-header__top flex items-start justify-between gap-8">
          <div>
            <div className="cv-eyebrow mb-2 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
              {cv.headline}
            </div>
            <h1 className="cv-name font-display text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-foreground">
              {cv.identity.name}
            </h1>
            <div className="cv-contact mt-3 font-mono text-[12px] leading-[1.6] tracking-[0.04em] text-text-secondary">
              <p className="cv-contact__address">{cv.identity.address}</p>
              <p className="cv-contact__contact">{cv.identity.contact}</p>
            </div>
          </div>
          {/* Click handler lives in the CV pages' <script> — this component
              renders statically (no hydration), so a React onClick would be
              silently dropped from the emitted HTML. */}
          <button
            type="button"
            className="cv-download group mt-3 inline-flex shrink-0 items-center gap-2 border border-border bg-transparent px-5 py-2.5 transition-[border-color,gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-3 hover:border-primary"
          >
            <span className="cv-download__text font-mono text-[12px] tracking-[0.08em] text-foreground uppercase">
              {cv.downloadLabel}
            </span>
            <span className="cv-download__arrow text-[14px] text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5">
              &darr;
            </span>
          </button>
        </div>
        <p className="cv-summary mt-8 max-w-[860px] border-t border-border pt-6 font-sans text-[18px] leading-[1.65] font-light text-text-secondary">
          {cv.summary}
        </p>
      </header>

      {/* Experience */}
      <SectionLabel>{cv.experienceLabel}</SectionLabel>
      <div className="cv-experience flex flex-col gap-9">
        {cv.experience.map((entry) => (
          <CvRow
            key={`${entry.role}-${entry.period}`}
            side={entry.period}
            sideSub={entry.location}
            className="reveal"
          >
            <CvExperienceEntry entry={entry} />
          </CvRow>
        ))}
      </div>

      {/* Earlier positions */}
      <SectionLabel>{cv.earlierExperienceLabel}</SectionLabel>
      <div className="cv-earlier reveal flex flex-col gap-2">
        {cv.earlierExperience.map((entry) => (
          <CvRow key={`${entry.company}-${entry.period}`} side={entry.period}>
            <span className="cv-earlier__role font-sans text-[15px] font-normal text-text-tertiary">
              {entry.role}
            </span>
            <span className="cv-earlier__company ml-3 font-mono text-[11px] tracking-[0.08em] text-text-faint">
              {entry.company}
            </span>
          </CvRow>
        ))}
      </div>

      {/* Skills & Expertise — languages and soft skills live INSIDE this section */}
      <div className="cv-skills-break">
        <SectionLabel>{cv.skillsLabel}</SectionLabel>
      </div>
      <div className="cv-skills reveal flex flex-col gap-6">
        {cv.skillGroups.map((group) => (
          <CvRow key={group.label} side={<GroupLabel>{group.label}</GroupLabel>}>
            <CvTags items={group.skills} />
          </CvRow>
        ))}
        <CvRow side={<GroupLabel>{cv.languagesLabel}</GroupLabel>}>
          <div className="cv-langs flex flex-wrap gap-x-12 gap-y-4">
            {cv.languages.map((lang) => (
              <div key={lang.language} className="cv-lang">
                <div className="cv-lang__name font-display text-[20px] leading-[1.25] text-foreground">
                  {lang.language}
                </div>
                <div className="cv-lang__level font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  {lang.level}
                </div>
              </div>
            ))}
          </div>
        </CvRow>
        <CvRow side={<GroupLabel>{cv.softSkillsLabel}</GroupLabel>}>
          <p className="cv-plain-list font-sans text-[15px] leading-[1.6] font-light text-text-secondary">
            {cv.softSkills.join(' · ')}
          </p>
        </CvRow>
      </div>

      {/* Education */}
      <SectionLabel>{cv.educationLabel}</SectionLabel>
      <div className="cv-education reveal flex flex-col gap-6">
        {cv.education.map((entry) => (
          <CvRow key={`${entry.institution}-${entry.period}`} side={entry.period}>
            <div className="cv-edu">
              <div className="cv-edu__degree font-display text-[20px] leading-[1.25] text-foreground">
                {entry.degree}
              </div>
              <div className="cv-edu__institution mt-0.5 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
                {entry.institution}
              </div>
              <p className="cv-edu__desc mt-1 font-sans text-[14px] leading-[1.55] font-light text-text-dim">
                {entry.description}
              </p>
            </div>
          </CvRow>
        ))}
      </div>

      {/* Certifications */}
      <SectionLabel>{cv.certificationsLabel}</SectionLabel>
      <div className="cv-certifications reveal flex flex-col gap-5">
        {cv.certifications.map((cert) => (
          <CvRow key={`${cert.name}-${cert.date}`} side={cert.date}>
            <div className="cv-cert">
              <div className="cv-cert__name font-sans text-[15px] font-medium text-foreground">
                {cert.name}
              </div>
              <div className="cv-cert__issuer font-mono text-[11px] tracking-[0.06em] text-text-faint">
                {cert.issuer}
              </div>
            </div>
          </CvRow>
        ))}
      </div>

      {/* Community */}
      <SectionLabel>{cv.communityLabel}</SectionLabel>
      <div className="cv-community reveal flex flex-col gap-3">
        {cv.communityRoles.map((entry) => (
          <CvRow key={`${entry.organization}-${entry.period}`} side={entry.period}>
            <span className="cv-community__role font-sans text-[15px] font-normal text-text-tertiary">
              {entry.role}
            </span>
            <span className="cv-community__org ml-3 font-mono text-[11px] tracking-[0.08em] text-text-faint">
              {entry.organization}
            </span>
          </CvRow>
        ))}
        <CvRow className="mt-3" side={<GroupLabel>{cv.communityActivitiesLabel}</GroupLabel>}>
          <ul className="cv-activities flex list-none flex-col gap-1 p-0">
            {cv.communityActivities.map((activity) => (
              <li
                key={activity}
                className="cv-activity relative pl-4 font-sans text-[15px] leading-[1.6] font-light text-text-dim before:absolute before:top-[10px] before:left-0 before:h-[2px] before:w-[5px] before:bg-primary before:content-['']"
              >
                {activity}
              </li>
            ))}
          </ul>
        </CvRow>
      </div>

      {/* Interests */}
      <SectionLabel>{cv.interestsLabel}</SectionLabel>
      <div className="cv-interests reveal">
        <CvRow side="">
          <p className="cv-plain-list font-sans text-[15px] leading-[1.6] font-light text-text-secondary">
            {cv.interests.join(' · ')}
          </p>
        </CvRow>
      </div>
    </section>
  );
}
