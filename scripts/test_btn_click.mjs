import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testSubmit() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Clear chips
  await page.evaluate(() => {
    const closeBtn = [...document.querySelectorAll('button')].find(b => {
      const t = (b.innerText || '').trim();
      return t === 'close' && b.getBoundingClientRect().y > 600;
    });
    if (closeBtn) closeBtn.click();
  });
  await page.waitForTimeout(500);

  // 2. Type test prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('Create an image: Athletic female fitness model lying flat on back on black gym mat in hollow body hold.', { delay: 10 });
  await page.waitForTimeout(500);

  // 3. Inspect submit button state
  const btnInfo = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start generation"]') || document.querySelector('button.generate-icon-button');
    return btn ? {
      aria: btn.getAttribute('aria-label'),
      disabled: btn.disabled,
      rect: btn.getBoundingClientRect()
    } : null;
  });
  console.log('Generate button info before click:', btnInfo);

  // 4. Click using page.click on the exact coordinates
  if (btnInfo) {
    await page.mouse.click(btnInfo.rect.x + btnInfo.rect.width / 2, btnInfo.rect.y + btnInfo.rect.height / 2);
    console.log('Clicked submit button!');
  }

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_test_submit.png' });
  console.log('Saved screenshot to scripts/after_test_submit.png');

  await browser.close();
}

testSubmit().catch(console.error);
