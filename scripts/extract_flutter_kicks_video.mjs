import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4';

async function extractVideo() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  await page.screenshot({ path: 'scripts/flow_canvas_state.png' });
  console.log('Saved canvas screenshot');

  // Look for tiles
  const allTiles = page.locator('flow-grid-tile-container, flow-video-tile, flow-media-tile, img[src*="flow.google.com/asb"]');
  const count = await allTiles.count();
  console.log('Found tiles count:', count);

  if (count > 0) {
    console.log('Clicking top tile to open video player...');
    await allTiles.first().dblclick({ force: true });
    await page.waitForTimeout(4000);

    const videoEl = page.locator('video').first();
    const src = await videoEl.getAttribute('src').catch(() => null);
    console.log('Video element src after dblclick:', src);

    if (src && src.startsWith('http')) {
      const res = await fetch(src);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
        console.log(`SUCCESS! Saved video (${buf.byteLength} bytes) to ${TARGET_FILE}`);
      }
    }
  }

  // Also check if download button is available
  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i]').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Found download button on open player!');
  }

  await browser.close();
}

extractVideo();
