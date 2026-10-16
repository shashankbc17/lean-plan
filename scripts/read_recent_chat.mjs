import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function readChat() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const texts = await page.evaluate(() => {
    const chat = document.querySelector('.chat-history-container') || document.body;
    return chat.innerText.slice(-600);
  });
  console.log('--- RECENT CHAT MESSAGES ---');
  console.log(texts);

  await browser.close();
}

readChat();
