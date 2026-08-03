export interface CvTagsProps {
  items: string[];
}

// The PDF's `.tag`: square, not rounded. Chips never wrap internally.
export function CvTags({ items }: CvTagsProps) {
  return (
    <div className="cv-tags flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="cv-tag border border-border px-2.5 py-1 font-mono text-[12px] whitespace-nowrap text-text-secondary transition-colors duration-200 hover:border-border-accent hover:text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
