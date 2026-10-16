import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function expandSidebar() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const expandBtn = page.locator('button:has-text("left_panel_open")').first();
  if (await expandBtn.isVisible().catch(() => false)) {
    await expandBtn.click();
    console.log('Clicked expand button!');
    await page.waitForTimeout(1000);
  }

  await browser.close();
}

expandSidebar();
