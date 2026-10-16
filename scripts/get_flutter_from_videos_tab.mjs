import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4';

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Click 'Videos' in left nav
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  console.log('Clicking Videos nav...');
  await videosNav.click();
  await page.waitForTimeout(3000);

  // Look for tiles
  const tiles = page.locator('flow-grid-tile-container, flow-media-tile, flow-video-tile');
  const count = await tiles.count();
  console.log('Video tab tiles count:', count);

  for (let i = 0; i < Math.min(5, count); i++) {
    const text = await tiles.nth(i).innerText().catch(() => '');
    console.log(`Video tile ${i}:`, text.replace(/\n/g, ' '));
  }

  if (count > 0) {
    console.log('Opening top video tile...');
    await tiles.first().dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i]').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Clicking download button...');
      const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
      await downloadBtn.click();
      await page.waitForTimeout(500);

      const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
      if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await originalOption.click();
      }

      const download = await downloadPromise;
      if (download) {
        await download.saveAs(TARGET_FILE);
        console.log(`SUCCESS! Saved video to ${TARGET_FILE} (${fs.statSync(TARGET_FILE).size} bytes)`);
      }
    }
  }

  await browser.close();
}

run();
