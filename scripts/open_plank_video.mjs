import { pathToFileURL } from 'url';

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
  await page.goto('https://flow.google.com/project/7885a233-6a72-4481-bac5-ebb96f370d02', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Click on the latest play_circle button in chat
  const playButtons = page.locator('button[aria-label="Open video in editor"], [aria-label*="play" i]');
  const count = await playButtons.count();
  console.log(`Found ${count} play/video buttons in chat`);

  if (count > 0) {
    console.log('Clicking last video tile...');
    await playButtons.last().click();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_plank_video_opened.png' });
    console.log('Saved flow_plank_video_opened.png');

    // Look for video element
    const video = page.locator('video').first();
    if (await video.isVisible().catch(() => false)) {
      const src = await video.getAttribute('src');
      console.log('Video element src:', src);
    }
  }

} finally {
  await adapter.close();
}
