import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function startClean() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start new session"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'scripts/clean_session_started.png' });
  console.log('Clean session started!');
  await browser.close();
}

startClean().catch(console.error);
