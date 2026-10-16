import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';
import path from 'path';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-high-knees-front.mp4';
const IMAGE_PROMPT = "Create an image: Female athletic fitness model in dark compression shorts and sports bra, mid-stride in sprint march with right knee driven high to 90 degrees parallel to floor, toes dorsiflexed, left arm pumped forward, 5 degree athletic forward lean. Dark minimalist gym studio with dramatic cyan and neon-orange rim lighting, side 45-degree angle, high contrast, crisp edge definition, photorealistic 8k.";
const MOTION_PROMPT = "Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete rhythmically driving alternate knees to hip height with bouncy ball-of-foot contact, arms pumping in sync, upright posture, steady tripod camera, 60fps.";

async function run() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const context = browser.contexts()[0];
  const page = context.pages().find(p => p.url().includes('flow.google.com')) || context.pages()[0];
  console.log('Connected! URL:', page.url());

  try {
    // 1. Focus prompt box & type image prompt
    console.log('Typing image prompt for Female High Knees...');
    const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
    await promptBox.click();
    await page.waitForTimeout(300);
    // Clear any previous text
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(IMAGE_PROMPT, { delay: 10 });
    await page.waitForTimeout(1000);

    // 2. Submit prompt
    const submitBtn = page.locator('button[aria-label="Start generation"]').last();
    await submitBtn.click();
    console.log('Submitted Image Prompt! Waiting for image to render (approx 20-30s)...');

    // Wait until generation completes (Stop button disappears)
    for (let i = 1; i <= 8; i++) {
      await page.waitForTimeout(5000);
      const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
      console.log(`[${i * 5}s] Image rendering active: ${stopVisible}`);
      if (!stopVisible && i >= 3) break;
    }

    console.log('Image generation settled! Attaching as ingredient for Image-to-Video...');
    await page.waitForTimeout(3000);

    // 3. Open ingredients picker
    const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
    await addIngredientsBtn.click();
    await page.waitForTimeout(1500);

    // 4. Select top item in overlay
    const overlay = page.locator('.cdk-overlay-container');
    const imageItem = overlay.locator('img, flow-media-tile, div[role="option"], flow-project-media-item').first();
    console.log('Found image in picker, clicking...');
    await imageItem.click();
    await page.waitForTimeout(500);

    // Click 'Add to prompt'
    const addToPromptBtn = page.getByText('Add to prompt').first();
    if (await addToPromptBtn.isVisible().catch(() => false)) {
      await addToPromptBtn.click();
      console.log('Clicked Add to prompt!');
      await page.waitForTimeout(1500);
    }

    // 5. Type motion prompt
    console.log('Typing motion prompt...');
    await promptBox.click();
    await page.waitForTimeout(300);
    await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
    await page.waitForTimeout(1000);

    // Setup network interceptor for video download
    let capturedVideoUrl = null;
    page.on('response', async resp => {
      const url = resp.url();
      const ct = resp.headers()['content-type'] || '';
      if (url.includes('.googlevideo.com') || url.includes('.mp4') || ct.includes('video/mp4')) {
        console.log('>>> Intercepted Video URL:', url.substring(0, 100));
        capturedVideoUrl = url;
      }
    });

    // 6. Submit motion prompt
    await submitBtn.click();
    console.log('Submitted Motion Prompt! Waiting for Approval or Render...');

    // Wait for approval card or generation
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(5000);
      // Check if Approve is visible
      const approveRadio = page.locator('div[role="radio"][aria-label="Approve"]').last();
      if (await approveRadio.isVisible().catch(() => false)) {
        console.log('Approval card appeared! Clicking Approve radio...');
        await approveRadio.click({ force: true });
        await page.waitForTimeout(1500);

        const confirmButtons = await page.locator('button, div').filter({ hasText: /^Approve$/ }).all();
        for (const b of confirmButtons) {
          const box = await b.boundingBox();
          if (box && box.y > 500) {
            console.log('Clicking confirmation Approve button at:', box);
            await b.click({ force: true });
            break;
          }
        }
        break;
      }
    }

    console.log('Monitoring video rendering (up to 90s)...');
    let videoSaved = false;

    for (let sec = 10; sec <= 90; sec += 10) {
      await page.waitForTimeout(10000);
      console.log(`[${sec}s] Waiting for video render...`);

      if (capturedVideoUrl) {
        console.log('Fetching intercepted video URL...');
        const res = await fetch(capturedVideoUrl);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
          console.log(`SUCCESS! Saved video (${buf.byteLength} bytes) to ${TARGET_FILE}`);
          videoSaved = true;
          break;
        }
      }

      // Check canvas tiles
      const latestTile = page.locator('flow-video-tile, img[src*="flow.google.com/asb"], img[alt*="Tile" i]').first();
      if (await latestTile.isVisible().catch(() => false)) {
        await latestTile.dblclick({ force: true }).catch(() => {});
        await page.waitForTimeout(3000);

        const videoEl = page.locator('video').first();
        const src = await videoEl.getAttribute('src').catch(() => null);
        if (src && src.startsWith('http')) {
          console.log('Downloading video directly from video element:', src);
          const res = await fetch(src);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
            console.log(`SUCCESS! Saved video (${buf.byteLength} bytes) to ${TARGET_FILE}`);
            videoSaved = true;
            break;
          }
        }
      }
    }

    if (!videoSaved) {
      console.log('Checking video extraction from page DOM...');
      const videoData = await page.evaluate(async () => {
        const v = document.querySelector('video');
        if (!v || !v.src) return null;
        try {
          const res = await fetch(v.src);
          const blob = await res.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      });

      if (videoData && videoData.startsWith('data:')) {
        const base64 = videoData.split(',')[1];
        const buf = Buffer.from(base64, 'base64');
        fs.writeFileSync(TARGET_FILE, buf);
        console.log(`SUCCESS! Extracted via evaluate (${buf.length} bytes) to ${TARGET_FILE}`);
        videoSaved = true;
      }
    }

    if (!videoSaved) {
      console.log('Taking screenshot of current state for diagnosis...');
      await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_high_knees_status.png' });
    }

  } catch (err) {
    console.error('Error during generation:', err);
  } finally {
    await browser.close();
  }
}

run();
