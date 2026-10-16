import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function listNav() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const items = await page.evaluate(() => {
    const nav = document.querySelector('[role="navigation"]');
    if (!nav) return 'No nav found';
    return [...nav.querySelectorAll('button, a')].map(b => ({
      aria: b.getAttribute('aria-label') || '',
      text: b.innerText.trim(),
      classes: b.className
    }));
  });

  console.log('Nav buttons:', items);
  await browser.close();
}

listNav();
