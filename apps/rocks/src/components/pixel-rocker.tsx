// Hand-crafted pixel-art guitarist mid-headbang. 28 wide x 30 tall logical
// pixels, two frames swapped via CSS visibility (see .v8-headbang in
// global.css) — motion-safe, static on frame 1 otherwise. No top hat: this
// is a generic punk-rock figure, not a likeness of any real musician.
//
// v3 (silhouette-grammar redraw). The reads this drawing is built to hit,
// and the failure modes each choice guards against:
//
// - Hair sweeps to ONE side (viewer-right, ~80/20), so the head can never
//   scan as a symmetric helmet with a centered visor slit. The face patch
//   sits off-center-left, the top edge is ragged with detached flyaway
//   strand pixels, and head+hair (10 cols) stays narrower than the
//   shoulders (16 cols). Hair is --v8-text-tertiary — a mid value in both
//   themes; a near-white dome is what reads as a helmet.
// - The face is NEGATIVE SPACE (background), not a filled skin patch, with
//   a single eye pixel + mouth/chin in --v8-text. A filled patch inverts
//   badly across themes: near-black "skin" in light mode is a visor slit.
//   Negative space is theme-symmetric — shadowed face w/ bright eye (dark),
//   cream face w/ dark eye (light).
// - Open jacket, not a chestplate: faint lapel columns flank a shirt drawn
//   in --v8-bg with the accent asterisk (plus-shaped, 5 px) on it, and both
//   arms are separated from the torso by background columns.
// - The guitar is ONE connected silhouette angled across the body: 2x3
//   headstock (cols 4-5, well clear of the hair on the opposite side), a
//   contiguous 1px neck stepping diagonally down-right across the shirt, an
//   accent body slanted at the right hip that sticks out past the torso,
//   with a cutaway notch (empty cell at 15,14) where the neck joins, plus a
//   1px faint strap line parallel one row below the neck. The fretting hand
//   grips the neck below the headstock; frame 1's strumming hand rests on
//   the body's top edge.
// - Frame 2 (headbang): the head+hair mass drops two rows and the curtain
//   covers the face down to an eye sliver; the strumming arm throws up
//   rock horns with a real elbow — horizontal upper arm (r10, cols 19-22),
//   2px vertical forearm (cols 21-22, r5-9), 3x2 fist, two finger spikes —
//   never a 1px antenna line. Rows 15-29 are byte-identical to frame 1, so
//   the loop reads as one figure headbanging.
export interface PixelRockerProps {
  /** Rendered height in px (width scales 28:30). */
  size: number;
  /** Headbang loop (motion-safe). Static frame 1 otherwise. */
  animated?: boolean;
}

// Legend: . empty, H hair, S skin/hands (also eye + chin), J jacket/arms/
// strap/legs, W shirt (bg tone — dark tee), A accent asterisk, N guitar
// neck + headstock, G guitar body, B boots.
const FRAME1 = [
  '............................',
  '...........HH.HH.H..........', // ragged hair top + flyaway
  '..........HHHHHHHH..........',
  '....NN...H....HHHHH.........', // headstock; face = negative space
  '....NN...H.S..HHHHH.........', // eye pixel (11,4)
  '....NN...H....HHHHH.H.......', // stray strand (20,5)
  '....SSN.....S.HHHHHH........', // fret hand 4-5, neck (6,6), mouth (12,6)
  '....J..N....SSHHHHH.H.......', // fret arm (4,7), neck (7,7), chin
  '....J...N...SSHHHHH.........', // neck (8,8); figure's neck 12-13
  '.....JJJJNJJJJHHHHHJJ.......', // shoulders 5-20, guitar neck crosses (9,9)
  '.....JJ.JJNWWAWHHH.JJ.......', // arms split off torso; asterisk top
  '........JJWNAAAHHH.JJ.......', // asterisk arms 12-14, neck (11,11)
  '........JJJWNAWJHH.JJ.......', // strap (10,12), neck (12,12), asterisk bot
  '........JJWJWNWJJH.JJ.......', // strap (11,13), neck (13,13)
  '........JJWWJWNJGGGSS.......', // strap (12,14), neck join, body, strum hand
  '........JJWWWWWGGGGG........', // body widens past the torso edge
  '........JJJJJJGGGGGG........',
  '.........JJJJJGGGGG.........',
  '.........JJ..JJGGG..........', // legs start beside the body's tail
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '........BBB..BBB............',
  '........BBB..BBB............',
  '............................',
];
const FRAME2 = [
  '............................',
  '....................S.S.....', // finger spikes (rock horns)
  '....................S.S.....',
  '....NN.....HH.HH.H..SSS.....', // hair top dropped 2 rows; 3x2 fist
  '....NN....HHHHHHHH..SSS.....',
  '....NN...HHHHHHHHHH..JJ.....', // curtain covers the face; 2px forearm
  '....SSN..HHHHHHHHHH..JJ.....',
  '....J..N.HH.S.HHHHH..JJ.....', // eye sliver (12,7)
  '....J...N.H.SSHHHHH..JJ.....', // chin
  '.....JJJJNJJJJHHHHHHJJJ.....', // hair swings wider; elbow above shoulder
  '.....JJ.JJNWWAWHHHHJJJJ.....', // horizontal upper arm 19-22
  '........JJWNAAAHHHH.........',
  '........JJJWNAWJHHH.........',
  '........JJWJWNWJJHH.H.......', // stray strand (20,13)
  '........JJWWJWNJGGG.........', // strum hand gone — it's raised
  '........JJWWWWWGGGGG........', // rows 15+ byte-identical to frame 1
  '........JJJJJJGGGGGG........',
  '.........JJJJJGGGGG.........',
  '.........JJ..JJGGG..........',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '.........JJ..JJ.............',
  '........BBB..BBB............',
  '........BBB..BBB............',
  '............................',
];

// Jacket/limbs use the faintest text tint (never --v8-bg-surface, which is
// invisible against the page in dark mode). Shirt is an explicit --v8-bg
// fill so the open-jacket chest stays clean even over decorated backdrops.
// Guitar neck is secondary — bright enough to carry the diagonal, but not
// the full text tone, so it can't fuse with the boots or hands.
const COLOR: Record<string, string> = {
  H: 'var(--v8-text-tertiary)',
  S: 'var(--v8-text)',
  J: 'var(--v8-text-faint)',
  W: 'var(--v8-bg)',
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
  const width = (size * 28) / 30;
  return (
    <span
      className={`inline-block ${animated ? 'v8-headbang' : ''}`}
      style={{ width, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 30" width={width} height={size} shapeRendering="crispEdges" style={{ display: 'block' }}>
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
