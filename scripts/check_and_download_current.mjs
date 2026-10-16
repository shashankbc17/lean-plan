import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function check() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
  console.log('Stop button visible:', stopVisible);

  const approveRadio = page.locator('div[role="radio"][aria-label="Approve"]').last();
  const approveVisible = await approveRadio.isVisible().catch(() => false);
  console.log('Approve radio visible:', approveVisible);

  if (approveVisible) {
    console.log('Clicking approve radio...');
    await approveRadio.click({ force: true });
    await page.waitForTimeout(1000);
    const confirmButtons = await page.locator('button, div').filter({ hasText: /^Approve$/ }).all();
    for (const b of confirmButtons) {
      const box = await b.boundingBox();
      if (box && box.y > 500) {
        console.log('Clicking confirmation Approve button at:', box);
        await b.click({ force: true });
        break;
      }
    }
  }

  // Check for videos
  const videos = await page.locator('video').all();
  console.log('Video count:', videos.length);
  for (let i = 0; i < videos.length; i++) {
    const src = await videos[i].getAttribute('src');
    console.log(`Video ${i} src:`, src ? src.substring(0, 100) : 'none');
  }

  await page.screenshot({ path: 'scripts/flow_current_state.png' });
  console.log('Saved scripts/flow_current_state.png');
  await browser.close();
}

check();
