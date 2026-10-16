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

  // Look for the '+' button in the prompt box
  const plusBtn = page.locator('button').filter({ hasText: /^add$/i }).first();
  console.log('Plus button visible:', await plusBtn.isVisible());
  if (await plusBtn.isVisible()) {
    await plusBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_plus_clicked.png' });
    console.log('Saved flow_plus_clicked.png');
  }

  // Also click Done to go back to main canvas
  const doneBtn = page.getByRole('button', { name: /done/i }).first();
  if (await doneBtn.isVisible()) {
    await doneBtn.click();
    await page.waitForTimeout(2000);
  }

  // In main chat, let's see what happens if we click '+'
  const mainPlusBtn = page.locator('button').filter({ hasText: /^add$/i }).first();
  if (await mainPlusBtn.isVisible()) {
    await mainPlusBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_main_plus_clicked.png' });
    console.log('Saved flow_main_plus_clicked.png');
  }

} finally {
  await adapter.close();
}
