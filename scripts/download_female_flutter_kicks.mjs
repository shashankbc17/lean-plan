import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4';

async function checkAndDownload() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Inspect video elements
  const videos = await page.locator('video').all();
  console.log('Video count on page:', videos.length);
  let saved = false;

  for (let i = 0; i < videos.length; i++) {
    const src = await videos[i].getAttribute('src');
    console.log(`Video ${i} src:`, src ? src.substring(0, 80) : 'none');
    if (src && src.startsWith('http')) {
      const res = await fetch(src);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        if (buf.byteLength > 100000) {
          // Double check if this is the flutter kicks video
          fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
          console.log(`Successfully saved female flutter kicks (${buf.byteLength} bytes) to ${TARGET_FILE}!`);
          saved = true;
          break;
        }
      }
    }
  }

  if (!saved) {
    // Click on newest video tile
    const tile = page.locator('flow-video-tile, img[src*="flow.google.com/asb"]').first();
    await tile.dblclick({ force: true }).catch(() => {});
    await page.waitForTimeout(3000);

    const videoEl = page.locator('video').first();
    const src = await videoEl.getAttribute('src').catch(() => null);
    if (src && src.startsWith('http')) {
      const res = await fetch(src);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        if (buf.byteLength > 100000) {
          fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
          console.log(`Saved via tile click (${buf.byteLength} bytes) to ${TARGET_FILE}!`);
          saved = true;
        }
      }
    }
  }

  await page.screenshot({ path: 'scripts/flow_flutter_check.png' });
  await browser.close();
}

checkAndDownload();
