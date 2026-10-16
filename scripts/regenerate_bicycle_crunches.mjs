import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const FEMALE_TARGET = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-bicycle-crunch-front.mp4';
const MALE_TARGET = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-bicycle-crunch-front.mp4';

const IMAGE_PROMPT = `Create an image: Athletic female fitness model lying completely flat on back on black gym mat in crisp bicycle crunch posture. Hands lightly resting behind head with elbows flared wide open. Left shoulder blade lifted off mat rotating inward, driving left elbow diagonally toward raised right knee bent at 90 degrees. Opposite left leg is extended straight out hovering just 6 inches above the floor, toes pointed forward. Perfect abdominal crunch posture, deep core flexion. Dark minimalist gym studio with dramatic cyan and neon-orange rim lights, high contrast, crisp biomechanical form, photorealistic 8k.`;

const MOTION_PROMPT = `First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition, do not switch to plank. Smooth continuous alternating bicycle crunches with tempo hold: rotating opposite elbow to lifted knee in a controlled 2-second hold, extending the opposite leg straight out, then fluidly switching sides with thoracic spinal rotation. Steady camera, 60fps.`;

async function clickSubmit(page) {
  const submitBtn = page.locator('button[aria-label="Start generation"]').last();
  await submitBtn.click();
}

async function navToVideos(page) {
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);
}

async function run() {
  console.log('Connecting to Google Flow via CDP...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Check video count before we start
  await navToVideos(page);
  const startCount = await page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile').count();
  console.log('Current video tiles count in Videos tab:', startCount);

  // Return to chat / canvas
  const allMediaBtn = page.locator('button').filter({ hasText: /All media/i }).first();
  if (await allMediaBtn.isVisible().catch(() => false)) {
    await allMediaBtn.click();
    await page.waitForTimeout(1500);
  }

  // 2. Start clean session
  console.log('Ensuring clean session...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start new session"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);

  // 3. Submit image prompt
  console.log('Focusing prompt box for image generation...');
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(IMAGE_PROMPT, { delay: 10 });
  await page.waitForTimeout(500);

  await clickSubmit(page);
  console.log('Submitted Bicycle Crunch image prompt! Waiting 25s for generation...');

  for (let i = 1; i <= 8; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 3) break;
  }
  console.log('Image generation settled!');
  await page.screenshot({ path: 'scripts/bicycle_img_ready.png' });

  // 4. Open ingredient picker and attach the new image
  console.log('Opening ingredient picker...');
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return;
    const imgTab = [...overlay.querySelectorAll('button, [role="tab"]')].find(t => (t.innerText || '').includes('Images'));
    if (imgTab) imgTab.click();
  });
  await page.waitForTimeout(1000);

  const overlay = page.locator('.cdk-overlay-container');
  const firstImage = overlay.locator('img, div[role="option"], flow-media-tile').first();
  await firstImage.click();
  await page.waitForTimeout(500);

  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    await page.waitForTimeout(1500);
  }
  console.log('Attached newly generated image as ingredient chip!');

  // 5. Submit motion prompt
  console.log('Typing motion prompt...');
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(800);

  await clickSubmit(page);
  console.log('Submitted motion prompt! Waiting for planning & Approve card...');

  // 6. Approve card loop
  let approved = false;
  for (let attempt = 1; attempt <= 25; attempt++) {
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
      await page.waitForTimeout(1500);
      approved = true;
      break;
    }
  }

  await page.screenshot({ path: 'scripts/bicycle_approved_state.png' });
  console.log('Saved scripts/bicycle_approved_state.png. Approved:', approved);

  // 7. Monitor render or queue completion
  console.log('Monitoring render/queue progress...');
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed or queued!');
      break;
    }
  }

  // 8. Download video
  console.log('Navigating to Videos tab for download...');
  await page.waitForTimeout(5000);
  await navToVideos(page);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const newCount = await videoTiles.count();
  console.log(`New video count: ${newCount} (was ${startCount})`);

  if (newCount <= startCount) {
    console.log('Waiting 15s for tile propagation in Videos tab...');
    await page.waitForTimeout(15000);
    await navToVideos(page);
  }

  const topVideo = videoTiles.first();
  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading authenticated video file...');
    const downloadPromise = page.waitForEvent('download', { timeout: 35000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(FEMALE_TARGET);
    fs.copyFileSync(FEMALE_TARGET, MALE_TARGET);

    const stats = fs.statSync(FEMALE_TARGET);
    console.log(`SUCCESS! Saved newly regenerated Bicycle Crunches video: ${stats.size} bytes`);
  } else {
    console.log('Download button not visible yet in viewer.');
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

run().catch(console.error);
