import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function inspectEachImage() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const tiles = await page.locator('flow-grid-tile-container, flow-media-tile').all();
  console.log(`Inspecting all ${tiles.length} tiles...`);

  const details = [];
  for (let i = 0; i < tiles.length; i++) {
    // Click tile to view
    await tiles[i].click();
    await page.waitForTimeout(1000);

    const title = await page.locator('h1, h2, h3, [role="heading"]').last().innerText().catch(() => '');
    const imgEl = page.locator('img[src*="flow.google.com/asb"]').last();
    const src = await imgEl.getAttribute('src').catch(() => '');

    const screenshotPath = `scripts/audit_tile_${i}.png`;
    await page.screenshot({ path: screenshotPath });

    details.push({ index: i, title, screenshotPath });
    console.log(`Tile ${i}: Title = "${title}"`);

    // Press Escape to return to grid
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }

  fs.writeFileSync('scripts/audit_details.json', JSON.stringify(details, null, 2));
  await browser.close();
}

inspectEachImage();
