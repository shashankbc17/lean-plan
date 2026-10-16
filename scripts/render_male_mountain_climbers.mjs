import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-mountain-climbers-front.mp4';
const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.';

async function runMaleMountainClimbers() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Open ingredients picker
  console.log('Opening ingredients picker...');
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1500);

  // 2. Find the Male Mountain Climber image tile ("Man holding push-up plank position")
  const overlay = page.locator('.cdk-overlay-container');
  const malePlankItem = overlay.locator('div[role="option"], flow-media-tile, flow-project-media-item, img[alt*="push-up" i], img[alt*="plank" i], [aria-label*="Man holding push-up plank" i]').first();
  console.log('Selecting Male Mountain Climber reference image...');
  await malePlankItem.click();
  await page.waitForTimeout(500);

  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    console.log('Added ingredient chip to prompt!');
    await page.waitForTimeout(1500);
  }

  // 3. Type motion prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 4. Submit prompt
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted motion prompt! Waiting for confirmation card...');

  // 5. Hard verification loop for APPROVE click
  let approvalConfirmed = false;
  for (let attempt = 1; attempt <= 10; attempt++) {
    await page.waitForTimeout(3000);

    // Look for Approve candidates in active viewport (y > 0 and visible)
    const approveCoords = await page.evaluate(() => {
      const all = [...document.querySelectorAll('*')];
      const items = all.filter(el => {
        const t = el.innerText ? el.innerText.trim() : '';
        return (t === 'Approve' || t === 'Always approve') && el.children.length <= 2;
      });
      for (const it of items) {
        const r = it.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.y > 100 && r.y < window.innerHeight) {
          return { text: it.innerText, x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
      }
      return null;
    });

    if (approveCoords) {
      console.log(`[Attempt ${attempt}] Found visible active card at (${approveCoords.x}, ${approveCoords.y}) [${approveCoords.text}]. Clicking!`);
      await page.mouse.click(approveCoords.x, approveCoords.y);
      await page.waitForTimeout(1500);
    }

    // VERIFICATION: Check if Stop button is visible (meaning video render actually started!)
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (stopVisible) {
      console.log('VERIFIED: Stop button is ACTIVE! Generation has definitely started.');
      approvalConfirmed = true;
      await page.screenshot({ path: 'scripts/male_climbers_render_started.png' });
      break;
    }
  }

  // FALLBACK CHECK: If approval was never confirmed, ABORT immediately and take screenshot
  if (!approvalConfirmed) {
    await page.screenshot({ path: 'scripts/approval_failed_state.png' });
    throw new Error('SAFETY CHECK FAILED: Approval was not confirmed by the Stop button. Download aborted to avoid downloading wrong/old videos.');
  }

  // 6. Monitor render completion
  console.log('Monitoring video rendering in Flow...');
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Video rendering active: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed!');
      break;
    }
  }

  // 7. Extra settlement wait
  await page.waitForTimeout(4000);

  // 8. Switch to Videos tab and download the NEWEST top video
  console.log('Switching to Videos tab...');
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click();
  await page.waitForTimeout(3000);

  const tiles = page.locator('flow-grid-tile-container, flow-media-tile, flow-video-tile');
  const count = await tiles.count();
  console.log(`Video tiles in project: ${count}`);

  if (count > 0) {
    const topTile = tiles.first();
    const title = await topTile.getAttribute('aria-label').catch(() => '');
    console.log('Newest top video tile title:', title);

    console.log('Opening player on top video tile...');
    await topTile.dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Triggering download from player...');
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      await downloadBtn.click();
      await page.waitForTimeout(500);

      const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
      if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await originalOption.click();
      }

      const download = await downloadPromise;
      await download.saveAs(TARGET_FILE);
      const stats = fs.statSync(TARGET_FILE);
      console.log(`SUCCESS! Saved Male Mountain Climbers MP4: ${stats.size} bytes`);
    }

    await page.keyboard.press('Escape');
  }

  await browser.close();
}

runMaleMountainClimbers().catch(err => {
  console.error('Execution error:', err.message);
  process.exit(1);
});
