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
  
  let targetVideoUrl = null;
  page.on('response', (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if ((url.includes('googlevideo.com') || url.includes('.mp4')) && (contentType.includes('video') || contentType.includes('application/octet-stream') || url.includes('videoplayback'))) {
      console.log('Captured authenticated video stream:', url.slice(0, 80));
      targetVideoUrl = url;
    }
  });

  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Click video thumbnail to trigger video playback / stream
  const card = page.locator('img[alt*="High Knees"]').or(page.locator('img[alt*="Generated video"]')).first();
  await card.click({ force: true });
  await page.waitForTimeout(4000);

  if (targetVideoUrl) {
    console.log('Downloading video using authenticated page context...');
    const res = await page.request.get(targetVideoUrl);
    console.log('Authenticated request status:', res.status());
    if (res.ok()) {
      const buf = await res.body();
      fs.writeFileSync(TARGET_FILE, buf);
      console.log(`SUCCESS! Saved video (${buf.length} bytes) to ${TARGET_FILE}`);
    }
  } else {
    console.log('No video stream captured, trying download button...');
    const downloadBtn = page.getByRole('button', { name: /download/i }).or(page.locator('button[aria-label*="download" i]')).first();
    if (await downloadBtn.isVisible().catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadBtn.click()
      ]);
      await download.saveAs(TARGET_FILE);
      console.log(`SUCCESS! Downloaded via browser to ${TARGET_FILE}`);
    }
  }

} finally {
  await adapter.close();
}
