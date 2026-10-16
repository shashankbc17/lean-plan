import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function auditBatch1Images() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Switch to 'Images' tab in Flow to view all generated images
  console.log('Switching to Images tab...');
  const imagesNav = page.locator('button, a').filter({ hasText: /Images/i }).first();
  await imagesNav.click();
  await page.waitForTimeout(3000);

  // Take screenshot of the images grid
  await page.screenshot({ path: 'scripts/flow_images_grid.png' });
  console.log('Saved scripts/flow_images_grid.png');

  // Query image tiles
  const imageTiles = await page.locator('flow-grid-tile-container, flow-media-tile, div[role="listitem"]').all();
  console.log(`Found ${imageTiles.length} image tiles in project.`);

  const auditReport = [];
  for (let i = 0; i < Math.min(20, imageTiles.length); i++) {
    const tile = imageTiles[i];
    const text = (await tile.innerText().catch(() => '')).replace(/\n/g, ' ').trim();
    const aria = await tile.getAttribute('aria-label').catch(() => '');
    const imgEl = tile.locator('img').first();
    const imgSrc = await imgEl.getAttribute('src').catch(() => '');
    auditReport.push({ index: i, aria, text: text.substring(0, 100), hasImg: !!imgSrc });
    console.log(`Tile ${i}: [Aria: ${aria}] [Text: ${text.substring(0, 80)}]`);
  }

  fs.writeFileSync('scripts/images_audit.json', JSON.stringify(auditReport, null, 2));

  await browser.close();
}

auditBatch1Images();
