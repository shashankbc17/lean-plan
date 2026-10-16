import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function checkTiming() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const approveInfo = await page.evaluate(() => {
    const all = [...document.querySelectorAll('*')];
    return all.filter(el => {
      const t = el.innerText ? el.innerText.trim() : '';
      return (t === 'Approve' || t === 'Always approve' || t === 'check Approve') && el.children.length <= 2;
    }).map(el => {
      const r = el.getBoundingClientRect();
      return { text: el.innerText.trim(), x: r.x + r.width / 2, y: r.y + r.height / 2, visible: r.width > 0 && r.height > 0 && r.y > 0 && r.y < window.innerHeight };
    });
  });

  console.log('Approve cards in viewport:', approveInfo);
  await browser.close();
}

checkTiming();
