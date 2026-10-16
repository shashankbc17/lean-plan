import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-mountain-climbers-front.mp4';
const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.';

async function renderMaleClimberFromMainCanvas() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Click Add Ingredients
  console.log('Opening ingredients picker from main canvas...');
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // 2. Select the Male Mountain Climber image chip
  const overlay = page.locator('.cdk-overlay-container');
  // It is the plank image (Tile 8)
  const imageItems = await overlay.locator('div[role="option"], flow-media-tile, flow-project-media-item, [role="menuitem"], flow-gallery-item, div.media-item').all();
  console.log('Overlay image items found:', imageItems.length);

  let clickedItem = false;
  for (const it of imageItems) {
    const text = (await it.innerText().catch(() => '')).toLowerCase();
    const aria = (await it.getAttribute('aria-label').catch(() => '')).toLowerCase();
    if (text.includes('plank') || aria.includes('plank') || aria.includes('man holding push-up')) {
      console.log('Clicking target image item:', aria || text);
      await it.click({ force: true });
      clickedItem = true;
      break;
    }
  }

  // Fallback to top-middle image if text not matched
  if (!clickedItem && imageItems.length > 0) {
    console.log('Clicking first available image item in overlay...');
    await imageItems[0].click({ force: true });
    clickedItem = true;
  }

  await page.waitForTimeout(500);

  // Click 'Add to prompt'
  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    console.log('Clicked Add to prompt!');
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

  // 4. Submit
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted motion prompt! Checking for active Approve button in viewport...');

  // 5. Strict Approve Verification Loop
  let approved = false;
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
      console.log(`Clicking Approve button at (${approveCoords.x}, ${approveCoords.y}) [${approveCoords.text}]...`);
      await page.mouse.click(approveCoords.x, approveCoords.y);
      await page.waitForTimeout(1500);
    }

    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (stopVisible) {
      console.log('VERIFIED: Stop button is active! Video is rendering in Flow.');
      approved = true;
      break;
    }
  }

  if (!approved) {
    await page.screenshot({ path: 'scripts/male_climber_approval_fail.png' });
    throw new Error('Approval not confirmed by active Stop button.');
  }

  // 6. Monitor render completion
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Video rendering: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed!');
      break;
    }
  }

  await page.waitForTimeout(4000);

  // 7. Go to Videos tab and download the top video
  console.log('Switching to Videos tab...');
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click({ force: true });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-video-tile, flow-grid-tile-container');
  const count = await videoTiles.count();
  console.log(`Videos in project: ${count}`);

  if (count > 0) {
    const topVideo = videoTiles.first();
    const title = await topVideo.getAttribute('aria-label').catch(() => '');
    console.log('Opening top video player:', title);
    await topVideo.dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Triggering download from video player...');
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
      console.log(`SUCCESS! Downloaded Male Mountain Climbers MP4: ${stats.size} bytes`);
    }

    await page.keyboard.press('Escape');
  }

  await browser.close();
}

renderMaleClimberFromMainCanvas().catch(err => {
  console.error('Execution error:', err.message);
  process.exit(1);
});
