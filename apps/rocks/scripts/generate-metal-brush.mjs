// Converts the owner's brushed-metal photograph
// (src/assets/brushed-metal-texture.png, 1254×1254, local-only, gitignored)
// into src/assets/metal-brush.webp — the grain overlay for the
// `.v8-metal` / `.v8-metal-sheet` finishes (global.css).
//
// History, shortest version: brushed grain as a repeating 1px CSS gradient
// read as scanlines ("the effect was not holding up"); a synthetic noise
// tile held up better; then the owner supplied the real thing. The authored
// texture wins (the concrete-tile precedent), and this script's only job is
// the part the blend contract requires:
//
//   RECENTRE to mid-gray. The overlay layer must average 128, where
//   `background-blend-mode: overlay` is a no-op — the texture's deviations
//   then modulate whatever sheen sits below, so ONE tile brushes dark
//   gunmetal and light aluminum alike. The authored mean (≈163) would
//   instead brighten every metal it touches.
//
// Amplitude ships as authored (AMPLITUDE = 1). The tile is larger than any
// element that wears it (buttons ~200px, tickets ~630px), so the repeat is
// never visible and the source doesn't need to be seamless.
//
// Run from apps/rocks:  bun scripts/generate-metal-brush.mjs
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SRC = fileURLToPath(new URL('../src/assets/brushed-metal-texture.png', import.meta.url));
const OUT = fileURLToPath(new URL('../src/assets/metal-brush.webp', import.meta.url));
// Multiplier on the authored deviation. 1.0 = the texture exactly as
// supplied; lower tames the brush if it ever competes with the glint.
const AMPLITUDE = 1;
// q90 measured: grain delta survives within a few percent of lossless at a
// fraction of the bytes (same criterion as the concrete tiles).
const WEBP_QUALITY = 90;

if (!existsSync(SRC)) {
  throw new Error(
    `missing source ${SRC} — the brushed-metal photograph is local-only (gitignored, ~2MB) ` +
      'and must be placed in src/assets/ before running this script.'
  );
}

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const n = info.width * info.height;

// Per-channel mean → per-channel shift to 128, so the authored (neutral)
// color balance survives the recentre.
const mean = [0, 0, 0];
for (let p = 0; p < n; p++) {
  for (let c = 0; c < info.channels; c++) mean[c] += data[p * info.channels + c];
}
for (let c = 0; c < info.channels; c++) mean[c] /= n;

for (let p = 0; p < n; p++) {
  for (let c = 0; c < info.channels; c++) {
    const i = p * info.channels + c;
    const v = 128 + (data[i] - mean[c]) * AMPLITUDE;
    data[i] = Math.max(0, Math.min(255, Math.round(v)));
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .webp({ quality: WEBP_QUALITY })
  .toFile(OUT);
const kb = (statSync(OUT).size / 1024).toFixed(0);
console.log(`wrote ${OUT} (${info.width}×${info.height}, ${kb}KB, authored grain recentred to 128)`);
