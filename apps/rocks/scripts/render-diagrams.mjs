/**
 * Renders every src/diagrams/*.mmd to a committed SVG in
 * src/assets/diagrams/ — the same bake-at-authoring-time pattern as
 * render-crt.mjs, so `bun run build` and the deploy scripts never need a
 * browser or mermaid. Re-run only when a .mmd source changes:
 *
 *   bun scripts/render-diagrams.mjs
 *
 * Styling: dark slab nodes with light mono type, matching the shiki code
 * blocks and the CRT terminal — one look in both site themes. The SVGs
 * ship as <img>, which isolates them from page fonts; the generic
 * `monospace` stack keeps metrics close everywhere.
 */
import { readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { run } from '@mermaid-js/mermaid-cli';

const SRC = fileURLToPath(new URL('../src/diagrams/', import.meta.url));
const OUT = fileURLToPath(new URL('../src/assets/diagrams/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const mermaidConfig = {
  theme: 'base',
  themeVariables: {
    background: 'transparent',
    primaryColor: '#1c1f24',
    primaryTextColor: '#e8e4da',
    primaryBorderColor: '#565c64',
    lineColor: '#8a8f96',
    secondaryColor: '#23272d',
    tertiaryColor: '#181b1f',
    clusterBkg: '#14161a',
    clusterBorder: '#3a3f45',
    edgeLabelBackground: '#14161a',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  flowchart: { curve: 'linear' },
};

for (const file of readdirSync(SRC).filter((f) => f.endsWith('.mmd'))) {
  const out = `${OUT}${file.replace(/\.mmd$/, '.svg')}`;
  await run(`${SRC}${file}`, out, {
    puppeteerConfig: { executablePath: '/usr/bin/chromium' },
    parseMMDOptions: { mermaidConfig, backgroundColor: 'transparent' },
    quiet: true,
  });
  console.log(`rendered ${file} → ${out}`);
}
