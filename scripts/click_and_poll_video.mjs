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
  await page.waitForTimeout(3000);

  const approveElem = page.getByText('Approve', { exact: true }).first();
  console.log('Approve text visible:', await approveElem.isVisible().catch(() => false));
  
  if (await approveElem.isVisible().catch(() => false)) {
    console.log('Clicking Approve button...');
    await approveElem.click({ force: true });
    console.log('Successfully clicked Approve!');
  }

  // Poll for generation updates
  for (let i = 1; i <= 15; i++) {
    await page.waitForTimeout(5000);
    const sec = i * 5;
    console.log(`[${sec}s] Monitoring generation...`);

    const videos = await page.locator('video').all();
    if (videos.length > 0) {
      console.log(`Found ${videos.length} video elements!`);
      for (const v of videos) {
        const src = await v.getAttribute('src');
        console.log('Video src:', src);
      }
    }

    if (sec % 20 === 0) {
      await page.screenshot({ path: `C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_rendering_${sec}s.png` });
    }
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_rendering_latest.png' });
} finally {
  await adapter.close();
}
