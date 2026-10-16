import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4';

async function clickDownload() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Download button is visible! Setting up download listener...');
    const downloadPromise = page.waitForEvent('download', { timeout: 20000 });
    await downloadBtn.click();
    console.log('Clicked download button!');

    // Wait for any download quality submenu
    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Clicking original quality...');
      await originalOption.click();
    }

    try {
      const download = await downloadPromise;
      await download.saveAs(TARGET_FILE);
      console.log(`SUCCESS! Downloaded and saved directly to ${TARGET_FILE}`);
    } catch (err) {
      console.log('Download event timed out, checking downloads directory or network...');
    }
  } else {
    console.log('Download button not currently visible.');
  }

  // Also check blob/video stream via page.evaluate
  const videoData = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return null;
    const url = v.currentSrc || v.src;
    if (!url) return null;
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }).catch(() => null);

  if (videoData && videoData.startsWith('data:')) {
    const base64 = videoData.split(',')[1];
    const buf = Buffer.from(base64, 'base64');
    fs.writeFileSync(TARGET_FILE, buf);
    console.log(`SUCCESS! Saved via video element data (${buf.length} bytes) to ${TARGET_FILE}`);
  }

  await browser.close();
}

clickDownload();
