import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const QUEUE = [
  // 1. Male Flutter Kicks
  {
    name: 'Male Flutter Kicks',
    gender: 'male',
    slug: 'flutter-kicks',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-flutter-kicks-front.mp4',
    imagePrompt: 'Create an image: Athletic male fitness model lying flat on back on black gym mat in hollow body hold, shoulder blades elevated 2 inches, lower back pressed into floor, straight legs hovered 6 inches off ground with toes pointed. Dark minimalist gym studio with cyan and neon-orange rim lights, side 45-degree angle, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. Smooth continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.'
  },
  // 2. Female Flutter Kicks
  {
    name: 'Female Flutter Kicks',
    gender: 'female',
    slug: 'flutter-kicks',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4',
    imagePrompt: 'Create an image: Athletic female fitness model lying flat on back on black gym mat in hollow body hold, shoulder blades elevated 2 inches, lower back pressed into floor, straight legs hovered 6 inches off ground with toes pointed. Dark minimalist gym studio with cyan and neon-orange rim lights, side 45-degree angle, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. Smooth continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.'
  },
  // 3. Male Speed Skaters
  {
    name: 'Male Speed Skaters',
    gender: 'male',
    slug: 'speed-skaters',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-speed-skaters-front.mp4',
    imagePrompt: 'Create an image: Athletic male fitness model in dark compression shorts and athletic tank, balanced low in mid-lateral skating leap on right leg with knee bent 60 degrees, left leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. Smooth lateral bounding side-to-side skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.'
  },
  // 4. Female Speed Skaters
  {
    name: 'Female Speed Skaters',
    gender: 'female',
    slug: 'speed-skaters',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-speed-skaters-front.mp4',
    imagePrompt: 'Create an image: Athletic female fitness model in dark gym shorts and sports bra, balanced low in mid-lateral skating leap on left leg with knee bent 60 degrees, right leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. Smooth lateral bounding side-to-side skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.'
  },
  // 5. Male Jumping Jacks to Cross Punches
  {
    name: 'Male Jumping Jacks to Cross Punches',
    gender: 'male',
    slug: 'jumping-jacks-punches',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-jumping-jacks-punches-front.mp4',
    imagePrompt: 'Create an image: Athletic male boxer in dark training apparel, standing in crisp athletic boxing stance with fists guarding chin, ready to strike. Dark minimalist gym studio with vibrant neon cyan and orange rim lighting, front eye-level view, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. 2 crisp jumping jacks immediately followed by 4 sharp alternating cross punches with torso rotation, fluid athletic rhythm, steady front camera, 60fps.'
  },
  // 6. Female Jumping Jacks to Cross Punches
  {
    name: 'Female Jumping Jacks to Cross Punches',
    gender: 'female',
    slug: 'jumping-jacks-punches',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-jumping-jacks-punches-front.mp4',
    imagePrompt: 'Create an image: Athletic female boxer in dark training apparel and sports bra, standing in crisp athletic boxing stance with fists guarding chin, ready to strike. Dark minimalist gym studio with vibrant neon cyan and orange rim lighting, front eye-level view, high contrast, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. 2 crisp jumping jacks immediately followed by 4 sharp alternating cross punches with torso rotation, fluid athletic rhythm, steady front camera, 60fps.'
  },
  // 7. Male Active Plank Shoulder Taps
  {
    name: 'Male Active Plank Shoulder Taps',
    gender: 'male',
    slug: 'plank-shoulder-taps',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-plank-shoulder-taps-front.mp4',
    imagePrompt: 'Create an image: Athletic male fitness model in high push-up plank on black gym mat, left hand lifted tapping right shoulder, core braced with completely flat and level hips, feet slightly wider than shoulders. Dark minimalist gym studio, neon cyan rim light, front 45-degree angle, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. Controlled alternating shoulder taps from high plank, hips staying rock solid and level without rocking or twisting, slow steady tempo, 60fps.'
  },
  // 8. Female Active Plank Shoulder Taps
  {
    name: 'Female Active Plank Shoulder Taps',
    gender: 'female',
    slug: 'plank-shoulder-taps',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-plank-shoulder-taps-front.mp4',
    imagePrompt: 'Create an image: Athletic female fitness model in high push-up plank on black gym mat, right hand lifted tapping left shoulder, core braced with completely flat and level hips, feet slightly wider than shoulders. Dark minimalist gym studio, neon cyan rim light, front 45-degree angle, photorealistic 8k.',
    motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. Controlled alternating shoulder taps from high plank, hips staying rock solid and level without rocking or twisting, slow steady tempo, 60fps.'
  }
];

