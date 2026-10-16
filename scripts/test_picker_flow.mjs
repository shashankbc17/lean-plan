import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testPickerFlow() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Click "Add to prompt" button
  console.log('Clicking Add to prompt button...');
  const addBtn = page.locator('button:has-text("Add to prompt")').first();
  await addBtn.click();
  await page.waitForTimeout(2000);

  // 2. Take screenshot to see if thumbnail was replaced or added
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_add_to_prompt.png' });
  await browser.close();
}

testPickerFlow().catch(console.error);
