// Capture dark/light screenshots of the job-directory dev server.
// Usage: bun scripts/screenshot-job-directory.mjs [outDir]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve(process.argv[2] ?? './tmp-screenshots');
await mkdir(outDir, { recursive: true });

const base = process.env.JOB_DIRECTORY_URL ?? 'http://localhost:4321';

const browser = await chromium.launch();
try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${outDir}/index-dark.png`, fullPage: true });
    await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    });
    await page.screenshot({ path: `${outDir}/index-light.png`, fullPage: true });

    const firstJobHref = await page.locator('a[href^="/jobs/"]').first().getAttribute('href').catch(() => null);
    if (firstJobHref) {
        await page.goto(new URL(firstJobHref, base).toString(), { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${outDir}/job-dark.png`, fullPage: true });
        await page.evaluate(() => {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        });
        await page.screenshot({ path: `${outDir}/job-light.png`, fullPage: true });
    }

    await page.close();
    console.log(`Wrote screenshots to ${outDir}`);
} finally {
    await browser.close();
}
