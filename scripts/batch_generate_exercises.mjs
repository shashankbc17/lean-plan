import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';
import path from 'path';

export async function generateExerciseVideo({
  exerciseId,
  name,
  gender,
  slug,
  angle = 'front',
  imagePrompt,
  motionPrompt,
  targetFile
}) {
  console.log(`\n======================================================`);
  console.log(`Generating: ${name} [${gender.toUpperCase()}]`);
  console.log(`Target: ${targetFile}`);
  console.log(`======================================================`);

  if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 100000) {
    console.log(`Asset already exists (${fs.statSync(targetFile).size} bytes). Skipping generation.`);
    return true;
  }

  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const context = browser.contexts()[0];
  const page = context.pages().find(p => p.url().includes('flow.google.com')) || context.pages()[0];

  try {
    // 1. Reset prompt area
    const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
    await promptBox.click();
    await page.waitForTimeout(300);
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(imagePrompt, { delay: 10 });
    await page.waitForTimeout(1000);

    // 2. Submit Image Prompt
    const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
    await submitBtn.click();
    console.log('Submitted Image Prompt! Waiting for reference image to render...');

    for (let i = 1; i <= 8; i++) {
      await page.waitForTimeout(5000);
      const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
      if (!stopVisible && i >= 3) break;
    }

    console.log('Reference image finished! Attaching as ingredient for Image-to-Video...');
    await page.waitForTimeout(3000);

    // 3. Attach image as ingredient
    const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
    await addIngredientsBtn.click();
    await page.waitForTimeout(1500);

    const overlay = page.locator('.cdk-overlay-container');
    const imageItem = overlay.locator('img, flow-media-tile, div[role="option"], flow-project-media-item').first();
    await imageItem.click();
    await page.waitForTimeout(500);

    const addToPromptBtn = page.getByText('Add to prompt').first();
    if (await addToPromptBtn.isVisible().catch(() => false)) {
      await addToPromptBtn.click();
      await page.waitForTimeout(1500);
    }

    // 4. Type motion prompt
    console.log('Typing kinematic motion prompt...');
    await promptBox.click();
    await page.waitForTimeout(300);
    await page.keyboard.type(motionPrompt, { delay: 10 });
    await page.waitForTimeout(1000);

    // 5. Intercept video stream
    let capturedVideoUrl = null;
    page.on('response', async resp => {
      const url = resp.url();
      const ct = resp.headers()['content-type'] || '';
      if (url.includes('.googlevideo.com') || (url.includes('.mp4') && !url.includes('placeholder')) || ct.includes('video/mp4')) {
        capturedVideoUrl = url;
      }
    });

    // 6. Submit motion prompt
    const runBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
    if (await runBtn.isVisible().catch(() => false)) {
      await runBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }
    console.log('Submitted Motion Prompt! Waiting for Approval card...');

    // 7. Auto-approve
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(5000);
      const approveRadio = page.locator('div[role="radio"][aria-label="Approve"]').last();
      if (await approveRadio.isVisible().catch(() => false)) {
        console.log('Approve radio visible! Clicking...');
        await approveRadio.click({ force: true });
        await page.waitForTimeout(1500);

        const confirmButtons = await page.locator('button, div').filter({ hasText: /^Approve$/ }).all();
        for (const b of confirmButtons) {
          const box = await b.boundingBox();
          if (box && box.y > 500) {
            await b.click({ force: true });
            console.log('Approved generation confirmation!');
            break;
          }
        }
        break;
      }
    }

    // 8. Monitor rendering and download
    console.log('Rendering in progress, monitoring output...');
    let downloaded = false;

    for (let attempt = 1; attempt <= 15; attempt++) {
      await page.waitForTimeout(8000);
      const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);

      if (!stopVisible && attempt >= 3) {
        console.log('Render settled. Inspecting video elements...');
        await page.waitForTimeout(3000);

        const videos = await page.locator('video').all();
        for (const v of videos) {
          const src = await v.getAttribute('src');
          if (src && src.startsWith('http')) {
            const res = await fetch(src);
            if (res.ok) {
              const buf = await res.arrayBuffer();
              if (buf.byteLength > 100000) {
                fs.writeFileSync(targetFile, Buffer.from(buf));
                console.log(`SUCCESS! Saved ${targetFile} (${buf.byteLength} bytes)`);
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
              fs.writeFileSync(targetFile, Buffer.from(buf));
              console.log(`SUCCESS! Saved via intercepted URL ${targetFile} (${buf.byteLength} bytes)`);
              downloaded = true;
              break;
            }
          }
        }
      }
    }

    return downloaded;
  } finally {
    await browser.close();
  }
}
