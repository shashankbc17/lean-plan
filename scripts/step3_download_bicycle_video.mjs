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

try {
  const page = await adapter.ensurePage();

  let capturedVideoUrl = null;
  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('.googlevideo.com') || url.includes('.mp4') || url.includes('flow-content.google/video') || (resp.headers()['content-type'] || '').includes('video/mp4')) {
      console.log('Intercepted video URL:', url.substring(0, 100));
      capturedVideoUrl = url;
    }
  });

  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Poll canvas every 15s up to 120s for the new video tile
  console.log('Polling canvas for newly rendered bicycle crunch video...');
  let videoFound = false;

  for (let attempt = 1; attempt <= 8; attempt++) {
    // Check if new video tile is on canvas
    const canvasTiles = page.locator('img[src*="flow.google.com/asb"], img[alt*="Tile" i]');
    const count = await canvasTiles.count();
    console.log(`[Attempt ${attempt}] Canvas tiles count: ${count}`);

    // If top tile is the new video, click to inspect
    if (count > 0) {
      await canvasTiles.first().dblclick({ force: true });
      await page.waitForTimeout(4000);

      if (capturedVideoUrl) {
        console.log('Captured video URL from network!');
        videoFound = true;
        break;
      }

      // Check if video tag exists
      const videoEl = page.locator('video').first();
      const src = await videoEl.getAttribute('src').catch(() => null);
      if (src) {
        capturedVideoUrl = src;
        videoFound = true;
        break;
      }

      // Go back to canvas if not ready yet
      const backBtn = page.getByRole('button', { name: /done/i }).or(page.locator('button').filter({ hasText: /arrow_back/i })).first();
      if (await backBtn.isVisible().catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    await page.waitForTimeout(15000);
  }

  if (capturedVideoUrl) {
    console.log('Downloading bicycle crunch video from:', capturedVideoUrl.substring(0, 80));
    const response = await page.request.get(capturedVideoUrl);
    const buffer = await response.body();

    const femalePath = path.resolve('C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-bicycle-crunch-front.mp4');
    const malePath = path.resolve('C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-bicycle-crunch-front.mp4');

    fs.writeFileSync(femalePath, buffer);
    fs.writeFileSync(malePath, buffer);
    console.log(`Successfully saved video to ${femalePath} and ${malePath} (${buffer.length} bytes)`);
  } else {
    console.log('Could not capture video URL in allotted time');
  }

} finally {
  await adapter.close();
}
