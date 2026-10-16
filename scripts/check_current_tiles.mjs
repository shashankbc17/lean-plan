import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkTiles() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Click videocam to see all videos
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  const tiles = await page.evaluate(() => {
    const all = [...document.querySelectorAll('flow-media-tile, flow-grid-tile-container, flow-video-tile')];
    return all.map(t => ({
      tag: t.tagName,
      aria: t.getAttribute('aria-label'),
      text: (t.innerText || '').substring(0, 60).replace(/\n/g, ' ')
    }));
  });

  console.log(`Tiles in Videos view (${tiles.length}):`);
  console.log(tiles.slice(0, 10));

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_after_batch.png' });
  console.log('Saved screenshot to scripts/flow_after_batch.png');

  await browser.close();
}

checkTiles().catch(console.error);
