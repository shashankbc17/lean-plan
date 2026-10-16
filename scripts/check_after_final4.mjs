import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function check() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_after_final4.png' });
  const chatSnippets = await page.evaluate(() => {
    return [...document.querySelectorAll('flow-chat-message, [class*="message"], p')].slice(-8).map(p => (p.innerText || '').substring(0, 150));
  });
  console.log('Chat snippets:', chatSnippets);
  await browser.close();
}
check().catch(console.error);
