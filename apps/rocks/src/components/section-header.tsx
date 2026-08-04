import { AsteriskMark } from './asterisk-mark';

export interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="reveal">
      <h2 className="flex items-center gap-3 font-[family-name:var(--v8-font-poster)] text-2xl tracking-[0.02em] text-foreground uppercase md:text-3xl">
        <AsteriskMark size={18} tone="accent" className="v8-spin-hover" />
        {title}
      </h2>
      <div className="mt-3 h-[3px] w-full bg-primary" aria-hidden="true" />
    </div>
  );
}
