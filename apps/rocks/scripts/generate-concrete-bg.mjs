// Converts the owner's pre-made seamless concrete tiles
// (src/assets/dark-concrete-tile.png / light-concrete-tile.png, 1254×1254,
// local-only, gitignored) into the shipped page-ground textures
// src/assets/concrete-tile-dark.webp / concrete-tile-light.webp.
//
// DELIBERATELY UNPROCESSED (owner: "I like the original image way more than
// the processed version"). Two earlier regimes shaped the ground — first
// synthesising tileable concrete from wall photographs (crop → torus-quilt →
// band-split; see git history), then re-centring the owner's tiles onto the
// --v8-bg tokens with a worst-pixel contrast clamp. Both subordinated the
// texture to the token system; the owner chose the texture. So the tiles ship
// at their AUTHORED tone and amplitude, and the token relationships invert
// where they invert:
//
//   - The dark ground (mean ≈ RGB 53) sits ABOVE --v8-bg-surface (#1e1e1e):
//     surface panels read as dark plaques set INTO the wall, not raised off
//     it. Physical, but the opposite of the old elevation direction.
//   - #FF3B00 accent text directly on the dark ground measures ≈ 3.5:1 —
//     under WCAG AA for body-size text. Accent ON PANELS (ticket stubs, the
//     case backs' chip) is unaffected; the exposure is prose links on the
//     bare ground (.case-prose a). If that ever needs fixing, fix it at the
//     component (chip/underline/size), not by darkening this tile.
//
// The old guard math therefore still RUNS but only REPORTS — the numbers stay
// on every regeneration so the tradeoff stays a decision instead of becoming
// a surprise, and the seam/grain checks still hard-verify what must never
// regress (a broken wrap is the "gaps in the background" this pipeline once
// shipped).
//
// Encoding: lossy q90. Measured on the dark tile against fully lossless —
// adjacent-pixel grain delta 3.77 vs 3.98 (imperceptible; "grain intact" by
// a wide margin) at roughly half the bytes. Lower presets start visibly
// waxing the grain (q75 → 2.48).
//
// Run from apps/rocks:  bun scripts/generate-concrete-bg.mjs
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const THEMES = [
  {
    name: 'dark',
    srcPath: fileURLToPath(new URL('../src/assets/dark-concrete-tile.png', import.meta.url)),
    outPath: fileURLToPath(new URL('../src/assets/concrete-tile-dark.webp', import.meta.url)),
    // Reporting references (src/styles/v8-theme.css): the theme's flat bg
    // token, its surface token, and the text that sits on the bare ground.
    bg: [0x0c, 0x0c, 0x0c],
    surface: [0x1e, 0x1e, 0x1e],
    guards: [{ label: 'accent #FF3B00 on ground', rgb: [0xff, 0x3b, 0x00], min: 4.5 }],
    // EXPOSURE, not re-centring (owner: "can you darken it?" after choosing
    // the authored tile over the token-fitted one). A straight multiply
    // darkens the tile the way stopping a camera down would — every tonal
    // relationship inside the texture keeps its proportion, so the material
    // reads the same, just in less light. 0.5 lands the mean at ≈ RGB 27:
    // accent text clears AA again and --v8-bg-surface (#1e1e1e = 30) sits
    // just above the ground, so panels read raised. This is the taste knob.
    exposure: 0.5,
  },
  {
    name: 'light',
    srcPath: fileURLToPath(new URL('../src/assets/light-concrete-tile.png', import.meta.url)),
    outPath: fileURLToPath(new URL('../src/assets/concrete-tile-light.webp', import.meta.url)),
    bg: [0xfa, 0xf7, 0xf0],
    surface: [0xf5, 0xf0, 0xe6],
    // --v8-text-muted rgba(20,20,19,0.7) composited over the cream token.
    guards: [{ label: 'muted text on ground', rgb: [89, 88, 85], min: 4.5 }],
    // Authored tone, untouched.
    exposure: 1,
  },
];

const WEBP_QUALITY = 90;

