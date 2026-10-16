import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function waitApprove() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  for (let attempt = 1; attempt <= 20; attempt++) {
    await page.waitForTimeout(3000);
    const coords = await page.evaluate(() => {
      const items = [...document.querySelectorAll('*')].filter(el => {
        const t = (el.innerText || '').trim();
        return (t === 'Approve' || t === 'Always approve' || t === 'check Approve') && el.children.length <= 2;
      });
      for (const it of items) {
        const r = it.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.y > 100 && r.y < window.innerHeight) {
          return { text: it.innerText.trim(), x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
      }
      return null;
    });

    if (coords) {
      console.log('FOUND APPROVE:', coords);
      await page.mouse.click(coords.x, coords.y);
      console.log('CLICKED APPROVE!');
      break;
    }

    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${attempt * 3}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && attempt >= 5) break;
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_wait_approve.png' });
  await browser.close();
}

waitApprove().catch(console.error);
