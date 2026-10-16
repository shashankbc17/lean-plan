import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-mountain-climbers-front.mp4';
const MOTION_PROMPT = 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.';

async function renderMaleClimberFromGrid() {
  console.log('Connecting to Flow Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  // 1. Tile 8 is "Man holding push-up plank position"
  const tiles = page.locator('flow-media-tile, flow-grid-tile-container');
  const malePlankTile = tiles.nth(8);
  console.log('Tile 8 label:', await malePlankTile.getAttribute('aria-label'));

  // 2. Click to open
  console.log('Opening Tile 8 (Man holding push-up plank position)...');
  await malePlankTile.click({ force: true });
  await page.waitForTimeout(2000);

  // 3. Type prompt into the editor prompt box
  const promptBox = page.locator('div[aria-label="What do you want to change?"], div[aria-label="What do you want to create?"]').last();
  await promptBox.click();
  await page.waitForTimeout(300);
  await page.keyboard.type(MOTION_PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // 4. Submit
  const submitBtn = page.locator('button[aria-label="Start generation"], button:has-text("arrow_forward")').last();
  await submitBtn.click();
  console.log('Submitted motion prompt! Checking for approval card in active viewport...');

  // 5. Click Approve strictly in active viewport
  let approved = false;
  for (let attempt = 1; attempt <= 10; attempt++) {
    await page.waitForTimeout(3000);

    const approveCoords = await page.evaluate(() => {
      const all = [...document.querySelectorAll('*')];
      const items = all.filter(el => {
        const t = el.innerText ? el.innerText.trim() : '';
        return (t === 'Approve' || t === 'Always approve') && el.children.length <= 2;
      });
      for (const it of items) {
        const r = it.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.y > 100 && r.y < window.innerHeight) {
          return { text: it.innerText, x: r.x + r.width / 2, y: r.y + r.height / 2 };
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
      console.log('VERIFIED: Stop button is active! Generation in progress.');
      approved = true;
      break;
    }
  }

  if (!approved) {
    await page.screenshot({ path: 'scripts/male_climber_approval_error.png' });
    throw new Error('Approval not verified by active Stop button.');
  }

  // 6. Monitor render
  for (let i = 1; i <= 25; i++) {
    await page.waitForTimeout(6000);
    const stopVisible = await page.locator('button').filter({ hasText: /^stop$/i }).isVisible().catch(() => false);
    console.log(`[${i * 6}s] Video rendering: ${stopVisible}`);
    if (!stopVisible && i >= 3) {
      console.log('Render completed!');
      break;
    }
  }

  await page.waitForTimeout(4000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // 7. Go to Videos tab
  console.log('Going to Videos tab...');
  const videosNav = page.locator('button, a').filter({ hasText: /Videos/i }).first();
  await videosNav.click({ force: true });
  await page.waitForTimeout(3000);

  const videoTiles = page.locator('flow-media-tile, flow-video-tile, flow-grid-tile-container');
  console.log(`Videos in project: ${await videoTiles.count()}`);

  const topVideo = videoTiles.first();
  console.log('Opening newly rendered video player:', await topVideo.getAttribute('aria-label').catch(() => ''));
  await topVideo.dblclick({ force: true });
  await page.waitForTimeout(3000);

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Found download button, triggering download...');
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
    console.log(`SUCCESS! Downloaded Male Mountain Climbers MP4: ${stats.size} bytes`);
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

renderMaleClimberFromGrid().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
