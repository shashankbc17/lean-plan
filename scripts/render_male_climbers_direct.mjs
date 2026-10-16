import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-mountain-climbers-front.mp4';
const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.';

async function runFromCanvas() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Ensure any lingering modals are closed
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 2. Go to Images tab
  const imagesNav = page.locator('button, a').filter({ hasText: /Images/i }).first();
  await imagesNav.click();
  await page.waitForTimeout(2000);

  // 3. Scroll to find "Man holding push-up plank position"
  const grid = page.locator('.page-container');
  await grid.evaluate(el => el.scrollTop = el.scrollHeight);
  await page.waitForTimeout(1500);

  const malePlankTile = page.locator('flow-media-tile, flow-grid-tile-container').filter({ hasText: /Man holding push-up plank/i }).first();
  console.log('Found male plank tile:', await malePlankTile.isVisible().catch(() => false));

  // 4. Double click tile to open in full viewer
  await malePlankTile.dblclick({ force: true });
  await page.waitForTimeout(2500);

  // 5. Look for "Animate" or prompt input in viewer
  const promptBox = page.locator('div[aria-label="What do you want to change?"], div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 6. Submit motion prompt
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted motion prompt from image viewer!');

  // 7. Verify Approval & Wait for Stop button
  let verified = false;
  for (let attempt = 1; attempt <= 10; attempt++) {
    await page.waitForTimeout(3000);

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
      console.log(`Clicking Approve button at (${approveCoords.x}, ${approveCoords.y})...`);
      await page.mouse.click(approveCoords.x, approveCoords.y);
      await page.waitForTimeout(1500);
    }

    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (stopVisible) {
      console.log('VERIFIED: Stop button is active! Rendering has started.');
      verified = true;
      break;
    }
  }

  if (!verified) {
    await page.screenshot({ path: 'scripts/approval_error.png' });
    throw new Error('Approval not confirmed by Stop button.');
  }

  // 8. Monitor render completion
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Rendering: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Rendering finished!');
      break;
    }
  }

  await page.waitForTimeout(4000);

  // 9. Go to Videos tab and download the top video
  console.log('Navigating to Videos tab...');
  // Press Escape to close any viewer
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click();
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-video-tile, flow-grid-tile-container');
  const count = await videoTiles.count();
  console.log(`Video count in tab: ${count}`);

  if (count > 0) {
    const topVideo = videoTiles.first();
    console.log('Opening top video player:', await topVideo.getAttribute('aria-label').catch(() => ''));
    await topVideo.dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Triggering download...');
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      await downloadBtn.click();
      await page.waitForTimeout(500);

      const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
      if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await originalOption.click();
      }

      const download = await downloadPromise;
      await download.saveAs(TARGET_FILE);
      console.log(`SUCCESS! Downloaded Male Mountain Climbers: ${fs.statSync(TARGET_FILE).size} bytes`);
    }

    await page.keyboard.press('Escape');
  }

  await browser.close();
}

runFromCanvas().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
