// Generates src/assets/tear-mask.png — the photographic torn-paper luminance
// mask for the hero's bottom edge (task 20, owner directive: "using an image of
// an actual paper tear is better than using a polypath to cut it out") — and
// src/assets/tear-fiber.png — the same boundary band's fiber detail rendered
// as warm white over transparency (task 21, owner directive: "make the paper
// tear a bit more paper like by whitening the tear"). Both derivatives share
// one boundary construction and one canvas size, so overlaying the fiber PNG
// with the exact scaling used for the mask strip aligns them by construction.
//
// Source texture: TextureLabs "Paper 314" (small size)
//   https://texturelabs.org/wp-content/uploads/Texturelabs_Paper_314S.jpg
//   1920×1388, photographed torn-paper fiber lines on black.
//   License: texturelabs.org — free for commercial website use, no attribution
//   required, but REDISTRIBUTION OF THE ORIGINAL FILE IS BARRED, so the source
//   jpg must never be committed to this (public) repo. It is downloaded to the
//   OS temp dir at generation time; only this processed derivative (a
//   single-line grayscale mask, a transformative crop) is committed.
//
// What it does, deterministically (no randomness — same input bytes, same
// constants, same output):
//   1. Downloads the source to the OS temp dir (skipped when already cached).
//   2. Crops a band around the thickest full-width fiber line (the lower-left
//      chunky one — of the two full-width candidates it has the widest exposed
//      pulp, avg run thickness 14.7px vs 10.6 for the top line) and flips it
//      vertically: the line's macro shape is an arch (high center), and
//      mirrored it becomes a valley, so the poster keeps its paper lowest at
//      bottom-center where the hero's billing block sits.
//   3. Per column, finds the fiber boundary (first/last pixel above a
//      brightness threshold; gap columns interpolate from neighbors).
//   4. De-trends the macro drift: the raw line wanders ~217px top to bottom,
//      which at a 100%-width mask would swallow the whole billing zone. Each
//      column is shifted vertically by DETREND × its wide-Gaussian-smoothed
//      boundary offset from the mean — a smooth vertical shear that tames the
//      macro sweep while leaving the local fiber character untouched.
//   5. Renders the mask column by column: pure white above the boundary, pure
//      black below it, and across the fiber zone max(fiber's own grayscale,
//      a short white→black ramp) — the ramp guarantees the sheet never cuts
//      off in a hard aliased line where the photographed fiber is wispy, and
//      the fiber grayscale supplies the genuine ragged detail on top of it.
//
// Outputs, both 1920×{OUT_H}:
//   tear-mask.png  — 8-bit grayscale, consumed as a luminance mask
//     (`mask-mode: luminance`) in src/components/hero.tsx. The top
//     WHITE_MARGIN rows are guaranteed pure white so the full-white gradient
//     layer above the strip can overlap into it without a seam (see the
//     HERO_MASK comment there).
//   tear-fiber.png — RGBA, a constant warm paper-white whose ALPHA is the
//     fiber zone's contrast-stretched grayscale (transparent outside the
//     zone). Overlaid additively on the torn edge it turns the ragged fringe
//     into exposed white pulp; per-theme strength lives in CSS. The tint is
//     baked here (not tinted in CSS) and fills every pixel — including fully
//     transparent ones — so downscaling never blends toward black fringes.
//
// Run from apps/rocks:  bun scripts/generate-tear-mask.mjs
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SOURCE_URL = 'https://texturelabs.org/wp-content/uploads/Texturelabs_Paper_314S.jpg';
const CACHE_PATH = path.join(os.tmpdir(), 'Texturelabs_Paper_314S.jpg');
const OUT_PATH = fileURLToPath(new URL('../src/assets/tear-mask.png', import.meta.url));
const FIBER_OUT_PATH = fileURLToPath(new URL('../src/assets/tear-fiber.png', import.meta.url));

