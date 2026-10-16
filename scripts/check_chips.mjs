import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkChips() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const chips = await page.evaluate(() => {
    const promptContainer = document.querySelector('div[aria-label="What do you want to create?"]') || document.body;
    return [...document.querySelectorAll('[aria-label*="ingredient" i], flow-ingredient-chip, .chip')].map(c => ({
      text: c.innerText.trim(),
      aria: c.getAttribute('aria-label') || ''
    }));
  });

  console.log('Current chips:', chips);
  await browser.close();
}

checkChips();
