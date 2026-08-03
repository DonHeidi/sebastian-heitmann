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
// G guitar, B boots. Rows 8-19 (torso, guitar, legs, boots) are identical
// between frames; only the head/hair/arm (rows 0-7) swap during the loop.
//
// Frame 1: calm strum pose. Hair is asymmetric — short-cropped on the
// left, a ragged strand hanging past the right shoulder — so it reads as
// hair, not a helmet dome. The guitar has a real instrument silhouette —
// a small headstock cluster, a thin neck, a hand bridge, and a bold body
// blob — held out in the open margin to the left of the torso (rather
// than crossing it) so the shape reads at full contrast against the page
// background instead of blending into the jacket or fusing with a limb.
//
// Frame 2: head thrown down and forward, hair whipping wide to the left
// with the headbang; the right arm is thrown straight up (fist), clearly
// outside the head/hair silhouette, to sell the headbang energy.
const FRAME1 = [
  '......HHHH......',
  '.....HHHHHH.....',
  '.....HHSSSH.....',
  '......SSSSHH....',
  '......SSSSHH....',
  '.....JJJJJJHH...',
  '....JJJJJJJJHH..',
  '...JJJJJJJJJJH..',
  '....JJJJJJJJ....',
  'GG..JJJAAJJJ....',
  'GGG.JJJJJJJJ....',
  '.GGSJJJJJJJJ....',
  '.GGGJJJJJJJJ....',
  'GGGGJJJJJJJJ....',
  'GGG.JJJJJJJJ....',
  '....JJJJJJJJ....',
  '....JJJJJJJJ....',
  '.....JJ..JJ.....',
  '....BBB..BBB....',
  '....BBB..BBB....',
];
const FRAME2 = [
  '................',
  '............S...',
  '..HHHHHHHH..S...',
  '.HHHHHHHHHH.S...',
  'HHHSSSSSSSHHS...',
  '.HHHSSSSSSHH....',
  '....JJJJJJJJS...',
  '...JJJJJJJJJJ...',
  '....JJJJJJJJ....',
  'GG..JJJAAJJJ....',
  'GGG.JJJJJJJJ....',
  '.GGSJJJJJJJJ....',
  '.GGGJJJJJJJJ....',
  'GGGGJJJJJJJJ....',
  'GGG.JJJJJJJJ....',
  '....JJJJJJJJ....',
  '....JJJJJJJJ....',
  '.....JJ..JJ.....',
  '....BBB..BBB....',
  '....BBB..BBB....',
];

// Jacket uses the faintest text tint rather than --v8-bg-surface: the
// surface color is nearly indistinguishable from --v8-bg in dark mode,
// which made the torso vanish against the page background. The guitar
// uses the same mid-tone as skin — bright enough to separate from the
// jacket, but deliberately not full white, so it can't fuse with the
// white boots directly below it into one shape.
const COLOR: Record<string, string> = {
  H: 'var(--v8-text)',
  S: 'var(--v8-text-secondary)',
  J: 'var(--v8-text-faint)',
  A: 'var(--v8-accent)',
  G: 'var(--v8-text-secondary)',
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
