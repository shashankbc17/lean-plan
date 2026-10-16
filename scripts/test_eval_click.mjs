import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testClick() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('[role="navigation"] button, [role="navigation"] a')].find(b => {
      const text = b.innerText || '';
      return text.includes('videocam') || text.includes('Videos');
    });
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  console.log('Evaluated click on Videos nav:', clicked);
  await page.waitForTimeout(2000);
  const count = await page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile').count();
  console.log('Video tiles visible:', count);
  await browser.close();
}

testClick();
