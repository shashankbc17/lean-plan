import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4';
const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete performing smooth, continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.';

async function run() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Click back if in detail view
  const backBtn = page.locator('button:has-text("arrow_back"), [aria-label*="back" i]').first();
  if (await backBtn.isVisible().catch(() => false)) {
    console.log('Clicking back button from detail view...');
    await backBtn.click();
    await page.waitForTimeout(2000);
  }

  // 2. Open ingredients picker
  console.log('Opening ingredients picker...');
  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  await addIngredientsBtn.click();
  await page.waitForTimeout(1500);

  // 3. Select top image item
  const overlay = page.locator('.cdk-overlay-container');
  const imageItem = overlay.locator('img, flow-media-tile, div[role="option"], flow-project-media-item').first();
  console.log('Selecting top image...');
  await imageItem.click();
  await page.waitForTimeout(500);

  const addToPromptBtn = page.getByText('Add to prompt').first();
  if (await addToPromptBtn.isVisible().catch(() => false)) {
    await addToPromptBtn.click();
    await page.waitForTimeout(1500);
  }

  // 4. Type motion prompt
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 5. Intercept video stream
  let capturedVideoUrl = null;
  page.on('response', async resp => {
    const url = resp.url();
    const ct = resp.headers()['content-type'] || '';
    if (url.includes('.googlevideo.com') || (url.includes('.mp4') && !url.includes('placeholder')) || ct.includes('video/mp4')) {
      console.log('Intercepted video stream URL:', url.substring(0, 80));
      capturedVideoUrl = url;
    }
  });

  // 6. Submit prompt
  const runBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  if (await runBtn.isVisible().catch(() => false)) {
    await runBtn.click();
  } else {
    await page.keyboard.press('Enter');
  }
  console.log('Submitted motion prompt! Waiting for Approval...');

  // 7. Auto-approve
  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(5000);
    const approveRadio = page.locator('div[role="radio"][aria-label="Approve"]').last();
    if (await approveRadio.isVisible().catch(() => false)) {
      console.log('Clicking approve radio...');
      await approveRadio.click({ force: true });
      await page.waitForTimeout(1500);

      const confirmButtons = await page.locator('button, div').filter({ hasText: /^Approve$/ }).all();
      for (const b of confirmButtons) {
        const box = await b.boundingBox();
        if (box && box.y > 500) {
          await b.click({ force: true });
          console.log('Approved!');
          break;
        }
      }
      break;
    }
  }

  // 8. Wait for render & download
  console.log('Monitoring render output...');
  let downloaded = false;

  for (let attempt = 1; attempt <= 15; attempt++) {
    await page.waitForTimeout(8000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${attempt * 8}s] Render active: ${stopVisible}`);

    if (!stopVisible && attempt >= 3) {
      console.log('Checking video elements...');
      await page.waitForTimeout(3000);

      const videos = await page.locator('video').all();
      for (const v of videos) {
        const src = await v.getAttribute('src');
        if (src && src.startsWith('http')) {
          const res = await fetch(src);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            if (buf.byteLength > 100000) {
              fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
              console.log(`SUCCESS! Saved ${TARGET_FILE} (${buf.byteLength} bytes)`);
              downloaded = true;
              break;
            }
          }
        }
      }

      if (downloaded) break;

      if (capturedVideoUrl) {
        const res = await fetch(capturedVideoUrl);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          if (buf.byteLength > 100000) {
            fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
            console.log(`SUCCESS via captured URL! Saved ${TARGET_FILE} (${buf.byteLength} bytes)`);
            downloaded = true;
            break;
          }
        }
      }
    }
  }

  await browser.close();
}

run();
