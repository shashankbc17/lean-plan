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
    if (url.includes('.googlevideo.com') || url.includes('.mp4') || (resp.headers()['content-type'] || '').includes('video/mp4')) {
      console.log('Intercepted video URL:', url.substring(0, 100));
      capturedVideoUrl = url;
    }
  });

  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Click on the top video tile on canvas
  const canvasTiles = page.locator('img[src*="flow.google.com/asb"], img[alt*="Tile" i]');
  console.log(`Canvas tiles found: ${await canvasTiles.count()}`);

  if (await canvasTiles.count() > 0) {
    console.log('Clicking top video tile...');
    await canvasTiles.first().dblclick({ force: true });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_plank_video_player.png' });
    console.log('Saved flow_plank_video_player.png');

    // Check video src
    const videoEl = page.locator('video').first();
    const src = await videoEl.getAttribute('src').catch(() => null);
    console.log('Video element src attribute:', src ? src.substring(0, 100) : 'none');

    const downloadUrl = capturedVideoUrl || src;
    if (downloadUrl) {
      console.log('Downloading authenticated video from:', downloadUrl.substring(0, 80));
      const response = await page.request.get(downloadUrl);
      const buffer = await response.body();
      const outputPath = path.resolve('C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-plank-knee-drive-front.mp4');
      fs.writeFileSync(outputPath, buffer);
      console.log(`Successfully saved video to ${outputPath} (${buffer.length} bytes)`);

      // Also copy to male-Bodyweight fallback if needed
      const fallbackPath = path.resolve('C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-plank-knee-drive-front.mp4');
      fs.writeFileSync(fallbackPath, buffer);
      console.log(`Also copied to ${fallbackPath}`);
    } else {
      console.log('Could not find video URL');
    }
  }

} finally {
  await adapter.close();
}
