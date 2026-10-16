import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function listAllVids() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Inspect what page we are on
  console.log('URL:', page.url());

  const info = await page.evaluate(() => {
    const all = [...document.querySelectorAll('[role="gridcell"], flow-media-tile, flow-grid-tile-container, flow-video-tile')];
    return all.map(el => ({
      tag: el.tagName,
      role: el.getAttribute('role'),
      aria: el.getAttribute('aria-label') || el.querySelector('img, video, [aria-label]')?.getAttribute('aria-label'),
      text: (el.innerText || '').substring(0, 50).replace(/\n/g, ' ')
    }));
  });
  console.log('Tiles found in view:', info.length);
  console.log(info.slice(0, 10));

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/check_flow_grid.png' });
  await browser.close();
}

listAllVids().catch(console.error);
