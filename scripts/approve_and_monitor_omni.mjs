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

  // Scroll to bottom
  await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    for (const a of all) {
      if (a.scrollHeight > a.clientHeight && a.clientHeight > 300) a.scrollTop = a.scrollHeight;
    }
  });
  await page.waitForTimeout(1000);

  // 1. Select Approve radio option
  const approveRadio = page.locator('div[role="radio"][aria-label="Approve"]').last();
  console.log('Approve radio visible:', await approveRadio.isVisible().catch(() => false));
  await approveRadio.click({ force: true });
  await page.waitForTimeout(1500);

  // 2. Check for confirmation button that appeared
  const confirmButtons = await page.locator('button, div').filter({ hasText: /^Approve$/ }).all();
  console.log(`Found ${confirmButtons.length} Approve buttons`);
  for (const b of confirmButtons) {
    const box = await b.boundingBox();
    if (box && box.y > 600) {
      console.log('Clicking confirmation Approve button at:', box);
      await b.click({ force: true });
      break;
    }
  }

  // 3. Monitor rendering progress
  console.log('Monitoring rendering progress (polling every 15s)...');
  for (let i = 1; i <= 8; i++) {
    await page.waitForTimeout(15000);
    await page.screenshot({ path: `C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_omni_render_${i * 15}s.png` });
    console.log(`[${i * 15}s] Checked progress, saved screenshot`);

    // Check if new video element appeared on canvas
    const videos = await page.locator('img[alt*="video" i], video, div[aria-label*="video" i]').all();
    console.log(`Detected media elements: ${videos.length}`);
  }

} finally {
  await adapter.close();
}
