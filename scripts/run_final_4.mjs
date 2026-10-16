import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const FINAL_4 = [
  // 1. Female Flutter Kicks
  {
    name: 'Female Flutter Kicks',
    gender: 'female',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4',
    imagePrompt: 'Create an image: Athletic female fitness model lying flat on back on black gym mat in hollow body hold, shoulder blades elevated 2 inches, lower back pressed into floor, straight legs hovered 6 inches off ground with toes pointed. Dark minimalist gym studio with cyan and neon-orange rim lights, side 45-degree angle, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. Smooth continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.'
  },
  // 2. Male Speed Skaters
  {
    name: 'Male Speed Skaters',
    gender: 'male',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-speed-skaters-front.mp4',
    imagePrompt: 'Create an image: Athletic male fitness model in dark compression shorts and athletic tank, balanced low in mid-lateral skating leap on right leg with knee bent 60 degrees, left leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. Smooth lateral bounding side-to-side skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.'
  },
  // 3. Female Speed Skaters
  {
    name: 'Female Speed Skaters',
    gender: 'female',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-speed-skaters-front.mp4',
    imagePrompt: 'Create an image: Athletic female fitness model in dark gym shorts and sports bra, balanced low in mid-lateral skating leap on left leg with knee bent 60 degrees, right leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. Smooth lateral bounding side-to-side skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.'
  },
  // 4. Male Jumping Jacks to Cross Punches
  {
    name: 'Male Jumping Jacks to Cross Punches',
    gender: 'male',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-jumping-jacks-punches-front.mp4',
    imagePrompt: 'Create an image: Athletic male boxer in dark training apparel, standing in crisp athletic boxing stance with fists guarding chin, ready to strike. Dark minimalist gym studio with vibrant neon cyan and orange rim lighting, front eye-level view, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. 2 crisp jumping jacks immediately followed by 4 sharp alternating cross punches with torso rotation, fluid athletic rhythm, steady front camera, 60fps.'
  }
];

async function navToVideos(page) {
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(2500);
}

async function startFreshSession(page) {
  console.log('Starting fresh session via header edit_square...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start new session"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2500);
}

async function clickSubmit(page) {
  // Click via evaluate to avoid locator interception
  await page.evaluate(() => {
    const submitBtn = [...document.querySelectorAll('button')].find(b => {
      const aria = b.getAttribute('aria-label') || '';
      const text = b.innerText || '';
      return aria.includes('Start generation') || text.includes('arrow_forward');
    });
    if (submitBtn) submitBtn.click();
  });
}

async function processOne(item, page) {
  console.log('\n============================================================');
  console.log(`PROCESSING: ${item.name}`);
  console.log(`TARGET: ${item.targetFile}`);
  console.log('============================================================');

  if (fs.existsSync(item.targetFile) && fs.statSync(item.targetFile).size > 1500000) {
    console.log(`File already exists (${fs.statSync(item.targetFile).size} bytes). Skipping.`);
    return true;
  }

  // 1. Initial video count
  await navToVideos(page);
  const startVideoCount = await page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile').count();
  console.log(`Initial video count: ${startVideoCount}`);

  // 2. Fresh session
  await startFreshSession(page);

  // 3. Generate reference image
  console.log('Generating reference image...');
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(item.imagePrompt, { delay: 10 });
  await page.waitForTimeout(500);

  await clickSubmit(page);
  console.log('Submitted image prompt. Waiting for image generation...');

  for (let i = 1; i <= 10; i++) {
    await page.waitForTimeout(4000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (!stopVisible && i >= 3) break;
  }
  console.log('Reference image generated!');
  await page.waitForTimeout(2000);

  // 4. Attach image as ingredient
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

  // 5. Type motion prompt
  console.log('Typing motion prompt...');
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(item.motionPrompt, { delay: 10 });
  await page.waitForTimeout(800);

  await clickSubmit(page);
  console.log('Submitted motion prompt! Waiting for planning / approval (up to 90s)...');

  // 6. Approval loop (up to 30 attempts = 90s)
  let approved = false;
  for (let attempt = 1; attempt <= 30; attempt++) {
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
      approved = true;
      break;
    }
  }

  if (!approved) {
    throw new Error('Approval card did not appear within 90s');
  }

  // 7. Monitor render or queue completion (up to 90s)
  console.log('Monitoring generation render/queue...');
  for (let i = 1; i <= 18; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed or queued!');
      break;
    }
  }

  // Allow Flow CDN to register the tile
  await page.waitForTimeout(6000);

  // 8. Download video
  await navToVideos(page);
  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const newCount = await videoTiles.count();
  console.log(`New video count: ${newCount} (was ${startVideoCount})`);

  // Wait if tile needs an extra 10s to appear
  if (newCount <= startVideoCount) {
    console.log('Waiting 10s for new video tile to appear...');
    await page.waitForTimeout(10000);
    await navToVideos(page);
  }

  const topVideo = videoTiles.first();
  const title = await topVideo.getAttribute('aria-label').catch(() => '');
  console.log('Opening top video tile:', title);

  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading authenticated video file...');
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(item.targetFile);
    const stats = fs.statSync(item.targetFile);
    console.log(`SUCCESS! Saved ${item.name}: ${stats.size} bytes`);
  }

  await page.keyboard.press('Escape');
  return true;
}

async function run() {
  console.log(`Starting Final 4 queue...`);
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  for (let idx = 0; idx < FINAL_4.length; idx++) {
    const item = FINAL_4[idx];
    try {
      await processOne(item, page);
      console.log(`>>> FINISHED (${idx + 1}/${FINAL_4.length}): ${item.name}`);
    } catch (err) {
      console.error(`>>> ERROR on ${item.name}:`, err.message);
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(3000);
    }
  }

  await browser.close();
  console.log('ALL FINAL 4 FINISHED!');
}

run().catch(console.error);
