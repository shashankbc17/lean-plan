import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-mountain-climbers-front.mp4';
const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.';

async function renderFemaleMountainClimbers() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Initial video count in Videos tab
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click({ force: true });
  await page.waitForTimeout(2000);
  const initialVideoCount = await page.locator('flow-media-tile, flow-video-tile, flow-grid-tile-container').count();
  console.log(`Initial video count in Videos tab: ${initialVideoCount}`);

  // 2. Start a fresh chat session to prevent prompt chip clutter
  const newChatBtn = page.locator('button:has-text("edit_square"), button[aria-label*="Start new session" i]').first();
  if (await newChatBtn.isVisible().catch(() => false)) {
    console.log('Starting fresh chat session...');
    await newChatBtn.click();
    await page.waitForTimeout(1500);
  }

  // 3. Open ingredients picker
  console.log('Opening ingredients picker...');
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // Filter to Images category
  const imagesTabInPicker = page.locator('.cdk-overlay-container button, .cdk-overlay-container [role="tab"]').filter({ hasText: /Images/i }).first();
  if (await imagesTabInPicker.isVisible().catch(() => false)) {
    console.log('Filtering picker by Images category...');
    await imagesTabInPicker.click();
    await page.waitForTimeout(1000);
  }

  // 4. Select the Female Plank image ("Woman holding push-up plank position")
  const overlay = page.locator('.cdk-overlay-container');
  const femalePlankTile = overlay.locator('img, div[role="option"], flow-media-tile, flow-project-media-item').filter({ hasText: /Woman holding push-up plank|Woman.*push-up/i }).first();
  
  if (await femalePlankTile.isVisible().catch(() => false)) {
    console.log('Found Female Plank Image! Clicking...');
    await femalePlankTile.click();
  } else {
    console.log('Searching for plank image tile in overlay options...');
    const allOptions = await overlay.locator('div[role="option"], flow-media-tile, flow-project-media-item').all();
    for (const opt of allOptions) {
      const aria = (await opt.getAttribute('aria-label').catch(() => '')).toLowerCase();
      if (aria.includes('woman') && aria.includes('plank')) {
        console.log('Found option with aria:', aria);
        await opt.click();
        break;
      }
    }
  }
  await page.waitForTimeout(500);

  // Click 'Add to prompt'
  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    console.log('Attached Female Plank image chip to prompt!');
    await page.waitForTimeout(1500);
  }

  // 5. Type motion prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 6. Submit prompt
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted motion prompt! Waiting for approval card...');

  // 7. Polling approval card in active viewport
  let approved = false;
  for (let attempt = 1; attempt <= 15; attempt++) {
    await page.waitForTimeout(3000);

    const approveCoords = await page.evaluate(() => {
      const all = [...document.querySelectorAll('*')];
      const items = all.filter(el => {
        const t = el.innerText ? el.innerText.trim() : '';
        return (t === 'Approve' || t === 'Always approve' || t === 'check Approve' || t === 'check Always approve') && el.children.length <= 2;
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
      console.log(`[Attempt ${attempt}] Clicking Approve button at (${approveCoords.x}, ${approveCoords.y}) [${approveCoords.text}]...`);
      await page.mouse.click(approveCoords.x, approveCoords.y);
      await page.waitForTimeout(1500);
    }

    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (stopVisible) {
      console.log('VERIFIED: Stop button is active! Female Mountain Climbers video is rendering in Flow.');
      approved = true;
      break;
    }
  }

  if (!approved) {
    await page.screenshot({ path: 'scripts/female_climbers_approval_fail.png' });
    throw new Error('Approval not verified by active Stop button.');
  }

  // 8. Monitor render completion
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

  // 9. Go to Videos tab and verify video count increased
  console.log('Switching to Videos tab...');
  await videosNav.click({ force: true });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-video-tile, flow-grid-tile-container');
  const newVideoCount = await videoTiles.count();
  console.log(`New video count: ${newVideoCount} (Initial was ${initialVideoCount})`);

  if (newVideoCount > initialVideoCount) {
    const topVideo = videoTiles.first();
    const title = await topVideo.getAttribute('aria-label').catch(() => '');
    console.log('Verified newly created video tile:', title);

    await topVideo.dblclick({ force: true });
    await page.waitForTimeout(3000);

    const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      console.log('Downloading authenticated video...');
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
      console.log(`SUCCESS! Downloaded Female Mountain Climbers MP4: ${stats.size} bytes`);
    }

    await page.keyboard.press('Escape');
  } else {
    throw new Error(`Video count did not increase (Initial: ${initialVideoCount}, New: ${newVideoCount}). No new video was created.`);
  }

  await browser.close();
}

renderFemaleMountainClimbers().catch(err => {
  console.error('Execution error:', err.message);
  process.exit(1);
});
