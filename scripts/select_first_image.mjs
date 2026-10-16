import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function selectImageOption() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Type: "Please animate the first image."
  console.log('Sending response to assistant...');
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('Please animate the first image.', { delay: 10 });
  await page.waitForTimeout(500);

  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted response! Waiting for Approve card...');

  // Poll for Approve card
  for (let attempt = 1; attempt <= 20; attempt++) {
    await page.waitForTimeout(3000);
    const approveCoords = await page.evaluate(() => {
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

    if (approveCoords) {
      console.log(`[${attempt * 3}s] Clicked approval button at (${approveCoords.x}, ${approveCoords.y})`);
      await page.mouse.click(approveCoords.x, approveCoords.y);
      break;
    }
    console.log(`[${attempt * 3}s] Waiting for approval...`);
  }

  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_select_first.png' });
  await browser.close();
}

selectImageOption().catch(console.error);
