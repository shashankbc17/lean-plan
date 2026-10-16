import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function inspectChips() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Press Escape in case dialog is open
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  const promptAreaInfo = await page.evaluate(() => {
    const promptContainer = document.querySelector('div[aria-label="What do you want to create?"]')?.closest('.prompt-box, form, [class*="prompt"]') || document.body;
    const chips = [...promptContainer.querySelectorAll('*')].filter(el => {
      const cls = el.className || '';
      return typeof cls === 'string' && (cls.includes('chip') || cls.includes('ingredient') || cls.includes('pill') || cls.includes('badge'));
    });
    return chips.map(c => ({
      tagName: c.tagName,
      className: c.className,
      innerText: c.innerText,
      innerHTML: c.innerHTML.substring(0, 150)
    }));
  });
  console.log('Prompt chips details:', JSON.stringify(promptAreaInfo, null, 2));

  await browser.close();
}

inspectChips().catch(console.error);
