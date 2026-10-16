import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';

const PROMPT = 'Create an image: Athletic female fitness model in dark gym compression shorts and sports bra, mid-stride in sprint march with right knee driven high to 90 degrees parallel to floor, toes dorsiflexed, left arm pumped forward, 5 degree athletic forward lean. Dark minimalist gym studio with dramatic cyan and neon-orange rim lighting, side-front 45-degree angle, high contrast, crisp edge definition, photorealistic 8k.';

async function genImage() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Focus prompt box
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 2. Submit prompt
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted Female High Knees image prompt! Waiting 25s for render...');

  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Image rendering: ${stopVisible}`);
    if (!stopVisible && i >= 3) break;
  }

  await page.screenshot({ path: 'scripts/female_high_knees_img_result.png' });
  console.log('Finished! Saved scripts/female_high_knees_img_result.png');

  await browser.close();
}

genImage();
