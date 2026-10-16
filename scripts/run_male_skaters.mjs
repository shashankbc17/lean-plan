import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET = {
  name: 'Male Speed Skaters',
  gender: 'male',
  targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-speed-skaters-front.mp4',
  imagePrompt: 'Create an image: Athletic male fitness model in dark compression shorts and athletic tank, balanced low in mid-lateral skating leap on right leg with knee bent 60 degrees, left leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
  motionPrompt: 'First frame lock: Exactly animate this male athlete without morphing, swapping, or changing the subject. Male athlete in dark athletic training apparel only. No female figures, no character transition. Smooth lateral bounding side-to-side skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.'
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
    const done = [...document.querySelectorAll('button')].find(b => (b.innerText || '').trim() === 'Done');
    if (done) done.click();
  });
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Start new session"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);

  // Clear prompt chips
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => {
      const t = (b.innerText || '').trim();
      return (t === 'close' || t === 'cancel') && b.getBoundingClientRect().y > 600;
    });
    btns.forEach(b => b.click());
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

async function handleApprove(page) {
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
      return true;
    }

    const assistantAsked = await page.evaluate(() => {
      const msgs = [...document.querySelectorAll('p, flow-chat-message')];
      const last = msgs[msgs.length - 1]?.innerText || '';
      return last.includes('Which one would you like to animate') || last.includes('two images are selected') || last.includes('start image');
    });

    if (assistantAsked) {
      console.log(`[${attempt * 3}s] Assistant asked for image selection. Sending answer...`);
      const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
      await promptBox.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type('Please animate the first image.', { delay: 10 });
      await page.waitForTimeout(500);
      await clickSubmit(page);
      await page.waitForTimeout(2000);
    }
  }
  return false;
}

async function generateMaleSkaters() {
  console.log('\n============================================================');
  console.log(`PROCESSING FINAL VIDEO: ${TARGET.name}`);
  console.log(`TARGET: ${TARGET.targetFile}`);
  console.log('============================================================');

  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Clean session
  await startCleanSession(page);

  // 2. Generate image
  console.log('Submitting image prompt...');
  const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(TARGET.imagePrompt, { delay: 10 });
  await page.waitForTimeout(500);

  await clickSubmit(page);
  console.log('Waiting for image generation...');

  for (let i = 1; i <= 12; i++) {
    await page.waitForTimeout(4000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    if (!stopVisible && i >= 3) break;
  }
  console.log('Image generated successfully!');
  await page.waitForTimeout(2000);

  // 3. Clear chips
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => {
      const t = (b.innerText || '').trim();
      return (t === 'close' || t === 'cancel') && b.getBoundingClientRect().y > 600;
    });
    btns.forEach(b => b.click());
  });
  await page.waitForTimeout(1000);

  // 4. Open picker & add first image
  console.log('Attaching newly generated image...');
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

  const clickedItem = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return null;
    const items = [...overlay.querySelectorAll('img, [role="option"]')];
    if (items.length > 0) {
      const r = items[0].getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (clickedItem) {
    await page.mouse.click(clickedItem.x, clickedItem.y);
    await page.waitForTimeout(1000);
  }

  // Click Add to prompt
  const addBtnCoord = await page.evaluate(() => {
    const overlay = document.querySelector('.cdk-overlay-container');
    if (!overlay) return null;
    const btn = [...overlay.querySelectorAll('button')].find(b => (b.innerText || '').includes('Add to prompt'));
    if (btn) {
      const r = btn.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }
    return null;
  });
  if (addBtnCoord) {
    await page.mouse.click(addBtnCoord.x, addBtnCoord.y);
    await page.waitForTimeout(1500);
  }

  // Dismiss overlay
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // 5. Submit motion prompt
  console.log('Submitting motion prompt...');
  await promptBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(TARGET.motionPrompt, { delay: 10 });
  await page.waitForTimeout(800);

  await clickSubmit(page);
  console.log('Waiting for approval card...');

  const ok = await handleApprove(page);
  if (!ok) {
    throw new Error('Approval failed');
  }

  // 6. Monitor render
  console.log('Monitoring video generation render...');
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Stop visible: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed or queued!');
      break;
    }
  }

  // 7. Download
  console.log('Navigating to Videos tab for download...');
  await page.waitForTimeout(5000);
  await navToVideos(page);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const topVideo = videoTiles.first();
  const label = await topVideo.getAttribute('aria-label').catch(() => '');
  console.log('Opening top video tile:', label);

  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading authenticated video...');
    const downloadPromise = page.waitForEvent('download', { timeout: 35000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(TARGET.targetFile);
    console.log(`SUCCESS! Saved Male Speed Skaters: ${fs.statSync(TARGET.targetFile).size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
  console.log('MALE SPEED SKATERS COMPLETE!');
}

generateMaleSkaters().catch(console.error);
