import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function clickTheApprovalButton() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Inspect the exact DOM elements inside the approval card
  const buttonInfo = await page.evaluate(() => {
    // Look for elements with text Approve, Always approve
    const all = [...document.querySelectorAll('*')];
    const targets = all.filter(el => {
      const t = el.innerText ? el.innerText.trim() : '';
      return (t === 'Approve' || t === 'Always approve' || t === 'check Approve') && el.children.length <= 2;
    });

    const info = [];
    for (const t of targets) {
      const rect = t.getBoundingClientRect();
      info.push({
        tag: t.tagName,
        text: t.innerText,
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        visible: rect.width > 0 && rect.height > 0
      });
    }
    return info;
  });

  console.log('Approval button candidates:', buttonInfo);

  // Click using exact mouse coordinates on the Approve row
  for (const b of buttonInfo) {
    if (b.text.includes('Approve') && b.visible && b.y > 200) {
      console.log(`Clicking at exact coordinate (${b.x}, ${b.y}) for [${b.text}]...`);
      await page.mouse.click(b.x, b.y);
      await page.waitForTimeout(1000);
      break;
    }
  }

  // Check if Stop button appeared (video started rendering!)
  const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
  console.log('Stop button visible (Video actively rendering):', stopVisible);

  await page.screenshot({ path: 'scripts/flow_after_coordinate_click.png' });
  await browser.close();
}

clickTheApprovalButton();
