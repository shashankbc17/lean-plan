import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete rhythmically driving alternate knees to hip height with bouncy ball-of-foot contact, arms pumping in sync, upright posture, steady tripod camera, 60fps.';

async function triggerAnimation() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Open ingredients picker
  console.log('Opening ingredients picker...');
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1500);

  // 2. Select top image (the female high knees still we just generated)
  const overlay = page.locator('.cdk-overlay-container');
  const imageItem = overlay.locator('img, flow-media-tile, div[role="option"], flow-project-media-item').first();
  console.log('Selecting Female High Knees image...');
  await imageItem.click();
  await page.waitForTimeout(500);

  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    console.log('Added image chip to prompt!');
    await page.waitForTimeout(1500);
  }

  // 3. Type motion prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 4. Submit prompt
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted motion prompt! Checking for confirmation card...');

  // 5. Look for approval button (Approve / Always approve)
  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(4000);
    const approveBtn = page.locator('button, div').filter({ hasText: /^Approve$/i }).last();
    const alwaysApproveBtn = page.locator('button, div').filter({ hasText: /^Always approve$/i }).last();

    if (await alwaysApproveBtn.isVisible().catch(() => false)) {
      console.log('Clicking Always approve...');
      await alwaysApproveBtn.click({ force: true });
      await page.waitForTimeout(1000);
      if (await approveBtn.isVisible().catch(() => false)) {
        await approveBtn.click({ force: true });
      }
      break;
    } else if (await approveBtn.isVisible().catch(() => false)) {
      console.log('Clicking Approve...');
      await approveBtn.click({ force: true });
      break;
    }
  }

  await page.screenshot({ path: 'scripts/flow_high_knees_rendering.png' });
  console.log('Saved screenshot scripts/flow_high_knees_rendering.png');
  await browser.close();
}

triggerAnimation();
