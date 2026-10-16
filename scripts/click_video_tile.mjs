import { pathToFileURL } from 'url';
import fs from 'fs';

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

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-high-knees-front.mp4';

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Monitor all network requests for .mp4 or video streams
  const mp4Urls = [];
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (url.includes('.mp4') || contentType.includes('video/mp4') || url.includes('videoplayback') || url.includes('/video/')) {
      console.log('Detected video network stream:', url.slice(0, 100), 'Content-Type:', contentType);
      mp4Urls.push(url);
    }
  });

  // Click the video thumbnail in the center canvas to play/open
  const card = page.locator('img[alt*="High Knees"]').or(page.locator('img[alt*="Generated video"]')).first();
  console.log('Video card found, clicking...');
  await card.click({ force: true });
  await page.waitForTimeout(3000);

  // Take screenshot of opened video dialog/player
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_video_opened.png' });
  console.log('Screenshot of opened video saved to scripts/flow_video_opened.png');

  // Check for download buttons or action menu
  const downloadBtn = page.getByRole('button', { name: /download/i }).or(page.locator('button[aria-label*="download" i]')).first();
  if (await downloadBtn.isVisible().catch(() => false)) {
    console.log('Download button visible! Setting up download listener...');
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await downloadBtn.click();
    const download = await downloadPromise;
    await download.saveAs(TARGET_FILE);
    console.log(`Downloaded via browser to ${TARGET_FILE}!`);
  } else if (mp4Urls.length > 0) {
    console.log('Downloading directly from detected stream URL:', mp4Urls[0]);
    const res = await fetch(mp4Urls[0]);
    const buf = await res.arrayBuffer();
    fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
    console.log(`Saved direct stream (${buf.byteLength} bytes) to ${TARGET_FILE}!`);
  } else {
    // Check video tag
    const v = page.locator('video').first();
    if (await v.isVisible().catch(() => false)) {
      const src = await v.getAttribute('src');
      console.log('Video tag src:', src);
      if (src && src.startsWith('http')) {
        const res = await fetch(src);
        const buf = await res.arrayBuffer();
        fs.writeFileSync(TARGET_FILE, Buffer.from(buf));
        console.log(`Saved video src (${buf.byteLength} bytes) to ${TARGET_FILE}!`);
      }
    }
  }

} finally {
  await adapter.close();
}
