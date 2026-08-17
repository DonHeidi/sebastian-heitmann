// Renders src/assets/crt-body.png — the About section's CRT monitor body —
// by RAYMARCHING a continuous parametric solid with per-pixel normals and
// one key light. This replaced a long line of approximations (CSS-3D planes,
// DOM onion slices, SVG fills, canvas slice-painting) whose shared failure
// the owner called precisely: stacked 2D fills can never make a smooth 3D
// SHAPE, and every detail painted onto them multiplies artifacts. A surface
// with real normals shades continuously by construction.
//
// Deterministic (pure math, fixed constants): same script, same bytes.
// Slow by design (~1-3 min): it runs at authoring time like
// generate-concrete-bg.mjs, never in the browser. The live terminal stays
// DOM — this render leaves the glass dark, and crt-meta.json carries the
// projected glass quad so the runtime homography can seat the HTML screen
// exactly where the camera put the glass.
//
// Geometry: the iMac-G3-inspired anatomy the owner converged on across
// references — a deep two-tone body (accent shell over a putty belly, split
// at a molded waterline), lofted from a rounded-rect cross-section that
// BULGES past the bezel then closes slowly into a wide rear cap; a ribbed
// putty front panel with molded screen ring; speaker pods + slot arranged
// as the RESEMBLANCE of a face; power button; feet molded from the panel's
// putty.
//
// Run from apps/rocks:  bun scripts/render-crt.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT_IMG = fileURLToPath(new URL('../src/assets/crt-body.png', import.meta.url));
const OUT_META = fileURLToPath(new URL('../src/assets/crt-meta.json', import.meta.url));

// ── Design space & camera (shared vocabulary with the previous painter) ──
const DW = 1000;
const DH = 900;
const SCALE = 1.6; // output = design × SCALE
const SS = 2; // supersamples per axis
const YAW = (26 * Math.PI) / 180; // front toward the right, body sweeping LEFT (owner's pick after trying both)
const PITCH = (-6 * Math.PI) / 180;
const F = 5200;
const CX = 594; // far enough right that the deep flank clears the canvas edge (verified by the border scan below)
const CY = 430;

// ── Materials ──
const SHELL = [255, 59, 0];
const BELLY = [217, 211, 194];
const PUTTY = [207, 199, 180];
const PUTTY_HI = [227, 220, 202];
const PUTTY_LO = [169, 159, 138];
const RING = [184, 175, 155];
const GLASS = [10, 12, 10];
const SLOT = [20, 20, 18];

// ── Body loft profile (the converged shape) ──
// DEEPER THAN WIDE OR TALL (owner: the defining trait of a CRT) — the
// reference iMac measures 38×39×44cm; against our 760-wide / 836-tall
// front, 840 units of depth keeps that ratio.
const DEPTH = 840;
const bodyProfile = (t) => {
  const bulge = Math.sin(Math.PI * t);
  const ix = -88 * bulge + 60 * Math.pow(t, 2.5);
  const iyT = 300 * Math.pow(t, 1.7);
  const iyB = -58 * bulge + 90 * Math.pow(t, 2.2);
  const x0 = 220 + ix;
  const x1 = 980 - ix;
  const y0 = 12 + iyT;
  const y1 = 848 - iyB;
  const hx = (x1 - x0) / 2;
  const hy = (y1 - y0) / 2;
  const cy2 = (y0 + y1) / 2;
  const maxR = Math.max(8, Math.min(hx, hy));
  const r = Math.min(maxR, 74 + 40 * bulge + (maxR - 74) * Math.pow(t, 1.6));
  return { hx, hy, cy: cy2, r };
};
// Waterline of the two-tone split: putty belly below, shell above; the band
// is tallest behind the chin and thins toward the tail (reference photos).
const waterline = (t) => 620 + 105 * t;

