import type { ReactNode } from 'react';
import { AuthorCard, type AuthorCardProps } from './author-card';
import { ArticleCta } from './article-cta';
import type { Strings } from '@/i18n/types';
import type { Locale } from '@/i18n/utils';

export interface ArticleViewAuthor {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  email?: string;
  socials?: AuthorCardProps['socials'];
}

export interface ArticleViewSeriesPart {
  slug: string;
  title: string;
  part: number;
}

export interface ArticleViewImage {
  src: string;
  width: number;
  height: number;
}

export interface ArticleViewProps {
  strings: Strings['article'];
  locale: Locale;
  categoryLabel: string;
  title: string;
  subline?: string;
  series?: { name: string; part: number };
  seriesParts: ArticleViewSeriesPart[];
  currentSlug: string;
  publishedDate: string;
  publishedISO: string;
  readingMinutes: number;
  heroImage?: ArticleViewImage;
  detailImage?: ArticleViewImage;
  authorship: 'human' | 'ai-assisted' | 'agent-written';
  aiTranslated: boolean;
  author?: ArticleViewAuthor;
  tags?: string[];
  backToAllHref: string;
  children: ReactNode;
}

function articleHref(locale: Locale, slug: string) {
  return `${locale === 'de-de' ? '/de-de' : ''}/articles/${slug}/`;
}

function AuthorshipLine({
  strings,
  authorship,
  aiTranslated,
}: {
  strings: Strings['article'];
  authorship: ArticleViewProps['authorship'];
  aiTranslated: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 font-mono text-[10px] tracking-[0.08em] text-text-faint uppercase">
      {authorship === 'human' && strings.authorship.human}
      {authorship === 'ai-assisted' && strings.authorship.aiAssisted}
      {authorship === 'agent-written' && strings.authorship.agentWritten}
      {aiTranslated && (
        <>
          <span aria-hidden="true" className="text-text-faint opacity-60">
            &middot;
          </span>
          <span>{strings.aiTranslated}</span>
        </>
      )}
    </div>
  );
}

