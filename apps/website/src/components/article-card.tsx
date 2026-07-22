import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ArticleCardProps {
  title: string;
  abstract: string;
  categoryLabel: string;
  tags: string[];
  publishedAt: Date;
  slug: string;
  imageSrc?: string;
  locale: string;
}

export function ArticleCard({
  title,
  abstract,
  categoryLabel,
  tags,
  publishedAt,
  slug,
  imageSrc,
  locale,
}: ArticleCardProps) {
  const href = `${locale === 'de-de' ? '/de-de' : ''}/articles/${slug}/`;

  const dateLocale = locale === 'de-de' ? 'de-DE' : 'en-US';
  const formattedDate = publishedAt.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <a href={href} className="group flex h-full flex-col">
      <Card className="h-full gap-0 overflow-hidden border-border py-0 transition-colors hover:border-border-accent">
        {imageSrc && (
          <div className="shrink-0 overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition duration-400 ease-out [filter:var(--v8-photo-filter)] group-hover:scale-[1.03] group-hover:[filter:var(--v8-photo-filter-hover)]"
            />
          </div>
        )}
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase">
              {categoryLabel}
            </span>
            <span className="font-mono text-[10px] whitespace-nowrap text-muted-foreground">
              {formattedDate}
            </span>
          </div>

          <h2 className="font-display text-2xl leading-[1.1] text-foreground">{title}</h2>

          <p className="line-clamp-3 text-sm leading-relaxed font-light text-muted-foreground">
            {abstract}
          </p>

          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[10px] tracking-[0.05em] uppercase"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
