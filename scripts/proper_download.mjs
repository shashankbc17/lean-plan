import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function downloadProper(tileIndex, targetPath) {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Navigate to Videos
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click();
  await page.waitForTimeout(2000);

  const tiles = page.locator('flow-grid-tile-container, flow-media-tile, flow-video-tile');
  console.log(`Opening video tile ${tileIndex}...`);
  await tiles.nth(tileIndex).dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i]').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Clicking download button in player...');
    const downloadPromise = page.waitForEvent('download', { timeout: 20000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(targetPath);
    console.log(`Saved ${targetPath}: ${fs.statSync(targetPath).size} bytes`);
  }

  // Close player
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  await browser.close();
}

// Download tile 2 (High knees female)
await downloadProper(2, 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-high-knees-front.mp4');
