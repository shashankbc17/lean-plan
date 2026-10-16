import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function monitorAndSave() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  console.log('Waiting for video render to finish...');
  for (let i = 1; i <= 30; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Render completed!');
      break;
    }
  }

  await page.waitForTimeout(4000);

  // Switch to videos tab
  console.log('Switching to Videos tab...');
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const count = await videoTiles.count();
  console.log(`Total video tiles: ${count}`);

  const topVideo = videoTiles.first();
  const label = await topVideo.getAttribute('aria-label').catch(() => '');
  console.log('Top video label:', label);

  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading authenticated video...');
    const targetFile = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-plank-shoulder-taps-front.mp4';
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
    console.log(`SUCCESS! Saved male-Bodyweight-plank-shoulder-taps-front.mp4: ${stats.size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

monitorAndSave().catch(console.error);
