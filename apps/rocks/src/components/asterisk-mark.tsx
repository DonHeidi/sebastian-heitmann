export interface AsteriskMarkProps {
  /** Rendered width/height in px. */
  size: number;
  /** Degrees; the mark's natural tilt is 8. */
  rotation?: number;
  tone?: 'accent' | 'ink' | 'faint';
  /** Render an accent ghost copy offset behind the mark (off-register print). */
  misregister?: boolean;
  /** Slow continuous rotation (motion-safe only). */
  spin?: boolean;
  className?: string;
}

const TONE: Record<NonNullable<AsteriskMarkProps['tone']>, string> = {
  accent: 'var(--v8-accent)',
  ink: 'var(--v8-text)',
  faint: 'var(--v8-border)',
};

// Six spokes, 60° apart, uneven lengths (44/36/42/38/45/37): hand-set, not the font glyph.
function spokes(stroke: string) {
  const lengths = [44, 36, 42, 38, 45, 37];
  return (
    <g stroke={stroke} strokeWidth={9} strokeLinecap="round">
      {lengths.map((len, i) => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={50 - Math.cos(a) * len * 0.18}
            y1={50 - Math.sin(a) * len * 0.18}
            x2={50 + Math.cos(a) * (len / 2)}
            y2={50 + Math.sin(a) * (len / 2)}
          />
        );
      })}
    </g>
  );
}

export function AsteriskMark({
  size,
  rotation = 8,
  tone = 'ink',
  misregister = false,
  spin = false,
  className = '',
}: AsteriskMarkProps) {
  return (
    <span
      className={`inline-block ${spin ? 'v8-spin-slow' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ transform: `rotate(${rotation}deg)`, display: 'block', overflow: 'visible' }}
      >
        {misregister && (
          <g transform="translate(3.5 3)" opacity={0.9}>
            {spokes('var(--v8-accent)')}
          </g>
        )}
        {spokes(TONE[tone])}
      </svg>
    </span>
  );
}