// Band around the chosen fiber line (probed: boundary spans y 1009–1234 in the
// source; 996+252 leaves ≥13px of clean black on both sides). A second, faint
// line fragment grazes the band's bottom-left — harmless, because the render
// step only ever emits what the per-column boundary construction decides.
const BAND = { left: 0, top: 996, width: 1920, height: 252 };
const FIBER_THRESHOLD = 44; // > jpeg noise on the black ground (< ~25)
const SMOOTH_SIGMA = 260; // px — wide enough to catch only the macro sweep
const DETREND = 0.65; // fraction of the macro sweep to remove
const WHITE_MARGIN = 34; // guaranteed pure-white rows at the top
const BLACK_MARGIN = 16; // guaranteed pure-black rows at the bottom
// Contrast stretch for the fiber grayscale: lifts the pulp toward solid paper.
const STRETCH_LO = 26;
const STRETCH_HI = 215;
// Warm paper-white for tear-fiber.png (pure white read clinical against the
// cream/near-black poster tones; this leans slightly toward the paper).
const FIBER_TINT = { r: 255, g: 248, b: 238 };
// Guaranteed whitening right at the cut: where the photographed fiber goes
// wispy, the MASK's edge is defined by its synthetic ramp — the fiber
// grayscale alone leaves those stretches unwhitened (black-on-black in dark
// theme, iter1). A short alpha ramp from the boundary guarantees a thin soft
// white line everywhere along the cut; the fiber detail still dominates
// wherever real pulp exists (max composition).
const EDGE_ALPHA = 195; // peak alpha of the guaranteed edge line
const EDGE_LEN_FRACTION = 0.6; // of the mask ramp length, clamped 3–8px

