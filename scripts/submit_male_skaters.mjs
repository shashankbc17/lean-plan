import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

async function submitAndDownloadMaleSkaters() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Click submit button
  console.log('Clicking submit button for Male Speed Skaters...');
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted! Waiting for planning / approval card...');

  // 2. Poll for Approve button
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
      approved = true;
      break;
    }

    // Check if assistant asked to pick an image
    const assistantAsked = await page.evaluate(() => {
      const msgs = [...document.querySelectorAll('p, flow-chat-message')];
      const last = msgs[msgs.length - 1]?.innerText || '';
      return last.includes('Which one would you like to animate') || last.includes('two images are selected') || last.includes('start image');
    });

    if (assistantAsked) {
      console.log(`[${attempt * 3}s] Assistant asked for image selection. Replying...`);
      const promptBox = page.locator('div[aria-label="What do you want to create?"]').last();
      await promptBox.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type('Please animate the first image.', { delay: 10 });
      await page.waitForTimeout(500);
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  // 3. Monitor render
  console.log('Monitoring video generation render...');
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(5000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 5}s] Rendering: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Video render completed or queued!');
      break;
    }
  }

  // 4. Download
  console.log('Navigating to Videos tab for download...');
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.innerText || '').includes('videocam'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-grid-tile-container, flow-video-tile');
  const topVideo = videoTiles.first();
  const label = await topVideo.getAttribute('aria-label').catch(() => '');
  console.log('Opening top video tile:', label);

  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Downloading authenticated video...');
    const targetFile = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-speed-skaters-front.mp4';
    const downloadPromise = page.waitForEvent('download', { timeout: 35000 });
    await downloadBtn.click();
    await page.waitForTimeout(500);

    const originalOption = page.locator('[role="menuitem"]:has-text("Original"), [role="menuitem"]:has-text("720p")').first();
    if (await originalOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await originalOption.click();
    }

    const download = await downloadPromise;
    await download.saveAs(targetFile);
    console.log(`SUCCESS! Saved Male Speed Skaters: ${fs.statSync(targetFile).size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

submitAndDownloadMaleSkaters().catch(console.error);
