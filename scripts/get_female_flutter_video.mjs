import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function checkTiles() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Press Escape to make sure no modal is open
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Look for video tiles specifically
  const videoTiles = page.locator('flow-video-tile');
  const count = await videoTiles.count();
  console.log('Video tiles count:', count);

  for (let i = 0; i < Math.min(5, count); i++) {
    const tile = videoTiles.nth(i);
    const text = await tile.innerText().catch(() => '');
    console.log(`Video tile ${i}:`, text.replace(/\n/g, ' '));
  }

  // Double click the newest video tile (first one)
  if (count > 0) {
    console.log('Double clicking video tile 0...');
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await videoTiles.first().dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i]').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Clicking download button...');
      await downloadBtn.click();
      await page.waitForTimeout(500);

      const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
      if (await originalOption.isVisible().catch(() => false)) {
        await originalOption.click();
      }

      const download = await downloadPromise;
      if (download) {
        await download.saveAs('C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4');
        console.log('Downloaded video file successfully!');
      }
    }
  }

  await browser.close();
}

checkTiles();
