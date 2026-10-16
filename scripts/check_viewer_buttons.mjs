import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkButtons() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const btns = await page.evaluate(() => {
    return [...document.querySelectorAll('button')].map(b => ({
      aria: b.getAttribute('aria-label') || '',
      text: b.innerText.trim(),
      disabled: b.disabled || b.getAttribute('aria-disabled') === 'true',
      visible: b.offsetWidth > 0 && b.offsetHeight > 0
    })).filter(b => b.visible);
  });

  console.log('Visible buttons in viewer:', btns);
  await browser.close();
}

checkButtons();
