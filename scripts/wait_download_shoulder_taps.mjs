import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-plank-shoulder-taps-front.mp4';

async function waitAndDownloadTaps() {
  console.log('Monitoring render for Female Active Plank Shoulder Taps...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

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

  // Switch to Videos tab using evaluated click
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('[role="navigation"] button, [role="navigation"] a')].find(b => (b.innerText || '').includes('videocam') || (b.innerText || '').includes('Videos'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const count = await videoTiles.count();
  console.log(`Video count in project: ${count} (was 10 previously)`);

  if (count > 10) {
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
      console.log(`SUCCESS! Saved Female Shoulder Taps MP4: ${stats.size} bytes`);
    }

    await page.keyboard.press('Escape');
  } else {
    console.log('Count did not increase yet, checking canvas...');
  }

  await browser.close();
}

waitAndDownloadTaps().catch(err => {
  console.error('Download error:', err.message);
  process.exit(1);
});
