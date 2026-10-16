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

const TARGET_FILE = 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-high-knees-front.mp4';

try {
  const page = await adapter.ensurePage();
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Inspect video elements
  const videos = await page.locator('video').all();
  console.log(`Found ${videos.length} video elements`);

  let downloaded = false;
  for (let i = 0; i < videos.length; i++) {
    const src = await videos[i].getAttribute('src');
    console.log(`Video ${i} src:`, src);
    if (src && src.startsWith('http')) {
      console.log('Downloading video directly from URL:', src);
      const response = await fetch(src);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(TARGET_FILE, Buffer.from(buffer));
        console.log(`Successfully saved video (${buffer.byteLength} bytes) to ${TARGET_FILE}!`);
        downloaded = true;
        break;
      }
    }
  }

  if (!downloaded) {
    // If blob or indirect, click the download button in the video tile or menu
    console.log('Checking for download button in UI...');
    // Click on the video tile to open actions
    const videoTile = page.locator('video').first();
    await videoTile.click({ button: 'right' }).catch(() => {});
    await page.waitForTimeout(1000);

    // Look for more_vert or download icon
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    const downloadIcon = page.locator('button[aria-label*="download" i], [title*="download" i], button:has-text("download")').first();
    
    if (await downloadIcon.isVisible().catch(() => false)) {
      console.log('Clicking download icon...');
      await downloadIcon.click();
      const download = await downloadPromise;
      if (download) {
        await download.saveAs(TARGET_FILE);
        console.log(`Download completed and saved to ${TARGET_FILE}!`);
        downloaded = true;
      }
    }
  }

  // Also check blob URL extraction via evaluate
  if (!downloaded) {
    console.log('Extracting video via page.evaluate buffer...');
    const videoData = await page.evaluate(async () => {
      const v = document.querySelector('video');
      if (!v || !v.src) return null;
      const res = await fetch(v.src);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });

    if (videoData && videoData.startsWith('data:')) {
      const base64 = videoData.split(',')[1];
      const buf = Buffer.from(base64, 'base64');
      fs.writeFileSync(TARGET_FILE, buf);
      console.log(`Extracted via evaluate (${buf.length} bytes) to ${TARGET_FILE}!`);
      downloaded = true;
    }
  }

} catch (err) {
  console.error('Error downloading:', err);
} finally {
  await adapter.close();
}
