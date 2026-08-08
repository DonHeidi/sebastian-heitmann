// Generates src/assets/concrete-tile-dark.webp and concrete-tile-light.webp —
// seamlessly tileable, contrast-tamed page-background textures for the `body`
// ground plane (owner: "I added the concrete dark and light to give a
// rougher texture for the background... the background is slightly clean
// which doesn't necessarily fit the theme").
//
// Sources: src/assets/concrete-dark.png / concrete-light.png — poured-concrete
// wall photographs supplied by the owner (1672×941, ~2.5MB each). These are
// NOT committed (see .gitignore) — only the processed derivatives below are.
// Regenerating requires the two source PNGs to be present locally.
//
// Pipeline, deterministic (same input bytes, same constants, same output):
//   1. Crop a square region from the source, centered and clear of the
//      photograph's vignetted corners, then downscale to TILE px. The
//      downscale itself softens photographic grain to a "reads as
//      roughness, not a photo" level appropriate for a background that must
//      never compete with the hero poster, jewel-case tiles or device
//      showcase.
//   2. Contrast-compress the crop toward its own mean by COMPRESS_K. This
//      pulls in local highlight/shadow mottling so no patch of the tiled
//      background strays far from the theme's base color — the mechanism
//      that keeps body-text contrast comfortable (see the task report for
//      measured ratios). It also reads as "poured concrete", not "cracked
//      concrete": a shallower, evener texture.
//   3. Make it seamlessly tileable via a torus roll + seam-hiding blur, the
//      "offset/mirror-blend" technique: shift the tile by half its size in
//      both axes (wrapping). The rolled tile's own edges are now two columns
//      (rows) that were ADJACENT in the source, so they already tile
//      losslessly — the roll only relocates the source's original,
//      non-matching left/right and top/bottom edges to a cross seam through
//      the middle. That seam is then hidden by compositing in a heavily
//      blurred copy of the same rolled tile, but only along a feathered
//      plus-sign band centered on the seam — far from the seam the sharp
//      rolled pixels are untouched, so the tile's outer edges (the ones that
//      actually matter for tiling) are never blurred.
//   4. Tint: alpha-composite the tile over the theme's flat --v8-bg color
//      (TINT_ALPHA) — "an overlay tint toward the theme bg" per the spec.
//      The tint is baked into the pixels here (not applied as a CSS
//      blend/opacity at runtime, the tear-mask/tear-fiber precedent) so the
//      shipped file's pixels ARE the final on-page color and contrast is a
//      measurable property of the file, not a runtime blend-mode guess.
//   5. Export as WEBP (lossy) — a background texture tolerates aggressive
//      compression; it only needs to read as roughness.
//
// Run from apps/rocks:  bun scripts/generate-concrete-bg.mjs
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const THEMES = [
  {
    name: 'dark',
    srcPath: fileURLToPath(new URL('../src/assets/concrete-dark.png', import.meta.url)),
    outPath: fileURLToPath(new URL('../src/assets/concrete-tile-dark.webp', import.meta.url)),
    // --v8-bg, dark theme (src/styles/v8-theme.css) — near-black.
    bg: [0x0c, 0x0c, 0x0c],
    // Dark theme has huge headroom (near-black bg vs near-white text), so the
    // texture can sit fairly strong and still read as "texture, not stain".
    // (The photographed concrete's own local contrast is quite low —
    // measured stdev ≈5.6/255 on the source crop — so compression stays
    // mild; tintAlpha carries most of the visible strength.)
    compressK: 0.85,
    tintAlpha: 0.75,
  },
  {
    name: 'light',
    srcPath: fileURLToPath(new URL('../src/assets/concrete-light.png', import.meta.url)),
    outPath: fileURLToPath(new URL('../src/assets/concrete-tile-light.webp', import.meta.url)),
    // --v8-bg, light theme (src/styles/v8-theme.css) — warm cream.
    bg: [0xfa, 0xf7, 0xf0],
    // Light theme is the contrast risk (spec): cream-to-concrete is a bigger
    // luminance jump than dark's, and muted-foreground text is already close
    // to the AA floor against the plain cream bg (measured baseline 4.70:1).
    // tintAlpha is kept low so the shipped background never drags that below
    // ~4.5:1 (see the task report for the full measured range).
    compressK: 0.85,
    tintAlpha: 0.25,
  },
];

// Crop is square (so the tile repeats identically in both axes) and centered,
// staying inside the source's mild vignette rather than reaching into it.
const CROP_SIZE = 900;
// Shipped tile resolution. Small enough to keep the file light and to blur
// out photographic grain; large enough that the repeat isn't obvious at
// typical viewport widths.
const TILE = 640;
// Seam-hiding blur: wide enough to fully dissolve the relocated cross seam
// against this texture's low local contrast.
const SEAM_BLUR_SIGMA = 18;
// Half-width of the feathered band (in tile px) around the seam that blends
// toward the blurred copy; 0 at the band's outer edge, 1 exactly on the seam.
const SEAM_FEATHER = 70;
const WEBP_QUALITY = 82;

