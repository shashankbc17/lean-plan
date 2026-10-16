import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkVideos() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Click on the video camera icon on the left sidebar
  console.log('Clicking videocam icon on sidebar...');
  await page.evaluate(() => {
    const icons = [...document.querySelectorAll('button')].filter(b => (b.innerText || '').includes('videocam'));
    if (icons.length > 0) icons[0].click();
  });
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_videocam_view.png' });

  // List tiles in current view
  const tileInfo = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('flow-media-tile, flow-grid-tile-container, flow-video-tile, [role="gridcell"]')];
    return tiles.map(t => ({
      tag: t.tagName,
      aria: t.getAttribute('aria-label'),
      text: (t.innerText || '').substring(0, 50).replace(/\n/g, ' ')
    }));
  });
  console.log(`Tiles in videocam view (${tileInfo.length}):`, tileInfo.slice(0, 15));

  await browser.close();
}

checkVideos().catch(console.error);
