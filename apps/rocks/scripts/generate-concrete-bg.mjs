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
//   3. Make it seamlessly tileable by MIRRORING the crop into a 2x2 block
//      (see mirrorTile). Opposite edges are then the same source column
//      or row, so the joint is pixel-exact by construction and needs no
//      healing. An earlier version rolled the crop and hid the relocated
//      seam under a feathered blur; the joints were fine, but the blur cut
//      a smooth plus-shaped band through every tile and, repeated, those
//      bands formed a visible lattice of "gaps" in the grain. Mirroring
//      trades that for four-fold symmetry, invisible at this contrast.
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
const TILE = 320; // quarter tile; mirrorTile() doubles it to a 640 pitch
const WEBP_QUALITY = 82;
// Mirroring makes opposite edges pixel-identical; lossy WebP would encode
// them in separate blocks and reintroduce a faint joint, so keep the encode
// near-lossless. The texture is smooth, so the files stay ~200KB.
const WEBP_NEAR_LOSSLESS = true;

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



/** Builds a seamless tile by MIRRORING the quarter tile into a 2x2 block.
 *
 * Replaces the earlier roll + seam-blur approach. That one produced genuinely
 * seamless joints (measured: joint delta ≈ the texture's own neighbour delta),
 * but healing the relocated cross seam with a feathered blur left a smooth
 * plus-shaped band through every tile — and repeated, those bands formed a
 * visible lattice of "gaps" in the grain, which is what the owner reported.
 *
 * Mirroring needs no healing: column 0 and column 2w-1 are both source column
 * 0, so opposite edges are pixel-identical BY CONSTRUCTION, and every pixel
 * keeps its original sharpness. The cost is four-fold symmetry, which on a
 * low-contrast concrete grain reads as far less than a lattice did. */
function mirrorTile(data, w, h, channels) {
  const W = w * 2;
  const H = h * 2;
  const out = new Uint8Array(W * H * channels);
  for (let y = 0; y < H; y++) {
    const sy = y < h ? y : H - 1 - y;
    for (let x = 0; x < W; x++) {
      const sx = x < w ? x : W - 1 - x;
      const src = (sy * w + sx) * channels;
      const dst = (y * W + x) * channels;
      for (let c = 0; c < channels; c++) out[dst + c] = data[src + c];
    }
  }
  return { data: out, width: W, height: H };
}

async function processTheme({ name, srcPath, outPath, bg, compressK, tintAlpha }) {
  const { data, width: qw, height: qh, channels } = await loadSquareTile(srcPath);
  const compressed = compressTowardMean(data, channels, compressK);
  const { data: mirrored, width: w, height: h } = mirrorTile(compressed, qw, qh, channels);

  const final = new Uint8Array(w * h * channels);
  for (let i = 0; i < final.length; i++) {
    const c = i % channels;
    final[i] = Math.max(0, Math.min(255, Math.round(bg[c] * (1 - tintAlpha) + mirrored[i] * tintAlpha)));
  }

  await sharp(final, { raw: { width: w, height: h, channels } })
    .webp(WEBP_NEAR_LOSSLESS ? { nearLossless: true, quality: 100 } : { quality: WEBP_QUALITY })
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
