import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function inspectFullPrompt() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const html = await page.evaluate(() => {
    const box = document.querySelector('div[aria-label="What do you want to create?"]');
    if (!box) return 'NO BOX';
    const parent = box.parentElement?.parentElement || box.parentElement;
    return parent.outerHTML;
  });
  console.log('Prompt area HTML:');
  console.log(html);

  await browser.close();
}

inspectFullPrompt().catch(console.error);
