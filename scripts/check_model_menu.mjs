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

  // Click on the first plank image tile
  const plankTile = page.locator('img[alt="Tile displaying a user\'s image"]').first();
  await plankTile.dblclick();
  await page.waitForTimeout(2000);

  // Click on the Nano Banana 2.1 pill button
  const modelBtn = page.getByText(/Nano Banana 2\.1/i).first();
  if (await modelBtn.isVisible().catch(() => false)) {
    console.log('Clicking Nano Banana 2.1 button...');
    await modelBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_model_menu.png' });
    console.log('Saved flow_model_menu.png');

    // Print all visible texts and options
    const menuItems = await page.locator('[role="menuitem"], [role="option"], [role="dialog"], li, div[role="menu"]').all();
    console.log(`Found ${menuItems.length} candidate menu elements`);
    const seen = new Set();
    for (const item of menuItems) {
      if (await item.isVisible().catch(() => false)) {
        const text = (await item.innerText().catch(() => '')).trim();
        if (text && text.length < 80 && !seen.has(text)) {
          seen.add(text);
          console.log('Menu option:', text.replace(/\n/g, ' '));
        }
      }
    }
  } else {
    console.log('Model button not visible');
  }
} finally {
  await adapter.close();
}
