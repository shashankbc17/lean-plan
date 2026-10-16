import { pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

const configPath = pathToFileURL('C:/Users/Shashank/AppData/Local/npm-cache/_npx/1cc5d12751a2e001/node_modules/google-flow-browser-mcp/dist/src/config.js').href;
const statePath = pathToFileURL('C:/Users/Shashank/AppData/Local/npm-cache/_npx/1cc5d12751a2e001/node_modules/google-flow-browser-mcp/dist/src/state.js').href;
const adapterPath = pathToFileURL('C:/Users/Shashank/AppData/Local/npm-cache/_npx/1cc5d12751a2e001/node_modules/google-flow-browser-mcp/dist/src/flow-adapter.js').href;

const [{ loadConfig }, { StateStore }, { FlowBrowserAdapter }] = await Promise.all([
  import(configPath),
  import(statePath),
  import(adapterPath)
]);

const config = loadConfig();
const store = new StateStore(config.databaseFile);
const adapter = new FlowBrowserAdapter(config, store);

const PROMPT = "High Knees Sprint: Cinematic high-definition 1080p 60fps video of an athletic fitness model performing high knees in continuous perfect biomechanical form. Dark minimalist gym studio with dramatic cyan and neon-orange rim lighting. Seamless looping movement, high contrast, crisp edge definition, centered in frame, front angle.";

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const promptDiv = page.locator('div[aria-label="What do you want to create?"]').first();
  await promptDiv.click();
  await page.waitForTimeout(500);

  // Clear if any, then retype
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(PROMPT, { delay: 10 });
  await page.waitForTimeout(1000);

  // Click submit button
  const submitBtn = page.locator('button').filter({ hasText: /arrow_forward/i }).first();
  console.log('Submitting prompt to Google Flow...');
  await submitBtn.click();
  console.log('Submit button clicked!');

  // Monitor generation progress
  console.log('Waiting for generation in Google Flow...');
  let videoFound = false;
  let videoSrc = null;
  const startTime = Date.now();
  const maxWaitMs = 180000; // 3 minutes max

  while (Date.now() - startTime < maxWaitMs) {
    await page.waitForTimeout(5000);
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);

    // Look for video elements or downloadable media in tiles
    const videoElements = await page.locator('video').all();
    console.log(`[${elapsedSec}s] Looking for generated video (found ${videoElements.length} video elements)...`);

    for (const v of videoElements) {
      const src = await v.getAttribute('src').catch(() => null);
      if (src && (src.startsWith('blob:') || src.startsWith('http') || src.includes('.mp4'))) {
        console.log('Found video element with src:', src);
        videoSrc = src;
        videoFound = true;
        break;
      }
    }

    if (videoFound) break;

    // Check for download buttons or menu options
    const downloadBtns = page.locator('button[aria-label*="download" i], button[title*="download" i]');
    if (await downloadBtns.count() > 0) {
      console.log('Download button appeared!');
      videoFound = true;
      break;
    }

    // Capture screenshot every 30s to monitor progress
    if (elapsedSec % 30 < 6) {
      await page.screenshot({ path: `C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_gen_${elapsedSec}s.png` });
    }
  }

  // Final screenshot
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_gen_final.png' });
  console.log('Final screenshot saved to scripts/flow_gen_final.png');

} catch (err) {
  console.error('Error during generation:', err);
} finally {
  await adapter.close();
}
