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

  const approveSpan = page.locator('.option-label').filter({ hasText: /^Approve$/ }).first();
  console.log('Approve span count:', await approveSpan.count());

  const parentOption = page.locator('div, button, li').filter({ has: approveSpan }).last();
  console.log('Parent HTML:\n', await parentOption.evaluate(el => el.outerHTML).catch(e => e.message));

  // Click parent or span with force: true
  console.log('Clicking with force: true...');
  await approveSpan.click({ force: true });
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_approved_confirmed.png' });
  console.log('Saved flow_approved_confirmed.png');

} finally {
  await adapter.close();
}
