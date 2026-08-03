// Hand-crafted pixel-art guitarist mid-headbang. 24 wide x 28 tall logical
// pixels, two frames swapped via CSS visibility (see .v8-headbang in
// global.css) — motion-safe, static on frame 1 otherwise. No top hat: this
// is a generic punk-rock figure, not a likeness of any real musician.
//
// v2 (higher-resolution redraw): the original 16x20 grid was too coarse to
// fit hair + a guitar + a pose without everything reading as a smooth
// helmet-and-weapon robot. Bumped to 24x28 (viewBox only — nothing else
// about the API changes) specifically to give the hair room to be ragged
// and asymmetric instead of a rounded dome, and the guitar room to have a
// distinct headstock/neck/body silhouette instead of a uniform stripe.
export interface PixelRockerProps {
  /** Rendered height in px (width scales 24:28). */
  size: number;
  /** Headbang loop (motion-safe). Static frame 1 otherwise. */
  animated?: boolean;
}

// Legend: . empty, H hair, S skin, J jacket, A shirt-accent asterisk pixel,
// N guitar neck/headstock, G guitar body, B boots (also the tuning-peg
// dots on the headstock, at full brightness for visibility).
//
// Hair is deliberately NOT a smooth curve: uneven strand columns of
// different lengths hang past the jaw on both sides (longer on the right,
// per the shirt-accent placement below), with a jagged top edge and a
// couple of stray flyaway pixels. A small skin patch shows between the two
// hair curtains. Hair uses --v8-text-tertiary — a mid-tone in both themes,
// not the near-white --v8-text a rounded mass of which reads as a helmet.
//
// The guitar has a real instrument silhouette: a 2x3 headstock cluster
// with tuning-peg dots (upper-left, in the open margin), a thin 1px neck
// stepping diagonally down-right, and a bold body blob with a cutaway
// notch that crosses into the lower torso. The body is --v8-accent — the
// same brand-accent moment as the shirt patch, but positioned far enough
// away (hip-height vs. shoulder) that the two accent shapes never touch —
// so it can never be mistaken for the grey jacket, and the neck is
// --v8-text-secondary so it doesn't fuse with the boots below it.
//
// Frame 1: calm pose, hair falling naturally.
// Frame 2 (headbang): the hair mass drops (unevenly per side, reading as a
// forward tilt) and swings, covering more of the face; the free (right)
// arm throws straight up in the open margin — a genuinely 2px-wide
// forearm topped by a 4px fist bulge and two 1px "horns" fingers, not a
// 1px antenna. In both frames the torso/asterisk/guitar/legs/boots shape
// is painted AFTER the hair, so a dropped hair mass drapes convincingly
// past the shoulder instead of eating into the jacket's silhouette —
// that torso paint is byte-identical between frames; only the hair/face
// coverage and the arm (rows 0-11ish) differ.
const FRAME1 = [
  '......H.....H...H.......',
  '......HH.H.H..H.H.H.....',
  '.....HHH.HH..HH.HHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHHHSSSSHHHHH.....',
  '.....HHHH..SS..HHHH.....',
  '.....HH.H......HHHH.....',
  '.BN.H.H.HJJJJAAJHHH.....',
  '.NB...H..JJJJAAJH.H.....',
  '.BN......JJJJJJJH.HH....',
  '...N.....JJJJJJJH.H.....',
  '....N....JJJJJJJH.......',
  '.....N...JJJJJJJ........',
  '......N....GGGGJ........',
  '.......NNGGGGGGJ........',
  '.........GGGGGG.........',
  '.........GGGGGG.........',
  '..........JJ.JJ.........',
  '..........JJ.JJ.........',
  '..........JJ.JJ.........',
  '.........BBB.BBB........',
  '.........BBB.BBB........',
  '.........BBB.BBB........',
];
const FRAME2 = [
  '..................S..S..',
  '..................SSSS..',
  '..................SSSS..',
  '......H.....H......SS...',
  '......HH.H.H.......SS...',
  '.....HHH.HH..H..H..SS...',
  '.....HHHHHSSSSH.H.HSS...',
  '.....HHHHHSSSSH.HHHSS...',
  '.....HHHHHSSSSHHHHHSS...',
  '.....HHHHH.SS.HHHHHSS...',
  '.....HHHHH....HHHHHSS...',
  '.....HHHHH....HHHHH.....',
  '.BN..HHHHJJJJAAJHHH.....',
  '.NB..HHHHJJJJAAJHHH.....',
  '.BN..HH.HJJJJJJJHHH.....',
  '...NH.H.HJJJJJJJHHH.....',
  '....N.H..JJJJJJJHHH.....',
  '.....N...JJJJJJJHHH.....',
  '......N....GGGGJH.H.....',
  '.......NNGGGGGGJH.HH....',
  '.........GGGGGG.H.H.....',
  '.........GGGGGG.H.......',
  '..........JJ.JJ.........',
  '..........JJ.JJ.........',
  '..........JJ.JJ.........',
  '.........BBB.BBB........',
  '.........BBB.BBB........',
  '.........BBB.BBB........',
];

// Jacket uses the faintest text tint rather than --v8-bg-surface: the
// surface color is nearly indistinguishable from --v8-bg in dark mode,
// which made the torso vanish against the page background. Skin is full
// --v8-text (not --v8-text-secondary) so the face patch stays clearly
// brighter than the --v8-text-tertiary hair around it — text-secondary
// and text-tertiary are close enough in value that the face silently
// disappeared into the hair mass at small sizes.
const COLOR: Record<string, string> = {
  H: 'var(--v8-text-tertiary)',
  S: 'var(--v8-text)',
  J: 'var(--v8-text-faint)',
  A: 'var(--v8-accent)',
  N: 'var(--v8-text-secondary)',
  G: 'var(--v8-accent)',
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
  const width = (size * 24) / 28;
  return (
    <span
      className={`inline-block ${animated ? 'v8-headbang' : ''}`}
      style={{ width, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 28" width={width} height={size} shapeRendering="crispEdges" style={{ display: 'block' }}>
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