async function ensureSource() {
  if (existsSync(CACHE_PATH)) return;
  console.log(`downloading ${SOURCE_URL}`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
  await writeFile(CACHE_PATH, Buffer.from(await res.arrayBuffer()));
}

await ensureSource();

const { data, info } = await sharp(CACHE_PATH)
  .extract(BAND)
  .grayscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
// Vertical flip is done at sampling time: row y of the working band is source
// row H-1-y (turning the line's arch into a valley, see header).
const px = (x, y) => data[(H - 1 - y) * W + x];

// --- per-column fiber boundary -------------------------------------------
// A column can contain, besides the chosen line, stray specks and the faint
// second line fragment that grazes the band's corner — naive first/last-bright
// detection latches onto those and renders black streaks through the white
// zone. Instead: split each column into bright runs (bridging gaps up to
// RUN_GAP, so one wispy fiber cluster stays one run) and keep the run with the
// largest brightness mass — the photographed pulp line is far heavier than any
// stray speck.
const RUN_GAP = 10;
const y0s = new Float64Array(W).fill(-1); // first fiber row of the main run
const y1s = new Float64Array(W).fill(-1); // last fiber row of the main run
for (let x = 0; x < W; x++) {
  let best = null; // { y0, y1, mass }
  let cur = null;
  let gap = 0;
  for (let y = 0; y < H; y++) {
    const v = px(x, y);
    if (v > FIBER_THRESHOLD) {
      if (cur === null) cur = { y0: y, y1: y, mass: 0 };
      cur.y1 = y;
      cur.mass += v;
      gap = 0;
    } else if (cur !== null && ++gap > RUN_GAP) {
      if (best === null || cur.mass > best.mass) best = cur;
      cur = null;
    }
  }
  if (cur !== null && (best === null || cur.mass > best.mass)) best = cur;
  if (best !== null && best.y1 > best.y0) {
    y0s[x] = best.y0;
    y1s[x] = best.y1;
  }
}
// Interpolate columns where the photographed line thins out to nothing.
for (const arr of [y0s, y1s]) {
  let prev = -1;
  for (let x = 0; x < W; x++) {
    if (arr[x] >= 0) {
      if (prev < 0 && x > 0) arr.fill(arr[x], 0, x); // leading gap: hold level
      else if (prev >= 0 && x - prev > 1) {
        for (let i = prev + 1; i < x; i++)
          arr[i] = arr[prev] + ((arr[x] - arr[prev]) * (i - prev)) / (x - prev);
      }
      prev = x;
    }
  }
  if (prev < 0) throw new Error('no fiber found in band — wrong crop?');
  if (prev < W - 1) arr.fill(arr[prev], prev + 1); // trailing gap: hold level
}

// --- de-trend the macro sweep --------------------------------------------
const centers = Float64Array.from({ length: W }, (_, x) => (y0s[x] + y1s[x]) / 2);
const kernelR = Math.ceil(SMOOTH_SIGMA * 3);
const kernel = Float64Array.from({ length: 2 * kernelR + 1 }, (_, i) => {
  const d = i - kernelR;
  return Math.exp(-(d * d) / (2 * SMOOTH_SIGMA * SMOOTH_SIGMA));
});
const smooth = new Float64Array(W);
for (let x = 0; x < W; x++) {
  let acc = 0;
  let wsum = 0;
  for (let i = -kernelR; i <= kernelR; i++) {
    const xi = x + i;
    if (xi < 0 || xi >= W) continue; // renormalized at the edges
    const k = kernel[i + kernelR];
    acc += centers[xi] * k;
    wsum += k;
  }
  smooth[x] = acc / wsum;
}
const mean = smooth.reduce((s, v) => s + v, 0) / W;
const shift = Int32Array.from(smooth, (v) => Math.round(DETREND * (v - mean)));

// --- render ----------------------------------------------------------------
// Column x maps working row y to de-trended row y - shift[x]; the output box
// is sized so the de-trended fiber zone sits between the two margins.
let minY0 = Infinity;
let maxY1 = -Infinity;
for (let x = 0; x < W; x++) {
  minY0 = Math.min(minY0, y0s[x] - shift[x]);
  maxY1 = Math.max(maxY1, y1s[x] - shift[x]);
}
const base = Math.round(minY0) - WHITE_MARGIN; // working-row offset of output row 0
const OUT_H = Math.ceil(maxY1) - base + BLACK_MARGIN;
const stretch = (v) =>
  Math.max(0, Math.min(255, Math.round(((v - STRETCH_LO) * 255) / (STRETCH_HI - STRETCH_LO))));

const out = new Uint8Array(W * OUT_H);
// tear-fiber.png: constant warm tint everywhere, alpha only in the fiber zone.
const fiberOut = new Uint8Array(W * OUT_H * 4);
for (let i = 0; i < W * OUT_H; i++) {
  fiberOut[i * 4] = FIBER_TINT.r;
  fiberOut[i * 4 + 1] = FIBER_TINT.g;
  fiberOut[i * 4 + 2] = FIBER_TINT.b;
}
for (let x = 0; x < W; x++) {
  const oy0 = y0s[x] - shift[x] - base;
  const oy1 = y1s[x] - shift[x] - base;
  // Short guaranteed ramp through the fiber zone (see header, step 5).
  const ramp = Math.max(5, Math.min(18, (oy1 - oy0) * 0.5));
  for (let oy = 0; oy < OUT_H; oy++) {
    let v;
    if (oy < oy0) v = 255;
    else if (oy > oy1) v = 0;
    else {
      const sy = oy + base + shift[x]; // back to working-band row
      const fiber = stretch(px(x, sy));
      const rampV = Math.max(0, Math.round(255 * (1 - (oy - oy0) / ramp)));
      v = Math.max(fiber, rampV);
      // Whitening alpha: the fiber's own brightness (bright pulp goes solid
      // white, wisps translucent) floored by a short guaranteed edge line at
      // the cut (see EDGE_ALPHA) so no stretch of the tear stays unwhitened.
      const edgeLen = Math.max(3, Math.min(8, ramp * EDGE_LEN_FRACTION));
      const edgeV = Math.max(0, Math.round(EDGE_ALPHA * (1 - (oy - oy0) / edgeLen)));
      fiberOut[(x + oy * W) * 4 + 3] = Math.max(fiber, edgeV);
    }
    out[x + oy * W] = v;
  }
}

await mkdir(path.dirname(OUT_PATH), { recursive: true });
await sharp(out, { raw: { width: W, height: OUT_H, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT_PATH);
await sharp(fiberOut, { raw: { width: W, height: OUT_H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(FIBER_OUT_PATH);

const spanPx = Math.ceil(maxY1 - minY0);
console.log(`wrote ${OUT_PATH}`);
console.log(`wrote ${FIBER_OUT_PATH}`);
console.log(
  `size ${W}×${OUT_H} (fiber span ${spanPx}px, margins ${WHITE_MARGIN}/${BLACK_MARGIN}, aspect ${(OUT_H / W).toFixed(5)})`
);
