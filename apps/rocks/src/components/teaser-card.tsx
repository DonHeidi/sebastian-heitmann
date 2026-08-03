import type { BlogTeaser } from '../data/blog-teasers';

export interface TeaserCardProps {
  teaser: BlogTeaser;
  readOn: string;
}

export function TeaserCard({ teaser, readOn }: TeaserCardProps) {
  return (
    <article className="reveal flex h-full flex-col border border-border p-6 md:p-8">
      <h3 className="font-[family-name:var(--v8-font-display)] text-xl text-foreground">{teaser.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{teaser.teaser}</p>
      <a href={teaser.url} className="mt-5 font-mono text-[10px] tracking-[0.1em] text-primary uppercase no-underline transition-colors hover:text-foreground">
        {readOn} →
      </a>
    </article>
  );
}
