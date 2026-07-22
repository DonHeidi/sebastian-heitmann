import type { Strings } from '@/i18n/types';

export interface ArticleCtaProps {
  cta: Strings['article']['cta'];
  socials?: Array<{ platform: string; url: string }>;
  email?: string;
}

const platformNames: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  bluesky: 'Bluesky',
  twitter: 'Twitter',
  x: 'X',
  mastodon: 'Mastodon',
  threads: 'Threads',
  youtube: 'YouTube',
  instagram: 'Instagram',
};

type Node = { kind: 'text'; value: string } | { kind: 'link'; label: string; url: string };

export function ArticleCta({ cta, socials = [] }: ArticleCtaProps) {
  const items = socials.map(({ platform, url }) => ({
    label: platformNames[platform] ?? platform.charAt(0).toUpperCase() + platform.slice(1),
    url,
  }));

  const nodes: Node[] = [];
  if (items.length > 0) {
    nodes.push({ kind: 'text', value: `${cta.lead} ` });
    items.forEach((item, index) => {
      if (index > 0) {
        const isLast = index === items.length - 1;
        nodes.push({ kind: 'text', value: isLast ? ` ${cta.conjunction} ` : ', ' });
      }
      nodes.push({ kind: 'link', label: item.label, url: item.url });
    });
    nodes.push({ kind: 'text', value: '.' });
  }

  if (nodes.length === 0) {
    return null;
  }

  return (
    <p className="mt-8 font-sans text-[15px] leading-relaxed font-light text-muted-foreground italic">
      {nodes.map((node, i) =>
        node.kind === 'link' ? (
          <a
            key={i}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-1 underline-offset-[3px] transition-colors hover:text-primary"
          >
            {node.label}
          </a>
        ) : (
          <span key={i}>{node.value}</span>
        )
      )}
    </p>
  );
}
