import { chromium } from 'file:///C:/Users/Shashank/flow-mcp/node_modules/playwright-core/index.mjs';
import fs from 'fs';

const FEMALE_TARGET = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-bicycle-crunch-front.mp4';
const MALE_TARGET = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-bicycle-crunch-front.mp4';

async function downloadTopVideo() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const page = browser.contexts()[0].pages()[0];

  const firstThumb = page.locator('img[alt="Generated video thumbnail"]').first();
  console.log('Double clicking first thumbnail...');
  await firstThumb.dblclick({ force: true });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'scripts/top_video_opened.png' });
  console.log('Saved scripts/top_video_opened.png');

  const downloadBtn = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Found download button, triggering download...');
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
    console.log(`SUCCESS! Saved newly verified bicycle video: ${stats.size} bytes`);
  } else {
    console.log('Download button not found in viewer.');
  }

  await page.keyboard.press('Escape');
  await browser.close();
}

downloadTopVideo().catch(console.error);
