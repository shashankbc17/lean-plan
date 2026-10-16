import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function downloadTopVideo() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Make sure we are on Videos tab
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  // 2. Open first video tile
  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const topVideo = videoTiles.first();
  const label = await topVideo.getAttribute('aria-label').catch(() => '');
  console.log('Top video tile label:', label);

  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  // 3. Download
  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading video...');
    const targetFile = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-jumping-jacks-punches-front.mp4';
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(targetFile);
    const stats = fs.statSync(targetFile);
    console.log(`SUCCESS! Saved Female Jumping Jacks: ${stats.size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

downloadTopVideo().catch(console.error);
