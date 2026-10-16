import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testSubmit() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  console.log('Inspecting submit button...');
  const submitBtns = await page.evaluate(() => {
    return [...document.querySelectorAll('button')].map((b, idx) => ({
      idx,
      ariaLabel: b.getAttribute('aria-label'),
      text: b.innerText,
      disabled: b.disabled,
      classes: b.className,
      rect: b.getBoundingClientRect()
    })).filter(x => /forward|arrow|start|send/i.test(x.ariaLabel || x.text));
  });
  console.log('Matching submit buttons:', submitBtns);

  if (submitBtns.length > 0) {
    const target = submitBtns[submitBtns.length - 1];
    console.log(`Clicking button at (${target.rect.x + 10}, ${target.rect.y + 10})...`);
    await page.mouse.click(target.rect.x + 10, target.rect.y + 10);
    await page.waitForTimeout(4000);
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_submit_test.png' });
  console.log('Saved screenshot to scripts/after_submit_test.png');

  await browser.close();
}

testSubmit().catch(console.error);
