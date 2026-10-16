import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET = {
  name: 'Female Flutter Kicks',
  gender: 'female',
  targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4',
  imagePrompt: 'Create an image: Athletic female fitness model lying flat on back on black gym mat in hollow body hold, shoulder blades elevated 2 inches, lower back pressed into floor, straight legs hovered 6 inches off ground with toes pointed. Dark minimalist gym studio with cyan and neon-orange rim lights, side 45-degree angle, photorealistic 8k.',
  motionPrompt: 'First frame lock: Exactly animate this female athlete without morphing, swapping, or changing the subject. Female athlete in dark compression shorts and sports bra only. No male figures, no character transition. Smooth continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.'
};

async function navToVideos(page) {
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(2500);
}

async function startCleanSession(page) {
  console.log('1. Starting clean session...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start new session"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);

  // Clear prompt chips
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => {
      const t = (b.innerText || '').trim();
      return t === 'close' && b.getBoundingClientRect().y > 600;
    });
    if (btns.length > 0) btns[0].click();
  });
  await page.waitForTimeout(1000);
}

async function clickSubmit(page) {
  const btnInfo = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start generation"]') || document.querySelector('button.generate-icon-button');
    return btn ? {
      x: btn.getBoundingClientRect().x + btn.getBoundingClientRect().width / 2,
      y: btn.getBoundingClientRect().y + btn.getBoundingClientRect().height / 2
    } : null;
  });
  if (btnInfo) {
    await page.mouse.click(btnInfo.x, btnInfo.y);
  }
}

async function runSingle() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Initial count
  await navToVideos(page);
  const startCount = await page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile').count();
  console.log(`Initial video count: ${startCount}`);

  // 2. Clean session
  await startCleanSession(page);

  // 3. Generate image
  console.log('2. Submitting image prompt...');
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(TARGET.imagePrompt, { delay: 10 });
  await page.waitForTimeout(500);

  await clickSubmit(page);
  console.log('Waiting for image generation to complete...');

  for (let i = 1; i <= 12; i++) {
    await page.waitForTimeout(4000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 4}s] Image generating: ${stopVisible}`);
    if (!stopVisible && i >= 3) break;
  }
  console.log('Image generated successfully!');
  await page.waitForTimeout(2000);

  // 4. Attach image as ingredient
  console.log('3. Attaching newly generated image...');
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

  // 5. Submit motion prompt
  console.log('4. Submitting motion prompt...');
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(TARGET.motionPrompt, { delay: 10 });
  await page.waitForTimeout(800);

  await clickSubmit(page);
  console.log('Motion prompt submitted! Polling for approval button or plan...');

  // 6. Polling loop with diagnostic log
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

    const state = await page.evaluate(() => {
      const stop = document.querySelector('button.stop-icon-button, button:has-text("Stop"), button:has-text("stop")');
      return { stopVisible: !!stop };
    });
    console.log(`[${attempt * 3}s] Waiting for approval card (Stop: ${state.stopVisible})...`);
  }

  if (!approved) {
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/female_flutter_timeout.png' });
    throw new Error('Approval card did not appear');
  }

  // 7. Monitor render
  console.log('5. Monitoring video render...');
  for (let i = 1; i <= 20; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Rendering: ${stopVisible}`);
    if (!stopVisible && i >= 3) break;
  }

  // 8. Download
  console.log('6. Downloading newly generated video...');
  await page.waitForTimeout(5000);
  await navToVideos(page);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const topVideo = videoTiles.first();
  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    const downloadPromise = page.waitForEvent('download', { timeout: 35000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(TARGET.targetFile);
    console.log(`SUCCESS! Saved Female Flutter Kicks: ${fs.statSync(TARGET.targetFile).size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

runSingle().catch(console.error);