// ── SDF helpers ──
const sdRounded2D = (px, py, hx, hy, r) => {
  const qx = Math.abs(px) - (hx - r);
  const qy = Math.abs(py) - (hy - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
};
const sdBox = (px, py, pz, x0, x1, y0, y1, z0, z1, r) => {
  const d2 = sdRounded2D(px - (x0 + x1) / 2, py - (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2, r);
  const dz = Math.max(z0 - pz, pz - z1);
  return Math.max(d2, dz);
};

// The power CAP is rendered only in the sprite passes (see the bottom of
// this file): a latching switch needs TWO baked states, so the base render
// carries just the socket and the cap ships as two swap-in sprites rendered
// by this same camera and light — the owner's earlier CSS cap read as "a 2d
// piece on a 3d piece" precisely because it wasn't.
let CAP = null; // { top: number } during sprite passes

// Part ids: 1 body, 2 panel, 3 pod, 4 slot, 5 power cap, 6 foot.
const parts = { d: 0, id: 0 };
const sdf = (x, y, z) => {
  let best = 1e9;
  let id = 0;
  // Body (loft): approximate SDF — cross-section at this z, plus z caps.
  {
    const t = Math.min(1, Math.max(0, -z / DEPTH));
    const p = bodyProfile(t);
    const d2 = sdRounded2D(x - 600, y - p.cy, p.hx, p.hy, p.r);
    const dz = Math.max(z - 0, -DEPTH - z);
    let d = Math.max(d2, dz);
    // COOLER GRILL (owner request, reinstated): real recessed slots CUT from
    // the flank — SDF subtraction, so each slot is genuine geometry that
    // shades itself via its own normals, unlike every painted attempt. The
    // pocket boxes reach only ~35 units past the bulge's surface, so slots
    // exist on the front half of the flank (the reference's vent zone) and
    // fade out where the body pulls inward toward the tail. Bounding
    // early-out keeps the 20 boxes cheap for the raymarcher.
    if (x < 340 && z < -110 && z > -470 && y > 310 && y < 690) {
      for (let row = 0; row < 5; row++) {
        const ry = 336 + row * 68;
        for (let col = 0; col < 4; col++) {
          const cz = -132 - col * 84;
          const slot = sdBox(x, y, z, -80, 167, ry, ry + 24, cz - 56, cz, 9);
          d = Math.max(d, -slot);
        }
      }
    }
    if (d < best) {
      best = d;
      id = 1;
    }
  }
  // Front panel slab, with the power socket cut into it.
  {
    let d = sdBox(x, y, z, 240, 960, 30, 830, 0, 26, 58);
    const socket = Math.max(Math.hypot(x - 886, y - 706) - 29, Math.max(18 - z, z - 40));
    d = Math.max(d, -socket);
    if (d < best) {
      best = d;
      id = 2;
    }
  }
  // Speaker pods (face eyes).
  for (const ex of [498, 640]) {
    const d = sdBox(x, y, z, ex, ex + 92, 646, 700, 24, 38, 26);
    if (d < best) {
      best = d;
      id = 3;
    }
  }
  // Slot (face mouth) — recessed look via thin dark box proud of the panel.
  {
    const d = sdBox(x, y, z, 480, 740, 742, 754, 25, 31, 6);
    if (d < best) {
      best = d;
      id = 4;
    }
  }
  // Power CAP (sprite passes only): a cylinder seated in the socket, its
  // top at CAP.top — 30 for latched-in, 38 for proud.
  if (CAP) {
    const dxy = Math.hypot(x - 886, y - 706) - 23;
    const dz = Math.max(19 - z, z - CAP.top);
    const d = Math.max(dxy, dz);
    if (d < best) {
      best = d;
      id = 5;
    }
  }
  // Feet.
  for (const fx of [322, 800]) {
    const d = sdBox(x, y, z, fx, fx + 82, 820, 892, -4, 26, 14);
    if (d < best) {
      best = d;
      id = 6;
    }
  }
  parts.d = best;
  parts.id = id;
  return best;
};

// ── Camera rays (matches the painter's projection model exactly) ──
const sy = Math.sin(YAW);
const cyw = Math.cos(YAW);
const sp = Math.sin(PITCH);
const cp = Math.cos(PITCH);
/** view→object: undo pitch, then undo yaw, about pivot (CX, CY, 0). */
const viewToObject = (vx, vy, vz) => {
  // inverse pitch (rotate about x by -PITCH)
  const y1 = vy * cp + vz * sp;
  const z1 = -vy * sp + vz * cp;
  // inverse yaw (rotate about y by -YAW)
  const x2 = vx * cyw - z1 * sy;
  const z2 = vx * sy + z1 * cyw;
  return [x2, y1, z2];
};
/** object→view (for the meta quad): yaw, then pitch. */
const project = (x, y, z) => {
  const x1 = (x - CX) * cyw + z * sy;
  const z1 = -(x - CX) * sy + z * cyw;
  const y1 = (y - CY) * cp - z1 * sp;
  const z2 = (y - CY) * sp + z1 * cp;
  const s = F / (F - z2);
  return { x: CX + x1 * s, y: CY + y1 * s };
};

// ── Shading ──
const L = (() => {
  // Key up, left, in front (site convention; y is DOWN in design space).
  const v = [-0.45, -0.72, 0.53];
  const n = Math.hypot(...v);
  return v.map((c) => c / n);
})();
const albedoAt = (x, y, z, id) => {
  if (id === 1) {
    const t = Math.min(1, Math.max(0, -z / DEPTH));
    return y > waterline(t) ? BELLY : SHELL;
  }
  if (id === 2) {
    // Panel face regions: glass, molded ring, ribbed putty.
    const dGlass = sdRounded2D(x - 602, y - 322, 290, 230, 24);
    if (dGlass < 0) return GLASS;
    if (dGlass < 16) return RING;
    // Ribs: subtle vertical striping baked into the albedo.
    const base = Math.floor(x) % 8 < 2 ? PUTTY_LO.map((c, i) => (c + PUTTY[i]) / 2) : PUTTY;
    // Badge print, silk-screened straight into the albedo (see the bake
    // below): a DOM badge floated flat over the perspective and vanished
    // outright in Gecko once its homography applied. Ink alpha is scaled
    // to 0.92 so the ribs ghost through like real screen print.
    if (BADGE_BMP && z > 20 && x >= BADGE.x0 && x < BADGE.x0 + BADGE.w && y >= BADGE.y0 && y < BADGE.y0 + BADGE.h) {
      const bx = Math.min(BADGE_BMP.w - 1, Math.floor(((x - BADGE.x0) / BADGE.w) * BADGE_BMP.w));
      const byy = Math.min(BADGE_BMP.h - 1, Math.floor(((y - BADGE.y0) / BADGE.h) * BADGE_BMP.h));
      const o = (byy * BADGE_BMP.w + bx) * 4;
      const a = (BADGE_BMP.data[o + 3] / 255) * 0.92;
      if (a > 0) return [0, 1, 2].map((i) => BADGE_BMP.data[o + i] * a + base[i] * (1 - a));
    }
    return base;
  }
  if (id === 3) {
    // Speaker grid (owner request, reinstated): perforation field on the pod
    // face — dark dots inside the pod's inner area, in the albedo (2px dots
    // don't need geometry to read as punched).
    for (const ex of [498, 640]) {
      if (x > ex + 13 && x < ex + 79 && y > 658 && y < 688) {
        const gx = (((x - ex) % 11) + 11) % 11 - 5.5;
        const gy = ((y % 11) + 11) % 11 - 5.5;
        if (gx * gx + gy * gy < 4.6) return [140, 26, 0];
      }
    }
    return SHELL;
  }
  if (id === 4) return SLOT;
  if (id === 5) {
    // Engraved power glyph on the cap's top face.
    const rr = Math.hypot(x - 886, y - 706);
    if (Math.abs(rr - 9.5) < 1.9 && !(Math.abs(x - 886) < 3.4 && y < 706 - 4)) return [96, 90, 76];
    if (Math.abs(x - 886) < 1.6 && y > 706 - 14 && y < 706 - 2) return [96, 90, 76];
    return PUTTY_HI;
  }
  if (id === 5) return PUTTY_HI;
  if (id === 6) return PUTTY;
  return PUTTY;
};

const EPS = 1.4;
const normalAt = (x, y, z) => {
  const d0 = sdf(x, y, z);
  const nx = sdf(x + EPS, y, z) - d0;
  const ny = sdf(x, y + EPS, z) - d0;
  const nz = sdf(x, y, z + EPS) - d0;
  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
};

// ── AUTO-FRAMING: project the geometry's extreme candidate points, take
// their bounding box plus padding, and render exactly that window. Manual
// canvas centering clipped the silhouette twice (left flank, then feet) —
// the frame must follow the geometry, not the other way around. ──
const PAD = 16;
const candidates = [];
for (let i = 0; i <= 72; i++) {
  const t = i / 72;
  const pr = bodyProfile(t);
  const z = -t * DEPTH;
  candidates.push([600 - pr.hx, pr.cy, z], [600 + pr.hx, pr.cy, z]);
  candidates.push([600, pr.cy - pr.hy, z], [600, pr.cy + pr.hy, z]);
  const c = Math.SQRT1_2;
  candidates.push(
    [600 - (pr.hx - pr.r) - pr.r * c, pr.cy - (pr.hy - pr.r) - pr.r * c, z],
    [600 - (pr.hx - pr.r) - pr.r * c, pr.cy + (pr.hy - pr.r) + pr.r * c, z],
    [600 + (pr.hx - pr.r) + pr.r * c, pr.cy - (pr.hy - pr.r) - pr.r * c, z],
    [600 + (pr.hx - pr.r) + pr.r * c, pr.cy + (pr.hy - pr.r) + pr.r * c, z]
  );
}
for (const [x, y] of [[240, 30], [960, 30], [240, 830], [960, 830]]) candidates.push([x, y, 26]);
for (const fx of [322, 800]) for (const x of [fx, fx + 82]) candidates.push([x, 892, 26], [x, 892, -4]);
let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
for (const [x, y, z] of candidates) {
  const q = project(x, y, z);
  bx0 = Math.min(bx0, q.x);
  by0 = Math.min(by0, q.y);
  bx1 = Math.max(bx1, q.x);
  by1 = Math.max(by1, q.y);
}
bx0 -= PAD; by0 -= PAD; bx1 += PAD; by1 += PAD;
const VW = bx1 - bx0;
const VH = by1 - by0;
console.log(`frame: x ${bx0.toFixed(0)}..${bx1.toFixed(0)}, y ${by0.toFixed(0)}..${by1.toFixed(0)} (${VW.toFixed(0)}×${VH.toFixed(0)})`);

const MAX_STEPS = 220;
const HIT = 0.5;
const MAX_DIST = 9000;

/** Raymarch a design-space window into an RGBA buffer. */
function renderWindow(wx0, wy0, ww, wh) {
  const W2 = Math.round(ww * SCALE);
  const H2 = Math.round(wh * SCALE);
  const buf = new Uint8Array(W2 * H2 * 4);
  for (let py = 0; py < H2; py++) {
    for (let px = 0; px < W2; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy2 = 0; sy2 < SS; sy2++) {
        for (let sx2 = 0; sx2 < SS; sx2++) {
          const dxp = wx0 + (px + (sx2 + 0.5) / SS) / SCALE;
          const dyp = wy0 + (py + (sy2 + 0.5) / SS) / SCALE;
          let vx = dxp - CX;
          let vy = dyp - CY;
          let vz = -F;
          const vlen = Math.hypot(vx, vy, vz);
          vx /= vlen;
          vy /= vlen;
          vz /= vlen;
          const [ox, oy, oz] = viewToObject(0, 0, F);
          const [dx, dy, dz] = viewToObject(vx, vy, vz);
          const Ex = CX + ox;
          const Ey = CY + oy;
          const Ez = 0 + oz;
          let dist = 0;
          let hit = false;
          for (let i = 0; i < MAX_STEPS; i++) {
            const x = Ex + dx * dist;
            const y = Ey + dy * dist;
            const z = Ez + dz * dist;
            const d = sdf(x, y, z);
            if (d < HIT) {
              hit = true;
              break;
            }
            dist += Math.max(0.9, d * 0.72);
            if (dist > MAX_DIST) break;
          }
          if (!hit) continue;
          const x = Ex + dx * dist;
          const y = Ey + dy * dist;
          const z = Ez + dz * dist;
          const id = (sdf(x, y, z), parts.id);
          const n = normalAt(x, y, z);
          const alb = albedoAt(x, y, z, id);
          const ndl = Math.max(0, -(n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) * -1);
          const hvx = L[0] - dx;
          const hvy = L[1] - dy;
          const hvz = L[2] - dz;
          const hl = Math.hypot(hvx, hvy, hvz) || 1;
          const spec = Math.pow(Math.max(0, (n[0] * hvx + n[1] * hvy + n[2] * hvz) / hl), 26) * (id === 4 ? 0.05 : 0.22);
          const amb = 0.34;
          for (let c = 0; c < 3; c++) {
            const v = alb[c] * (amb + 0.66 * ndl) + 255 * spec;
            if (c === 0) r += Math.min(255, v);
            else if (c === 1) g += Math.min(255, v);
            else b += Math.min(255, v);
          }
          a += 255;
        }
      }
      const o = (py * W2 + px) * 4;
      const cov = a / (SS * SS) / 255;
      if (cov > 0) {
        buf[o] = Math.round(r / (a / 255));
        buf[o + 1] = Math.round(g / (a / 255));
        buf[o + 2] = Math.round(b / (a / 255));
        buf[o + 3] = Math.round(cov * 255);
      }
    }
    if (py % 400 === 0) console.log(`row ${py}/${H2}`);
  }
  return { buf, W2, H2 };
}

// ── Badge print bake ──
// The "✳ V8-CRT" model print, rasterized once and sampled by the panel
// albedo. Text is set in the site's own IBM Plex Mono (Pango + fontfile);
// the asterisk re-bakes the SAME seeded spokes as asterisk-mark.tsx, so the
// printed mark is the site's mark, not an approximation.
const BADGE = { x0: 440, y0: 576, w: 320, h: 46 };
let BADGE_BMP = null;
{
  const PXU = 4; // raster px per design unit
  const bw = BADGE.w * PXU;
  const bh = BADGE.h * PXU;
  // mulberry32 + bakeSpokes verbatim from src/components/asterisk-mark.tsx
  // (seed 11) — keep in sync if the mark's recipe ever changes.
  const mulberry32 = (seed) => {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const fmt = (v) => (Math.round(v * 10) / 10).toString();
  const bakeSpokes = (seed) => {
    const rng = mulberry32(seed);
    const lengths = [44, 36, 42, 38, 45, 37];
    const parts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 * Math.PI) / 180;
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      const nx = -uy;
      const ny = ux;
      const len = lengths[i];
      const rIn = -len * 0.18;
      const rOut = len / 2;
      const base = 4.2 + rng() * 1.1;
      const amp = 0.6 + rng() * 0.9;
      const phase = rng() * Math.PI;
      const tipL = 0.6 + rng() * 1.8;
      const tipR = 0.6 + rng() * 1.8;
      const segs = 4;
      const pts = [];
      const edge = (t, side, tip) => {
        const r = rIn + (rOut - rIn) * t + (t === 1 ? tip : 0);
        const w =
          base + amp * Math.sin(Math.PI * t * 1.7 + phase + (side === -1 ? 1.3 : 0)) + (rng() - 0.5) * 1.4;
        pts.push([50 + ux * r + nx * w * side, 50 + uy * r + ny * w * side]);
      };
      for (let s = 0; s <= segs; s++) edge(s / segs, 1, tipL);
      for (let s = segs; s >= 0; s--) edge(s / segs, -1, tipR);
      parts.push('M' + pts.map(([px, py]) => `${fmt(px)} ${fmt(py)}`).join('L') + 'Z');
    }
    return parts.join(' ');
  };
  const astPx = 36 * PXU;
  const astSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${astPx}" height="${astPx}">` +
      `<g transform="rotate(8 50 50)"><path fill="#ff3b00" d="${bakeSpokes(11)}"/></g></svg>`
  );
  const astBuf = await sharp(astSvg).png().toBuffer();
  const FONT = fileURLToPath(new URL('../public/fonts/IBMPlexMono-Regular.woff2', import.meta.url));
  const text = await sharp({
    text: {
      // letter_spacing is Pango units: 0.22em of 88pt ≈ 19.4pt × 1024.
      text: `<span foreground="#48422f" letter_spacing="19800">V8-CRT</span>`,
      font: 'IBM Plex Mono 88',
      fontfile: FONT,
      dpi: 72,
      rgba: true,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  const gap = 10 * PXU;
  const total = astPx + gap + text.info.width;
  const left = Math.round((bw - total) / 2);
  const composed = await sharp({
    create: { width: bw, height: bh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: astBuf, left, top: Math.round((bh - astPx) / 2) },
      { input: text.data, left: left + astPx + gap, top: Math.round((bh - text.info.height) / 2) },
    ])
    .raw()
    .toBuffer({ resolveWithObject: true });
  BADGE_BMP = { data: composed.data, w: composed.info.width, h: composed.info.height };
  console.log(`badge bake: text ${text.info.width}×${text.info.height}px, band ${bw}×${bh}px`);
}

console.time('render');
const W = Math.round(VW * SCALE);
const H = Math.round(VH * SCALE);
CAP = null;
const base = renderWindow(bx0, by0, VW, VH);
console.timeEnd('render');

await sharp(base.buf, { raw: { width: base.W2, height: base.H2, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT_IMG);

// ── Cap sprites: the same renderer over the socket's window, once per
// latch state. Rendered opaque over local panel context, so swapping them
// composites seamlessly onto the base image at the window's coordinates. ──
const capCenter = project(886, 706, 34);
const CAPW = 106;
const cwx0 = capCenter.x - CAPW / 2;
const cwy0 = capCenter.y - CAPW / 2;
console.time('cap sprites');
CAP = { top: 30 };
const capOn = renderWindow(cwx0, cwy0, CAPW, CAPW);
CAP = { top: 38 };
const capOff = renderWindow(cwx0, cwy0, CAPW, CAPW);
CAP = null;
console.timeEnd('cap sprites');
await sharp(capOn.buf, { raw: { width: capOn.W2, height: capOn.H2, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('../src/assets/crt-cap-on.png', import.meta.url)));
await sharp(capOff.buf, { raw: { width: capOff.W2, height: capOff.H2, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('../src/assets/crt-cap-off.png', import.meta.url)));

// Glass quad (design coords normalized to 0..1 of the image) for the runtime
// homography that seats the DOM terminal.
// Projected at z=26 — the PANEL'S FRONT FACE, where the glass albedo is
// actually drawn. Projecting at z=0 put the quad one slab-depth behind the
// visible surface, and the parallax (≈11 design px at this yaw) showed as
// the DOM screen sitting visibly offset from the rendered glass.
const GLASSQ = [
  project(312, 92, 26),
  project(892, 92, 26),
  project(892, 552, 26),
  project(312, 552, 26),
].map((p) => [(p.x - bx0) / VW, (p.y - by0) / VH]);
// Power button hit area, projected on its cap face (z=36) — the runtime
// places a real <button> there, so the control clicks where it renders.
const PC = project(886, 706, 36);
const PE = project(886 - 24, 706, 36);
const POWER = {
  c: [(PC.x - bx0) / VW, (PC.y - by0) / VH],
  r: Math.hypot(PC.x - PE.x, PC.y - PE.y) / VW,
};
const CAPRECT = {
  x: (cwx0 - bx0) / VW,
  y: (cwy0 - by0) / VH,
  w: CAPW / VW,
  h: CAPW / VH,
};
writeFileSync(
  OUT_META,
  JSON.stringify(
    { quad: GLASSQ, power: POWER, capRect: CAPRECT, aspect: [Math.round(VW), Math.round(VH)] },
    null,
    2
  )
);
console.log(`wrote ${OUT_IMG} (${W}×${H}) and crt-meta.json`);
