import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function clickTheClose() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // The 'x' button is at the top right of the ingredient thumbnail strip
  // In the screenshot it's at roughly x: 958, y: 686
  await page.evaluate(() => {
    // Look specifically for elements with text 'close' or svg/material icon close
    const all = [...document.querySelectorAll('*')];
    const closeEl = all.find(el => {
      const t = el.innerText ? el.innerText.trim() : '';
      const r = el.getBoundingClientRect();
      return (t === 'close' || el.getAttribute('aria-label') === 'Clear ingredients') && r.y > 600 && r.y < 750 && r.x > 900;
    });
    if (closeEl) {
      console.log('Found close element:', closeEl.getBoundingClientRect());
      closeEl.click();
    } else {
      // Fallback coordinate click
      const el = document.elementFromPoint(958, 686);
      if (el) el.click();
    }
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_clean_close.png' });
  await browser.close();
}

clickTheClose().catch(console.error);