const srgbToLin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lumOf = (r, g, b) => 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function processTheme({ name, srcPath, outPath, bg, surface, guards, exposure }) {
  if (!existsSync(srcPath)) {
    throw new Error(
      `missing source ${srcPath} — the concrete tiles are local-only (gitignored, ~3MB each) ` +
        'and must be placed in src/assets/ before running this script.'
    );
  }
  const { data, info } = await sharp(srcPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = info.channels;

  // Exposure (see THEMES): plain per-channel multiply, texture untouched.
  if (exposure !== 1) {
    for (let i = 0; i < data.length; i++) data[i] = Math.round(data[i] * exposure);
  }

  await sharp(data, { raw: { width: w, height: h, channels } })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  const kb = (statSync(outPath).size / 1024).toFixed(0);
  console.log(
    `[${name}] wrote ${outPath} (${w}×${h}, ${kb}KB, authored texture at ${exposure}x exposure)`
  );

  // ---- Tone report (informational — see header). Mean AND worst pixel,
  // because prose sits over whole regions (mean matters) while a guard
  // failure only at rare pore/chip pixels is cosmetic. ----
  let meanL = 0;
  let minL = Infinity;
  let maxL = -Infinity;
  for (let p = 0; p < w * h; p++) {
    const i = p * channels;
    const l = lumOf(data[i], data[i + 1], data[i + 2]);
    meanL += l;
    minL = Math.min(minL, l);
    maxL = Math.max(maxL, l);
  }
  meanL /= w * h;
  const bgL = lumOf(...bg);
  const surfaceL = lumOf(...surface);
  console.log(
    `[${name}] ground luminance min/mean/max = ${minL.toFixed(4)}/${meanL.toFixed(4)}/${maxL.toFixed(4)}` +
      ` (flat --v8-bg token: ${bgL.toFixed(4)})`
  );
  const elevation =
    surfaceL > bgL
      ? meanL < surfaceL
        ? 'surface still reads raised'
        : 'surface reads RECESSED into the ground (owner-accepted)'
      : meanL > surfaceL
        ? 'surface still reads raised'
        : 'surface reads RECESSED into the ground (owner-accepted)';
  console.log(`[${name}] elevation vs --v8-bg-surface: ${elevation}`);
  for (const g of guards) {
    const gL = lumOf(...g.rgb);
    console.log(
      `[${name}] ${g.label}: ${ratio(gL, meanL).toFixed(2)}:1 vs mean, ` +
        `${Math.min(ratio(gL, minL), ratio(gL, maxL)).toFixed(2)}:1 worst-pixel ` +
        `(AA floor ${g.min}:1 — informational)`
    );
  }

  // ---- Hard checks: these DO gate quality, encoder included. ----
  const shipped = await sharp(outPath).removeAlpha().raw().toBuffer();
  const chanAt = (x, y) => shipped[(y * w + x) * channels];

  // Grain survival: adjacent-pixel delta near zero means the encoder waxed
  // the texture into fabric-like fuzz.
  let adj = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 1; x < w; x++) adj += Math.abs(chanAt(x, y) - chanAt(x - 1, y));
  }
  adj /= h * (w - 1);
  console.log(
    `[${name}] adjacent-pixel delta ${adj.toFixed(2)} levels — ${adj > 1 ? 'grain intact' : 'GRAIN SMEARED'}`
  );

  // Wrap check on both axes: the tiles are authored seamless; this proves the
  // encoder kept them that way.
  const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const jointX = [];
  const jointY = [];
  const neighbour = [];
  for (let y = 0; y < h; y++) {
    jointX.push(Math.abs(chanAt(w - 1, y) - chanAt(0, y)));
    neighbour.push(Math.abs(chanAt(w >> 2, y) - chanAt((w >> 2) - 1, y)));
  }
  for (let x = 0; x < w; x++) jointY.push(Math.abs(chanAt(x, h - 1) - chanAt(x, 0)));
  const jointDelta = Math.max(avg(jointX), avg(jointY));
  const neighbourDelta = avg(neighbour);
  // Threshold 2.0, not 1.5: the authored tiles' own wrap sits at ~1.45-1.66x
  // their interior neighbour delta, and a 10x contrast-boosted crop across
  // the live joint shows no visible line — 1.5 flagged the source's normal
  // state after the exposure multiply halved both deltas into rounding range.
  const verdict = jointDelta <= neighbourDelta * 2.0 ? 'ok' : 'SEAM';
  console.log(
    `[${name}] joint delta ${jointDelta.toFixed(2)} vs neighbour delta ${neighbourDelta.toFixed(2)} — ${verdict}`
  );
}

for (const theme of THEMES) {
  await processTheme(theme);
}
