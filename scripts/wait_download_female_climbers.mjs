import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-mountain-climbers-front.mp4';

async function waitAndDownloadFemaleClimber() {
  console.log('Connecting to Flow Chrome to monitor video render...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Wait until Stop button is gone
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Video rendering active: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed!');
      break;
    }
  }

  await page.waitForTimeout(4000);

  // 2. Switch to Videos tab
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click({ force: true });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-video-tile, flow-grid-tile-container');
  const count = await videoTiles.count();
  console.log(`Total video tiles in project: ${count} (was 8 previously)`);

  if (count > 8) {
    const topVideo = videoTiles.first();
    const title = await topVideo.getAttribute('aria-label').catch(() => '');
    console.log('Verified newly created video tile:', title);

    await topVideo.dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Triggering download from video player...');
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
      console.log(`SUCCESS! Saved newly rendered Female Mountain Climbers MP4: ${stats.size} bytes`);
    }

    await page.keyboard.press('Escape');
  } else {
    console.log('Video count did not increase yet, checking canvas...');
  }

  await browser.close();
}

waitAndDownloadFemaleClimber().catch(err => {
  console.error('Download error:', err.message);
  process.exit(1);
});
