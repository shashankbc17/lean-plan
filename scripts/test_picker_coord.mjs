import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testPickerCoord() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Open ingredient picker
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // Click Images tab
  await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return;
    const imgTab = [...overlay.querySelectorAll('button, [role="tab"]')].find(t => (t.innerText || '').includes('Images'));
    if (imgTab) imgTab.click();
  });
  await page.waitForTimeout(1000);

  // Look for Add to prompt button details
  const btnDetails = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return null;
    const all = [...overlay.querySelectorAll('button, div[role="button"]')];
    return all.map(b => ({
      text: b.innerText,
      aria: b.getAttribute('aria-label'),
      rect: b.getBoundingClientRect()
    })).filter(x => /add/i.test(x.text || x.aria));
  });
  console.log('Add buttons in picker overlay:', btnDetails);

  if (btnDetails && btnDetails.length > 0) {
    const target = btnDetails[0];
    await page.mouse.click(target.rect.x + target.rect.width / 2, target.rect.y + target.rect.height / 2);
    console.log('Clicked Add to prompt!');
  }

  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_coord_add.png' });
  await browser.close();
}

testPickerCoord().catch(console.error);
