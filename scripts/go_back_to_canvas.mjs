import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function goBack() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const back = page.locator('button[aria-label*="Back button" i], button:has-text("arrow_back")').first();
  if (await back.isVisible().catch(() => false)) {
    await back.click();
    console.log('Clicked back button!');
  } else {
    await page.keyboard.press('Escape');
    console.log('Pressed Escape');
  }
  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());
  await browser.close();
}

goBack();
