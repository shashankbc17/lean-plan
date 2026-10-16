import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function approvePending() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const approveInfo = await page.evaluate(() => {
    const list = [...document.querySelectorAll('button, div[role="button"]')].filter(b => {
      const t = (b.innerText || '').trim();
      return t === 'Approve';
    });
    return list.map(b => {
      const r = b.getBoundingClientRect();
      return { text: b.innerText, x: r.x + r.width/2, y: r.y + r.height/2, w: r.width, h: r.height };
    });
  });
  console.log('Approve candidates:', approveInfo);

  if (approveInfo.length > 0) {
    const target = approveInfo[approveInfo.length - 1];
    console.log('Clicking target:', target);
    await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(3000);
  }

  await page.screenshot({ path: 'scripts/after_pending_approved.png' });
  console.log('Saved scripts/after_pending_approved.png');
  await browser.close();
}

approvePending().catch(console.error);
