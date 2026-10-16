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

  // Click on the Nano Banana 2.1 pill button at bottom
  const modelBtn = page.getByText(/Nano Banana 2\.1/i).first();
  await modelBtn.click();
  await page.waitForTimeout(1000);

  // Click button with aria-label="Select model family"
  const selectFamilyBtn = page.locator('button[aria-label="Select model family"]').first();
  console.log('Select family button visible:', await selectFamilyBtn.isVisible());
  await selectFamilyBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_model_family_dropdown.png' });
  console.log('Saved flow_model_family_dropdown.png');

  // Let's print all options inside any menu
  const menuOptions = await page.locator('.mat-mdc-menu-panel [role="menuitem"], .cdk-overlay-pane button').all();
  console.log('Found menu options:', menuOptions.length);
  for (const opt of menuOptions) {
    const text = (await opt.innerText().catch(() => '')).trim();
    if (text) {
      console.log('Model Option:', text.replace(/\n/g, ' '));
    }
  }

} finally {
  await adapter.close();
}
