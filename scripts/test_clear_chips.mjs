import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

async function testClearChips() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // Look for the "x" button that closes the ingredient chips
  const closeBtn = page.locator('button:has-text("close"), [aria-label*="remove" i], [aria-label*="close" i], .chip-container button, flow-rich-text-editor button, button:has(.google-symbols:has-text("close"))').first();
  console.log('Close button visible:', await closeBtn.isVisible().catch(() => false));

  // Also check all buttons inside or near the prompt box container
  const promptBoxContainerButtons = await page.evaluate(() => {
    // Find the 'x' button inside the ingredients preview
    const btns = [...document.querySelectorAll('button')];
    return btns.map(b => ({
      text: b.innerText,
      aria: b.getAttribute('aria-label'),
      rect: b.getBoundingClientRect()
    })).filter(x => x.rect.y > 600 && x.rect.x > 800);
  });
  console.log('Buttons in bottom right area:', promptBoxContainerButtons);

  // Click the 'x' button (in screenshot it is at top right of the ingredient thumbnail strip)
  // Let's find the 'close' icon button near y: 670-710, x: 940-980
  const xBtn = promptBoxContainerButtons.find(b => (b.text || '').includes('close') || (b.aria || '').includes('close') || (b.rect.y > 650 && b.rect.y < 720));
  if (xBtn) {
    console.log('Clicking X button at:', xBtn.rect);
    await page.mouse.click(xBtn.rect.x + 10, xBtn.rect.y + 10);
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/after_clear_chips.png' });
  await browser.close();
}

testClearChips().catch(console.error);
