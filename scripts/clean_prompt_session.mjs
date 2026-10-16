import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function clearPromptChips() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Look for close/remove buttons on chips
  const removeButtons = await page.locator('flow-ingredient-chip button, [aria-label*="remove" i], [aria-label*="delete" i], button:has-text("close")').all();
  console.log(`Found ${removeButtons.length} remove chip buttons`);
  for (const b of removeButtons) {
    if (await b.isVisible().catch(() => false)) {
      await b.click().catch(() => {});
    }
  }

  // 2. Clear prompt text
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(500);

  // 3. Or start new session
  const newSessionBtn = page.locator('button:has-text("edit_square")').first();
  if (await newSessionBtn.isVisible().catch(() => false)) {
    console.log('Clicking Start New Session to ensure 100% clean prompt context...');
    await newSessionBtn.click();
    await page.waitForTimeout(2000);
  }

  console.log('Clean prompt context ready!');
  await browser.close();
}

clearPromptChips();
