/**
 * Decorative horizontal dotted rule used next to section eyebrow labels
 * (capabilities, situations, proof, featured-articles). Ports the shared
 * SCSS pattern:
 *   background-image: radial-gradient(circle, var(--v8-text-muted) 0.85px, transparent 1.4px);
 *   background-size: 6px 8px; background-repeat: repeat-x; background-position: 0 50%;
 */
export function DotRule({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-2 flex-1 bg-left bg-repeat-x opacity-85 ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle, var(--v8-text-muted) 0.85px, transparent 1.4px)',
        backgroundSize: '6px 8px',
      }}
    />
  );
}
