import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testPicker() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  const menuItems = await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role="menuitem"], button, .mat-mdc-menu-item')];
    return items.map(it => ({
      text: it.innerText ? it.innerText.trim() : '',
      aria: it.getAttribute('aria-label') || '',
      visible: it.offsetWidth > 0
    })).filter(x => x.visible && (x.text || x.aria));
  });

  console.log('Opened picker items:', menuItems);
  await page.screenshot({ path: 'scripts/picker_opened.png' });
  await browser.close();
}

testPicker();