async function loadSquareTile(srcPath) {
  if (!existsSync(srcPath)) {
    throw new Error(
      `missing source ${srcPath} — the raw concrete photographs are local-only ` +
        '(gitignored, ~2.5MB each) and must be placed in src/assets/ before running this script.'
    );
  }
  const meta = await sharp(srcPath).metadata();
  const left = Math.round((meta.width - CROP_SIZE) / 2);
  const top = Math.round((meta.height - CROP_SIZE) / 2);
  const { data, info } = await sharp(srcPath)
    .extract({ left, top, width: CROP_SIZE, height: CROP_SIZE })
    .resize(TILE, TILE)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

/** Torus roll by (w/2, h/2): moves the crop's non-matching outer edges to a
 * cross seam through the middle; the rolled tile's own outer edges become two
 * source columns/rows that were adjacent pre-roll, so they already tile. */
function rollHalf(data, w, h, channels) {
  const out = new Uint8Array(data.length);
  const sx = Math.floor(w / 2);
  const sy = Math.floor(h / 2);
  for (let y = 0; y < h; y++) {
    const srcY = (y + sy) % h;
    for (let x = 0; x < w; x++) {
      const srcX = (x + sx) % w;
      const srcI = (srcY * w + srcX) * channels;
      const dstI = (y * w + x) * channels;
      for (let c = 0; c < channels; c++) out[dstI + c] = data[srcI + c];
    }
  }
  return out;
}

/** Pulls each pixel toward the buffer's own per-channel mean by factor k
 * (0 = flat mean, 1 = untouched) — tames highlight/shadow extremes. */
function compressTowardMean(data, channels, k) {
  const mean = new Float64Array(channels);
  const n = data.length / channels;
  for (let i = 0; i < data.length; i++) mean[i % channels] += data[i];
  for (let c = 0; c < channels; c++) mean[c] /= n;
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const c = i % channels;
    out[i] = Math.max(0, Math.min(255, Math.round(mean[c] + (data[i] - mean[c]) * k)));
  }
  return out;
}

/** 0 on the seam (x=w/2 or y=h/2), rising linearly to 1 at SEAM_FEATHER px
 * away, clamped — a feathered plus-sign mask, zero at the tile's own edges. */
function seamMask(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const mask = new Float64Array(w * h);
  for (let y = 0; y < h; y++) {
    const dy = Math.abs(y - cy);
    for (let x = 0; x < w; x++) {
      const dx = Math.abs(x - cx);
      const d = Math.min(dx, dy); // distance to the nearer seam line
      mask[y * w + x] = Math.min(1, d / SEAM_FEATHER);
    }
  }
  return mask;
}

async function processTheme({ name, srcPath, outPath, bg, compressK, tintAlpha }) {
  const { data, width: w, height: h, channels } = await loadSquareTile(srcPath);
  const compressed = compressTowardMean(data, channels, compressK);
  const rolled = rollHalf(compressed, w, h, channels);

  const blurred = await sharp(rolled, { raw: { width: w, height: h, channels } })
    .blur(SEAM_BLUR_SIGMA)
    .raw()
    .toBuffer();

  const mask = seamMask(w, h);
  const final = new Uint8Array(w * h * channels);
  for (let p = 0; p < w * h; p++) {
    const keepSharp = mask[p]; // 1 = far from seam, keep the rolled pixel
    for (let c = 0; c < channels; c++) {
      const i = p * channels + c;
      const blended = rolled[i] * keepSharp + blurred[i] * (1 - keepSharp);
      final[i] = Math.max(0, Math.min(255, Math.round(bg[c] * (1 - tintAlpha) + blended * tintAlpha)));
    }
  }

  await sharp(final, { raw: { width: w, height: h, channels } })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  // Diagnostics: min/mean/max luminance of the shipped tile, for the
  // contrast-ratio report (WCAG relative luminance, sRGB).
  const srgbToLin = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = (r, g, b) => 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
  let minL = Infinity;
  let maxL = -Infinity;
  let sumL = 0;
  let sumL2 = 0;
  for (let p = 0; p < w * h; p++) {
    const i = p * channels;
    const l = lum(final[i], final[i + 1], final[i + 2]);
    minL = Math.min(minL, l);
    maxL = Math.max(maxL, l);
    sumL += l;
    sumL2 += l * l;
  }
  const n = w * h;
  const meanL = sumL / n;
  const sdL = Math.sqrt(sumL2 / n - meanL * meanL);
  console.log(`[${name}] wrote ${outPath}`);
  console.log(
    `[${name}] tile ${w}×${h}, luminance min/mean/max/stdev = ${minL.toFixed(4)}/${meanL.toFixed(4)}/${maxL.toFixed(4)}/${sdL.toFixed(4)}`
  );
}

for (const theme of THEMES) {
  await processTheme(theme);
}
