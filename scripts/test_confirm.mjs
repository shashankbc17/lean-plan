import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testConfirm() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('Yes, animate the first male athlete plank shoulder tap image we just generated with the prompt above.', { delay: 10 });
  await page.waitForTimeout(500);

  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted confirmation answer! Waiting 15s to check assistant response...');

  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_confirm.png' });
  console.log('Saved screenshot to scripts/after_confirm.png');

  await browser.close();
}

testConfirm().catch(console.error);
