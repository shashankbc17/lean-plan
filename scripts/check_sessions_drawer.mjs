import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkPastSessions() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const menuBtn = page.locator('button:has-text("menu"), [aria-label*="session" i]').first();
  await menuBtn.click();
  await page.waitForTimeout(1000);

  const list = await page.evaluate(() => {
    return [...document.querySelectorAll('div, button, li')].filter(el => {
      const c = el.className || '';
      return (c.includes('session') || c.includes('history')) && el.innerText;
    }).map(el => el.innerText.slice(0, 100).replace(/\n/g, ' '));
  });

  console.log('Sessions list:', list.slice(0, 8));
  await page.screenshot({ path: 'scripts/sessions_drawer.png' });
  await browser.close();
}

checkPastSessions();