export function ArticleView({
  strings,
  locale,
  categoryLabel,
  title,
  subline,
  series,
  seriesParts,
  currentSlug,
  publishedDate,
  publishedISO,
  readingMinutes,
  heroImage,
  detailImage,
  authorship,
  aiTranslated,
  author,
  tags,
  backToAllHref,
  children,
}: ArticleViewProps) {
  const hasHero = !!heroImage;
  const showSeries = !!series && seriesParts.length > 0;

  return (
    <main className="relative mx-auto max-w-[1440px]">
      {heroImage && (
        <div className="relative z-[1] mt-10 max-h-[clamp(240px,28vw,440px)] w-screen overflow-hidden [margin-inline:calc(50%_-_50vw)]">
          <img
            src={heroImage.src}
            alt={title}
            width={heroImage.width}
            height={heroImage.height}
            className="h-[clamp(240px,28vw,440px)] max-h-[clamp(240px,28vw,440px)] w-full object-cover"
          />
        </div>
      )}

      <div className="relative isolate z-[2] grid grid-cols-1 gap-0 px-0 pb-[60px] before:pointer-events-none before:absolute before:inset-y-0 before:-z-10 before:opacity-55 before:content-[''] before:[background-image:radial-gradient(circle_at_center,var(--v8-dot-color)_1px,transparent_1.5px)] before:[background-position:0_0] before:[background-size:24px_24px] before:[left:calc(50%_-_50vw)] before:[right:calc(50%_-_50vw)] md:px-20 md:pb-[120px] lg:grid-cols-[1fr_280px] lg:gap-16">
        <article
          className={`min-w-0 border border-[var(--v8-glass-border)] bg-[var(--v8-glass-bg)] px-6 pt-8 pb-9 shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-[24px] backdrop-saturate-[1.35] max-md:border-x-0 md:px-10 md:pt-10 md:pb-12 lg:col-start-1 lg:px-14 lg:pt-12 lg:pb-14 ${
            hasHero ? '-mt-16 md:-mt-[120px] lg:-mt-[220px]' : 'mt-6 md:mt-10 lg:mt-[60px]'
          }`}
        >
          <header
            className={`relative mb-14 border-b border-[var(--v8-glass-border)] pb-8 [text-shadow:1px_1px_0_rgba(255,255,255,0.7)] dark:[text-shadow:1px_1px_0_rgba(0,0,0,0.9)] ${
              detailImage ? 'min-h-[272px]' : ''
            } ${hasHero ? 'pt-2 lg:pt-0' : 'pt-4'}`}
          >
            {detailImage && (
              <img
                src={detailImage.src}
                alt={title}
                width={detailImage.width}
                height={detailImage.height}
                className={
                  hasHero
                    ? 'absolute top-0 right-[-180px] z-[3] size-[240px] max-lg:hidden border border-white/50 object-cover shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_30px_-10px_rgba(0,0,0,0.25)]'
                    : 'float-right mb-4 ml-6 size-[200px] max-lg:hidden border border-border object-cover shadow-[0_6px_20px_-8px_rgba(0,0,0,0.15)]'
                }
              />
            )}
            <div className="flex flex-col gap-3 pr-0 lg:pr-20">
              {series && showSeries && (
                <p className="mb-1 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
                  {series.name} &middot; {strings.seriesPartPrefix} {series.part} {strings.seriesPartOf}{' '}
                  {seriesParts.length}
                </p>
              )}
              <p className="mb-1 inline-flex items-center gap-3.5 font-mono text-xs tracking-[0.14em] text-primary uppercase before:h-0.5 before:w-14 before:bg-primary before:content-['']">
                {categoryLabel}
              </p>
              <h1 className="font-display text-[clamp(36px,5vw,56px)] leading-[1.05] font-normal text-foreground">
                {title}
              </h1>
              {subline && (
                <p className="text-lg leading-[1.5] font-light text-text-secondary">{subline}</p>
              )}
              <p className="mt-6 flex items-center gap-2.5 border-t border-border pt-5 font-mono text-xs tracking-[0.04em] text-muted-foreground">
                <time dateTime={publishedISO} className="font-mono text-xs text-muted-foreground">
                  {publishedDate}
                </time>
                <span aria-hidden="true" className="text-text-faint">
                  &middot;
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {readingMinutes} {strings.readingTimeSuffix}
                </span>
              </p>
            </div>
          </header>

          {/* Author block: visible on mobile/tablet (<1024px), hidden on desktop where the sidebar takes over. */}
          <div className="mb-12 flex flex-col gap-4 lg:hidden">
            {author && (
              <AuthorCard
                name={author.name}
                role={author.role}
                description={author.description}
                avatarSrc={author.avatarSrc}
                email={author.email}
                socials={author.socials}
                compactOnMobile
              />
            )}
            <AuthorshipLine strings={strings} authorship={authorship} aiTranslated={aiTranslated} />
          </div>

          <div
            className="max-w-none font-sans text-[17px] leading-[1.7] font-light text-text-secondary md:max-w-[53ch] md:text-2xl
              [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-[3px]
              [&_blockquote]:my-6 [&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:text-muted-foreground [&_blockquote]:italic
              [&_code]:rounded-[2px] [&_code]:bg-surface [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.9em]
              [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[36px] [&_h2]:leading-[1.15] [&_h2]:font-normal [&_h2]:text-foreground
              [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-[28px] [&_h3]:leading-[1.2] [&_h3]:font-normal [&_h3]:text-foreground
              [&_img]:h-auto [&_img]:max-w-full
              [&_li]:mb-2
              [&_ol]:mb-5 [&_ol]:pl-6
              [&_p]:mb-5
              [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-[2px] [&_pre]:bg-surface [&_pre]:p-5
              [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm
              [&_strong]:font-semibold [&_strong]:text-foreground
              [&_b]:font-semibold [&_b]:text-foreground
              [&_ul]:mb-5 [&_ul]:pl-6"
          >
            {children}
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-5 pb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase before:text-primary before:content-['+_']"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {series && showSeries && (
            <nav aria-label={strings.seriesNavLabel} className="mt-14 border-t border-foreground pt-7">
              <div className="mb-5 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {strings.seriesOverline}
                </span>
                <span className="font-display text-xl leading-[1.2] text-foreground">{series.name}</span>
              </div>
              <ol className="m-0 flex list-none flex-col p-0">
                {seriesParts.map((part) => (
                  <li
                    key={part.slug}
                    className="flex items-baseline gap-4 border-b border-border py-2.5 last:border-b-0"
                  >
                    <span
                      className={`shrink-0 font-mono text-[11px] tracking-[0.04em] ${
                        part.slug === currentSlug ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {String(part.part).padStart(2, '0')}
                    </span>
                    {part.slug === currentSlug ? (
                      <span className="font-sans text-[15px] text-foreground">{part.title}</span>
                    ) : (
                      <a
                        href={articleHref(locale, part.slug)}
                        className="font-sans text-[15px] text-text-tertiary no-underline transition-colors hover:text-foreground"
                      >
                        {part.title}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Author footer: only shown on the smallest viewports (<768px), below the article body. */}
          {author && (
            <div
              aria-label={strings.aboutAuthorLabel}
              role="complementary"
              className="hidden max-md:mt-14 max-md:block max-md:border-t max-md:border-border max-md:pt-8"
            >
              <AuthorCard
                name={author.name}
                role={author.role}
                description={author.description}
                avatarSrc={author.avatarSrc}
                email={author.email}
                socials={author.socials}
              />
            </div>
          )}

          <ArticleCta cta={strings.cta} socials={author?.socials} email={author?.email} />

          <div className="mt-8">
            <a
              href={backToAllHref}
              className="font-mono text-xs tracking-[0.05em] text-primary no-underline transition-opacity hover:opacity-70"
            >
              &larr; {strings.backToAll}
            </a>
          </div>
        </article>

        {/* Sidebar: sticky author card, desktop only (>=1024px). */}
        <aside
          aria-label={strings.aboutAuthorLabel}
          className="sticky top-[100px] mr-[-20px] hidden self-start pt-20 lg:col-start-2 lg:flex lg:flex-col lg:gap-4"
        >
          {author && (
            <AuthorCard
              name={author.name}
              role={author.role}
              description={author.description}
              avatarSrc={author.avatarSrc}
              email={author.email}
              socials={author.socials}
              className="bg-[var(--v8-glass-bg)] shadow-[0_1px_0_var(--v8-glass-highlight)_inset,0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-[24px] backdrop-saturate-[1.35]"
            />
          )}
          <AuthorshipLine strings={strings} authorship={authorship} aiTranslated={aiTranslated} />
        </aside>
      </div>
    </main>
  );
}
