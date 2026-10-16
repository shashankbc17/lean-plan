import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkScreen() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/screen_inspect_773.png' });

  // Get full text of the right panel
  const panelText = await page.evaluate(() => {
    const session = document.querySelector('flow-session, [class*="session"], [class*="chat"]') || document.body;
    return session.innerText;
  });
  console.log('Session text:');
  console.log(panelText.substring(panelText.length - 1200));

  await browser.close();
}

checkScreen().catch(console.error);
