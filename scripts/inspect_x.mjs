import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function inspectX() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const found = await page.evaluate(() => {
    // Find all elements around x: 930..970, y: 660..710
    const elements = document.elementsFromPoint(958, 686);
    return elements.map(e => ({
      tagName: e.tagName,
      className: e.className,
      aria: e.getAttribute('aria-label'),
      text: e.innerText
    }));
  });
  console.log('Elements at point (958, 686):', found);

  await browser.close();
}

inspectX().catch(console.error);
