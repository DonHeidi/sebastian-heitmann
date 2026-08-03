// Hand-crafted pixel-art guitarist mid-headbang. 16 wide x 20 tall logical
// pixels, two frames swapped via CSS visibility (see .v8-headbang in
// global.css) — motion-safe, static on frame 1 otherwise. No top hat: this
// is a generic punk-rock figure, not a likeness of any real musician.
export interface PixelRockerProps {
  /** Rendered height in px (width scales 16:20). */
  size: number;
  /** Headbang loop (motion-safe). Static frame 1 otherwise. */
  animated?: boolean;
}

// Legend: . empty, H hair, S skin, J jacket, A accent asterisk pixel,
// G guitar, B boots. Frame 1: head up, shoulder-length hair, mid-strum,
// guitar staircasing diagonally across the torso. Frame 2: head thrown
// forward and down, hair whipping wide with the headbang. Shoulders-down
// (rows 6-19) are identical between frames so only the head/hair swaps.
const FRAME1 = [
  '......HHHH......',
  '.....HHHHHH.....',
  '....HHSSSSHH....',
  '....HHSSSSHH....',
  '.....SSSSSS.....',
  '....HHSSSSHH....',
  '....JJJJJJJJ....',
  '....JJJJJJJJ....',
  '....JJJAAJJJ....',
  '...JJJJJJJJJJ...',
  '..GGGJJJJJJJJ...',
  '...GGGGJJJJJJ...',
  '....JGGGGJJJ....',
  '.....JJGGGG.....',
  '.........GGGG...',
  '.....JJ..JJ.....',
  '.....JJ..JJ.....',
  '.....JJ..JJ.....',
  '....BBB..BBB....',
  '....BBB..BBB....',
];
const FRAME2 = [
  '................',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '..HHHSSSSSSHHH..',
  '.HHHSSSSSSSSHHH.',
  '..HHHSSSSSSHHH..',
  '....JJJJJJJJ....',
  '....JJJJJJJJ....',
  '....JJJAAJJJ....',
  '...JJJJJJJJJJ...',
  '..GGGJJJJJJJJ...',
  '...GGGGJJJJJJ...',
  '....JGGGGJJJ....',
  '.....JJGGGG.....',
  '.........GGGG...',
  '.....JJ..JJ.....',
  '.....JJ..JJ.....',
  '.....JJ..JJ.....',
  '....BBB..BBB....',
  '....BBB..BBB....',
];

// Jacket uses the faintest text tint rather than --v8-bg-surface: the
// surface color is nearly indistinguishable from --v8-bg in dark mode,
// which made the torso vanish against the page background. The guitar
// uses the full-strength text color (matching hair/boots) so its
// diagonal stripe reads clearly against the darker jacket.
const COLOR: Record<string, string> = {
  H: 'var(--v8-text)',
  S: 'var(--v8-text-secondary)',
  J: 'var(--v8-text-faint)',
  A: 'var(--v8-accent)',
  G: 'var(--v8-text)',
  B: 'var(--v8-text)',
};

function Frame({ map }: { map: string[] }) {
  return (
    <>
      {map.flatMap((row, y) =>
        row
          .split('')
          .map((c, x) => (COLOR[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLOR[c]} /> : null))
      )}
    </>
  );
}

export function PixelRocker({ size, animated = false }: PixelRockerProps) {
  const width = (size * 16) / 20;
  return (
    <span
      className={`inline-block ${animated ? 'v8-headbang' : ''}`}
      style={{ width, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 20" width={width} height={size} shapeRendering="crispEdges" style={{ display: 'block' }}>
        <g className="v8-frame-1">
          <Frame map={FRAME1} />
        </g>
        <g className="v8-frame-2">
          <Frame map={FRAME2} />
        </g>
      </svg>
    </span>
  );
}
