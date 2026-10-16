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

  // Click on the top Plank Knee Drive image tile on the canvas
  const plankImages = await page.locator('img[src*="flow-content.google"]').all();
  console.log(`Found ${plankImages.length} flow-content images`);

  if (plankImages.length > 0) {
    console.log('Clicking the top Plank Knee image...');
    await plankImages[0].click({ force: true });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_image_actions.png' });
    console.log('Saved flow_image_actions.png');

    // Print all buttons that appear
    const buttons = await page.locator('button, [role="button"]').all();
    const labels = [];
    for (const b of buttons) {
      if (await b.isVisible().catch(() => false)) {
        const text = (await b.innerText().catch(() => '')) || (await b.getAttribute('aria-label').catch(() => ''));
        if (text) labels.push(text.trim());
      }
    }
    console.log('Visible buttons after clicking image:', labels);
  }
} finally {
  await adapter.close();
}
