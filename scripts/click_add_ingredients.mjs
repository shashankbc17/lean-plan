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

  const addIngredientsBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]').first();
  console.log('Add ingredients button visible:', await addIngredientsBtn.isVisible());
  await addIngredientsBtn.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_ingredients_menu.png' });
  console.log('Saved flow_ingredients_menu.png');

  // Print all elements that appeared in popover or overlay
  const overlays = await page.locator('.cdk-overlay-container button, .cdk-overlay-container [role="menuitem"], .cdk-overlay-container [role="option"]').all();
  console.log('Overlay items count:', overlays.length);
  for (const item of overlays) {
    if (await item.isVisible().catch(() => false)) {
      const text = (await item.innerText().catch(() => '')).trim();
      const aria = await item.getAttribute('aria-label').catch(() => null);
      console.log('Item:', { text: text.replace(/\n/g, ' '), aria });
    }
  }

} finally {
  await adapter.close();
}
