import type { Strings } from '@/i18n/types';

export interface CvSectionProps {
  cv: Strings['cv'];
}

// Bullet-dash markers on highlight/activity list items (ported from the old
// `&::before` pseudo-element rule) — kept as a shared class so the print
// stylesheet's `.cv-entry__highlights li::before` / activity selectors keep
// matching regardless of which list renders them.
const dashBullet =
  "relative before:absolute before:left-0 before:h-px before:w-[5px] before:bg-muted-foreground before:content-['']";

export function CvSection({ cv }: CvSectionProps) {
  const lastExperienceIndex = cv.experience.length - 1;
  const lastEducationIndex = cv.education.length - 1;

  return (
    <section className="cv mx-auto max-w-[1440px] px-6 pt-[120px] pb-20 md:px-12 lg:px-20 lg:pt-[160px] lg:pb-[120px]">
      <div className="cv-header reveal mb-16 max-w-[720px] md:mb-[72px] lg:mb-24">
        <div className="cv-header__top flex items-start justify-between gap-8">
          <h1 className="cv-headline mb-6 font-display text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.02em] text-foreground">
            {cv.headline}
          </h1>
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
        {/* Print-only identity block — invisible on screen, styled entirely by cv-print.css */}
        <div className="cv-print-identity hidden">
          <p className="cv-print-name">{cv.print.name}</p>
          <p className="cv-print-address">{cv.print.address}</p>
          <p className="cv-print-contact">{cv.print.contact}</p>
        </div>
        <div className="cv-rule mb-8 h-0.5 w-12 bg-primary" />
        <p className="cv-summary max-w-[600px] font-sans text-[18px] leading-[1.7] font-light text-text-secondary">
          {cv.summary}
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="cv-experience reveal mb-16 md:mb-24" style={{ transitionDelay: '0.1s' }}>
        <div className="cv-section-header mb-12 flex items-center gap-6">
          <span className="cv-section-label shrink-0 font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
            {cv.experienceLabel}
          </span>
          <div className="cv-section-line h-px flex-1 bg-border" />
        </div>

        <div className="cv-timeline flex flex-col">
          {cv.experience.map((entry, i) => (
            <article
              key={`${entry.company}-${entry.period}`}
              className="cv-entry reveal grid grid-cols-1 md:grid-cols-[140px_32px_1fr] lg:grid-cols-[180px_32px_1fr]"
              style={{ transitionDelay: `${0.15 + i * 0.06}s` }}
            >
              <div className="cv-entry__aside flex flex-row items-baseline gap-3 pt-1 pb-2 text-left md:flex-col md:items-stretch md:gap-1 md:pt-1 md:pb-0 md:pr-6 md:text-right">
                <span className="cv-entry__period font-mono text-[13px] tracking-[0.02em] whitespace-nowrap text-foreground">
                  {entry.period}
                </span>
                <span className="cv-entry__location font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
                  {entry.location}
                </span>
              </div>
              <div className="cv-entry__marker hidden md:flex md:flex-col md:items-center">
                <span className="cv-entry__dot z-[1] mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span
                  className={`cv-entry__stem w-px flex-1 ${
                    i === lastExperienceIndex
                      ? 'bg-[linear-gradient(to_bottom,var(--v8-border)_60%,transparent)]'
                      : 'bg-border'
                  }`}
                />
              </div>
              <div
                className={`cv-entry__body border-l-2 border-border pb-10 pl-5 md:border-l-0 md:pb-12 md:pl-6 ${
                  i === 0
                    ? "max-md:[border-image:linear-gradient(to_bottom,var(--v8-accent),var(--v8-border)_40%)_1]"
                    : ''
                }`}
              >
                <h3 className="cv-entry__role mb-1.5 font-display text-[22px] leading-[1.15] tracking-[-0.01em] text-foreground md:text-[24px] lg:text-[28px]">
                  {entry.role}
                </h3>
                <span className="cv-entry__company mb-4 block font-mono text-[13px] tracking-[0.06em] text-primary uppercase">
                  {entry.company}
                </span>
                <p className="cv-entry__description mb-4 max-w-[640px] font-sans text-[17px] leading-[1.7] font-light text-text-tertiary">
                  {entry.description}
                </p>
                <ul className="cv-entry__highlights flex max-w-[640px] list-none flex-col gap-1.5 p-0">
                  {entry.highlights.map((h) => (
                    <li
                      key={h}
                      className={`${dashBullet} before:top-[10px] pl-4 font-sans text-[15px] leading-[1.6] font-light text-text-dim`}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Earlier positions fade into the timeline */}
        <div className="cv-earlier reveal mt-2 flex flex-col gap-3 border-t border-border pt-8 pl-0 md:pl-[172px] lg:pl-[212px]" style={{ transitionDelay: '0.5s' }}>
          <span className="cv-earlier__label mb-1 font-mono text-[12px] tracking-[0.12em] text-text-faint uppercase">
            {cv.earlierExperienceLabel}
          </span>
          {cv.earlierExperience.map((entry) => (
            <div
              key={`${entry.company}-${entry.period}`}
              className="cv-earlier__row flex flex-wrap items-baseline gap-[4px_12px] md:flex-nowrap md:gap-4"
            >
              <span className="cv-earlier__period shrink-0 font-mono text-[12px] tracking-[0.02em] text-text-faint">
                {entry.period}
              </span>
              <span className="cv-earlier__role font-sans text-[15px] font-light text-text-dim">{entry.role}</span>
              <span className="cv-earlier__company shrink-0 font-mono text-[11px] tracking-[0.04em] text-text-faint">
                {entry.company}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid: Everything Else */}
      <div className="bento reveal" style={{ transitionDelay: '0.2s' }}>
        <div className="cv-section-header mb-12 flex items-center gap-6">
          <span className="cv-section-label shrink-0 font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
            {cv.skillsLabel}
          </span>
          <div className="cv-section-line h-px flex-1 bg-border" />
        </div>

        <div className="bento-grid overflow-hidden bg-text-faint">
          {/* Skills: Technologies */}
          <div
            className="bento-cell bento-area--tech reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.25s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.skillGroups[0].label}
            </span>
            <div className="bento-tags flex flex-wrap gap-1.5">
              {cv.skillGroups[0].skills.map((skill) => (
                <span
                  key={skill}
                  className="bento-tag rounded-sm border border-border px-2.5 py-1 font-mono text-[13px] text-text-tertiary transition-[border-color,color] duration-200 hover:border-border-accent hover:text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills: Project Management */}
          <div
            className="bento-cell bento-area--pm reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.28s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.skillGroups[1].label}
            </span>
            <div className="bento-tags flex flex-wrap gap-1.5">
              {cv.skillGroups[1].skills.map((skill) => (
                <span
                  key={skill}
                  className="bento-tag rounded-sm border border-border px-2.5 py-1 font-mono text-[13px] text-text-tertiary transition-[border-color,color] duration-200 hover:border-border-accent hover:text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills: Architecture */}
          <div
            className="bento-cell bento-area--arch reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.31s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.skillGroups[2].label}
            </span>
            <div className="bento-tags flex flex-wrap gap-1.5">
              {cv.skillGroups[2].skills.map((skill) => (
                <span
                  key={skill}
                  className="bento-tag rounded-sm border border-border px-2.5 py-1 font-mono text-[13px] text-text-tertiary transition-[border-color,color] duration-200 hover:border-border-accent hover:text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div
            className="bento-cell bento-area--lang reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.34s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.languagesLabel}
            </span>
            <div className="bento-langs flex flex-col gap-4">
              {cv.languages.map((lang) => (
                <div key={lang.language} className="bento-lang flex flex-col gap-0.5">
                  <span className="bento-lang__name font-display text-[20px] leading-[1.2] text-foreground">
                    {lang.language}
                  </span>
                  <span className="bento-lang__level font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div
            className="bento-cell bento-area--soft reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.37s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.softSkillsLabel}
            </span>
            <div className="bento-tags flex flex-wrap gap-1.5">
              {cv.softSkills.map((skill) => (
                <span
                  key={skill}
                  className="bento-tag rounded-sm border border-border px-2.5 py-1 font-mono text-[13px] text-text-tertiary transition-[border-color,color] duration-200 hover:border-border-accent hover:text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div
            className="bento-cell bento-area--edu reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.3s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.educationLabel}
            </span>
            <div className="bento-edu-list flex flex-col gap-5">
              {cv.education.map((entry, i) => (
                <div
                  key={`${entry.institution}-${entry.period}`}
                  className={`bento-edu flex flex-col gap-0.5 ${
                    i === lastEducationIndex ? '' : 'border-b border-border pb-4'
                  }`}
                >
                  <span className="bento-edu__period font-mono text-[11px] tracking-[0.04em] text-text-faint">
                    {entry.period}
                  </span>
                  <span className="bento-edu__degree font-display text-[20px] leading-[1.25] text-foreground">
                    {entry.degree}
                  </span>
                  <span className="bento-edu__institution font-mono text-[11px] tracking-[0.06em] text-primary uppercase">
                    {entry.institution}
                  </span>
                  <p className="bento-edu__desc mt-1 font-sans text-[14px] leading-[1.5] font-light text-text-dim">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div
            className="bento-cell bento-area--cert reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.36s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.certificationsLabel}
            </span>
            <div className="bento-cert-list flex flex-col gap-4">
              <div className="bento-cert-focus flex flex-col gap-2.5 border-b border-border pb-4">
                <span className="bento-cert-focus__label font-mono text-[11px] tracking-[0.08em] text-text-faint uppercase">
                  {cv.currentFocusLabel}
                </span>
                <div className="bento-tags flex flex-wrap gap-1.5">
                  {cv.currentFocus.map((item) => (
                    <span
                      key={item}
                      className="bento-tag rounded-sm border border-border px-2.5 py-1 font-mono text-[13px] text-text-tertiary transition-[border-color,color] duration-200 hover:border-border-accent hover:text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {cv.certifications.map((cert) => (
                <div key={`${cert.name}-${cert.date}`} className="bento-cert flex flex-col gap-0.5">
                  <span className="bento-cert__name font-sans text-[15px] font-normal text-text-tertiary">
                    {cert.name}
                  </span>
                  <span className="bento-cert__meta font-mono text-[11px] tracking-[0.04em] text-text-faint">
                    {cert.issuer} &middot; {cert.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Community */}
          <div
            className="bento-cell bento-area--comm reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.39s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.communityLabel}
            </span>
            <div className="bento-community flex flex-col gap-5">
              <ul className="bento-community__activities flex list-none flex-col gap-1.5 border-b border-border p-0 pb-4">
                {cv.communityActivities.map((activity) => (
                  <li
                    key={activity}
                    className={`${dashBullet} before:top-[9px] pl-3.5 font-sans text-[15px] leading-[1.5] font-light text-text-tertiary`}
                  >
                    {activity}
                  </li>
                ))}
              </ul>
              <div className="bento-community__roles flex flex-col gap-2">
                {cv.communityRoles.map((entry) => (
                  <div key={`${entry.organization}-${entry.period}`} className="bento-community__role flex flex-col gap-px">
                    <span className="bento-community__role-name font-sans text-[14px] font-normal text-text-dim">
                      {entry.role}
                    </span>
                    <span className="bento-community__role-meta font-mono text-[11px] tracking-[0.04em] text-text-faint">
                      {entry.organization} &middot; {entry.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div
            className="bento-cell bento-area--interests reveal flex flex-col gap-5 bg-background p-8"
            style={{ transitionDelay: '0.42s' }}
          >
            <span className="bento-cell__label font-mono text-[12px] tracking-[0.12em] text-muted-foreground uppercase">
              {cv.interestsLabel}
            </span>
            <div className="bento-tags flex flex-wrap gap-1.5">
              {cv.interests.map((interest) => (
                <span
                  key={interest}
                  className="bento-tag rounded-sm border border-border px-2.5 py-1 font-mono text-[13px] text-text-tertiary transition-[border-color,color] duration-200 hover:border-border-accent hover:text-foreground"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
