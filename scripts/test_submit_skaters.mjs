import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testSubmit() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  console.log('Submitting female skaters prompt...');
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_submit_skaters.png' });
  await browser.close();
}

testSubmit().catch(console.error);
