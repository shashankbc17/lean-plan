import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testPickerCoord() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Clear the old chip first
  await page.evaluate(() => {
    // Find the small 'x' (cancel) on the chip preview or the prompt close
    const cancelBtn = [...document.querySelectorAll('button')].find(b => {
      const t = (b.innerText || '').trim();
      return (t === 'close' || t === 'cancel') && b.getBoundingClientRect().y > 600;
    });
    if (cancelBtn) cancelBtn.click();
  });
  await page.waitForTimeout(1000);

  // 2. Open ingredient picker
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // 3. Click Images tab
  await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return;
    const imgTab = [...overlay.querySelectorAll('button, [role="tab"]')].find(t => (t.innerText || '').includes('Images'));
    if (imgTab) imgTab.click();
  });
  await page.waitForTimeout(1000);

  // 4. Click the FIRST image in the list explicitly
  const clickedItem = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return null;
    // Find image or row
    const items = [...overlay.querySelectorAll('img, [role="option"]')];
    if (items.length > 0) {
      const r = items[0].getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (clickedItem) {
    console.log('Clicking first image item at:', clickedItem);
    await page.mouse.click(clickedItem.x, clickedItem.y);
    await page.waitForTimeout(1000);
  }

  // 5. Click Add to prompt
  const addBtnCoord = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return null;
    const btn = [...overlay.querySelectorAll('button')].find(b => (b.innerText || '').includes('Add to prompt'));
    if (btn) {
      const r = btn.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (addBtnCoord) {
    console.log('Clicking Add to prompt button at:', addBtnCoord);
    await page.mouse.click(addBtnCoord.x, addBtnCoord.y);
    await page.waitForTimeout(1500);
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_clean_picker.png' });
  await browser.close();
}

testPickerCoord().catch(console.error);
