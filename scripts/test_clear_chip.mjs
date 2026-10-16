import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testClear() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Inspect the chips in the prompt box
  const chips = await page.evaluate(() => {
    // Look for chips or close/remove icons near the bottom prompt box
    const elements = [...document.querySelectorAll('mat-chip, [class*="chip"], [role="button"]')];
    return elements.map(el => ({
      tag: el.tagName,
      text: el.innerText ? el.innerText.substring(0, 30) : '',
      aria: el.getAttribute('aria-label'),
      rect: el.getBoundingClientRect()
    })).filter(x => x.rect.y > 800);
  });
  console.log('Chips or controls near prompt box:', chips);

  // If there is an 'x' or 'cancel' chip button, click it
  const cancelBtn = page.locator('button:has-text("cancel"), mat-chip button, [class*="chip"] button, [aria-label*="remove" i]').last();
  if (await cancelBtn.isVisible().catch(() => false)) {
    console.log('Clicking cancel chip button...');
    await cancelBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_chip_clear.png' });

  await browser.close();
}

testClear().catch(console.error);
