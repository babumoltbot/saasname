/**
 * Take full-page screenshots of all app pages using Playwright.
 *
 * Usage:
 *   node scripts/screenshots.mjs                        # unauthenticated
 *   node scripts/screenshots.mjs <session-token>        # authenticated (pass next-auth.session-token cookie value)
 *
 * Screenshots are saved to screenshots/ in the project root.
 * Requires: npx playwright install chromium
 */
import { chromium } from "playwright";

const SESSION_TOKEN = process.argv[2];

const PAGES = [
  { name: "landing-hero", url: "http://localhost:3000" },
  { name: "landing-demo", url: "http://localhost:3000/#demo" },
  { name: "landing-features", url: "http://localhost:3000/#features" },
  { name: "landing-pricing", url: "http://localhost:3000/#pricing" },
  { name: "generate", url: "http://localhost:3000/generate" },
  { name: "history", url: "http://localhost:3000/history" },
];

const OUT = new URL("../screenshots", import.meta.url).pathname;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

if (SESSION_TOKEN) {
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: SESSION_TOKEN,
      domain: "localhost",
      path: "/",
    },
  ]);
  console.log("Using authenticated session\n");
}

const page = await context.newPage();

for (const p of PAGES) {
  await page.goto(p.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true });
  console.log(`✓ ${p.name}`);
}

await browser.close();
console.log(`\nDone — screenshots saved to ${OUT}/`);
