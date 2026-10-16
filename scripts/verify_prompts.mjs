import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function verifyPrompts() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const chatMessages = await page.evaluate(() => {
    const bubbles = document.querySelectorAll('*');
    const prompts = [];
    for (const b of bubbles) {
      const text = b.innerText;
      if (text && text.includes('Create an image:') && text.length < 500) {
        if (!prompts.includes(text)) prompts.push(text);
      }
    }
    return prompts;
  });

  console.log('--- GENERATED IMAGE PROMPTS IN PROJECT ---');
  chatMessages.forEach((p, i) => console.log(`Prompt ${i + 1}:\n${p}\n`));

  await browser.close();
}

verifyPrompts();
