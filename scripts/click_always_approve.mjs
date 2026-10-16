import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function clickApproval() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Search for 'Always approve' or 'Approve'
  const options = await page.locator('div, button, span').filter({ hasText: /^Always approve$/i }).all();
  console.log('Always approve candidates:', options.length);

  let clicked = false;
  for (const opt of options) {
    if (await opt.isVisible().catch(() => false)) {
      console.log('Clicking Always approve option...');
      await opt.click({ force: true });
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    const approveOptions = await page.locator('div, button, span').filter({ hasText: /^Approve$/i }).all();
    for (const opt of approveOptions) {
      if (await opt.isVisible().catch(() => false)) {
        console.log('Clicking Approve option...');
        await opt.click({ force: true });
        clicked = true;
        break;
      }
    }
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'scripts/flow_approved_state.png' });
  console.log('Saved flow_approved_state.png');

  await browser.close();
}

clickApproval();
