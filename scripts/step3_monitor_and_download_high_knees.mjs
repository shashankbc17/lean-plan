import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-high-knees-front.mp4';

async function monitorAndDownload() {
  console.log('Connecting to Flow Chrome to monitor video render...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Wait until Stop button disappears (rendering completes)
  for (let i = 1; i <= 20; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Video rendering active: ${stopVisible}`);
    if (!stopVisible && i >= 3) break;
  }

  console.log('Video render finished! Navigating to Videos tab to inspect new video tile...');
  await page.waitForTimeout(3000);

  // 2. Go to Videos tab
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click();
  await page.waitForTimeout(3000);

  // 3. Inspect top video tile
  const videoTiles = page.locator('flow-grid-tile-container, flow-media-tile, flow-video-tile');
  const count = await videoTiles.count();
  console.log(`Found ${count} video tiles in Videos tab.`);

  if (count > 0) {
    const topTile = videoTiles.first();
    const aria = await topTile.getAttribute('aria-label').catch(() => '');
    console.log('Top video tile title:', aria);

    // Double-click to open player
    console.log('Opening player on top video tile...');
    await topTile.dblclick({ force: true });
    await page.waitForTimeout(3000);

    // 4. Download video via official player download button
    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Found player download button! Triggering download...');
      const downloadPromise = page.waitForEvent('download', { timeout: 25000 });
      await downloadBtn.click();
      await page.waitForTimeout(500);

      // Select original / 720p if menu pops up
      const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
      if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Selecting original resolution option...');
        await originalOption.click();
      }

      const download = await downloadPromise;
      await download.saveAs(TARGET_FILE);
      console.log(`SUCCESS! Downloaded and saved directly to ${TARGET_FILE}`);
      console.log(`File size: ${fs.statSync(TARGET_FILE).size} bytes`);
    } else {
      console.log('Download button not found in player UI.');
    }

    await page.keyboard.press('Escape');
  }

  await browser.close();
}

monitorAndDownload();