async function navTo(page, category) {
  await page.evaluate((cat) => {
    const btn = [...document.querySelectorAll('[role="navigation"] button, [role="navigation"] a')].find(b => {
      const text = b.innerText || '';
      if (cat === 'videos') return text.includes('videocam') || text.includes('Videos');
      if (cat === 'images') return text.includes('image') || text.includes('Images');
      return false;
    });
    if (btn) btn.click();
  }, category);
  await page.waitForTimeout(2000);
}

async function processQueueItem(item, page) {
  console.log('\n============================================================');
  console.log(`STARTING: ${item.name}`);
  console.log(`TARGET: ${item.targetFile}`);
  console.log('============================================================');

  // Check initial video count
  await navTo(page, 'videos');
  const startCount = await page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile').count();
  console.log(`Initial video count in project: ${startCount}`);

  // 1. Fresh session
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('edit_square'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(1500);

  // 2. Generate reference image
  console.log('Generating locked reference image...');
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(item.imagePrompt, { delay: 10 });
  await page.waitForTimeout(500);

  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted image prompt. Waiting for generation...');

  for (let i = 1; i <= 8; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (!stopVisible && i >= 3) break;
  }
  console.log('Reference image generated!');
  await page.waitForTimeout(2000);

  // 3. Attach image as ingredient
  console.log('Attaching image ingredient...');
  const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addBtn.click();
  await page.waitForTimeout(1500);

  // Filter to Images tab in picker
  await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return;
    const imgTab = [...overlay.querySelectorAll('button, [role="tab"]')].find(t => (t.innerText || '').includes('Images'));
    if (imgTab) imgTab.click();
  });
  await page.waitForTimeout(1000);

  // Pick first image
  const overlay = page.locator('.cdk-overlay-container');
  const firstImage = overlay.locator('img, div[role="option"], flow-media-tile').first();
  await firstImage.click();
  await page.waitForTimeout(500);

  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    await page.waitForTimeout(1500);
  }

  // 4. Type motion prompt with Strict First-Frame Lock
  console.log('Typing motion prompt with strict character lock...');
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(item.motionPrompt, { delay: 10 });
  await page.waitForTimeout(1000);

  await submitBtn.click();
  console.log('Submitted motion prompt! Polling approval card...');

  // 5. Active Approve Loop
  let approved = false;
  for (let attempt = 1; attempt <= 15; attempt++) {
    await page.waitForTimeout(3000);

    const approveCoords = await page.evaluate(() => {
      const all = [...document.querySelectorAll('*')];
      const items = all.filter(el => {
        const t = el.innerText ? el.innerText.trim() : '';
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
      console.log(`Clicking Approve button at (${approveCoords.x}, ${approveCoords.y})...`);
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
    throw new Error('Approval not verified by active Stop button.');
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

  // 7. Verify count increase & download
  await navTo(page, 'videos');
  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const newCount = await videoTiles.count();
  console.log(`New video count: ${newCount} (was ${startCount})`);

  if (newCount > startCount) {
    const topVideo = videoTiles.first();
    const title = await topVideo.getAttribute('aria-label').catch(() => '');
    console.log('Opening newly created video tile:', title);

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
  } else {
    throw new Error(`Video count did not increase (Initial: ${startCount}, New: ${newCount}).`);
  }
}

async function runAll() {
  console.log(`Connecting to Flow Chrome. Total queue items: ${QUEUE.length}...`);
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  for (let idx = 0; idx < QUEUE.length; idx++) {
    const item = QUEUE[idx];
    try {
      await processQueueItem(item, page);
      console.log(`>>> FINISHED (${idx + 1}/${QUEUE.length}): ${item.name}`);
    } catch (err) {
      console.error(`>>> FAILED (${idx + 1}/${QUEUE.length}) ${item.name}:`, err.message);
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(3000);
    }
  }

  await browser.close();
  console.log('ALL REMAINING BATCHES PROCESSED!');
}

runAll().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
