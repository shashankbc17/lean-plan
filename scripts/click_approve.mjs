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

  const approveBtn = page.getByRole('button', { name: /always approve/i })
    .or(page.getByRole('button', { name: /^approve$/i }))
    .or(page.locator('button').filter({ hasText: /approve/i }))
    .first();

  console.log('Approve button visible:', await approveBtn.isVisible().catch(() => false));
  if (await approveBtn.isVisible().catch(() => false)) {
    console.log('Clicking approve...');
    await approveBtn.click();
    console.log('Approved! Generation started.');
  }

  // Wait 10 seconds and take screenshot
  await page.waitForTimeout(10000);
  await page.screenshot({ path: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/scripts/flow_rendering_started.png' });
  console.log('Screenshot saved to scripts/flow_rendering_started.png');
} finally {
  await adapter.close();
}
