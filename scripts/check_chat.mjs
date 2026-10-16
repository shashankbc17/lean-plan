import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkChat() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Inspect the right panel (chat/session history)
  const chatInfo = await page.evaluate(() => {
    // Find all elements in the right sidebar/chat panel
    const msgs = [...document.querySelectorAll('flow-chat-message, [class*="message"], [class*="session"]')];
    const cards = [...document.querySelectorAll('flow-assistant-plan, [class*="plan"], [class*="approval"], button')].map(b => ({
      text: b.innerText ? b.innerText.substring(0, 100) : '',
      role: b.getAttribute('role'),
      class: b.className
    })).filter(x => /approve|cancel|stop|confirm|generating|error/i.test(x.text));

    return {
      messageCount: msgs.length,
      buttonsOrPlans: cards
    };
  });

  console.log('Chat Info:', JSON.stringify(chatInfo, null, 2));

  // Also check if the bottom prompt box still has text
  const promptValue = await page.evaluate(() => {
    const box = document.querySelector('div[aria-label="What do you want to create?"]');
    return box ? box.innerText : null;
  });
  console.log('Current prompt box text:', promptValue);

  await browser.close();
}

checkChat().catch(console.error);
