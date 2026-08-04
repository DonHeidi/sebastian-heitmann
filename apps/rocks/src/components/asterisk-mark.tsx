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

// Rough hand-set spokes in the paint register of the GraffitiWord marks: each of the
// six spokes (60° apart, uneven lengths 44/36/42/38/45/37) is a filled irregular
// polygon — wobbled long edges, width swelling along the shaft, blunt slanted tips —
// plus a scatter of tiny paint flecks. Path data is baked once at module load from a
// seeded PRNG, so server and client render identical markup and the mark never
// shimmers between renders.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmt = (v: number) => (Math.round(v * 10) / 10).toString();

function bakeSpokes(seed: number): string {
  const rng = mulberry32(seed);
  const lengths = [44, 36, 42, 38, 45, 37];
  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 * Math.PI) / 180;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const nx = -uy;
    const ny = ux;
    const len = lengths[i];
    const rIn = -len * 0.18;
    const rOut = len / 2;
    const base = 4.2 + rng() * 1.1; // half-width; ~matches the old strokeWidth 9
    const amp = 0.6 + rng() * 0.9; // low-frequency swell along the shaft
    const phase = rng() * Math.PI;
    // blunt uneven tips: each outer corner overshoots by its own amount, so the
    // tip edge lands slanted instead of round-capped
    const tipL = 0.6 + rng() * 1.8;
    const tipR = 0.6 + rng() * 1.8;
    const segs = 4;
    const pts: Array<[number, number]> = [];
    const edge = (t: number, side: 1 | -1, tip: number) => {
      const r = rIn + (rOut - rIn) * t + (t === 1 ? tip : 0);
      const w =
        base +
        amp * Math.sin(Math.PI * t * 1.7 + phase + (side === -1 ? 1.3 : 0)) +
        (rng() - 0.5) * 1.4;
      pts.push([50 + ux * r + nx * w * side, 50 + uy * r + ny * w * side]);
    };
    for (let s = 0; s <= segs; s++) edge(s / segs, 1, tipL);
    for (let s = segs; s >= 0; s--) edge(s / segs, -1, tipR);
    parts.push('M' + pts.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join('L') + 'Z');
  }
  return parts.join(' ');
}

function bakeFlecks(seed: number): string {
  const rng = mulberry32(seed);
  const parts: string[] = [];
  for (let i = 0; i < 7; i++) {
    const ang = rng() * Math.PI * 2;
    const dist = 27 + rng() * 19; // just outside the spoke tips
    const cx = 50 + Math.cos(ang) * dist;
    const cy = 50 + Math.sin(ang) * dist;
    const n = 3 + Math.floor(rng() * 3);
    const r0 = 1 + rng() * 1.6;
    const pts: string[] = [];
    for (let k = 0; k < n; k++) {
      const t = (k / n) * Math.PI * 2 + (rng() - 0.5) * 0.9;
      const r = r0 * (0.6 + rng() * 0.8);
      pts.push(`${fmt(cx + Math.cos(t) * r)} ${fmt(cy + Math.sin(t) * r)}`);
    }
    parts.push('M' + pts.join('L') + 'Z');
  }
  return parts.join(' ');
}

const SPOKES_D = bakeSpokes(11);
const FLECKS_D = bakeFlecks(23);

function spokes(fill: string) {
  return <path fill={fill} d={SPOKES_D} />;
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
        {/* Flecks only at sizes where they read as paint spatter; below ~24px they
            collapse into stray dirt pixels and cost the mark its crispness. */}
        {size >= 24 && <path fill={TONE[tone]} opacity={0.55} d={FLECKS_D} />}
      </svg>
    </span>
  );
}
