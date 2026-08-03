import type { Strings } from '../i18n/types';

export interface CaseCardData {
  title: string;
  summary: string;
  kind: 'case-study' | 'project';
  role: string;
  stack: string[];
  links: { label: string; url: string }[];
  startDate: Date;
}

export interface CaseCardProps {
  data: CaseCardData;
  /** Detail-page href for case studies; ignored for kind === 'project'. */
  href: string;
  strings: Strings['cases'];
  /** 0-based position within its section; rendered as `01 /`. */
  index: number;
}

export function CaseCard({ data, href, strings, index }: CaseCardProps) {
  const external = data.kind === 'project' ? data.links[0] : undefined;
  return (
    <article className="reveal flex h-full flex-col border border-border bg-surface p-6 transition-colors hover:border-muted-foreground md:p-8">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
          {String(index + 1).padStart(2, '0')} /
        </span>
        <span className="rotate-2 border border-border px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
          {data.kind === 'case-study' ? strings.stampCaseStudy : strings.stampProject}{' '}
          {data.startDate.getUTCFullYear()}
        </span>
      </div>
      <h3 className="mt-4 font-[family-name:var(--v8-font-display)] text-3xl text-foreground">{data.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
      <dl className="mt-5 space-y-1">
        <div className="flex gap-2">
          <dt className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{strings.roleLabel}</dt>
          <dd className="font-mono text-[10px] text-foreground">{data.role}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{strings.stackLabel}</dt>
          <dd className="font-mono text-[10px] text-foreground">{data.stack.join(' · ')}</dd>
        </div>
      </dl>
      {data.kind === 'case-study' ? (
        <a href={href} className="mt-6 inline-block border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary">
          {strings.readCase}
        </a>
      ) : external ? (
        <a href={external.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block border border-border px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase transition-colors hover:border-primary hover:text-primary">
          {external.label}
        </a>
      ) : null}
    </article>
  );
}
