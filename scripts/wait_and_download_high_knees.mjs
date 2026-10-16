import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-high-knees-front.mp4';

async function waitForRealRenderAndDownload() {
  console.log('Monitoring active video render in Flow...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Poll until Stop button is gone
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Video rendering active: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Rendering finished!');
      break;
    }
  }

  // 2. Extra pause for asset settlement
  await page.waitForTimeout(4000);

  // 3. Switch to Videos tab
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click();
  await page.waitForTimeout(3000);

  const tiles = page.locator('flow-grid-tile-container, flow-media-tile, flow-video-tile');
  const count = await tiles.count();
  console.log(`Videos in project: ${count}`);

  if (count > 0) {
    const topTile = tiles.first();
    const title = await topTile.getAttribute('aria-label').catch(() => '');
    console.log('Top video tile title:', title);

    console.log('Opening video player on top video tile...');
    await topTile.dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Triggering download from player...');
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      await downloadBtn.click();
      await page.waitForTimeout(500);

      const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
      if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await originalOption.click();
      }

      const download = await downloadPromise;
      await download.saveAs(TARGET_FILE);
      const stats = fs.statSync(TARGET_FILE);
      console.log(`SUCCESS! Saved Female High Knees MP4: ${stats.size} bytes`);
    }

    await page.keyboard.press('Escape');
  }

  await browser.close();
}

waitForRealRenderAndDownload();
