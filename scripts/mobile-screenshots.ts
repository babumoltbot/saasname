#!/usr/bin/env npx tsx
/**
 * Takes mobile screenshots of all pages.
 * Usage: npx tsx scripts/mobile-screenshots.ts [--headed]
 * Requires: app running on localhost:3000
 */

import { chromium, devices } from "playwright";
import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);
const headed = args.includes("--headed");

const BASE_URL = "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "screenshots");

const PAGES = [
  { name: "landing", path: "/" },
  { name: "generate", path: "/generate" },
  { name: "history", path: "/history" },
];

const DEVICES = [
  { name: "iphone-14", device: devices["iPhone 14"] },
  { name: "pixel-7", device: devices["Pixel 7"] },
];

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: !headed,
    slowMo: headed ? 600 : 0,
  });

  for (const { name: deviceName, device } of DEVICES) {
    console.log(`\n[${deviceName}]`);
    const context = await browser.newContext({ ...device });
    const page = await context.newPage();

    for (const { name: pageName, path: pagePath } of PAGES) {
      const url = `${BASE_URL}${pagePath}`;
      console.log(`  ${pageName} → ${url}`);

      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

      // Wait a bit for any animations to settle
      await page.waitForTimeout(500);

      const file = path.join(OUT_DIR, `${deviceName}-${pageName}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`  Saved: ${file}`);
    }

    await context.close();
  }

  await browser.close();
  console.log(`\nDone. Screenshots saved to: ${OUT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
