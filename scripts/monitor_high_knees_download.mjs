import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-high-knees-front.mp4';

async function monitorAndDownload() {
  console.log('Connecting to Flow Chrome to monitor rendering...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  let capturedVideoUrl = null;
  page.on('response', async resp => {
    const url = resp.url();
    const ct = resp.headers()['content-type'] || '';
    if (url.includes('.googlevideo.com') || (url.includes('.mp4') && !url.includes('placeholder')) || ct.includes('video/mp4')) {
      console.log('Intercepted video stream:', url.substring(0, 100));
      capturedVideoUrl = url;
    }
  });

  let downloaded = false;

  for (let attempt = 1; attempt <= 15; attempt++) {
    await page.waitForTimeout(8000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${attempt * 8}s] Render active: ${stopVisible}`);

    // If stop button is gone, render is finished!
    if (!stopVisible && attempt >= 3) {
      console.log('Render appears complete! Checking tiles...');
      await page.waitForTimeout(3000);

      // Inspect video elements
      const videos = await page.locator('video').all();
      console.log(`Found ${videos.length} videos`);
      for (const v of videos) {
        const src = await v.getAttribute('src');
        if (src && src.startsWith('http')) {
          console.log('Found video src, downloading:', src.substring(0, 80));
          const res = await fetch(src);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            if (buf.byteLength > 100000) {
              fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
              console.log(`SUCCESS! Saved video (${buf.byteLength} bytes) to ${TARGET_FILE}`);
              downloaded = true;
              break;
            }
          }
        }
      }

      if (downloaded) break;

      // Try double clicking first video tile on canvas
      const tile = page.locator('flow-video-tile, flow-grid-tile-container, img[src*="flow.google.com/asb"]').first();
      await tile.dblclick({ force: true }).catch(() => {});
      await page.waitForTimeout(3000);

      if (capturedVideoUrl) {
        console.log('Fetching captured video URL...');
        const res = await fetch(capturedVideoUrl);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          if (buf.byteLength > 100000) {
            fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
            console.log(`SUCCESS! Saved video (${buf.byteLength} bytes) to ${TARGET_FILE}`);
            downloaded = true;
            break;
          }
        }
      }
    }
  }

  await page.screenshot({ path: 'scripts/flow_after_monitor.png' });
  await browser.close();
}

monitorAndDownload();
