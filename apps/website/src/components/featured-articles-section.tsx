import { ArticleCard } from './article-card';
import { DotRule } from './dot-rule';
import type { Strings } from '@/i18n/types';
import type { Locale } from '@/i18n/utils';

export interface FeaturedArticleItem {
  title: string;
  abstract: string;
  categoryLabel: string;
  tags: string[];
  publishedAt: Date;
  slug: string;
  imageSrc?: string;
}

export interface FeaturedArticlesSectionProps {
  articles: FeaturedArticleItem[];
  strings: Strings['featuredArticles'];
  locale: Locale;
  viewAllHref: string;
  totalCount?: number;
}

export function FeaturedArticlesSection({
  articles,
  strings,
  locale,
  viewAllHref,
  totalCount,
}: FeaturedArticlesSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section id="writing" className="mx-auto max-w-[1440px] border-t border-border py-12 px-6 md:px-12 lg:py-[120px] lg:px-20">
      <div className="flex flex-col gap-12">
        <div className="reveal flex items-center gap-6">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            {strings.label}
          </span>
          <DotRule />
          <a
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-primary uppercase no-underline transition-opacity hover:opacity-70"
          >
            {strings.viewAllLabel}
            {totalCount != null && (
              <span className="border border-border px-[7px] py-0.5 font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
                {totalCount}
              </span>
            )}
            &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          {articles.map((article, i) => (
            <div key={article.slug} className="reveal" style={{ transitionDelay: `${Math.min(i * 80, 240)}ms` }}>
              <ArticleCard
                title={article.title}
                abstract={article.abstract}
                categoryLabel={article.categoryLabel}
                tags={article.tags}
                publishedAt={article.publishedAt}
                slug={article.slug}
                imageSrc={article.imageSrc}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
