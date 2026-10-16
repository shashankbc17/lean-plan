import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testPicker() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Click "+" (Add ingredients)
  console.log('Opening ingredient picker...');
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(2000);

  // 2. Click "Images" tab
  await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return;
    const imgTab = [...overlay.querySelectorAll('button, [role="tab"]')].find(t => (t.innerText || '').includes('Images'));
    if (imgTab) imgTab.click();
  });
  await page.waitForTimeout(1500);

  // Take screenshot of image picker
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/picker_open.png' });

  // Inspect the images listed in the picker
  const pickerItems = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return [];
    const items = [...overlay.querySelectorAll('flow-media-tile, flow-grid-tile-container, div[role="option"], img')];
    return items.map(el => ({
      tag: el.tagName,
      aria: el.getAttribute('aria-label'),
      src: el.getAttribute('src'),
      rect: el.getBoundingClientRect()
    }));
  });
  console.log('Picker items found:', pickerItems.slice(0, 8));

  await browser.close();
}

testPicker().catch(console.error);
