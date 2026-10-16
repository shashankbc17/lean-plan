import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkPicker() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return;
    const imgTab = [...overlay.querySelectorAll('button, [role="tab"]')].find(t => (t.innerText || '').includes('Images'));
    if (imgTab) imgTab.click();
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/picker_order.png' });

  const items = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return [];
    return [...overlay.querySelectorAll('div[role="option"], flow-media-tile, .item-container')].slice(0, 6).map(el => ({
      aria: el.getAttribute('aria-label') || el.innerText
    }));
  });
  console.log('Picker items:', items);

  await page.keyboard.press('Escape');
  await browser.close();
}

checkPicker().catch(console.error);
