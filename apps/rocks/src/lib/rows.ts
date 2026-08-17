/** Splits a tile list into BALANCED, CENTERABLE rows (owner-specified grid
 * behavior): rows hold at most `maxPerRow` tiles, and the counts are balanced
 * so no row is left with a lonely orphan — 4 tiles become 2+2 (never 3+1),
 * 5 become 3+2, 7 become 3+2+2. Rendered as centered flex rows, every layout
 * this produces is symmetric about the page axis, which is what kills the
 * "posters fell off the wall" hole that a plain CSS grid leaves whenever the
 * item count doesn't divide by the column count.
 *
 * The chunking runs at build time (item counts are static content), so the
 * layout costs nothing at runtime and never reflows. Fuller rows always come
 * first — the section leads with its widest shelf. */
export function chunkRows<T>(items: T[], maxPerRow = 3): T[][] {
  const rowCount = Math.ceil(items.length / maxPerRow);
  const rows: T[][] = [];
  const base = rowCount > 0 ? Math.floor(items.length / rowCount) : 0;
  let extra = rowCount > 0 ? items.length % rowCount : 0;
  let taken = 0;
  for (let r = 0; r < rowCount; r++) {
    const size = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
    rows.push(items.slice(taken, taken + size));
    taken += size;
  }
  return rows;
}
