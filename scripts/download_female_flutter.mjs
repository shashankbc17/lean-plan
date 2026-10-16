import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function monitorAndDownload() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  console.log('Monitoring render of Female Flutter Kicks...');
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Render completed or queued!');
      break;
    }
  }

  // Navigate to videos tab
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const topVideo = videoTiles.first();
  const title = await topVideo.getAttribute('aria-label').catch(() => '');
  console.log('Opening top video tile:', title);

  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading authenticated video...');
    const targetFile = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4';
    const downloadPromise = page.waitForEvent('download', { timeout: 35000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(targetFile);
    console.log(`SUCCESS! Saved Female Flutter Kicks: ${fs.statSync(targetFile).size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

monitorAndDownload().catch(console.error);
