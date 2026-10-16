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

  // Check if there is an active 'Approve' submit button that needs clicking
  const confirmBtn = page.getByRole('button', { name: /^approve$/i }).last();
  if (await confirmBtn.isVisible().catch(() => false)) {
    console.log('Approve submit button is visible, clicking it...');
    await confirmBtn.click();
    await page.waitForTimeout(3000);
  }

  // Poll for 30s to see generation status
  for (let i = 1; i <= 3; i++) {
    await page.waitForTimeout(10000);
    console.log(`Waited ${i * 10}s...`);
  }

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_render_progress.png' });
  console.log('Saved flow_render_progress.png');

  // Print all video elements or tiles on canvas
  const canvasVideos = await page.locator('video, img[alt*="video" i], img[alt*="generating" i]').all();
  console.log(`Canvas video/generating items: ${canvasVideos.length}`);

} finally {
  await adapter.close();
}
