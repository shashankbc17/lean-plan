import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function exitEditor() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  await page.evaluate(() => {
    const done = [...document.querySelectorAll('button')].find(b => (b.innerText || '').trim() === 'Done');
    if (done) done.click();
  });
  await page.waitForTimeout(2000);

  // Click videocam tab
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(2500);

  const tiles = await page.evaluate(() => {
    const all = [...document.querySelectorAll('flow-media-tile, flow-grid-tile-container, flow-video-tile')];
    return all.map(t => ({
      tag: t.tagName,
      aria: t.getAttribute('aria-label'),
      text: (t.innerText || '').substring(0, 50).replace(/\n/g, ' ')
    }));
  });
  console.log(`Video tiles in project overview (${tiles.length}):`);
  console.log(tiles.slice(0, 10));

  await browser.close();
}

exitEditor().catch(console.error);
